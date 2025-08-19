import { createSlice, type PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type { Movie, MoviesState } from './types';
import { formatTitle } from '../../utils/helpers';
import { MOVIES } from './initialData';

const API_KEY = 'YOUR_OMDB_API_KEY';

export const fetchMovies = createAsyncThunk(
  'movies/fetchMovies',
  async (query: string) => {
    const res = await axios.get(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`);
    return (res.data.Search || []).map((movie: any) => ({
      ...movie,
      Title: formatTitle(movie.Title),
      isFavorite: false,
    }));
  }
);

const initialState: MoviesState = {
  movies: [...MOVIES],
  loading: false,
};

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    addMovie: (state, action: PayloadAction<Movie>) => {
      state.movies.push({ ...action.payload, isFavorite: false });
    },
    editMovie: (state, action: PayloadAction<Movie>) => {
      state.movies = state.movies.map(m => m.Title === action.payload.Title ? action.payload : m);
    },
    deleteMovie: (state, action: PayloadAction<string>) => {
      state.movies = state.movies.filter(m => m.Title !== action.payload);
    },
    toggleFavorite: (state, action: PayloadAction<string>) => {
      state.movies = state.movies.map(m =>
        m.Title === action.payload ? { ...m, isFavorite: !m.isFavorite } : m
      );
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMovies.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchMovies.fulfilled, (state, action: PayloadAction<Movie[]>) => {
      state.movies = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchMovies.rejected, (state) => {
      state.loading = false;
    });
  }
});

export const { addMovie, editMovie, deleteMovie, toggleFavorite } = moviesSlice.actions;
export default moviesSlice.reducer;