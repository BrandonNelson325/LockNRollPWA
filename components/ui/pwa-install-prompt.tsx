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
  const [isStandalone, setIsStandalone] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };

    // Check if iOS
    const checkIOS = () => {
      return /iPad|iPhone|iPod/.test(navigator.userAgent) && 
             !(window as any).MSStream;
    };

    // Check if already installed
    const checkStandalone = () => {
      return window.matchMedia('(display-mode: standalone)').matches || 
             (window.navigator as any).standalone || 
             document.referrer.includes('android-app://');
    };

    const initialize = () => {
      const mobile = checkMobile();
      const ios = checkIOS();
      const standalone = checkStandalone();

      setIsMobile(mobile);
      setIsIOS(ios);
      setIsStandalone(standalone);

      // Show prompt for iOS mobile users if not installed
      if (ios && mobile && !standalone) {
        setShowPrompt(true);
      }
    };

    initialize();

    const handler = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      // Show prompt for non-iOS mobile users
      if (!isIOS && isMobile && !isStandalone) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Listen for display mode changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setShowPrompt(false);
        setIsStandalone(true);
      }
    };
    mediaQuery.addEventListener('change', handleDisplayModeChange);

    // Check visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        initialize();
      }
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      mediaQuery.removeEventListener('change', handleDisplayModeChange);
    };
  }, [isIOS, isMobile, isStandalone]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  // Don't show if already installed
  if (!showPrompt || isStandalone) return null;

  // Don't show on desktop unless there's an install prompt
  if (!isMobile && !deferredPrompt) return null;

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
                  {isMobile ? 'Tap' : 'Click'} the install button below
                </div>
              </div>
              <div className="flex items-start gap-3 text-gray-300">
                <div className="mt-1">2.</div>
                <div>
                  When prompted, {isMobile ? 'tap' : 'click'} "Install" to add LockNRoll to your device
                </div>
              </div>
            </div>
          )}

          {!isIOS && deferredPrompt && (
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