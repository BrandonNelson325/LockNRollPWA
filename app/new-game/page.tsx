"use client";

import { useState, useEffect } from 'react';
import { Plus, ArrowRight, Trash2, GripVertical, Pencil, Check, X, History, Users } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
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

interface SortablePlayerItemProps {
  id: string;
  name: string;
  onRemove: () => void;
  onNameChange: (newName: string) => void;
}

function SortablePlayerItem({ id, name, onRemove, onNameChange }: SortablePlayerItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    opacity: isDragging ? 0.8 : 1,
  };

  const handleSave = () => {
    if (editedName.trim()) {
      onNameChange(editedName.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedName(name);
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
        isDragging ? 'shadow-lg ring-2 ring-blue-500' : ''
      }`}
    >
      <div className="flex items-center gap-3 flex-1">
        <button
          className="touch-none text-gray-400 hover:text-gray-300 cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
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
          <span className="text-white flex-1">{name}</span>
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
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-400 hover:text-blue-300 p-1"
            >
              <Pencil className="w-5 h-5" />
            </button>
            <button
              onClick={onRemove}
              className="text-red-400 hover:text-red-300 p-1"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function NewGame() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [players, setPlayers] = useState<string[]>([]);
  const [currentName, setCurrentName] = useState('');
  const [error, setError] = useState('');
  const [previousPlayers, setPreviousPlayers] = useState<string[]>([]);
  const [showPreviousPlayers, setShowPreviousPlayers] = useState(false);

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

  useEffect(() => {
    // Load previous players from local storage
    const stored = localStorage.getItem('previousPlayers');
    if (stored) {
      setPreviousPlayers(JSON.parse(stored));
    }

    // Check if we have players from a previous game
    const previousParam = searchParams.get('previous');
    if (previousParam) {
      try {
        const previousGamePlayers = JSON.parse(decodeURIComponent(previousParam));
        setPlayers(previousGamePlayers);
      } catch (error) {
        console.error('Error parsing previous players:', error);
      }
    }
  }, [searchParams]);

  const addPlayer = () => {
    if (!currentName.trim()) {
      setError('Please enter a player name');
      return;
    }
    const newName = currentName.trim();
    setPlayers(prev => [...prev, newName]);
    
    // Update previous players in local storage
    const updatedPreviousPlayers = Array.from(new Set([...previousPlayers, newName]));
    setPreviousPlayers(updatedPreviousPlayers);
    localStorage.setItem('previousPlayers', JSON.stringify(updatedPreviousPlayers));
    
    setCurrentName('');
    setError('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addPlayer();
    }
  };

  const removePlayer = (index: number) => {
    setPlayers(players.filter((_, i) => i !== index));
  };

  const removePreviousPlayer = (playerName: string) => {
    const updatedPreviousPlayers = previousPlayers.filter(name => name !== playerName);
    setPreviousPlayers(updatedPreviousPlayers);
    localStorage.setItem('previousPlayers', JSON.stringify(updatedPreviousPlayers));
  };

  const handleNameChange = (index: number, newName: string) => {
    const newPlayers = [...players];
    newPlayers[index] = newName;
    setPlayers(newPlayers);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setPlayers((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const addPreviousPlayer = (playerName: string) => {
    if (!players.includes(playerName)) {
      setPlayers(prev => [...prev, playerName]);
    }
  };

  const addAllPreviousPlayers = () => {
    const uniquePlayers = Array.from(new Set([...players, ...previousPlayers]));
    setPlayers(uniquePlayers);
  };

  const handleContinue = () => {
    if (players.length < 2) {
      setError('Please add at least 2 players');
      return;
    }
    router.push(`/rounds?players=${encodeURIComponent(JSON.stringify(players))}`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Add Players</h1>
          <p className="text-gray-400">Add at least 2 players to start the game</p>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={currentName}
            onChange={(e) => setCurrentName(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter player name"
            className="flex-1 p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          />
          <button
            onClick={addPlayer}
            className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {error && <p className="text-red-400 text-center">{error}</p>}

        {previousPlayers.length > 0 && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <button
                onClick={() => setShowPreviousPlayers(!showPreviousPlayers)}
                className="flex-1 p-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
              >
                <History className="w-5 h-5" />
                <span>{showPreviousPlayers ? 'Hide' : 'Show'} Previous Players</span>
              </button>
              <button
                onClick={addAllPreviousPlayers}
                className="p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                title="Add all previous players"
              >
                <Users className="w-5 h-5" />
              </button>
            </div>

            {showPreviousPlayers && (
              <div className="space-y-2">
                {previousPlayers.map((playerName) => (
                  <div
                    key={playerName}
                    className="flex justify-between items-center bg-gray-800 p-3 rounded-lg"
                  >
                    <span className="text-white">{playerName}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => addPreviousPlayer(playerName)}
                        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={players.includes(playerName)}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removePreviousPlayer(playerName)}
                        className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="space-y-2">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={players}
              strategy={verticalListSortingStrategy}
            >
              {players.map((player, index) => (
                <SortablePlayerItem
                  key={player}
                  id={player}
                  name={player}
                  onRemove={() => removePlayer(index)}
                  onNameChange={(newName) => handleNameChange(index, newName)}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>

        <button
          onClick={handleContinue}
          disabled={players.length < 2}
          className={`w-full p-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${
            players.length < 2
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          <ArrowRight className="w-5 h-5" />
          <span>Continue</span>
        </button>
      </div>
    </main>
  );
}