"use client";

import { useEffect, useRef, useState } from 'react';

interface InterstitialAdProps {
  onClose?: () => void;
}

export function InterstitialAd({ onClose }: InterstitialAdProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const [adFailed, setAdFailed] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    // Check if the script is loaded
    const checkScript = () => {
      if ((window as any).adsbygoogle) {
        setScriptLoaded(true);
      }
    };

    // Check immediately
    checkScript();

    // Also set up an interval to check for delayed loading
    const interval = setInterval(checkScript, 100);
    const timeout = setTimeout(() => {
      clearInterval(interval);
      if (!scriptLoaded) {
        setAdFailed(true);
        onClose?.();
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [scriptLoaded, onClose]);

  useEffect(() => {
    if (!scriptLoaded) return;

    try {
      const adsbygoogle = (window as any).adsbygoogle;
      if (adRef.current) {
        adsbygoogle.push({});
      }

      const timeout = setTimeout(() => {
        if (adRef.current && !adRef.current.firstChild) {
          setAdFailed(true);
          onClose?.();
        }
      }, 2000);

      return () => {
        clearTimeout(timeout);
        if (adRef.current) {
          adRef.current.innerHTML = '';
        }
      };
    } catch (error) {
      console.error('Error loading interstitial ad:', error);
      setAdFailed(true);
      onClose?.();
    }
  }, [scriptLoaded, onClose]);

  if (adFailed) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg max-w-md w-full min-h-[250px]">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', minHeight: '250px', width: '100%' }}
          data-ad-client="ca-pub-4471669474742212"
          data-ad-slot="1819468844"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}