"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { Home, ArrowLeft } from 'lucide-react';

export default function Rules() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromGameplay = searchParams.get('from') === 'gameplay';
  const players = searchParams.get('players');
  const rounds = searchParams.get('rounds');

  const handleBack = () => {
    if (fromGameplay && players && rounds) {
      router.push(`/gameplay?players=${players}&rounds=${rounds}`);
    } else {
      router.push('/');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        <div className="flex justify-between items-center w-full">
          <button
            onClick={handleBack}
            className="text-white hover:text-blue-400 transition-colors"
          >
            {fromGameplay ? <ArrowLeft className="w-6 h-6" /> : <Home className="w-6 h-6" />}
          </button>
          <h1 className="text-3xl font-bold text-white">Game Rules</h1>
          <div className="w-6" /> {/* Spacer for symmetry */}
        </div>

        <div className="bg-gray-800 rounded-lg p-6 space-y-6 text-white">
          <section>
            <h2 className="text-2xl font-bold mb-4 text-blue-400">Basic Rules</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-200">
              <li>Players take turns rolling dice and accumulating points for the round</li>
              <li>Players can lock in their score at any time to secure their points</li>
              <li>Once locked, a player cannot roll again until the next round</li>
              <li>Points are only added to an individuals total score if they lock their score before a round ends</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-blue-400">Scoring</h2>
            <h3 className="text-xl font-semibold mb-2 text-green-400">First Three Rolls</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-200">
              <li>Rolling a 2: +200 points</li>
              <li>Rolling a 7: +100 points</li>
              <li>Rolling a 12: +200 points</li>
              <li>All other numbers: Add face value to score</li>
              <li>Rolling doubles: Multiply current score by 2</li>
            </ul>

            <h3 className="text-xl font-semibold mt-4 mb-2 text-green-400">After Three Rolls</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-200">
              <li>Rolling a 2 or 12: Multiply current score by 2.5</li>
              <li>Rolling a 7: End round (only locked scores are kept)</li>
              <li>All other numbers: Add face value to score</li>
              <li>Rolling doubles: Multiply current score by 2</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-blue-400">Round End Conditions</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-200">
              <li>All players lock their scores</li>
              <li>A player rolls a 7 after their third roll</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-blue-400">Winning</h2>
            <p className="text-gray-200">
              After all rounds are completed, the player with the highest total score wins the game!
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}