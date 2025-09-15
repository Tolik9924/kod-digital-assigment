import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { formatTitle } from '../../utils/formatTitle';
import { getErrorMessage } from '../../utils/getErrorMessage';
import { movieService } from '../../services/useService';
import type { Movie } from './types';

const API_KEY = 'b573b702';

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

export const editMovie = createAsyncThunk<Movie, {imdbID: string, data: Movie}>(
  'movies/editMovie',
  async ({imdbID, data}, { rejectWithValue  }) => {
    try {
      const editData = await movieService.edit({imdbID, data});
      return editData;
    }
    catch (err) {
      return rejectWithValue(getErrorMessage(err));
    } 
  }
);

export const deleteMovie = createAsyncThunk<string, string>(
  'movies/deleteMovie',
  async (imdbID,  { rejectWithValue  }) => {
    try {
      const data = await movieService.delete(imdbID);
      return data;
    }
    catch (err) {
      return rejectWithValue(getErrorMessage(err));
    } 
  }
);

export const addMovie = createAsyncThunk<Movie, Movie>(
  'movies/addMovie',
  async (data, { rejectWithValue  }) => {
    try {
      const res = await movieService.create(data);
      return res;
    }
    catch (err) {
      return rejectWithValue(getErrorMessage(err)); 
    }
  }
);
