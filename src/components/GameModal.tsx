import React, { useState, useEffect, useRef } from 'react';
import { Game } from '../types/game';
import { X, Star, Eye, Tag, Maximize2, Heart, Play } from 'lucide-react';
import { gameStorage } from '../utils/gameStorage';

interface GameModalProps {
  game: Game;
  onClose: () => void;
  onGamePlay?: (game: Game) => void;
}

export default function GameModal({ game, onClose, onGamePlay }: GameModalProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    setIsFavorited(gameStorage.isFavorite(game.id));
  }, [game.id]);

  const handleFavoriteToggle = () => {
    if (isFavorited) {
      gameStorage.removeFavorite(game.id);
    } else {
      gameStorage.addFavorite(game);
    }
    setIsFavorited(!isFavorited);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleGameStart = () => {
    setIsGameStarted(true);
    if (onGamePlay) {
      onGamePlay(game);
    }
  };

  const handleFullscreen = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    try {
      if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
      } else if ((iframe as any).webkitRequestFullscreen) {
        (iframe as any).webkitRequestFullscreen();
      } else if ((iframe as any).mozRequestFullScreen) {
        (iframe as any).mozRequestFullScreen();
      } else if ((iframe as any).msRequestFullscreen) {
        (iframe as any).msRequestFullscreen();
      }
    } catch (error) {
      console.error('Fullscreen request failed:', error);
      // Fallback: open game in new window
      window.open(game.url, '_blank', 'width=800,height=600');
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-gray-900 rounded-xl max-w-6xl w-full max-h-full overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div>
            <h2 className="text-2xl font-bold text-white">{game.title}</h2>
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span>{(game.rating || 4.5).toFixed(2)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>{(game.plays || 0).toLocaleString()} plays</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleFavoriteToggle}
              className={`p-2 rounded-lg transition-colors ${
                isFavorited 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-gray-800 hover:bg-gray-700 text-gray-400'
              }`}
            >
              <Heart className={`h-6 w-6 ${isFavorited ? 'fill-current' : ''}`} />
            </button>
            {!isGameStarted && (
              <button
                onClick={handleGameStart}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Play className="h-4 w-4" />
                Play Now
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="h-6 w-6 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Game iframe */}
          <div className="relative bg-black rounded-lg overflow-hidden mb-6">
            <div className="aspect-video">
              {isGameStarted ? (
                <iframe
                  ref={iframeRef}
                  src={game.url}
                  title={game.title}
                  className="w-full h-full"
                  allowFullScreen
                  frameBorder="0"
                  allow="gamepad; microphone; camera"
                />
              ) : (
                <div 
                  className="w-full h-full flex items-center justify-center bg-cover bg-center relative cursor-pointer"
                  style={{ backgroundImage: `url(${game.thumb})` }}
                  onClick={handleGameStart}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                  <button 
                    onClick={handleGameStart}
                    className="relative z-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-6 transition-colors"
                  >
                    <Play className="w-12 h-12" />
                  </button>
                </div>
              )}
            </div>
            {isGameStarted && (
              <button 
                onClick={handleFullscreen}
                className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 hover:bg-opacity-75 rounded-lg transition-colors"
                title="Fullscreen"
              >
                <Maximize2 className="h-4 w-4 text-white" />
              </button>
            )}
          </div>

          {/* Ad Space - Hidden for now */}

          {/* Game Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">About This Game</h3>
              <p className="text-gray-300 leading-relaxed">{game.description}</p>
              
              <div className="mt-4">
                <h4 className="text-md font-semibold text-white mb-2 flex items-center">
                  <Tag className="h-4 w-4 mr-2" />
                  Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {game.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Game Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Category:</span>
                  <span className="text-white capitalize">{game.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Resolution:</span>
                  <span className="text-white">{game.width} x {game.height}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Rating:</span>
                  <span className="text-white">{game.rating}/5.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Plays:</span>
                  <span className="text-white">{(game.plays || 0).toLocaleString()}</span>
                </div>
              </div>

              {/* Instructions */}
              {game.instructions && (
                <div className="mt-6">
                  <h4 className="text-md font-semibold text-white mb-2">How to Play</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">{game.instructions}</p>
                </div>
              )}

              {/* Ad Space - Hidden for now */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}