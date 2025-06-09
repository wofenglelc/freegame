import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Star } from 'lucide-react';
import { Game } from '../types/game';

interface FeaturedGamesProps {
  games: Game[];
  onGameSelect: (game: Game) => void;
  onGamePlay: (game: Game) => void;
}

const FeaturedGames: React.FC<FeaturedGamesProps> = ({ games, onGameSelect, onGamePlay }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (games.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % games.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [games.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? games.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % games.length);
  };

  if (games.length === 0) {
    return null;
  }

  const currentGame = games[currentIndex];

  return (
    <div className="relative h-80 mb-8 rounded-lg overflow-hidden bg-gradient-to-r from-blue-900 to-purple-900">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={currentGame.thumb} 
          alt={currentGame.title}
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center h-full px-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold">
              Featured
            </span>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-yellow-400 font-semibold">
                {(currentGame.rating || 4.5).toFixed(2)}
              </span>
            </div>
          </div>

          <h2 className="text-4xl font-bold text-white mb-3">
            {currentGame.title}
          </h2>
          
          <p className="text-gray-300 text-lg mb-6 line-clamp-3">
            {currentGame.description}
          </p>

          <div className="flex items-center gap-4 mb-6">
            <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">
              {currentGame.category}
            </span>
            <span className="text-gray-400 text-sm">
              {currentGame.plays?.toLocaleString()} plays
            </span>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => {
                onGameSelect(currentGame);
                onGamePlay(currentGame);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
            >
              <Play className="w-5 h-5" />
              Play Now
            </button>
            <button
              onClick={() => onGameSelect(currentGame)}
              className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Learn More
            </button>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {games.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedGames; 