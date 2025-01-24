"use client";

import { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export function BannerAd() {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      console.error('Error loading banner ad:', err);
    }
  }, []);

  return (
    <div className="w-full flex justify-center bg-gray-800 py-2">
      <div className="w-full max-w-[728px] h-[90px]">
        <ins
          className="adsbygoogle"
          style={{ display: 'inline-block', width: '100%', height: '90px' }}
          data-ad-client="ca-pub-4471669474742212"
          data-ad-slot="4895960841"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}