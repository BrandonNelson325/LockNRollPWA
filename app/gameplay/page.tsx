"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Home, Lock, Unlock, ScrollText, GripVertical, Pencil, Check, X, Crown, Trophy, RotateCw } from 'lucide-react';
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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

type Player = {
  name: string;
  totalScore: number;
  isLocked: boolean;
};

interface SortablePlayerItemProps {
  id: string;
  player: Player;
  isCurrentPlayer: boolean;
  onLockToggle: () => void;
  onNameChange: (newName: string) => void;
  roundScore: number;
}

function SortablePlayerItem({ 
  id, 
  player, 
  isCurrentPlayer, 
  onLockToggle, 
  onNameChange,
  roundScore
}: SortablePlayerItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(player.name);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id,
    disabled: player.isLocked
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    opacity: isDragging ? 0.8 : player.isLocked ? 0.5 : 1,
  };

  const handleSave = () => {
    if (editedName.trim()) {
      onNameChange(editedName.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedName(player.name);
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex justify-between items-center bg-gray-800 p-3 rounded-lg ${
        isCurrentPlayer ? 'ring-2 ring-blue-500' : ''
      } ${isDragging ? 'shadow-lg ring-2 ring-green-500' : ''}`}
    >
      <div className="flex items-center gap-3 flex-1">
        <button
          className={`touch-none text-gray-400 hover:text-gray-300 ${
            player.isLocked ? 'cursor-not-allowed opacity-50' : 'cursor-grab active:cursor-grabbing'
          }`}
          {...attributes}
          {...listeners}
          disabled={player.isLocked}
        >
          <GripVertical className="w-5 h-5" />
        </button>
        {isEditing ? (
          <input
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1 bg-gray-700 text-white px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        ) : (
          <span className="text-white flex-1">{player.name}</span>
        )}
        {!player.isLocked && roundScore > 0 && isCurrentPlayer && (
          <span className="text-gray-400">(+{roundScore})</span>
        )}
      </div>
      <div className="flex items-center gap-2">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="text-green-400 hover:text-green-300 p-1"
            >
              <Check className="w-5 h-5" />
            </button>
            <button
              onClick={handleCancel}
              className="text-red-400 hover:text-red-300 p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </>
        ) : (
          <>
            <span className="text-blue-400 font-bold">{player.totalScore}</span>
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-400 hover:text-blue-300 p-1"
            >
              <Pencil className="w-4 h-4" />
            </button>
            {!player.isLocked && (
              <button
                onClick={onLockToggle}
                className="p-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
              >
                <Unlock className="w-4 h-4" />
              </button>
            )}
            {player.isLocked && (
              <div className="p-2 bg-green-500 rounded-lg">
                <Lock className="w-4 h-4" />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function RulesContent() {
  return (
    <div className="space-y-6 pr-6">
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
  );
}

export default function Gameplay() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [totalRounds, setTotalRounds] = useState(10);
  const [currentRound, setCurrentRound] = useState(1);
  const [rollCount, setRollCount] = useState(0);
  const [roundScore, setRoundScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [winners, setWinners] = useState<Player[]>([]);

  useEffect(() => {
    try {
      const playersParam = searchParams.get('players');
      const roundsParam = searchParams.get('rounds');
      
      if (!playersParam || !roundsParam) {
        router.push('/');
        return;
      }

      const playerNames = JSON.parse(decodeURIComponent(playersParam));
      const rounds = parseInt(roundsParam, 10);

      if (!Array.isArray(playerNames) || playerNames.length < 2 || isNaN(rounds)) {
        router.push('/');
        return;
      }

      setPlayers(playerNames.map((name: string) => ({ 
        name, 
        totalScore: 0,
        isLocked: false
      })));
      setTotalRounds(rounds);
    } catch (error) {
      console.error('Error initializing game:', error);
      router.push('/');
    }
  }, [searchParams, router]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setPlayers((items) => {
        const oldIndex = items.findIndex(p => p.name === active.id);
        const newIndex = items.findIndex(p => p.name === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleNameChange = (index: number, newName: string) => {
    setPlayers(prev => {
      const newPlayers = [...prev];
      newPlayers[index] = { ...newPlayers[index], name: newName };
      return newPlayers;
    });
  };

  const moveToNextPlayer = () => {
    let nextIndex = (currentPlayerIndex + 1) % players.length;
    while (players[nextIndex].isLocked && nextIndex !== currentPlayerIndex) {
      nextIndex = (nextIndex + 1) % players.length;
    }
    
    // If we've cycled through all players and they're all locked, end the round
    if (nextIndex === currentPlayerIndex && players[nextIndex].isLocked) {
      endRound(false);
      return;
    }
    
    setCurrentPlayerIndex(nextIndex);
  };

  const handleRoll = (number: number | 'Doubles') => {
    if (players[currentPlayerIndex].isLocked) {
      moveToNextPlayer();
      return;
    }
    
    const newRollCount = rollCount + 1;
    setRollCount(newRollCount);
    
    let newScore = roundScore;
    let shouldEndRound = false;
    
    if (newRollCount <= 3) {
      if (typeof number === 'number') {
        if (number === 2) newScore += 200;
        else if (number === 7) newScore += 100;
        else if (number === 12) newScore += 200;
        else newScore += number;
      } else if (number === 'Doubles') {
        newScore *= 2;
      }
    } else {
      if (typeof number === 'number') {
        if (number === 7) {
          shouldEndRound = true;
        }
        else if (number === 2 || number === 12) {
          newScore = Math.floor(newScore * 2.5);
        }
        else {
          newScore += number;
        }
      } else if (number === 'Doubles') {
        newScore *= 2;
      }
    }

    setRoundScore(newScore);

    if (shouldEndRound) {
      endRound(true);
    } else {
      moveToNextPlayer();
    }
  };

  const toggleLock = (playerIndex: number) => {
    setPlayers(prev => {
      const newPlayers = [...prev];
      const player = newPlayers[playerIndex];
      
      if (!player.isLocked) {
        // Add round score to any player who locks
        player.totalScore += roundScore;
        player.isLocked = true;
        
        // If this was the current player, move to next
        if (playerIndex === currentPlayerIndex) {
          setTimeout(() => moveToNextPlayer(), 0);
        }
      }
      
      // Check if all players are locked
      if (newPlayers.every(p => p.isLocked)) {
        setTimeout(() => endRound(false), 0);
      }
      
      return newPlayers;
    });
  };

  const determineWinners = () => {
    const maxScore = Math.max(...players.map(p => p.totalScore));
    const winners = players.filter(p => p.totalScore === maxScore);
    setWinners(winners);
    setGameOver(true);
  };

  const endRound = (rolledSeven: boolean) => {
    setPlayers(prev => prev.map(player => ({
      ...player,
      isLocked: false,
      totalScore: player.totalScore // Keep existing scores
    })));
    
    setRollCount(0);
    setRoundScore(0);
    setCurrentPlayerIndex(0);
    
    if (currentRound === totalRounds) {
      determineWinners();
      return;
    }
    setCurrentRound(prev => prev + 1);
  };

  const handlePlayAgain = () => {
    // Pass the current players to the new game screen
    const playersParam = encodeURIComponent(JSON.stringify(players.map(p => p.name)));
    router.push(`/new-game?previous=${playersParam}`);
  };

  const getButtonStyle = (number: number | 'Doubles') => {
    if (players[currentPlayerIndex]?.isLocked) {
      return 'from-gray-500 to-gray-600 hover:from-gray-500 hover:to-gray-600 cursor-not-allowed opacity-50';
    }
    
    if (number === 'Doubles') {
      return rollCount < 3 
        ? 'from-gray-500 to-gray-600 hover:from-gray-500 hover:to-gray-600 cursor-not-allowed opacity-50'
        : 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700';
    }
    
    if (rollCount < 3) {
      if (number === 2 || number === 7 || number === 12) {
        return 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700';
      }
    } else {
      if (number === 7) {
        return 'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700';
      }
      if (number === 2 || number === 12) {
        return 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700';
      }
    }
    
    return 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700';
  };

  const getLeaderInfo = () => {
    if (players.length === 0) return null;
    
    let highestScore = -1;
    let leadingPlayers: Player[] = [];
    
    players.forEach(player => {
      if (player.totalScore > highestScore) {
        highestScore = player.totalScore;
        leadingPlayers = [player];
      } else if (player.totalScore === highestScore) {
        leadingPlayers.push(player);
      }
    });
    
    return {
      score: highestScore,
      players: leadingPlayers
    };
  };

  const numberButtons = [
    [2, 3, 4],
    [5, 6, 7],
    [8, 9, 10],
    [11, 12, 'Doubles']
  ];

  if (players.length === 0) {
    return null;
  }

  const leaderInfo = getLeaderInfo();

  if (gameOver) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4">
        <InterstitialAd onClose={() => {}} />
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

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-md space-y-4 sm:space-y-8">
        <div className="flex flex-col items-center gap-2">
          <div className="flex justify-between items-center w-full mb-2">
            <button
              onClick={() => router.push('/')}
              className="text-white hover:text-blue-400 transition-colors"
            >
              <Home className="w-6 h-6" />
            </button>
            <h1 className="text-3xl font-bold text-white">Round {currentRound}/{totalRounds}</h1>
            <Sheet>
              <SheetTrigger asChild>
                <button className="text-white hover:text-blue-400 transition-colors">
                  <ScrollText className="w-6 h-6" />
                </button>
              </SheetTrigger>
              <SheetContent className="w-[90%] sm:w-[540px] bg-gray-900 border-gray-800">
                <SheetHeader>
                  <SheetTitle className="text-3xl font-bold text-white">Game Rules</SheetTitle>
                </SheetHeader>
                <div className="mt-6 overflow-y-auto max-h-[calc(100vh-100px)]">
                  <RulesContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>
          {leaderInfo && leaderInfo.score > 0 && (
            <div className="flex items-center gap-2 text-yellow-400">
              <Crown className="w-5 h-5" />
              <span className="font-semibold">
                {leaderInfo.players.length === 1 
                  ? `${leaderInfo.players[0].name}: ${leaderInfo.score}`
                  : `Tied: ${leaderInfo.score}`
                }
              </span>
            </div>
          )}
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            {players[currentPlayerIndex].name}'s Turn
          </h2>
          <p className="text-4xl font-bold text-blue-400">{roundScore}</p>
          <p className="text-gray-400 mt-2">Roll #{rollCount}</p>
        </div>

        <div className="grid grid-rows-4 gap-4">
          {numberButtons.map((row, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-3 gap-4">
              {row.map((number, colIndex) => (
                <button
                  key={colIndex}
                  onClick={() => handleRoll(number)}
                  disabled={
                    (number === 'Doubles' && rollCount < 3) || 
                    players[currentPlayerIndex].isLocked
                  }
                  className={`p-4 bg-gradient-to-r rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 text-white font-bold flex items-center justify-center ${
                    typeof number === 'string' ? 'text-lg' : 'text-2xl'
                  } ${getButtonStyle(number)}`}
                >
                  {number}
                </button>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-8">
          <h3 className="text-xl text-white mb-4">Players</h3>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={players.map(p => p.name)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {players.map((player, index) => (
                  <SortablePlayerItem
                    key={player.name}
                    id={player.name}
                    player={player}
                    isCurrentPlayer={index === currentPlayerIndex}
                    onLockToggle={() => toggleLock(index)}
                    onNameChange={(newName) => handleNameChange(index, newName)}
                    roundScore={roundScore}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </main>
  );
}