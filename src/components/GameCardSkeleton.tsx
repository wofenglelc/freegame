import React from 'react';

const GameCardSkeleton: React.FC = () => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg animate-pulse">
      <div className="relative">
        {/* Image skeleton */}
        <div className="w-full h-48 bg-gray-700"></div>
        
        {/* Favorite button skeleton */}
        <div className="absolute top-2 right-2 w-8 h-8 bg-gray-600 rounded-full"></div>
        
        {/* Stats skeleton */}
        <div className="absolute bottom-2 left-2 flex items-center space-x-2">
          <div className="bg-gray-600 rounded-full px-2 py-1 w-12 h-5"></div>
          <div className="bg-gray-600 rounded-full px-2 py-1 w-12 h-5"></div>
        </div>
      </div>
      
      <div className="p-4">
        {/* Title skeleton */}
        <div className="h-6 bg-gray-700 rounded mb-2"></div>
        
        {/* Description skeleton */}
        <div className="space-y-2 mb-3">
          <div className="h-4 bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
        </div>
        
        {/* Tags skeleton */}
        <div className="flex flex-wrap gap-1 mb-3">
          <div className="h-6 bg-gray-700 rounded-full w-16"></div>
          <div className="h-6 bg-gray-700 rounded-full w-12"></div>
          <div className="h-6 bg-gray-700 rounded-full w-20"></div>
        </div>
        
        {/* Footer skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-4 bg-gray-700 rounded w-16"></div>
          <div className="h-8 bg-gray-700 rounded w-20"></div>
        </div>
      </div>
    </div>
  );
};

export default GameCardSkeleton; 