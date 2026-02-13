import React, { useState, useEffect } from 'react';
import { Mic, Loader2, Play, Download, Settings2, Volume2, Gauge } from 'lucide-react';
import { VoiceActor, SpeechStyle, SpeechSpeed } from '../types';
import { generateSpeech } from '../services/geminiService';

interface SpeechGeneratorProps {
  initialText?: string;
}

const SpeechGenerator: React.FC<SpeechGeneratorProps> = ({ initialText }) => {
  const [text, setText] = useState('');
  const [voice, setVoice] = useState<VoiceActor>(VoiceActor.PUCK);
  const [style, setStyle] = useState<SpeechStyle>(SpeechStyle.HYPED);
  const [speed, setSpeed] = useState<SpeechSpeed>(SpeechSpeed.NORMAL);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialText) {
        setText(initialText);
    }
  }, [initialText]);

  const handleGenerate = async () => {
    if (!text.trim()) {
        alert("Masukkan teks terlebih dahulu");
        return;
    }
    setIsLoading(true);
    setAudioUrl(null);
    try {
        const url = await generateSpeech(text, voice, style, speed);
        setAudioUrl(url);
    } catch (e) {
        console.error(e);
        alert("Gagal membuat audio");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
      {/* Left Panel: Controls */}
      <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-zinc-200 shadow-sm h-fit">
        <h2 className="text-xl font-bold text-zinc-900 mb-2 flex items-center gap-2">
          <div className="bg-primary-50 p-1.5 rounded-lg">
             <Settings2 className="w-5 h-5 text-primary-600" />
          </div>
          Voice Studio
        </h2>
        <p className="text-sm text-zinc-500 mb-6">
            Atur suara, gaya bicara, dan kecepatan untuk hasil voice over profesional.
        </p>

        <div className="space-y-6">
            <div className="relative group">
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 ml-1">Script</label>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full h-32 bg-zinc-50 border border-zinc-300 rounded-xl p-4 text-zinc-900 focus:ring-2 focus:ring-primary-500 outline-none resize-none placeholder-zinc-400 transition-shadow"
                    placeholder="Masukkan teks di sini..."
                />
                <span className="absolute bottom-3 right-3 text-[10px] font-mono text-zinc-400 bg-zinc-100 px-2 py-1 rounded-full border border-zinc-200">
                    {text.length} chars
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Voice Selector */}
                <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 ml-1 flex items-center gap-1">
                        <Mic size={12} /> Aktor Suara
                    </label>
                    <div className="relative">
                        <select
                            value={voice}
                            onChange={(e) => setVoice(e.target.value as VoiceActor)}
                            className="w-full appearance-none bg-white border border-zinc-300 text-zinc-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-3 pr-8"
                        >
                        {Object.values(VoiceActor).map((v) => (
                            <option key={v} value={v}>{v}</option>
                        ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-zinc-500">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                    </div>
                </div>

                {/* Style Selector */}
                <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 ml-1 flex items-center gap-1">
                        <Volume2 size={12} /> Gaya Bicara
                    </label>
                    <div className="relative">
                        <select
                            value={style}
                            onChange={(e) => setStyle(e.target.value as SpeechStyle)}
                            className="w-full appearance-none bg-white border border-zinc-300 text-zinc-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-3 pr-8"
                        >
                        {Object.values(SpeechStyle).map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-zinc-500">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Speed Control (ElevenLabs Style) */}
            <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200">
                 <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3 ml-1 flex items-center gap-1">
                    <Gauge size={12} /> Kecepatan & Stabilitas
                </label>
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-xs text-zinc-500 font-medium px-1">
                        <span>Slow</span>
                        <span>Normal</span>
                        <span>Fast</span>
                    </div>
                    <input 
                        type="range" 
                        min="0" 
                        max="3" 
                        step="1"
                        value={Object.values(SpeechSpeed).indexOf(speed)}
                        onChange={(e) => setSpeed(Object.values(SpeechSpeed)[parseInt(e.target.value)])}
                        className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                    />
                    <div className="text-center text-xs font-bold text-primary-700 mt-1">
                        {speed}
                    </div>
                </div>
            </div>

            <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-4 px-4 rounded-xl shadow-lg shadow-primary-500/20 transition-all flex items-center justify-center gap-2 mt-2 hover:scale-[1.01] active:scale-[0.99]"
            >
                {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : <Mic className="w-5 h-5" />}
                Generate Voice
            </button>
        </div>
      </div>

      {/* Right Panel: Player (Clean White Theme) */}
      <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-zinc-200 shadow-sm flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden">
        {/* Decorative Background Elements - Light Mode */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden rounded-xl">
             <div className="absolute -top-10 -left-10 w-64 h-64 bg-primary-50 rounded-full blur-[80px] opacity-60"></div>
             <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-blue-50 rounded-full blur-[80px] opacity-60"></div>
        </div>

        {!audioUrl ? (
            <div className="text-center relative z-10">
                <div className="w-20 h-20 rounded-full bg-primary-50 border border-primary-100 flex items-center justify-center mx-auto mb-6">
                    {isLoading ? <Loader2 className="animate-spin w-8 h-8 text-primary-500" /> : <Settings2 className="w-8 h-8 text-primary-300" />}
                </div>
                <h3 className="text-lg font-bold text-zinc-900 mb-2">{isLoading ? 'Sedang Memproses...' : 'Siap Membuat Suara'}</h3>
                <p className="text-sm text-zinc-500 max-w-[250px] mx-auto leading-relaxed">
                    {isLoading ? 'AI sedang meracik nada dan intonasi...' : 'Sesuaikan pengaturan di kiri, lalu tekan tombol Generate.'}
                </p>
            </div>
        ) : (
            <div className="w-full max-w-sm text-center relative z-10 animate-in fade-in zoom-in duration-300">
                <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200 mb-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4 text-left">
                        <div className="w-12 h-12 rounded-full bg-white border border-zinc-100 flex items-center justify-center font-bold text-primary-600 text-lg shadow-sm">
                            AI
                        </div>
                        <div>
                            <div className="text-base font-bold text-zinc-900">Hasil Voice Over</div>
                            <div className="text-xs text-zinc-500 font-medium">{voice.split('(')[0]} • {style.split(' ')[0]}</div>
                        </div>
                    </div>
                    <audio controls className="w-full h-10 block rounded-lg" src={audioUrl}>
                        Your browser does not support the audio element.
                    </audio>
                </div>

                <a 
                    href={audioUrl} 
                    download={`japrikonten-${voice.split(' ')[0]}-${Date.now()}.wav`}
                    className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-8 rounded-full transition-all shadow-md hover:shadow-lg active:scale-95"
                >
                    <Download className="w-4 h-4" /> Download .wav
                </a>
                
                <button 
                    onClick={() => setAudioUrl(null)}
                    className="block mt-4 text-xs text-zinc-400 hover:text-primary-600 transition-colors mx-auto font-medium"
                >
                    Generate Baru
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default SpeechGenerator;