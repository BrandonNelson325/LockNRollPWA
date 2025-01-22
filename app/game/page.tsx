"use client";

import { useState } from 'react';
import { Lock, Unlock, RotateCcw, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Game() {
  const router = useRouter();
  const [combination, setCombination] = useState<number[]>([0, 0, 0, 0]);
  const [isLocked, setIsLocked] = useState(true);
  const [targetCombination] = useState(() => 
    Array.from({ length: 4 }, () => Math.floor(Math.random() * 10))
  );

  const handleNumberChange = (index: number, increment: boolean) => {
    setCombination(prev => {
      const newCombination = [...prev];
      if (increment) {
        newCombination[index] = (newCombination[index] + 1) % 10;
      } else {
        newCombination[index] = (newCombination[index] - 1 + 10) % 10;
      }
      return newCombination;
    });
  };

  const checkCombination = () => {
    const isCorrect = combination.every((num, index) => num === targetCombination[index]);
    setIsLocked(!isCorrect);
    if (isCorrect) {
      // TODO: Implement win animation
      console.log('Unlocked!');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-8">
        <div className="flex justify-between items-center w-full mb-8">
          <button
            onClick={() => router.push('/')}
            className="text-white hover:text-blue-400 transition-colors"
          >
            <Home className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-bold text-white">LockNRoll</h1>
          <button
            onClick={() => {
              setCombination([0, 0, 0, 0]);
              setIsLocked(true);
            }}
            className="text-white hover:text-blue-400 transition-colors"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          {combination.map((number, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <button
                className="w-12 h-12 bg-gray-700 hover:bg-gray-600 text-white rounded-t-lg flex items-center justify-center"
                onClick={() => handleNumberChange(index, true)}
              >
                ▲
              </button>
              <div className="w-12 h-12 bg-white text-gray-900 flex items-center justify-center text-2xl font-bold rounded-md">
                {number}
              </div>
              <button
                className="w-12 h-12 bg-gray-700 hover:bg-gray-600 text-white rounded-b-lg flex items-center justify-center"
                onClick={() => handleNumberChange(index, false)}
              >
                ▼
              </button>
            </div>
          ))}
        </div>

        <button
          className="w-64 p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-3 text-white font-semibold text-lg"
          onClick={checkCombination}
        >
          {isLocked ? (
            <>
              <Lock className="w-6 h-6" />
              <span>Check Lock</span>
            </>
          ) : (
            <>
              <Unlock className="w-6 h-6" />
              <span>Unlocked!</span>
            </>
          )}
        </button>
      </div>
    </main>
  );
}