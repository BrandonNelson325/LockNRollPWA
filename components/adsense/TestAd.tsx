"use client";

import React, { useEffect, useRef } from 'react';

interface TestAdProps {
  type?: 'banner' | 'square';
}

const TestAd = ({ type = 'square' }: TestAdProps) => {
  const adRef = useRef<HTMLDivElement>(null);
  const height = type === 'banner' ? 'h-[90px]' : 'h-[250px]';

  useEffect(() => {
    // Only try to load ads in production
    if (process.env.NODE_ENV === 'production' && adRef.current) {
      try {
        const adsbygoogle = (window as any).adsbygoogle || [];
        adsbygoogle.push({});
      } catch (err) {
        console.error('Error loading AdSense:', err);
      }
    }
  }, []);

  // In development, show a placeholder
  if (process.env.NODE_ENV === 'development') {
    return (
      <div className={`w-full ${height} bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 text-xs border border-gray-700`}>
        <p>{type === 'banner' ? 'Banner Ad' : 'Square Ad'} Placeholder</p>
      </div>
    );
  }

  // In production, render the actual ad with proper sizing and format
  return (
    <div ref={adRef} className="w-full">
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          width: '100%',
          height: type === 'banner' ? '90px' : '250px',
          backgroundColor: '#1f2937',
          border: '1px solid #374151'
        }}
        data-ad-client="ca-pub-3940256099942544"
        data-ad-slot={type === 'banner' ? '6978867993' : '8087457555'}
        data-ad-format={type === 'banner' ? 'auto' : 'rectangle'}
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default TestAd;