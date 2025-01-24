"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Home, Lock, Unlock, ScrollText, GripVertical, Pencil, Check, X, Crown, Trophy, RotateCw } from 'lucide-react';
import { InterstitialAd } from '@/components/ui/ads/interstitial-ad';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// ... rest of the imports and component code remains the same until the gameOver return ...

  if (gameOver) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4">
        <InterstitialAd onClose={() => router.push('/new-game')} />
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <Trophy className="w-24 h-24 text-yellow-400" />
            <h1 className="text-4xl font-bold text-white">Game Over!</h1>
            {winners.length === 1 ? (
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-yellow-400">
                  {winners[0].name} Wins!
                </h2>
                <p className="text-xl text-gray-300">
                  Final Score: {winners[0].totalScore}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-yellow-400">
                  It's a Tie!
                </h2>
                <div className="space-y-2">
                  {winners.map((winner, index) => (
                    <p key={index} className="text-xl text-gray-300">
                      {winner.name}: {winner.totalScore}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4 mt-8">
            <button
              onClick={handlePlayAgain}
              className="w-full p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-3 text-white font-semibold text-lg"
            >
              <RotateCw className="w-6 h-6" />
              <span>Play Again</span>
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

  // ... rest of the component code remains unchanged ...