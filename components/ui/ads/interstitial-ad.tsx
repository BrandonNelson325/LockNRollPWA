"use client";

import { useEffect, useRef, useState } from 'react';

interface InterstitialAdProps {
  onClose?: () => void;
}

export function InterstitialAd({ onClose }: InterstitialAdProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const [adState, setAdState] = useState<'loading' | 'loaded' | 'failed'>('loading');
  const [adPushed, setAdPushed] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          setAdState('loaded');
        }
      });
    });

    const initializeAd = () => {
      if (!adRef.current || adPushed) return;

      try {
        const adsbygoogle = (window as any).adsbygoogle;
        if (!adsbygoogle) {
          console.warn('AdSense not loaded');
          setAdState('failed');
          onClose?.();
          return;
        }

        adsbygoogle.push({});
        setAdPushed(true);
        
        observer.observe(adRef.current, { childList: true, subtree: true });
        
        timeout = setTimeout(() => {
          if (adState === 'loading') {
            setAdState('failed');
            onClose?.();
          }
        }, 5000);
      } catch (error) {
        console.error('Error loading interstitial ad:', error);
        setAdState('failed');
        onClose?.();
      }
    };

    // Wait a bit before initializing to ensure proper cleanup of previous ads
    const initTimeout = setTimeout(initializeAd, 100);

    return () => {
      observer.disconnect();
      clearTimeout(timeout);
      clearTimeout(initTimeout);
      if (adRef.current) {
        adRef.current.innerHTML = '';
      }
    };
  }, [adState, onClose, adPushed]);

  if (adState === 'failed') {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg max-w-md w-full">
        <div className="relative min-h-[250px]">
          {adState === 'loading' && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse rounded-lg">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          <ins
            ref={adRef}
            className="adsbygoogle"
            style={{ 
              display: 'block',
              width: '100%',
              height: '250px',
              backgroundColor: adState === 'loading' ? 'transparent' : undefined
            }}
            data-ad-client="ca-pub-4471669474742212"
            data-ad-slot="1819468844"
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>
      </div>
    </div>
  );
}