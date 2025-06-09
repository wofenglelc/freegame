import React from 'react';
import { Game } from '../types/game';
import GameCard from './GameCard';
import GameCardSkeleton from './GameCardSkeleton';
import { Search, GamepadIcon } from 'lucide-react';

interface GameGridProps {
  games: Game[];
  onGameSelect: (game: Game) => void;
  onGamePlay: (game: Game) => void;
  loading?: boolean;
}

const GameGrid: React.FC<GameGridProps> = ({ 
  games, 
  onGameSelect, 
  onGamePlay, 
  loading = false 
}) => {
  // Show skeleton loading state
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {Array.from({ length: 10 }).map((_, index) => (
          <GameCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  // Show empty state when no games found
  if (games.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="bg-gray-800 rounded-full p-6 mb-6">
          <Search className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">No Games Found</h3>
        <p className="text-gray-400 mb-6 max-w-md">
          We couldn't find any games matching your search criteria. 
          Try adjusting your filters or search terms.
        </p>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <GamepadIcon className="w-4 h-4" />
          <span>Browse our categories to discover amazing games</span>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {games.map((game) => (
        <GameCard
          key={game.id}
          game={game}
          onGameSelect={onGameSelect}
          onGamePlay={onGamePlay}
        />
      ))}
    </div>
  );
};

export default GameGrid;