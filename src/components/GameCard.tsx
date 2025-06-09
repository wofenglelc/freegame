import React from 'react';
import { Game } from '../types/game';
import { Star, Play, Eye, Heart, Users } from 'lucide-react';
import { gameStorage } from '../utils/gameStorage';

interface GameCardProps {
  game: Game;
  onGameSelect: (game: Game) => void;
  onGamePlay: (game: Game) => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, onGameSelect, onGamePlay }) => {
  const [isFavorited, setIsFavorited] = React.useState(false);

  React.useEffect(() => {
    setIsFavorited(gameStorage.isFavorite(game.id));
  }, [game.id]);

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorited) {
      gameStorage.removeFavorite(game.id);
    } else {
      gameStorage.addFavorite(game);
    }
    setIsFavorited(!isFavorited);
  };

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    onGameSelect(game);
    onGamePlay(game);
  };

  const formatPlayCount = (count: number): string => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
  };

  return (
    <div 
      className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
      onClick={() => onGameSelect(game)}
    >
      <div className="relative">
        <img 
          src={game.thumb} 
          alt={game.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Favorite Button */}
        <button
          onClick={handleFavoriteToggle}
          className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-200 ${
            isFavorited 
              ? 'bg-red-500 text-white' 
              : 'bg-black bg-opacity-50 text-white hover:bg-red-500'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
        </button>

        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            onClick={handlePlay}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 transform scale-90 group-hover:scale-100 transition-transform duration-300"
          >
            <Play className="w-8 h-8" />
          </button>
        </div>

        {/* Game Stats */}
        <div className="absolute bottom-2 left-2 flex items-center space-x-2">
          <div className="bg-black bg-opacity-70 rounded-full px-2 py-1 flex items-center space-x-1">
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
            <span className="text-xs text-white">{(game.rating || 4.5).toFixed(2)}</span>
          </div>
          <div className="bg-black bg-opacity-70 rounded-full px-2 py-1 flex items-center space-x-1">
            <Users className="w-3 h-3 text-gray-300" />
            <span className="text-xs text-white">{formatPlayCount(game.plays || 0)}</span>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">{game.title}</h3>
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{game.description}</p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {game.tags.slice(0, 3).map((tag, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
          {game.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full">
              +{game.tags.length - 3}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 uppercase">{game.category}</span>
          <button
            onClick={handlePlay}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
          >
            Play Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameCard;