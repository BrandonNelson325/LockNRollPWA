"use client";

import { useEffect, useRef } from 'react';

interface InterstitialAdProps {
  onClose?: () => void;
}

export function InterstitialAd({ onClose }: InterstitialAdProps) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const adsbygoogle = (window as any).adsbygoogle || [];
      
      if (adRef.current) {
        adsbygoogle.push({});
      }
    } catch (error) {
      console.error('Error loading interstitial ad:', error);
      // If ad fails to load, call onClose to continue the game flow
      onClose?.();
    }

    return () => {
      // Cleanup: Remove the ad when component unmounts
      if (adRef.current) {
        adRef.current.innerHTML = '';
      }
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg max-w-md w-full">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-4471669474742212"
          data-ad-slot="2307998982"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}