"use client";

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface FullScreenAdProps {
  onClose: () => void;
}

const FullScreenAd = ({ onClose }: FullScreenAdProps) => {
  const [showCloseButton, setShowCloseButton] = useState(false);

  useEffect(() => {
    // Show close button after 2 seconds
    const timer = setTimeout(() => {
      setShowCloseButton(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (process.env.NODE_ENV === 'development') {
    return (
      <div className="fixed inset-0 z-50 bg-gray-900 flex flex-col items-center justify-center p-4">
        <div className="bg-gray-800 w-full max-w-sm rounded-lg p-8 text-center">
          <p className="text-gray-400 mb-4">Full Screen Ad Placeholder</p>
          {showCloseButton && (
            <button
              onClick={onClose}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close Ad
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-gray-900 flex flex-col items-center justify-center">
      <ins
        className="adsbygoogle w-full h-full"
        data-ad-client="ca-pub-3940256099942544"
        data-ad-slot="1234567890"
        data-ad-format="vertical"
        data-full-width-responsive="true"
      />
      {showCloseButton && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
        >
          <X className="w-6 h-6 text-white" />
        </button>
      )}
    </div>
  );
};

export default FullScreenAd;