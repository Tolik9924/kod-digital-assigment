import type { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { fetchMovies, fetchMovie, editMovie } from "./moviesThunks";
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

export const editMovieExtra = (builder: ActionReducerMapBuilder<MoviesState>) => {
  builder
    .addCase(editMovie.pending, (state) => {
      state.loadingMovie = true;
    })
    .addCase(editMovie.fulfilled, (state, action) => {
      state.movie = action.payload;
      state.loadingMovie = false;
    })
    .addCase(editMovie.rejected, (state) => {
      state.loadingMovie = false;
    });
};