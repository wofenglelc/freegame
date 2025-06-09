import { useState, useEffect, useMemo } from 'react';
import { Game, GameCategory, PaginationData, RecentGame, FavoriteGame } from '../types/game';
import { gameStorage } from '../utils/gameStorage';
import { FilterOptions } from '../components/GameFilters';

import categoriesData from '../data/categories.json';
import hotGamesData from '../data/hotGames.json';

// Dynamic import function for game data
const importGameData = async (category: string): Promise<any[]> => {
  try {
    // Map category IDs to actual file names
    const fileMap: { [key: string]: string } = {
      'action': 'action',
      'adventure': 'Adventure',
      'puzzle': 'Puzzle',
      'racing': 'Racing',
      'sports': 'Sports',
      'arcade': 'Arcade',
      'shooting': 'Shooting',
      'multiplayer': 'Multiplayer',
      'hypercasual': 'Hypercasual',
      'girls': 'Girls',
      'boys': 'Boys',
      'clicker': 'Clicker',
      'cooking': 'Cooking',
      'soccer': 'Soccer',
      'stickman': 'Stickman',
      'io': 'IO',
      '2player': '2 Player',
      '3d': '3D',
      'bejeweled': 'Bejeweled',
      'babyhazel': 'Baby Hazel'
    };

    const fileName = fileMap[category];
    if (!fileName) return [];

    const module = await import(`../data/games/${fileName}.json`);
    return module.default || [];
  } catch (error) {
    console.error(`Failed to load games for category: ${category}`, error);
    return [];
  }
};

// Shuffle array using Fisher-Yates algorithm with seed
const shuffleArray = <T>(array: T[], seed: number): T[] => {
  const shuffled = [...array];
  let currentIndex = shuffled.length;
  let randomIndex;
  
  // Use seed for consistent randomization
  const random = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  while (currentIndex !== 0) {
    randomIndex = Math.floor(random() * currentIndex);
    currentIndex--;
    [shuffled[currentIndex], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[currentIndex]];
  }

  return shuffled;
};

// Transform raw game data to match our Game interface
const transformGameData = (rawGames: any[]): Game[] => {
  return rawGames.map(game => ({
    id: game.id,
    title: game.title,
    description: game.description,
    thumb: game.thumb,
    url: game.url,
    instructions: game.instructions,
    width: game.width,
    height: game.height,
    category: game.category,
    tags: typeof game.tags === 'string' ? game.tags.split(', ').map((tag: string) => tag.trim()) : game.tags,
    rating: game.rating || (4.0 + Math.random() * 1.0), // Random rating between 4.0-5.0
    plays: game.plays || Math.floor(Math.random() * 50000) + 1000, // Random play count
  }));
};

export function useGames() {
  const [allGames, setAllGames] = useState<Game[]>([]);
  const [gamesByCategory, setGamesByCategory] = useState<{ [key: string]: Game[] }>({});
  const [loadingCategories, setLoadingCategories] = useState<Set<string>>(new Set());
  
  // Updated categories to match actual files
  const [categories] = useState<GameCategory[]>([
    {
      id: 'recent',
      name: 'Recently Played',
      description: 'Your recently played games',
      icon: 'clock',
      gameCount: 0
    },
    {
      id: 'favorites',
      name: 'Favorites',
      description: 'Your favorite games',
      icon: 'heart',
      gameCount: 0
    },
    {
      id: 'hot',
      name: 'Hot Games',
      description: 'Most popular games right now',
      icon: 'flame',
      gameCount: 10
    },
    // Add categories that have actual game files
    {
      id: 'action',
      name: 'Action',
      description: 'High-energy games with fast-paced gameplay',
      icon: 'zap',
      gameCount: 0
    },
    {
      id: 'adventure',
      name: 'Adventure',
      description: 'Explore new worlds and embark on epic journeys',
      icon: 'compass',
      gameCount: 0
    },
    {
      id: 'puzzle',
      name: 'Puzzle',
      description: 'Brain-teasing challenges and mind-bending riddles',
      icon: 'puzzle',
      gameCount: 0
    },
    {
      id: 'racing',
      name: 'Racing',
      description: 'High-speed thrills and competitive racing',
      icon: 'car',
      gameCount: 0
    },
    {
      id: 'sports',
      name: 'Sports',
      description: 'Athletic competitions and sports simulations',
      icon: 'football',
      gameCount: 0
    },
    {
      id: 'arcade',
      name: 'Arcade',
      description: 'Classic arcade-style games with retro charm',
      icon: 'gamepad-2',
      gameCount: 0
    },
    {
      id: 'shooting',
      name: 'Shooting',
      description: 'Target practice and combat shooting games',
      icon: 'target',
      gameCount: 0
    },
    {
      id: 'multiplayer',
      name: 'Multiplayer',
      description: 'Play with friends and compete online',
      icon: 'users',
      gameCount: 0
    },
    {
      id: 'girls',
      name: 'Girls',
      description: 'Games designed for girls',
      icon: 'heart',
      gameCount: 0
    },
    {
      id: 'boys',
      name: 'Boys',
      description: 'Games designed for boys',
      icon: 'shield',
      gameCount: 0
    },
    {
      id: 'cooking',
      name: 'Cooking',
      description: 'Cooking and restaurant management games',
      icon: 'chef-hat',
      gameCount: 0
    },
    {
      id: 'soccer',
      name: 'Soccer',
      description: 'Football and soccer games',
      icon: 'football',
      gameCount: 0
    },
    {
      id: 'stickman',
      name: 'Stickman',
      description: 'Simple but fun stickman games',
      icon: 'user',
      gameCount: 0
    },
    {
      id: 'io',
      name: 'IO Games',
      description: 'Multiplayer browser games',
      icon: 'globe',
      gameCount: 0
    },
    {
      id: '2player',
      name: '2 Player',
      description: 'Games for two players',
      icon: 'users',
      gameCount: 0
    },
    {
      id: '3d',
      name: '3D Games',
      description: '3D graphics and gameplay',
      icon: 'box',
      gameCount: 0
    },
    {
      id: 'bejeweled',
      name: 'Bejeweled',
      description: 'Match-3 puzzle games',
      icon: 'gem',
      gameCount: 0
    },
    {
      id: 'babyhazel',
      name: 'Baby Hazel',
      description: 'Baby Hazel adventure games',
      icon: 'baby',
      gameCount: 0
    },
    {
      id: 'clicker',
      name: 'Clicker',
      description: 'Click and idle games',
      icon: 'mouse-pointer',
      gameCount: 0
    },
    {
      id: 'hypercasual',
      name: 'Hypercasual',
      description: 'Simple and addictive games',
      icon: 'smartphone',
      gameCount: 0
    }
  ]);
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [recentGames, setRecentGames] = useState<RecentGame[]>([]);
  const [favoriteGames, setFavoriteGames] = useState<FavoriteGame[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    sortBy: 'random',
    sortOrder: 'asc',
    minRating: 0,
    tags: []
  });
  const [gamesSeed, setGamesSeed] = useState(Date.now()); // Seed for randomization

  // Load games for a specific category
  const loadCategoryGames = async (categoryId: string) => {
    if (gamesByCategory[categoryId] || loadingCategories.has(categoryId)) {
      return; // Already loaded or loading
    }

    setLoadingCategories(prev => new Set([...prev, categoryId]));
    
    try {
      const rawGames = await importGameData(categoryId);
      const games = transformGameData(rawGames);
      
      setGamesByCategory(prev => ({
        ...prev,
        [categoryId]: games
      }));
      
      // Update allGames with better duplicate detection
      setAllGames(prev => {
        // Use combination of ID and title to detect duplicates more reliably
        const existingKeys = new Set(prev.map(g => `${g.id}-${g.title.toLowerCase().trim()}`));
        const newGames = games.filter(g => {
          const key = `${g.id}-${g.title.toLowerCase().trim()}`;
          return !existingKeys.has(key);
        });
        return [...prev, ...newGames];
      });

      console.log(`Loaded ${games.length} games for category: ${categoryId}`);
    } catch (error) {
      console.error(`Failed to load category ${categoryId}:`, error);
    } finally {
      setLoadingCategories(prev => {
        const newSet = new Set(prev);
        newSet.delete(categoryId);
        return newSet;
      });
    }
  };

  // Initialize data and load from storage
  useEffect(() => {
    setRecentGames(gameStorage.getRecentGames());
    setFavoriteGames(gameStorage.getFavoriteGames());
    
    // Clear existing games and categories to ensure clean state
    setAllGames([]);
    setGamesByCategory({});
    setLoadingCategories(new Set());
    
    // Load all categories for display counts
    const loadAllCategories = async () => {
      const categoriesToLoad = [
        'action', 'adventure', 'puzzle', 'racing', 'sports', 'arcade', 'shooting',
        'multiplayer', 'girls', 'boys', 'cooking', 'soccer', 'stickman', 'io',
        '2player', '3d', 'bejeweled', 'babyhazel', 'clicker', 'hypercasual'
      ];
      
      // Load categories one by one to avoid overwhelming the browser
      for (const categoryId of categoriesToLoad) {
        try {
          await loadCategoryGames(categoryId);
          // Small delay to prevent browser freezing
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          console.error(`Failed to load category ${categoryId}:`, error);
        }
      }
    };
    
    loadAllCategories();
  }, []);

  // Load games when category is selected
  useEffect(() => {
    if (selectedCategory && !['recent', 'favorites', 'hot'].includes(selectedCategory)) {
      loadCategoryGames(selectedCategory);
    }
  }, [selectedCategory]);

  // Set fixed items per page to prevent overflow - always 20 items
  useEffect(() => {
    setItemsPerPage(20); // Fixed 20 items per page
  }, []);

  // Get hot games based on play counts
  const getHotGames = useMemo(() => {
    if (allGames.length === 0) return [];
    
    const localHotData = gameStorage.getHotGamesData();
    const defaultHotData = hotGamesData;
    
    // Combine local and default data, prioritizing local
    const combinedData = [...localHotData];
    defaultHotData.forEach(defaultItem => {
      if (!combinedData.find(item => item.gameId === defaultItem.gameId)) {
        combinedData.push(defaultItem);
      }
    });
    
    // Sort by play count and get top 10
    const sortedData = combinedData.sort((a, b) => b.playCount - a.playCount).slice(0, 10);
    
    // Map to actual games
    const hotGames = sortedData
      .map(item => allGames.find(game => game.id === item.gameId))
      .filter(Boolean) as Game[];
    
    // If no hot games found, return top rated games
    if (hotGames.length === 0) {
      return allGames
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 10);
    }
    
    return hotGames;
  }, [allGames]);

  // Get all unique tags for filtering
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    allGames.forEach(game => {
      game.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [allGames]);

  // Add timer for periodic game shuffling
  useEffect(() => {
    const interval = setInterval(() => {
      setGamesSeed(Date.now());
    }, 24 * 60 * 60 * 1000); // Update every day (24 hours)
    
    return () => clearInterval(interval);
  }, []);

  // Filter and sort games based on category, search, and filters
  const filteredGames = useMemo(() => {
    let filtered: Game[] = [];

    if (selectedCategory === 'recent') {
      filtered = recentGames.map(item => item.game);
    } else if (selectedCategory === 'favorites') {
      filtered = favoriteGames.map(item => item.game);
    } else if (selectedCategory === 'hot') {
      filtered = getHotGames;
    } else if (selectedCategory) {
      // Use games from specific category
      filtered = gamesByCategory[selectedCategory] || [];
    } else {
      filtered = allGames;
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(game =>
        game.title.toLowerCase().includes(query) ||
        game.description.toLowerCase().includes(query) ||
        game.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply filters
    if (filters.minRating > 0) {
      filtered = filtered.filter(game => (game.rating || 0) >= filters.minRating);
    }

    if (filters.tags.length > 0) {
      filtered = filtered.filter(game => 
        filters.tags.some(filterTag => game.tags.includes(filterTag))
      );
    }

    // Apply sorting
    if (filters.sortBy === 'random' || (!selectedCategory && !searchQuery)) {
      // For all games or random sort, use shuffled order
      filtered = shuffleArray(filtered, gamesSeed);
    } else {
      filtered.sort((a, b) => {
        let comparison = 0;
        
        switch (filters.sortBy) {
          case 'title':
            comparison = a.title.localeCompare(b.title);
            break;
          case 'rating':
            comparison = (a.rating || 0) - (b.rating || 0);
            break;
          case 'plays':
            comparison = (a.plays || 0) - (b.plays || 0);
            break;
          case 'recent':
            // For recent, we'll use a simple random sort for now
            comparison = Math.random() - 0.5;
            break;
        }
        
        return filters.sortOrder === 'desc' ? -comparison : comparison;
      });
    }

    return filtered;
  }, [allGames, selectedCategory, searchQuery, recentGames, favoriteGames, getHotGames, filters, gamesSeed]);

  // Paginate games
  const paginatedGames = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredGames.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredGames, currentPage, itemsPerPage]);

  // Update categories with dynamic counts
  const updatedCategories = useMemo(() => {
    return categories.map(category => {
      if (category.id === 'recent') {
        return { ...category, gameCount: recentGames.length };
      } else if (category.id === 'favorites') {
        return { ...category, gameCount: favoriteGames.length };
      } else if (category.id === 'hot') {
        return { ...category, gameCount: getHotGames.length };
      } else {
        const categoryGames = gamesByCategory[category.id] || [];
        return { ...category, gameCount: categoryGames.length };
      }
    });
  }, [categories, recentGames.length, favoriteGames.length, gamesByCategory, getHotGames.length]);

  // Pagination data
  const pagination: PaginationData = useMemo(() => ({
    currentPage,
    totalPages: Math.ceil(filteredGames.length / itemsPerPage),
    totalItems: filteredGames.length,
    itemsPerPage,
  }), [filteredGames.length, currentPage, itemsPerPage]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery, itemsPerPage, filters]);

  const handleSearch = (query: string) => {
    setLoading(true);
    setSearchQuery(query);
    // Simulate loading delay
    setTimeout(() => setLoading(false), 300);
  };

  const handleCategorySelect = (categoryId: string | null) => {
    setLoading(true);
    setSelectedCategory(categoryId);
    // Simulate loading delay
    setTimeout(() => setLoading(false), 300);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
  };

  const handleGamePlay = (game: Game) => {
    // Add to recent games
    gameStorage.addRecentGame(game);
    setRecentGames(gameStorage.getRecentGames());
    
    // Increment play count for hot games
    gameStorage.incrementGamePlayCount(game.id);
    
    // Initialize hot games data if needed
    if (allGames.length > 0) {
      gameStorage.initializeHotGamesData(allGames);
    }
  };

  const refreshFavorites = () => {
    setFavoriteGames(gameStorage.getFavoriteGames());
  };

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setLoading(true);
    setFilters(newFilters);
    // Simulate loading delay
    setTimeout(() => setLoading(false), 300);
  };

  const handleFiltersReset = () => {
    setFilters({
      sortBy: 'random',
      sortOrder: 'asc',
      minRating: 0,
      tags: []
    });
  };

  return {
    games: paginatedGames,
    allGames, // Expose all games for statistics
    categories: updatedCategories,
    selectedCategory,
    searchQuery,
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
  };
}