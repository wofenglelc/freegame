import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import GameGrid from './components/GameGrid';
import GameModal from './components/GameModal';
import Pagination from './components/Pagination';
import FeaturedGames from './components/FeaturedGames';
import GameFilters from './components/GameFilters';
import GameStats from './components/GameStats';
import { useGames } from './hooks/useGames';
import { Game } from './types/game';

function App() {
  const {
    games,
    allGames,
    categories,
    selectedCategory,
    pagination,
    loading,
    recentGames,
    favoriteGames,
    filters,
    allTags,
    handleSearch,
    handleCategorySelect,
    handlePageChange,
    handleItemsPerPageChange,
    handleGamePlay,
    refreshFavorites,
    handleFiltersChange,
    handleFiltersReset,
  } = useGames();

  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [featuredGamesKey, setFeaturedGamesKey] = useState(0);

  // Update featured games every day
  React.useEffect(() => {
    const interval = setInterval(() => {
      setFeaturedGamesKey(prev => prev + 1);
    }, 24 * 60 * 60 * 1000); // Change every day (24 hours)
    
    return () => clearInterval(interval);
  }, []);

  const handleGameSelect = (game: Game) => {
    setSelectedGame(game);
  };

  const handleCloseModal = () => {
    setSelectedGame(null);
    // Refresh favorites when modal closes in case user favorited/unfavorited
    refreshFavorites();
  };

  const handleMenuToggle = (isOpen: boolean) => {
    setIsSidebarOpen(isOpen);
  };

  const getCategoryDisplayName = () => {
    if (!selectedCategory) return 'All Games';
    
    const category = categories.find(cat => cat.id === selectedCategory);
    return category?.name || 'All Games';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header onSearch={handleSearch} onMenuToggle={handleMenuToggle} />
      
      <div className="flex">
        <Sidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={(categoryId) => {
            handleCategorySelect(categoryId);
            setIsSidebarOpen(false);
          }}
          isOpen={isSidebarOpen}
        />
        
        <main className="flex-1 p-6 md:ml-60">
          {/* Featured Games - Only show on home page */}
          {!selectedCategory && (
            <>
              <FeaturedGames
                key={featuredGamesKey}
                games={allGames.length > 0 ? 
                  // Use featuredGamesKey as seed for consistent but changing randomization
                  (() => {
                    const shuffled = [...allGames];
                    const seed = featuredGamesKey + Date.now();
                    // Simple seeded shuffle
                    for (let i = shuffled.length - 1; i > 0; i--) {
                      const j = Math.floor(((seed + i) * 9301 + 49297) % 233280 / 233280) * (i + 1);
                      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
                    }
                    return shuffled.slice(0, 5);
                  })() : 
                  []
                }
                onGameSelect={handleGameSelect}
                onGamePlay={handleGamePlay}
              />
              
              {/* Game Statistics */}
              <GameStats
                games={allGames}
                categories={categories}
                favoriteCount={favoriteGames.length}
                recentCount={recentGames.length}
              />
            </>
          )}

          {/* Breadcrumb and Filters */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">{getCategoryDisplayName()}</h2>
                <p className="text-gray-400">
                  {loading ? 'Loading...' : `${pagination.totalItems} games available`}
                </p>
              </div>
              
              {/* Filters */}
              <GameFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                availableTags={allTags}
                onReset={handleFiltersReset}
              />
            </div>
          </div>

          {/* Games Grid */}
          <GameGrid
            games={games}
            onGameSelect={handleGameSelect}
            onGamePlay={handleGamePlay}
            loading={loading}
          />

          {/* Pagination */}
          {!loading && games.length > 0 && (
            <Pagination
              pagination={pagination}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          )}

        </main>
      </div>

      {/* Game Modal */}
      {selectedGame && (
        <GameModal 
          game={selectedGame} 
          onClose={handleCloseModal}
          onGamePlay={handleGamePlay}
        />
      )}
    </div>
  );
}

export default App;