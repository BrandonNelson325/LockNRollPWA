import { useEffect } from 'react';
import { X } from 'lucide-react';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface FullScreenAdProps {
  onClose: () => void;
  adSlot: string;
}

export function FullScreenAd({ onClose, adSlot }: FullScreenAdProps) {
  useEffect(() => {
    // Initialize ads when component mounts
    try {
      if (typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      console.error('Error initializing AdSense:', err);
    }
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="relative bg-white rounded-lg p-4 max-w-md w-full mx-4">
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 bg-gray-800 text-white p-1 rounded-full hover:bg-gray-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="min-h-[320px] flex items-center justify-center">
          <ins
            className="adsbygoogle"
            style={{ display: 'block', minWidth: '300px', width: '100%', height: '300px' }}
            data-ad-client="ca-pub-4471669474742212"
            data-ad-slot={adSlot}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>
      </div>
    </div>
  );
}