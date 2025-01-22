"use client";

import { useEffect, useState } from 'react';
import { X, Download, Share, Plus, Menu } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return;
    }

    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg max-w-md w-full p-6 shadow-xl animate-slide-up">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-white">Install LockNRoll</h2>
          <button 
            onClick={() => setShowPrompt(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          <p className="text-gray-300">
            Install LockNRoll on your device for the best experience:
          </p>

          {isIOS ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-gray-300">
                <div className="mt-1">1.</div>
                <div>
                  Tap the <Share className="w-5 h-5 inline-block mx-1" /> share button in your browser
                </div>
              </div>
              <div className="flex items-start gap-3 text-gray-300">
                <div className="mt-1">2.</div>
                <div>
                  Scroll down and tap <span className="whitespace-nowrap">
                    <Plus className="w-5 h-5 inline-block mx-1" /> Add to Home Screen
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-3 text-gray-300">
                <div className="mt-1">3.</div>
                <div>
                  Tap "Add" in the top right corner
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-gray-300">
                <div className="mt-1">1.</div>
                <div>
                  Click the install button below
                </div>
              </div>
              <div className="flex items-start gap-3 text-gray-300">
                <div className="mt-1">2.</div>
                <div>
                  When prompted, click "Install" to add LockNRoll to your device
                </div>
              </div>
            </div>
          )}

          {!isIOS && (
            <button
              onClick={handleInstall}
              className="w-full p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-3 text-white font-semibold text-lg"
            >
              <Download className="w-6 h-6" />
              <span>Install App</span>
            </button>
          )}

          <p className="text-sm text-gray-400 text-center">
            You can always install later through your browser&apos;s menu 
            <Menu className="w-4 h-4 inline-block ml-1" />
          </p>
        </div>
      </div>
    </div>
  );
}