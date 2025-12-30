
export interface Song {
  id: string;
  title: string;
  artists: string[];
  duration: string;
  styles: string[];
  categories: string[]; 
  thumbnail: string;
  isFavorite: boolean;
  addedDate: string;
  key?: string;
  lastPlayed?: string;
  youtubeUrl?: string;
}

export interface Category {
  id: string;
  name: string;
}

export type View = 'AUTH' | 'LIBRARY' | 'ARTISTS' | 'STYLES' | 'CATEGORIES' | 'ADD_SONG' | 'SONG_DETAILS' | 'SELECT_SONGS_FOR_CATEGORY';
