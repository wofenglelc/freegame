import React, { useState } from 'react';
import { ChevronDown, SlidersHorizontal, X, Star, TrendingUp, Clock, Users } from 'lucide-react';

export interface FilterOptions {
  sortBy: 'title' | 'rating' | 'plays' | 'recent' | 'random';
  sortOrder: 'asc' | 'desc';
  minRating: number;
  tags: string[];
}

interface GameFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  availableTags: string[];
  onReset: () => void;
}

const GameFilters: React.FC<GameFiltersProps> = ({
  filters,
  onFiltersChange,
  availableTags,
  onReset
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const sortOptions = [
    { value: 'title', label: 'Title', icon: '🔤' },
    { value: 'rating', label: 'Rating', icon: '⭐' },
    { value: 'plays', label: 'Popularity', icon: '👥' },
    { value: 'recent', label: 'Recently Added', icon: '🕒' },
    { value: 'random', label: 'Random', icon: '🎲' },
  ];

  const ratingOptions = [
    { value: 0, label: 'All Ratings' },
    { value: 3, label: '3+ Stars' },
    { value: 4, label: '4+ Stars' },
    { value: 4.5, label: '4.5+ Stars' },
  ];

  const updateFilters = (updates: Partial<FilterOptions>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const toggleTag = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    updateFilters({ tags: newTags });
  };

  const hasActiveFilters = () => {
    return filters.minRating > 0 || filters.tags.length > 0 || (filters.sortBy !== 'random' && filters.sortBy !== 'title');
  };

  return (
    <div className="relative">
      {/* Filter Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
          hasActiveFilters()
            ? 'bg-blue-600 text-white'
            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
        }`}
      >
        <SlidersHorizontal className="w-4 h-4" />
        <span>Filters</span>
        {hasActiveFilters() && (
          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {filters.tags.length + (filters.minRating > 0 ? 1 : 0) + (filters.sortBy !== 'title' ? 1 : 0)}
          </span>
        )}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Filter Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-xl z-50 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Filter Games</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sort By */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Sort By
            </label>
            <div className="grid grid-cols-2 gap-2">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateFilters({ sortBy: option.value as any })}
                  className={`flex items-center space-x-2 p-2 rounded-lg text-sm transition-colors ${
                    filters.sortBy === option.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <span>{option.icon}</span>
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
            
            {/* Sort Order */}
            <div className="flex mt-2 space-x-2">
              <button
                onClick={() => updateFilters({ sortOrder: 'asc' })}
                className={`flex-1 py-2 px-3 rounded text-sm ${
                  filters.sortOrder === 'asc'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                ↑ Ascending
              </button>
              <button
                onClick={() => updateFilters({ sortOrder: 'desc' })}
                className={`flex-1 py-2 px-3 rounded text-sm ${
                  filters.sortOrder === 'desc'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                ↓ Descending
              </button>
            </div>
          </div>

          {/* Minimum Rating */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Minimum Rating
            </label>
            <div className="grid grid-cols-2 gap-2">
              {ratingOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateFilters({ minRating: option.value })}
                  className={`flex items-center justify-center space-x-1 p-2 rounded-lg text-sm transition-colors ${
                    filters.minRating === option.value
                      ? 'bg-yellow-600 text-black'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {option.value > 0 && <Star className="w-3 h-3 fill-current" />}
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tags Filter */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tags ({filters.tags.length} selected)
            </label>
            <div className="max-h-32 overflow-y-auto">
              <div className="grid grid-cols-2 gap-1">
                {availableTags.slice(0, 20).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`p-2 rounded text-xs text-left transition-colors ${
                      filters.tags.includes(tag)
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-2">
            <button
              onClick={onReset}
              className="flex-1 py-2 px-4 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Clear All
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameFilters; 