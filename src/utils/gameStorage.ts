import { Game, RecentGame, HotGameData, FavoriteGame } from '../types/game';

const RECENT_GAMES_KEY = 'recentGames';
const HOT_GAMES_KEY = 'hotGamesData';
const FAVORITES_KEY = 'favoriteGames';
const MAX_RECENT_GAMES = 10;

export const gameStorage = {
  // Recently played games
  getRecentGames(): RecentGame[] {
    try {
      const stored = localStorage.getItem(RECENT_GAMES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  addRecentGame(game: Game): void {
    try {
      const recentGames = this.getRecentGames();
      
      // Remove if already exists
      const filtered = recentGames.filter(item => item.game.id !== game.id);
      
      // Add to beginning
      const updated = [
        { game, lastPlayed: new Date().toISOString() },
        ...filtered
      ].slice(0, MAX_RECENT_GAMES);
      
      localStorage.setItem(RECENT_GAMES_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save recent game:', error);
    }
  },

  clearRecentGames(): void {
    try {
      localStorage.removeItem(RECENT_GAMES_KEY);
    } catch (error) {
      console.error('Failed to clear recent games:', error);
    }
  },

  // Favorite games
  getFavoriteGames(): FavoriteGame[] {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  addFavorite(game: Game): void {
    try {
      const favorites = this.getFavoriteGames();
      
      // Check if already favorited
      if (!favorites.find(item => item.game.id === game.id)) {
        const updated = [
          { game, addedAt: new Date().toISOString() },
          ...favorites
        ];
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      }
    } catch (error) {
      console.error('Failed to add favorite:', error);
    }
  },

  removeFavorite(gameId: string): void {
    try {
      const favorites = this.getFavoriteGames();
      const filtered = favorites.filter(item => item.game.id !== gameId);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to remove favorite:', error);
    }
  },

  isFavorite(gameId: string): boolean {
    try {
      const favorites = this.getFavoriteGames();
      return favorites.some(item => item.game.id === gameId);
    } catch {
      return false;
    }
  },

  clearFavorites(): void {
    try {
      localStorage.removeItem(FAVORITES_KEY);
    } catch (error) {
      console.error('Failed to clear favorites:', error);
    }
  },

  // Hot games data
  getHotGamesData(): HotGameData[] {
    try {
      const stored = localStorage.getItem(HOT_GAMES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  incrementGamePlayCount(gameId: string): void {
    try {
      const hotGamesData = this.getHotGamesData();
      const existingIndex = hotGamesData.findIndex(item => item.gameId === gameId);
      
      if (existingIndex >= 0) {
        hotGamesData[existingIndex].playCount += 1;
      } else {
        hotGamesData.push({ gameId, playCount: 1 });
      }
      
      localStorage.setItem(HOT_GAMES_KEY, JSON.stringify(hotGamesData));
    } catch (error) {
      console.error('Failed to increment play count:', error);
    }
  },

  initializeHotGamesData(games: Game[]): void {
    try {
      const existing = this.getHotGamesData();
      if (existing.length === 0) {
        // Select 10 random games and assign random play counts
        const shuffled = [...games].sort(() => Math.random() - 0.5);
        const initialData = shuffled.slice(0, 10).map(game => ({
          gameId: game.id,
          playCount: Math.floor(Math.random() * 500) + 100 // Random count between 100-600
        }));
        
        localStorage.setItem(HOT_GAMES_KEY, JSON.stringify(initialData));
      }
    } catch (error) {
      console.error('Failed to initialize hot games data:', error);
    }
  }
};