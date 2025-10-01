type Rating = {
  Source: string;
  Value: string;
}

export type Movie = {
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
  searchTitle: string;
  movie: Movie;
  movies: Movie[];
  loadings: {
    loading: boolean;
    loadingMovies: boolean;
    loadingMovie: boolean;
    loadingAdding: boolean;
  },
  error?: string;
  deleteMovie: string;
}