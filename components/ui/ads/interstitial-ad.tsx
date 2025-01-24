"use client";

import { useEffect, useState } from 'react';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export function InterstitialAd({ onClose }: { onClose: () => void }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }

      const timer = setTimeout(() => {
        handleClose();
      }, 15000);

      return () => clearTimeout(timer);
    } catch (err) {
      console.error('Error loading interstitial ad:', err);
      handleClose();
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center">
      <div className="relative w-full max-w-lg mx-4">
        <button
          onClick={handleClose}
          className="absolute -top-10 right-0 text-white hover:text-gray-300"
        >
          Skip Ad (15s)
        </button>
        <div className="bg-gray-800 rounded-lg overflow-hidden w-full h-[480px]">
          <ins
            className="adsbygoogle"
            style={{ display: 'inline-block', width: '100%', height: '480px' }}
            data-ad-client="ca-pub-4471669474742212"
            data-ad-slot="1819468844"
            data-ad-format="rectangle"
          />
        </div>
      </div>
    </div>
  );
}