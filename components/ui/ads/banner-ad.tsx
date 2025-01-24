"use client";

import { useEffect, useRef } from 'react';

export function BannerAd() {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const adsbygoogle = (window as any).adsbygoogle || [];
      
      if (adRef.current) {
        adsbygoogle.push({});
      }
    } catch (error) {
      console.error('Error loading banner ad:', error);
    }

    return () => {
      // Cleanup: Remove the ad when component unmounts
      if (adRef.current) {
        adRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="w-full flex justify-center p-4 bg-gray-900">
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-4471669474742212"
        data-ad-slot="7161732583"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}