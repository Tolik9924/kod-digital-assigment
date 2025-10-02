import { createAsyncThunk } from "@reduxjs/toolkit";
import { formatTitle } from "../../utils/formatTitle";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { movieService } from "../../services/useService";
import type { Movie } from "./types";

export const fetchMovies = createAsyncThunk(
  "movies/fetchMovies",
  async (query: string, { rejectWithValue }) => {
    try {
      if (!query || query === "") {
        return [];
      }

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
  "movies/fetchMovie",
  async (query: string, { rejectWithValue }) => {
    try {
      const res = await movieService.getMovieInfo(query);
      return res;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

export const editMovie = createAsyncThunk<
  Movie,
  { imdbID: string; data: Movie }
>("movies/editMovie", async ({ imdbID, data }, { rejectWithValue }) => {
  try {
    const editData = await movieService.edit({ imdbID, data });
    return editData;
  } catch (err) {
    return rejectWithValue(getErrorMessage(err));
  }
});

export const deleteMovie = createAsyncThunk<string, string>(
  "movies/deleteMovie",
  async (imdbID, { rejectWithValue }) => {
    try {
      const data = await movieService.delete(imdbID);
      return data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

export const addMovie = createAsyncThunk<Movie, Movie>(
  "movies/addMovie",
  async (data, { rejectWithValue }) => {
    try {
      const res = await movieService.create(data);
      return res;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

export const getFavorites = createAsyncThunk(
  "movies/getFavorites",
  async (query: string, { rejectWithValue }) => {
    try {
      if (!query || query === "") {
        return [];
      }

      const res = await movieService.getFavorites(query);
      return res;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);
