"use client";

import { useEffect, useRef, useState } from 'react';

export function BannerAd() {
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
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [scriptLoaded]);

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
        }
      }, 2000);

      return () => {
        clearTimeout(timeout);
        if (adRef.current) {
          adRef.current.innerHTML = '';
        }
      };
    } catch (error) {
      console.error('Error loading banner ad:', error);
      setAdFailed(true);
    }
  }, [scriptLoaded]);

  if (adFailed) {
    return null;
  }

  return (
    <div className="w-full flex justify-center p-4 bg-gray-900 min-h-[100px]">
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', minHeight: '100px', width: '100%', maxWidth: '728px' }}
        data-ad-client="ca-pub-4471669474742212"
        data-ad-slot="4895960841"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}