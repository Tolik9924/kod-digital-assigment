import { createSlice, type PayloadAction, } from '@reduxjs/toolkit';
import type { Movie, MoviesState } from './types';
import { editMovieExtra, fetchMovieExtra, fetchMoviesExtra } from './moviesExtraReducers';

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
};

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    addMovie: (state, action: PayloadAction<Movie>) => {
      state.movies.push({ ...action.payload });
    },
    deleteMovie: (state, action: PayloadAction<string>) => {
      state.movies = state.movies.filter(m => m.Title !== action.payload);
    },
    showLocalMovie: (state, action: PayloadAction<Movie>) => {
      state.movie = action.payload;
    }
  },
  extraReducers: (builder) => {
    fetchMoviesExtra(builder);
    fetchMovieExtra(builder);
    editMovieExtra(builder);
  }
});

export const { addMovie, deleteMovie, showLocalMovie } = moviesSlice.actions;
export default moviesSlice.reducer;