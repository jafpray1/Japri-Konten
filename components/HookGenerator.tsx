
import React, { useState } from 'react';
import { Upload, Wand2, Loader2, Copy, Check } from 'lucide-react';
import { Audience, Tone, HookItem } from '../types';
import { generateHooks } from '../services/geminiService';

interface HookGeneratorProps {
  onHooksGenerated: (hooks: HookItem[]) => void;
}

const HookGenerator: React.FC<HookGeneratorProps> = ({ onHooksGenerated }) => {
  const [productName, setProductName] = useState('');
  const [audience, setAudience] = useState<Audience>(Audience.GENERAL);
  const [tone, setTone] = useState<Tone>(Tone.SLANG);
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedHooks, setGeneratedHooks] = useState<HookItem[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!productName) {
        alert("Nama produk harus diisi");
        return;
    }
    setIsLoading(true);
    try {
      const hooks = await generateHooks(productName, audience, tone, image || undefined);
      setGeneratedHooks(hooks);
      onHooksGenerated(hooks); // Pass up to parent for next tab
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat generate hook.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {/* Left Panel: Inputs */}
      <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm h-fit">
        <h2 className="text-xl font-bold text-zinc-900 mb-6 flex items-center gap-2">
          <div className="bg-primary-50 p-1.5 rounded-lg">
             <Wand2 className="w-5 h-5 text-primary-600" />
          </div>
          Konfigurasi Produk
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Nama Produk</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-3 text-zinc-900 placeholder-zinc-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              placeholder="Contoh: Daster kekinian"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Gambar Produk</label>
            <div className="border-2 border-dashed border-zinc-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors relative bg-zinc-50 hover:bg-zinc-50/80">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {image ? (
                <div className="relative h-32 w-full flex items-center justify-center">
                    <img src={image} alt="Preview" className="h-full object-contain rounded shadow-sm" />
                    <span className="absolute bottom-2 bg-zinc-900/70 text-xs px-2 py-1 rounded text-white backdrop-blur-sm">Klik untuk ganti</span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Upload className="w-8 h-8 text-zinc-400 mb-2" />
                  <p className="text-sm text-zinc-600 font-medium">Upload file atau drag and drop</p>
                  <p className="text-xs text-zinc-500 mt-1">PNG, JPG, GIF hingga 10MB</p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Target Audiens</label>
                <select
                value={audience}
                onChange={(e) => setAudience(e.target.value as Audience)}
                className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-3 text-zinc-900 outline-none focus:ring-2 focus:ring-primary-500"
                >
                {Object.values(Audience).map((aud) => (
                    <option key={aud} value={aud}>{aud}</option>
                ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Gaya Bahasa</label>
                <select
                value={tone}
                onChange={(e) => setTone(e.target.value as Tone)}
                className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-3 text-zinc-900 outline-none focus:ring-2 focus:ring-primary-500"
                >
                {Object.values(Tone).map((t) => (
                    <option key={t} value={t}>{t}</option>
                ))}
                </select>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-3.5 px-4 rounded-lg shadow-md shadow-primary-500/20 transition-all flex items-center justify-center gap-2 mt-4"
          >
            {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : <Wand2 className="w-5 h-5" />}
            Generate Hooks
          </button>
        </div>
      </div>

      {/* Right Panel: Output */}
      <div className="space-y-4">
        {generatedHooks.length === 0 && !isLoading && (
            <div className="h-full flex flex-col items-center justify-center text-zinc-400 bg-white border border-dashed border-zinc-300 rounded-xl p-10">
                <Wand2 className="w-12 h-12 mb-3 opacity-20" />
                <p className="font-medium">Generated hooks akan muncul di sini</p>
            </div>
        )}
        
        {generatedHooks.map((hook, index) => (
          <div key={index} className="bg-white border border-zinc-200 rounded-xl p-5 hover:border-primary-300 hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-3">
              <span className="text-[10px] font-bold text-primary-600 uppercase tracking-wider bg-primary-50 px-2.5 py-1 rounded-full border border-primary-100">
                {hook.type}
              </span>
              <button
                onClick={() => copyToClipboard(hook.content, index)}
                className="text-zinc-400 hover:text-primary-600 transition-colors p-1"
                title="Copy Hook"
              >
                {copiedIndex === index ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-zinc-700 text-lg leading-relaxed font-medium">{hook.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HookGenerator;
