import type { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { fetchMovies, fetchMovie, addFavorites } from "./moviesSlice";
import type { MoviesState } from "./types";

export const fetchMoviesExtra = (builder: ActionReducerMapBuilder<MoviesState>) => {
  builder
    .addCase(fetchMovies.pending, (state) => {
      state.loadingMovies = true;
    })
    .addCase(fetchMovies.fulfilled, (state, action) => {
      state.movies = action.payload;
      state.loadingMovies = false;
    })
    .addCase(fetchMovies.rejected, (state) => {
      state.loadingMovies = false;
    });
};

export const fetchMovieExtra = (builder: ActionReducerMapBuilder<MoviesState>) => {
  builder
    .addCase(fetchMovie.pending, (state) => {
      state.loadingMovie = true;
    })
    .addCase(fetchMovie.fulfilled, (state, action) => {
      state.movie = action.payload;
      state.loadingMovie = false;
    })
    .addCase(fetchMovie.rejected, (state) => {
      state.loadingMovie = false;
    });
};

export const addFavoritesExtra = (builder: ActionReducerMapBuilder<MoviesState>) => {
  builder
    .addCase(addFavorites.pending, (state) => {
      state.loadingMovie = true;
    })
    .addCase(addFavorites.fulfilled, (state, action) => {
      state.movie = action.payload;
      state.loadingMovie = false;
    })
    .addCase(addFavorites.rejected, (state) => {
      state.loadingMovie = false;
    });
};