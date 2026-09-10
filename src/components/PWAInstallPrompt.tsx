import React, { useEffect, useState } from 'react';
import { Download, Sparkles, X } from 'lucide-react';

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Only show if user hasn't dismissed in this session
      if (!sessionStorage.getItem('pwa_prompt_dismissed')) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem('pwa_prompt_dismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:w-96 z-50 animate-in fade-in slide-in-from-bottom duration-300">
      <div className="card-cosmic p-4 border border-cyan-500/30 bg-slate-950/90 shadow-2xl backdrop-blur-xl rounded-2xl flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 p-0.5 flex-shrink-0 shadow-lg shadow-cyan-500/20">
          <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-cyan-400 animate-pulse" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-white truncate">Install AstroGuru 247</h4>
          <p className="text-xs text-slate-400 line-clamp-1">Get 24/7 AI Jyotish guidance on your home screen</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleInstallClick}
            className="btn-cosmic-primary px-3 py-1.5 text-xs flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Install
          </button>
          <button
            onClick={handleDismiss}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
