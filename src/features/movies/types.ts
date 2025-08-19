export interface Movie {
  Title: string;
  Year: string;
  Runtime: string;
  Genre: string;
  Director: string;
  isFavorite?: boolean;
}

export interface MoviesState {
  movies: Movie[];
  loading: boolean;
  error?: string;
}