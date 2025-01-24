"use client";

import { useEffect } from 'react';

interface AdContainerProps {
  adSlot: string;
  adFormat?: 'auto' | 'fluid' | 'rectangle';
  className?: string;
}

export function AdContainer({ adSlot, adFormat = 'auto', className = '' }: AdContainerProps) {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="YOUR_ADSENSE_CLIENT_ID" // Replace with your AdSense client ID
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  );
}