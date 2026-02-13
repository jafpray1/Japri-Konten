
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { HookItem, GeneratedScript } from "../types";
import { decodeBase64ToFloat32, pcmToWav } from "./audioUtils";

const getAiClient = (apiKey: string) => new GoogleGenAI({ apiKey });

// Helper to process file for API
const fileToPart = (base64Data: string, mimeType: string) => {
  return {
    inlineData: {
      data: base64Data,
      mimeType
    },
  };
};

export const generateHooks = async (
  productName: string,
  audience: string,
  tone: string,
  imageBase64?: string
): Promise<HookItem[]> => {
  const apiKey = process.env.API_KEY || '';
  if (!apiKey) throw new Error("API Key missing");
  const ai = getAiClient(apiKey);

  const prompt = `
    I need you to act as a viral marketing expert. 
    Product Name: ${productName}
    Target Audience: ${audience}
    Tone: ${tone}

    Create 8 different viral marketing hooks for a short video (TikTok/Reels).
    The hooks should be based on these specific theories:
    1. Question Hook
    2. Desire Hook
    3. Hope Hook
    4. Problem Hook
    5. Benefit Hook
    6. Controversial Hook
    7. FOMO Hook
    8. Fear Hook

    Output valid JSON strictly.
  `;

  const parts: any[] = [{ text: prompt }];
  if (imageBase64) {
    // Determine mime type from base64 header or default to png if stripped
    const mimeMatch = imageBase64.match(/^data:(.*);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/png';
    const base64Clean = imageBase64.replace(/^data:(.*);base64,/, '');
    
    parts.push(fileToPart(base64Clean, mimeType));
  }

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: { parts },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING, description: "The type of hook (e.g., Question Hook)" },
            content: { type: Type.STRING, description: "The actual hook text" }
          },
          required: ["type", "content"]
        }
      }
    }
  });

  if (response.text) {
    return JSON.parse(response.text) as HookItem[];
  }
  return [];
};

export const generateScript = async (
  hook: string,
  maxLength: string,
  description: string,
  descriptionImageBase64?: string
): Promise<GeneratedScript> => {
  const apiKey = process.env.API_KEY || '';
  if (!apiKey) throw new Error("API Key missing");
  const ai = getAiClient(apiKey);

  const prompt = `
    Create a viral short video script (TikTok/Reels).
    
    Selected Hook: "${hook}"
    Maximum Length: ${maxLength}
    
    Product Description/Context:
    ${description}

    Structure the response strictly as a JSON object with 3 parts: 
    1. "hook" (The hook provided)
    2. "body" (The main content, engaging and concise)
    3. "cta" (Call to Action)
  `;

  const parts: any[] = [{ text: prompt }];
  if (descriptionImageBase64) {
      const mimeMatch = descriptionImageBase64.match(/^data:(.*);base64,/);
      const mimeType = mimeMatch ? mimeMatch[1] : 'image/png';
      const base64Clean = descriptionImageBase64.replace(/^data:(.*);base64,/, '');
      parts.push(fileToPart(base64Clean, mimeType));
  }

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: { parts },
    config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                hook: { type: Type.STRING },
                body: { type: Type.STRING },
                cta: { type: Type.STRING }
            },
            required: ["hook", "body", "cta"]
        }
    }
  });

  if (response.text) {
    return JSON.parse(response.text) as GeneratedScript;
  }
  throw new Error("Failed to generate script");
};

export const generateSpeech = async (
    text: string,
    voiceNameRaw: string,
    style: string,
    speed: string
): Promise<string> => {
    const apiKey = process.env.API_KEY || '';
    if (!apiKey) throw new Error("API Key missing");
    const ai = getAiClient(apiKey);

    // Extract just the name from the UI string "Kore (Female, Warm)" -> "Kore"
    const voiceName = voiceNameRaw.split(' ')[0];

    // MAPPING GAYA BICARA AGAR LEBIH KONSISTEN
    // Kunci masalah inkonsistensi biasanya ada pada prompt gaya yang terlalu umum.
    // Kita buat instruksi spesifik untuk setiap gaya.
    const styleInstructions: Record<string, string> = {
        'Hype & Viral (Cepat/Semangat)': 
            'Bicaralah dengan energi TINGGI, antusias, dan sangat "punchy". Bayangkan Anda adalah content creator TikTok yang sedang mempromosikan produk viral. Jangan ada jeda yang canggung. Pertahankan excitement dari awal sampai akhir.',
        
        'Storytelling (Mengalir)': 
            'Gunakan nada bercerita yang hangat, akrab, dan natural. Seperti sedang curhat kepada sahabat dekat. Intonasi harus dinamis (naik turun) tapi tetap lembut. Jangan kaku seperti robot.',
        
        'Berita/Formal (Jelas)': 
            'Gunakan nada profesional, wibawa, dan jelas artikulasinya. Seperti pembaca berita TV atau presenter dokumenter. Tempo stabil dan terpercaya.',
        
        'Sedih/Emosional': 
            'Gunakan nada rendah, agak lambat, dan penuh perasaan. Terdengar menyentuh hati dan sedikit melankolis. Berikan jeda untuk efek dramatis.',
        
        'Berbisik/Misterius': 
            'Gunakan suara "soft whisper" atau berbisik dekat mic. Terdengar rahasia, penting, dan membuat orang penasaran (ASMR style).',
        
        'Tegas/Marah': 
            'Gunakan nada tegas, volume agak keras, dan menuntut perhatian. Tunjukkan urgensi yang tinggi.'
    };

    // Ambil instruksi detail, jika tidak ada fallback ke style string biasa
    const specificInstruction = styleInstructions[style] || style;

    // Prompt yang direkayasa ulang untuk stabilitas
    const prompt = `
        TASK: Generate audio speech from the text below.
        LANGUAGE: Indonesian (Bahasa Indonesia).
        
        CRITICAL INSTRUCTIONS FOR CONSISTENCY:
        1. ACCENT: You MUST use a native Indonesian accent/intonation. Do NOT sound like a foreigner reading Indonesian.
        2. CONSISTENCY: Maintain the selected emotion/tone strictly throughout the entire text. Do not drop the character halfway.
        3. CLARITY: Articulate every word clearly.
        
        STYLE GUIDELINE:
        "${specificInstruction}"
        
        SPEED GUIDELINE:
        "${speed}"
        
        TEXT TO READ:
        "${text}"
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: prompt }] }],
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: voiceName },
                },
            },
        },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    
    if (!base64Audio) {
        throw new Error("No audio generated");
    }

    // Convert to WAV for easier playback in standard HTML Audio
    const float32 = decodeBase64ToFloat32(base64Audio);
    const wavBlob = pcmToWav(1, 24000, float32);
    
    // Create an object URL
    return URL.createObjectURL(wavBlob);
};
