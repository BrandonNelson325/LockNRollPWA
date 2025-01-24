"use client";

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export function InterstitialAd({ onClose }: { onClose: () => void }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(15);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    let countdown: NodeJS.Timeout;

    const loadAd = async () => {
      try {
        if (typeof window !== 'undefined') {
          // Wait for adsense to be ready
          if (!window.adsbygoogle) {
            window.adsbygoogle = [];
          }
          
          // Push the ad with a timeout
          const adPromise = new Promise((resolve, reject) => {
            timer = setTimeout(() => reject(new Error('Ad load timeout')), 5000);
            try {
              window.adsbygoogle.push({
                callback: () => {
                  clearTimeout(timer);
                  resolve(true);
                }
              });
            } catch (e) {
              reject(e);
            }
          });

          await adPromise;
          setIsLoading(false);

          // Start countdown
          countdown = setInterval(() => {
            setTimeLeft((prev) => {
              if (prev <= 1) {
                handleClose();
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        }
      } catch (err) {
        console.error('Error loading interstitial ad:', err);
        setError('Ad failed to load');
        setIsLoading(false);
      }
    };

    loadAd();

    return () => {
      clearTimeout(timer);
      clearInterval(countdown);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center">
      <div className="relative w-full max-w-lg mx-4">
        <div className="absolute -top-12 right-0 flex items-center gap-4">
          {!error && (
            <span className="text-white">
              Skip Ad in {timeLeft}s
            </span>
          )}
          <button
            onClick={handleClose}
            className="text-white hover:text-gray-300 p-2"
            title="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="bg-gray-800 rounded-lg overflow-hidden w-full">
          {isLoading && (
            <div className="w-full h-[480px] flex items-center justify-center">
              <div className="text-white">Loading ad...</div>
            </div>
          )}
          {error && (
            <div className="w-full h-[480px] flex items-center justify-center">
              <div className="text-white">{error}</div>
            </div>
          )}
          {!isLoading && !error && (
            <ins
              className="adsbygoogle"
              style={{ display: 'block', width: '100%', height: '480px' }}
              data-ad-client="ca-pub-4471669474742212"
              data-ad-slot="1819468844"
              data-ad-format="rectangle"
              data-full-width-responsive="true"
            />
          )}
        </div>
      </div>
    </div>
  );
}