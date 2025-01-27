"use client";

import { useEffect, useState } from 'react';
import { ADMOB_CONFIG } from '@/lib/admob';

let adShown = false;

export function useInterstitialAd() {
  const [isAdComplete, setIsAdComplete] = useState(false);

  useEffect(() => {
    // Initialize adsbygoogle if it doesn't exist
    if (typeof window !== 'undefined') {
      window.adsbygoogle = window.adsbygoogle || [];
    }
  }, []);

  const showAd = async () => {
    try {
      if (typeof window === 'undefined' || adShown) {
        setIsAdComplete(true);
        return;
      }
      
      // Create a full-screen container
      const overlay = document.createElement('div');
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
      overlay.style.zIndex = '9999';
      overlay.style.display = 'flex';
      overlay.style.alignItems = 'center';
      overlay.style.justifyContent = 'center';

      // Create ad container
      const adContainer = document.createElement('ins');
      adContainer.className = 'adsbygoogle';
      adContainer.style.display = 'block';
      adContainer.style.width = '100%';
      adContainer.style.height = '100%';
      adContainer.style.maxWidth = '800px';
      adContainer.style.maxHeight = '600px';
      adContainer.setAttribute('data-ad-client', ADMOB_CONFIG.isTestMode 
        ? 'ca-pub-3940256099942544'
        : 'ca-pub-4471669474742212'
      );
      adContainer.setAttribute('data-ad-slot', ADMOB_CONFIG.isTestMode 
        ? ADMOB_CONFIG.testInterstitialAdUnitId 
        : ADMOB_CONFIG.interstitialAdUnitId
      );
      adContainer.setAttribute('data-ad-format', 'auto');
      adContainer.setAttribute('data-full-width-responsive', 'true');

      // Remove any existing ads
      const existingAds = document.getElementsByClassName('adsbygoogle');
      Array.from(existingAds).forEach(ad => ad.remove());

      // Add close button
      const closeButton = document.createElement('button');
      closeButton.innerText = '✕';
      closeButton.style.position = 'absolute';
      closeButton.style.top = '20px';
      closeButton.style.right = '20px';
      closeButton.style.background = 'none';
      closeButton.style.border = 'none';
      closeButton.style.color = 'white';
      closeButton.style.fontSize = '24px';
      closeButton.style.cursor = 'pointer';
      closeButton.style.padding = '10px';
      closeButton.style.zIndex = '10000';

      closeButton.onclick = () => {
        overlay.remove();
        setIsAdComplete(true);
      };

      // Add elements to DOM
      overlay.appendChild(adContainer);
      overlay.appendChild(closeButton);
      document.body.appendChild(overlay);

      // Push the ad
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      
      adShown = true;

      // Set a timeout to auto-close the ad after 30 seconds
      setTimeout(() => {
        if (document.body.contains(overlay)) {
          overlay.remove();
          setIsAdComplete(true);
        }
      }, 30000);

    } catch (error) {
      console.error('Error showing interstitial ad:', error);
      setIsAdComplete(true);
    }
  };

  return { showAd, isAdComplete };
}