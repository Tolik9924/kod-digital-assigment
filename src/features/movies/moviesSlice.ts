import { createSlice, type PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type { Movie, MoviesState } from './types';
import { formatTitle } from '../../utils/formatTitle';
import { getErrorMessage } from '../../utils/getErrorMessage';
import { movieService } from '../../services/useService';

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
      const res = await movieService.search(query);

      return (res || []).map((movie: Movie) => ({
      ...movie,
      Title: formatTitle(movie.Title),
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

export const addFavorites = createAsyncThunk(
  'movies/addFavorite',
  async (data: Movie, { rejectWithValue  }) => {
    console.log('DATA: ', data);
    try {
      await movieService.addFavorites(data);
    }
    catch (err) {
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
      state.movies.push({ ...action.payload });
    },
    editMovie: (state, action: PayloadAction<Movie>) => {
      state.movies = state.movies.map(m => m.imdbID === action.payload.imdbID ? action.payload : m);
    },
    deleteMovie: (state, action: PayloadAction<string>) => {
      state.movies = state.movies.filter(m => m.Title !== action.payload);
    },
    showLocalMovie: (state, action: PayloadAction<Movie>) => {
      console.log('SHOW LOCAL MOVIE: ', action.payload);
      state.movie = action.payload;
    }
  },
  extraReducers: (builder) => {
    //fetch movies
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

    // fetch movie
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

    // add favorites
    builder.addCase(addFavorites.pending, (state) => {
      state.loadingMovie = true;
    });
    builder.addCase(addFavorites.fulfilled, (state, action: PayloadAction<Movie>) => {
      state.movie = action.payload;
      state.loadingMovie = false;
    });
    builder.addCase(addFavorites.rejected, (state) => {
      state.loadingMovie = false;
    });
  }
});

export const { addMovie, editMovie, deleteMovie, toggleFavorite, showLocalMovie } = moviesSlice.actions;
export default moviesSlice.reducer;