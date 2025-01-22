"use client";

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if the app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInstalled = localStorage.getItem('pwaInstalled') === 'true';
    const hasPromptBeenShown = localStorage.getItem('pwaPromptShown') === 'true';

    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(iOS);

    // Show prompt if not installed and not previously shown
    if (!isStandalone && !isInstalled && !hasPromptBeenShown) {
      setShowPrompt(true);
      localStorage.setItem('pwaPromptShown', 'true');
    }

    // Listen for standalone mode changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        localStorage.setItem('pwaInstalled', 'true');
        setShowPrompt(false);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50 animate-slide-up">
      <button
        onClick={() => setShowPrompt(false)}
        className="absolute top-2 right-2 text-white/80 hover:text-white"
      >
        <X className="w-5 h-5" />
      </button>
      <div className="space-y-2">
        <h3 className="font-bold text-lg">Install LockNRoll</h3>
        {isIOS ? (
          <p>
            To install this app on your iPhone:
            <br />
            1. Tap the Share button <span className="inline-block">
              <svg className="w-4 h-4 inline-block" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 8.59c-.69-.69-1.81-.69-2.5 0l-1.5 1.5V5c0-.55-.45-1-1-1s-1 .45-1 1v5.09l-1.5-1.5c-.69-.69-1.81-.69-2.5 0-.69.69-.69 1.81 0 2.5l4.5 4.5c.69.69 1.81.69 2.5 0l4.5-4.5c.69-.69.69-1.81 0-2.5z"/>
              </svg>
            </span>
            <br />
            2. Scroll down and tap "Add to Home Screen"
          </p>
        ) : (
          <p>
            To install this app:
            <br />
            Look for the install icon <span className="inline-block">
              <svg className="w-4 h-4 inline-block" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
              </svg>
            </span> in your browser's address bar
          </p>
        )}
      </div>
    </div>
  );
}