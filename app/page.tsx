"use client";

import { Gamepad2, ScrollText } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-12">
        <h1 className="text-5xl font-bold text-white mb-12">LockNRoll</h1>
        
        <div className="space-y-6">
          <button 
            className="w-64 p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 text-white font-semibold text-lg"
            onClick={() => router.push('/new-game')}
          >
            <Gamepad2 className="w-6 h-6" />
            <span>New Game</span>
          </button>

          <button 
            className="w-64 p-4 bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg shadow-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 text-white font-semibold text-lg"
            onClick={() => router.push('/rules')}
          >
            <ScrollText className="w-6 h-6" />
            <span>Rules</span>
          </button>
        </div>
      </div>
    </main>
  );
}