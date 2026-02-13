import React, { useState } from 'react';
import { Upload, FileText, Loader2, Copy, Image as ImageIcon } from 'lucide-react';
import { ScriptLength, HookItem, GeneratedScript } from '../types';
import { generateScript } from '../services/geminiService';

interface ScriptGeneratorProps {
  availableHooks: HookItem[];
  onScriptGenerated: (script: GeneratedScript) => void;
}

const ScriptGenerator: React.FC<ScriptGeneratorProps> = ({ availableHooks, onScriptGenerated }) => {
  const [selectedHook, setSelectedHook] = useState<string>('');
  const [maxLength, setMaxLength] = useState<ScriptLength>(ScriptLength.MEDIUM);
  const [inputType, setInputType] = useState<'text' | 'image'>('text');
  const [description, setDescription] = useState('');
  const [descImage, setDescImage] = useState<string | null>(null);
  
  const [generatedScript, setGeneratedScript] = useState<GeneratedScript | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDescImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!selectedHook) {
        alert("Pilih hook terlebih dahulu (Generate di tab Hook jika kosong)");
        return;
    }
    if (inputType === 'text' && !description) {
        alert("Deskripsi produk wajib diisi");
        return;
    }
    if (inputType === 'image' && !descImage) {
        alert("Upload gambar deskripsi produk");
        return;
    }

    setIsLoading(true);
    try {
        const result = await generateScript(
            selectedHook, 
            maxLength, 
            inputType === 'text' ? description : "Analyze this image for product details", 
            inputType === 'image' ? descImage || undefined : undefined
        );
        setGeneratedScript(result);
        onScriptGenerated(result);
    } catch (e) {
        console.error(e);
        alert("Gagal membuat script");
    } finally {
        setIsLoading(false);
    }
  };

  const copyFullScript = () => {
    if (!generatedScript) return;
    const fullText = `Hook: ${generatedScript.hook}\n\nIsi: ${generatedScript.body}\n\nCTA: ${generatedScript.cta}`;
    navigator.clipboard.writeText(fullText);
    alert("Full script copied!");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {/* Left: Input */}
      <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm h-fit">
        <h2 className="text-xl font-bold text-zinc-900 mb-6 flex items-center gap-2">
          <div className="bg-primary-50 p-1.5 rounded-lg">
            <FileText className="w-5 h-5 text-primary-600" />
          </div>
          Buat Skrip Video
        </h2>
        <p className="text-sm text-zinc-500 mb-6">
          Pilih hook, lalu lengkapi deskripsi produk untuk membuat skrip video yang utuh.
        </p>

        <div className="space-y-5">
            <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Pilih Hook</label>
                <select 
                    value={selectedHook}
                    onChange={(e) => setSelectedHook(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-3 text-zinc-900 outline-none focus:ring-2 focus:ring-primary-500"
                >
                    <option value="">-- Pilih Hook --</option>
                    {availableHooks.map((h, i) => (
                        <option key={i} value={h.content}>[{h.type}] {h.content.substring(0, 50)}...</option>
                    ))}
                </select>
                {availableHooks.length === 0 && (
                    <p className="text-xs text-amber-600 mt-2 bg-amber-50 px-2 py-1 rounded inline-block">*Belum ada hook generated. Silahkan ke tab Hook.</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Maksimal Karakter Skrip</label>
                <select
                  value={maxLength}
                  onChange={(e) => setMaxLength(e.target.value as ScriptLength)}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-3 text-zinc-900 outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {Object.values(ScriptLength).map((len) => (
                    <option key={len} value={len}>{len}</option>
                  ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Deskripsi Produk</label>
                <div className="flex gap-4 mb-3">
                    <button 
                        onClick={() => setInputType('text')}
                        className={`flex items-center gap-2 text-sm px-4 py-2 rounded-full transition-all font-medium border ${inputType === 'text' ? 'bg-primary-500 border-primary-500 text-white shadow-sm' : 'bg-white border-zinc-300 text-zinc-600 hover:bg-zinc-50'}`}
                    >
                        <FileText size={14} /> Input Teks
                    </button>
                    <button 
                        onClick={() => setInputType('image')}
                        className={`flex items-center gap-2 text-sm px-4 py-2 rounded-full transition-all font-medium border ${inputType === 'image' ? 'bg-primary-500 border-primary-500 text-white shadow-sm' : 'bg-white border-zinc-300 text-zinc-600 hover:bg-zinc-50'}`}
                    >
                        <ImageIcon size={14} /> Upload Gambar
                    </button>
                </div>

                {inputType === 'text' ? (
                    <textarea 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full h-32 bg-zinc-50 border border-zinc-300 rounded-lg p-3 text-zinc-900 focus:ring-2 focus:ring-primary-500 outline-none resize-none placeholder-zinc-400"
                        placeholder="Jelaskan fitur, keunggulan, atau detail produk..."
                    />
                ) : (
                    <div className="border-2 border-dashed border-zinc-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors relative bg-zinc-50 hover:bg-zinc-50/80">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        {descImage ? (
                            <div className="relative h-32 w-full flex items-center justify-center">
                                <img src={descImage} alt="Desc Preview" className="h-full object-contain rounded shadow-sm" />
                                <span className="absolute bottom-2 bg-zinc-900/70 text-xs px-2 py-1 rounded text-white backdrop-blur-sm">Ganti Gambar</span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center">
                            <Upload className="w-8 h-8 text-zinc-400 mb-2" />
                            <p className="text-sm text-zinc-600 font-medium">Upload screenshot/gambar produk</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-3.5 px-4 rounded-lg shadow-md shadow-primary-500/20 transition-all flex items-center justify-center gap-2"
            >
                {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : <FileText className="w-5 h-5" />}
                Generate Script
            </button>
        </div>
      </div>

      {/* Right: Output */}
      <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm h-fit">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-zinc-900">Hasil Skrip</h3>
            {generatedScript && (
                <button 
                    onClick={copyFullScript}
                    className="flex items-center gap-2 text-xs bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-300 px-3 py-1.5 rounded-lg transition-colors font-medium"
                >
                    <Copy size={14} /> Salin Semua Skrip
                </button>
            )}
        </div>

        {!generatedScript ? (
            <div className="h-64 flex flex-col items-center justify-center text-zinc-400 border border-dashed border-zinc-300 rounded-xl bg-zinc-50/50">
                <FileText className="w-10 h-10 mb-2 opacity-30" />
                <p>Skrip belum dibuat</p>
            </div>
        ) : (
            <div className="space-y-4">
                <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200">
                    <span className="text-primary-600 text-xs font-bold uppercase mb-2 block tracking-wide">1. Hook</span>
                    <p className="text-zinc-800 font-medium">{generatedScript.hook}</p>
                </div>
                <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200">
                    <span className="text-blue-600 text-xs font-bold uppercase mb-2 block tracking-wide">2. Isi</span>
                    <p className="text-zinc-700 whitespace-pre-line leading-relaxed">{generatedScript.body}</p>
                </div>
                <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200">
                    <span className="text-green-600 text-xs font-bold uppercase mb-2 block tracking-wide">3. Call to Action</span>
                    <p className="text-zinc-800 font-medium">{generatedScript.cta}</p>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default ScriptGenerator;