"use client";

import { useEffect } from 'react';
import { ADMOB_CONFIG } from '@/lib/admob';

interface BannerAdProps {
  className?: string;
}

export function BannerAd({ className = '' }: BannerAdProps) {
  useEffect(() => {
    try {
      // Push the ad after component mounts
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (error) {
      console.error('Error loading banner ad:', error);
    }
  }, []);

  return (
    <div className={`w-full h-[100px] bg-gray-800 rounded-lg overflow-hidden ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-4471669474742212"
        data-ad-slot={ADMOB_CONFIG.isTestMode ? ADMOB_CONFIG.testBannerAdUnitId : ADMOB_CONFIG.bannerAdUnitId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}