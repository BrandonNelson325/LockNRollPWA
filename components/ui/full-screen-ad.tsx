"use client";

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface FullScreenAdProps {
  onClose: () => void;
  adSlot: string;
}

export function FullScreenAd({ onClose, adSlot }: FullScreenAdProps) {
  const [canClose, setCanClose] = useState(false);

  useEffect(() => {
    // Load ad
    try {
      if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
        (window as any).adsbygoogle.push({});
      }
    } catch (error) {
      console.error('Error loading AdSense ad:', error);
    }

    // Allow closing after 3 seconds
    const timer = setTimeout(() => {
      setCanClose(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4">
      {canClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-blue-400 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      )}
      <div className="w-full max-w-[728px] h-[90vh] max-h-[900px] bg-gray-800 rounded-lg overflow-hidden">
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', height: '100%' }}
          data-ad-client="ca-pub-4471669474742212" // Replace with your AdSense client ID
          data-ad-slot={adSlot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
      {canClose && (
        <button
          onClick={onClose}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Close Ad
        </button>
      )}
    </div>
  );
}