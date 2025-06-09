import React from 'react';
import { GameCategory } from '../types/game';
import { 
  Zap, 
  Compass, 
  Puzzle, 
  Car, 
  Gamepad2, 
  Target, 
  Users, 
  Heart, 
  Shield, 
  User, 
  Globe, 
  Box, 
  MousePointer, 
  Smartphone, 
  Clock, 
  Flame,
  X
} from 'lucide-react';

interface SidebarProps {
  categories: GameCategory[];
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
  isOpen: boolean;
}

const iconMap: { [key: string]: React.ComponentType<any> } = {
  'zap': Zap,
  'compass': Compass,
  'puzzle': Puzzle,
  'car': Car,
  'football': Users, // Using Users as fallback for football
  'gamepad-2': Gamepad2,
  'target': Target,
  'users': Users,
  'heart': Heart,
  'shield': Shield,
  'chef-hat': User, // Using User as fallback for chef-hat
  'user': User,
  'globe': Globe,
  'box': Box,
  'gem': Zap, // Using Zap as fallback for gem
  'baby': User, // Using User as fallback for baby
  'mouse-pointer': MousePointer,
  'smartphone': Smartphone,
  'clock': Clock,
  'flame': Flame,
};

const Sidebar: React.FC<SidebarProps> = ({ 
  categories, 
  selectedCategory, 
  onCategorySelect, 
  isOpen 
}) => {
  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName] || Gamepad2;
    return <IconComponent className="w-4 h-4" />;
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => onCategorySelect(selectedCategory)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-60 bg-gray-800 border-r border-gray-700 z-50
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:h-screen
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700 shrink-0">
          <h2 className="text-lg font-bold text-white">Categories</h2>
          <button
            onClick={() => onCategorySelect(selectedCategory)}
            className="md:hidden text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories List - Remove scrolling, fit all categories */}
        <div className="flex-1 p-3">
          {/* All Games Button */}
          <button
            onClick={() => onCategorySelect(null)}
            className={`w-full flex items-center space-x-3 p-2 rounded-lg transition-colors duration-200 mb-2 ${
              selectedCategory === null
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span className="flex-1 text-left text-sm">All Games</span>
          </button>

          {/* Category Buttons */}
          <div className="space-y-1">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategorySelect(category.id)}
                className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  {getIcon(category.icon)}
                  <span className="text-left text-sm truncate">{category.name}</span>
                </div>
                <span className={`text-xs px-1.5 py-0.5 rounded-full shrink-0 ml-2 ${
                  selectedCategory === category.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-600 text-gray-300'
                }`}>
                  {category.gameCount}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-700 bg-gray-800 shrink-0">
          <div className="text-center">
            <p className="text-xs text-gray-400 mb-1">Free Game Portal</p>
            <p className="text-xs text-gray-500">Thousands of free games</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;