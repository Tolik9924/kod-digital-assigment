import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { MoviesState } from "./types";
import {
  addMovieExtra,
  editMovieExtra,
  editMovieFavoriteExtra,
  fetchMovieExtra,
  fetchMoviesExtra,
  getFavoritesExtra,
} from "./moviesExtraReducers";

const initialMovie = {
  imdbID: "",
  Poster: "",
  Title: "",
  Year: "",
  Runtime: "",
  Genre: "",
  Director: "",
  Type: "",
  isFavorite: false,
};

const initialState: MoviesState = {
  searchTitle: "",
  movie: initialMovie,
  movies: [],
  loadings: {
    loadingMovies: false,
    loadingMovie: false,
    loading: false,
    loadingAdding: false,
  },
  deleteMovie: "",
};

const moviesSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    handleSearch: (state, action: PayloadAction<string>) => {
      state.searchTitle = action.payload;
    },
  },
  extraReducers: (builder) => {
    fetchMoviesExtra(builder);
    fetchMovieExtra(builder);
    editMovieExtra(builder);
    editMovieFavoriteExtra(builder);
    addMovieExtra(builder);
    getFavoritesExtra(builder);
  },
});

export const { handleSearch } = moviesSlice.actions;
export default moviesSlice.reducer;
