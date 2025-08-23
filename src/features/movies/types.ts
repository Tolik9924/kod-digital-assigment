export interface Movie {
  Id: string;
  Poster: string;
  Title: string;
  Year: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Type: string;
  isFavorite?: boolean;
}

export interface MoviesState {
  movie: Movie,
  movies: Movie[];
  loading: boolean;
  error?: string;
}