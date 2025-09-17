import { createSlice, type PayloadAction, } from '@reduxjs/toolkit';
import type { Movie, MoviesState } from './types';
import { addMovieExtra, editMovieExtra, fetchMovieExtra, fetchMoviesExtra } from './moviesExtraReducers';

const initialMovie = {
  imdbID: '',
  Poster: '',
  Title: '',
  Year: '',
  Runtime: '',
  Genre: '',
  Director: '',
  Type: '',
  isFavorite: false,
};

const initialState: MoviesState = {
  searchTitle: 'batman',
  movie: initialMovie,
  movies: [],
  loadings: {
    loadingMovies: false,
    loadingMovie: false,
    loading: false,
    loadingAdding: false,
  },
  deleteMovie: '',
};

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    handleSearch: (state, action: PayloadAction<string>) => {
      state.searchTitle = action.payload;
    },
    showLocalMovie: (state, action: PayloadAction<Movie>) => {
      state.movie = action.payload;
    }
  },
  extraReducers: (builder) => {
    fetchMoviesExtra(builder);
    fetchMovieExtra(builder);
    editMovieExtra(builder);
    addMovieExtra(builder);
  }
});

export const { showLocalMovie, handleSearch } = moviesSlice.actions;
export default moviesSlice.reducer;