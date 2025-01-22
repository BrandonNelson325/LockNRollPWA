"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

export default function Rounds() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const players = JSON.parse(decodeURIComponent(searchParams.get('players') || '[]'));
  const roundOptions = [10, 15, 20, 25];

  const handleSelectRounds = (rounds: number) => {
    router.push(`/gameplay?players=${encodeURIComponent(JSON.stringify(players))}&rounds=${rounds}`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Select Rounds</h1>
          <p className="text-gray-400">How many rounds would you like to play?</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {roundOptions.map((rounds) => (
            <button
              key={rounds}
              onClick={() => handleSelectRounds(rounds)}
              className="p-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
            >
              <span className="text-4xl font-bold text-white">{rounds}</span>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}