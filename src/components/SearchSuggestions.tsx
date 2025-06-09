import React from 'react';
import { Search, TrendingUp, Clock } from 'lucide-react';
import { Game } from '../types/game';

interface SearchSuggestionsProps {
  query: string;
  games: Game[];
  recentSearches: string[];
  onSuggestionClick: (suggestion: string) => void;
  onGameClick: (game: Game) => void;
  isVisible: boolean;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  query,
  games,
  recentSearches,
  onSuggestionClick,
  onGameClick,
  isVisible,
}) => {
  if (!isVisible) return null;

  // Filter games based on query
  const filteredGames = query.length > 0 
    ? games.filter(game =>
        game.title.toLowerCase().includes(query.toLowerCase()) ||
        game.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 5)
    : [];

  // Get popular search terms (categories and common tags)
  const popularSearches = [
    'Action', 'Puzzle', 'Racing', 'Adventure', 'Shooting',
    'Multiplayer', 'Arcade', 'Sports', 'Strategy'
  ];

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
      {/* Game Suggestions */}
      {filteredGames.length > 0 && (
        <div className="p-2">
          <div className="text-xs text-gray-400 uppercase tracking-wide px-2 py-1 mb-1">
            Games
          </div>
          {filteredGames.map((game) => (
            <button
              key={game.id}
              onClick={() => onGameClick(game)}
              className="w-full flex items-center gap-3 px-2 py-2 hover:bg-gray-700 rounded-lg transition-colors text-left"
            >
              <img 
                src={game.thumb} 
                alt={game.title}
                className="w-10 h-10 object-cover rounded"
              />
              <div className="flex-1 min-w-0">
                <div className="text-white text-sm font-medium truncate">
                  {game.title}
                </div>
                <div className="text-gray-400 text-xs">
                  {game.category} • {(game.plays || 0).toLocaleString()} plays
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Recent Searches */}
      {query.length === 0 && recentSearches.length > 0 && (
        <div className="p-2 border-t border-gray-700">
          <div className="text-xs text-gray-400 uppercase tracking-wide px-2 py-1 mb-1 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Recent Searches
          </div>
          {recentSearches.slice(0, 5).map((search, index) => (
            <button
              key={index}
              onClick={() => onSuggestionClick(search)}
              className="w-full flex items-center gap-2 px-2 py-2 hover:bg-gray-700 rounded-lg transition-colors text-left"
            >
              <Search className="w-4 h-4 text-gray-400" />
              <span className="text-gray-300 text-sm">{search}</span>
            </button>
          ))}
        </div>
      )}

      {/* Popular Searches */}
      {query.length === 0 && (
        <div className="p-2 border-t border-gray-700">
          <div className="text-xs text-gray-400 uppercase tracking-wide px-2 py-1 mb-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Popular Searches
          </div>
          <div className="grid grid-cols-2 gap-1">
            {popularSearches.map((search) => (
              <button
                key={search}
                onClick={() => onSuggestionClick(search)}
                className="flex items-center gap-2 px-2 py-2 hover:bg-gray-700 rounded-lg transition-colors text-left"
              >
                <span className="text-gray-300 text-sm">{search}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {query.length > 0 && filteredGames.length === 0 && (
        <div className="p-4 text-center">
          <div className="text-gray-400 text-sm">
            No games found for "{query}"
          </div>
          <div className="text-gray-500 text-xs mt-1">
            Try searching for categories like "Action" or "Puzzle"
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchSuggestions; 