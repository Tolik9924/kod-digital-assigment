import { createSlice, type PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type { Movie, MoviesState } from './types';
import { formatTitle } from '../../utils/formatTitle';
import { getErrorMessage } from '../../utils/getErrorMessage';

const API_KEY = 'b573b702';

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

export const fetchMovies = createAsyncThunk(
  'movies/fetchMovies',
  async (query: string, { rejectWithValue  }) => {
    try {
      const res = await axios.get(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`);

      if (res.data.Response === "False") {
        return [];
      }

      return (res.data.Search || []).map((movie: Movie) => ({
      ...movie,
      Title: formatTitle(movie.Title),
      isFavorite: false,
    }));
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

export const fetchMovie = createAsyncThunk(
  'movies/fetchMovie',
  async (query: string, { rejectWithValue  }) => {
    try {
      const res = await axios.get(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${query}`);

      if (res.data.Response === "False") {
        return rejectWithValue(res.data.Error); 
    }

    return res.data || res;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

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
      state.movies.push({ ...action.payload, isFavorite: false });
    },
    editMovie: (state, action: PayloadAction<Movie>) => {
      console.log('ACTION PAYLOAD: ', action.payload);
      state.movies = state.movies.map(m => m.imdbID === action.payload.imdbID ? action.payload : m);
    },
    deleteMovie: (state, action: PayloadAction<string>) => {
      state.movies = state.movies.filter(m => m.Title !== action.payload);
    },
    toggleFavorite: (state, action: PayloadAction<string>) => {
      state.movies = state.movies.map(m =>
        m.Title === action.payload ? { ...m, isFavorite: !m.isFavorite } : m
      );
    },
    showLocalMovie: (state, action: PayloadAction<Movie>) => {
      console.log('SHOW LOCAL MOVIE: ', action.payload);
      state.movie = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMovies.pending, (state) => {
      state.loadingMovies = true;
    });
    builder.addCase(fetchMovies.fulfilled, (state, action: PayloadAction<Movie[]>) => {
      state.movies = action.payload;
      state.loadingMovies = false;
    });
    builder.addCase(fetchMovies.rejected, (state) => {
      state.loadingMovies = false;
    });

    builder.addCase(fetchMovie.pending, (state) => {
      state.loadingMovie = true;
    });
    builder.addCase(fetchMovie.fulfilled, (state, action: PayloadAction<Movie>) => {
      state.movie = action.payload;
      state.loadingMovie = false;
    });
    builder.addCase(fetchMovie.rejected, (state) => {
      state.loadingMovie = false;
    });
  }
});

export const { addMovie, editMovie, deleteMovie, toggleFavorite, showLocalMovie } = moviesSlice.actions;
export default moviesSlice.reducer;