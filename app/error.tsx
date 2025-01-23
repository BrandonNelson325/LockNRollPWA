"use client";

import { useEffect } from 'react';
import { Home } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  const router = useRouter();

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Something went wrong</h1>
        <p className="text-gray-300 mb-8">
          We apologize for the inconvenience. Please try again.
        </p>
        <div className="space-y-4">
          <button
            onClick={reset}
            className="w-full p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 text-white font-semibold text-lg"
          >
            Try again
          </button>
          <button
            onClick={() => router.push('/')}
            className="w-full p-4 bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg shadow-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-300 flex items-center justify-center gap-3 text-white font-semibold text-lg"
          >
            <Home className="w-6 h-6" />
            <span>Back to Home</span>
          </button>
        </div>
      </div>
    </main>
  );
}