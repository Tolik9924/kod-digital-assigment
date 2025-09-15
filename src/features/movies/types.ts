type Rating = {
  Source: string;
  Value: string;
}

export interface Movie {
  imdbID: string;
  Poster: string;
  Title: string;
  Year: string;
  Type: string;
  isFavorite?: boolean;
  Runtime?: string;
  Director?: string;
  Genre?: string;
  Actors?: string;
  Awards?: string;
  BoxOffice?: string;
  Country?: string;
  DVD?: string;
  Language?: string;
  Metascore?: string;
  Ratings?: Rating[],
  Plot?: string;
  Production?: string;
  Rated?: string;
  Source?: {
    Source: string,
    Value: string,
  }[],
  Released?: string;
  Response?: string;
  Website?: string;
  Writer?: string;
  imdbRating?: string;
  imdbVotes?: string;
}

export type Error = {
  Response: string;
  Error: string;
};

export interface MoviesState {
  movie: Movie,
  movies: Movie[];
  loading: boolean;
  error?: string;
  loadingMovies: boolean;
  loadingMovie: boolean;
  deleteMovie: string;
  loadingAdding: boolean;
}