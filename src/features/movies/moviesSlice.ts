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
  movie: initialMovie,
  movies: [],
  loadingMovies: false,
  loadingMovie: false,
  loading: false,
  loadingAdding: false,
  deleteMovie: '',
};

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
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

export const { showLocalMovie } = moviesSlice.actions;
export default moviesSlice.reducer;