import React from 'react';
import { Game, GameCategory } from '../types/game';
import { Star, Users, Trophy, TrendingUp, Clock, Heart, Gamepad2 } from 'lucide-react';

interface GameStatsProps {
  games: Game[];
  categories: GameCategory[];
  favoriteCount: number;
  recentCount: number;
}

const GameStats: React.FC<GameStatsProps> = ({ 
  games, 
  categories, 
  favoriteCount, 
  recentCount 
}) => {
  const stats = React.useMemo(() => {
    const totalGames = games.length;
    const totalPlays = games.reduce((sum, game) => sum + (game.plays || 0), 0);
    const averageRating = games.reduce((sum, game) => sum + (game.rating || 0), 0) / totalGames;
    const topRatedGames = games.filter(game => (game.rating || 0) >= 4.5).length;
    const mostPopularCategory = categories
      .filter(cat => !['recent', 'favorites', 'hot'].includes(cat.id))
      .sort((a, b) => b.gameCount - a.gameCount)[0];

    return {
      totalGames,
      totalPlays,
      averageRating,
      topRatedGames,
      mostPopularCategory,
      totalCategories: categories.filter(cat => !['recent', 'favorites', 'hot'].includes(cat.id)).length
    };
  }, [games, categories]);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const statItems = [
    {
      icon: <Gamepad2 className="w-6 h-6" />,
      label: 'Total Games',
      value: formatNumber(stats.totalGames),
      color: 'bg-blue-500',
      textColor: 'text-blue-400'
    },
    {
      icon: <Users className="w-6 h-6" />,
      label: 'Total Plays',
      value: formatNumber(stats.totalPlays),
      color: 'bg-green-500',
      textColor: 'text-green-400'
    },
    {
      icon: <Star className="w-6 h-6" />,
      label: 'Avg Rating',
      value: stats.averageRating.toFixed(2),
      color: 'bg-yellow-500',
      textColor: 'text-yellow-400'
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      label: 'Top Rated',
      value: stats.topRatedGames.toString(),
      color: 'bg-purple-500',
      textColor: 'text-purple-400'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      label: 'Categories',
      value: stats.totalCategories.toString(),
      color: 'bg-indigo-500',
      textColor: 'text-indigo-400'
    },
    {
      icon: <Heart className="w-6 h-6" />,
      label: 'Favorites',
      value: favoriteCount.toString(),
      color: 'bg-red-500',
      textColor: 'text-red-400'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      label: 'Recent',
      value: recentCount.toString(),
      color: 'bg-gray-500',
      textColor: 'text-gray-400'
    }
  ];

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-8">
      <div className="flex items-center mb-6">
        <TrendingUp className="w-6 h-6 text-blue-400 mr-2" />
        <h3 className="text-xl font-bold text-white">Game Portal Statistics</h3>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {statItems.map((item, index) => (
          <div 
            key={index}
            className="bg-gray-700 rounded-lg p-4 text-center hover:bg-gray-600 transition-colors duration-200"
          >
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${item.color} bg-opacity-20 mb-3`}>
              <div className={item.textColor}>
                {item.icon}
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{item.value}</div>
            <div className="text-sm text-gray-400">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Most Popular Category */}
      {stats.mostPopularCategory && (
        <div className="mt-6 p-4 bg-gray-700 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-semibold text-white mb-1">Most Popular Category</h4>
              <p className="text-gray-400">{stats.mostPopularCategory.description}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-400">{stats.mostPopularCategory.name}</div>
              <div className="text-sm text-gray-400">{stats.mostPopularCategory.gameCount} games</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameStats; 