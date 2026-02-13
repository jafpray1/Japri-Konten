import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import HookGenerator from './components/HookGenerator';
import ScriptGenerator from './components/ScriptGenerator';
import SpeechGenerator from './components/SpeechGenerator';
import { HookItem } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<'hook' | 'script' | 'speech' | 'about'>('hook');
  const [generatedHooks, setGeneratedHooks] = useState<HookItem[]>([]);
  // State to hold script text for auto-filling the speech tab
  const [scriptForSpeech, setScriptForSpeech] = useState<string>('');

  const NavButton = ({ tab, label }: { tab: typeof activeTab, label: string }) => (
    <button
        onClick={() => setActiveTab(tab)}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
        activeTab === tab 
          ? 'bg-primary-50 text-primary-600 border border-primary-200' 
          : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
        }`}
    >
        {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-zinc-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 md:py-0 md:h-16 gap-3 md:gap-0">
            {/* Logo Section */}
            <div className="flex items-center gap-3">
              <div className="bg-primary-50 p-2 rounded-lg">
                  <Sparkles className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                  <h1 className="text-xl font-bold text-zinc-900 tracking-tight leading-none">Japri Konten</h1>
                  <span className="text-xs font-medium text-primary-600 tracking-wide uppercase">Creative Studio</span>
              </div>
            </div>
            
            {/* Nav Section - Stacked below title on mobile */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              <NavButton tab="hook" label="Hook" />
              <NavButton tab="script" label="Script" />
              <NavButton tab="speech" label="Speech" />
              <NavButton tab="about" label="About" />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 flex-grow w-full">
        {activeTab === 'hook' && (
            <HookGenerator 
                onHooksGenerated={(hooks) => {
                    setGeneratedHooks(hooks);
                }} 
            />
        )}
        
        {activeTab === 'script' && (
            <ScriptGenerator 
                availableHooks={generatedHooks} 
                onScriptGenerated={(script) => {
                    // Combine script parts for speech
                    const fullText = `${script.hook} ... ${script.body} ... ${script.cta}`;
                    setScriptForSpeech(fullText);
                }}
            />
        )}
        
        {activeTab === 'speech' && (
            <SpeechGenerator initialText={scriptForSpeech} />
        )}

        {activeTab === 'about' && (
            <div className="p-6 text-center text-zinc-600">
                <h2 className="text-2xl text-zinc-900 font-bold mb-4">About This Tool</h2>
                <p className="max-w-2xl mx-auto mb-8 text-zinc-500">
                    Japri Konten Creative Studio is a comprehensive viral content generator designed to streamline your content creation workflow.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left">
                    <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="text-zinc-900 font-bold mb-2 flex items-center gap-2">
                             Gemini 2.5 Flash
                        </h3>
                        <p className="text-zinc-600 text-sm">Used for creative text generation (Hooks & Scripts) and image analysis with high speed and efficiency.</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="text-zinc-900 font-bold mb-2">Gemini 2.5 TTS</h3>
                        <p className="text-zinc-600 text-sm">Powers the Speech generator with realistic, emotive AI voices.</p>
                    </div>
                </div>
            </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-zinc-200 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-zinc-500">
                &copy; {new Date().getFullYear()} Japri Konten <span className="text-primary-600 font-medium">Creative Studio</span>. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm text-zinc-400">
                <a href="#" className="hover:text-primary-600 transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-primary-600 transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-primary-600 transition-colors">Support</a>
            </div>
        </div>
      </footer>
    </div>
  );
}

export default App;