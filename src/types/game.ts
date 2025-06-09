export interface Game {
  id: string;
  title: string;
  description: string;
  image?: string;
  thumb: string;
  url: string;
  instructions?: string;
  width: string | number;
  height: string | number;
  category: string;
  tags: string[];
  featured?: boolean;
  rating?: number;
  plays?: number;
}

export interface GameCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  gameCount: number;
}

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface RecentGame {
  game: Game;
  lastPlayed: string;
}

export interface HotGameData {
  gameId: string;
  playCount: number;
}

export interface FavoriteGame {
  game: Game;
  addedAt: string;
}