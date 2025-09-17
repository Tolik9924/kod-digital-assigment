import type { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { fetchMovies, fetchMovie, editMovie, deleteMovie, addMovie } from "./moviesThunks";
import type { MoviesState } from "./types";

export const fetchMoviesExtra = (builder: ActionReducerMapBuilder<MoviesState>) => {
  builder
    .addCase(fetchMovies.pending, (state) => {
      state.loadings.loadingMovies = true;
    })
    .addCase(fetchMovies.fulfilled, (state, action) => {
      state.movies = action.payload;
      state.loadings.loadingMovies = false;
    })
    .addCase(fetchMovies.rejected, (state) => {
      state.loadings.loadingMovies = false;
    });
};

export const fetchMovieExtra = (builder: ActionReducerMapBuilder<MoviesState>) => {
  builder
    .addCase(fetchMovie.pending, (state) => {
      state.loadings.loadingMovie = true;
    })
    .addCase(fetchMovie.fulfilled, (state, action) => {
      state.movie = action.payload;
      state.loadings.loadingMovie = false;
    })
    .addCase(fetchMovie.rejected, (state) => {
      state.loadings.loadingMovie = false;
    });
};

export const editMovieExtra = (builder: ActionReducerMapBuilder<MoviesState>) => {
  builder
    .addCase(editMovie.pending, (state) => {
      state.loadings.loadingMovie = true;
    })
    .addCase(editMovie.fulfilled, (state, action) => {
      const updatedMovie = action.payload;
      const index = state.movies.findIndex(m => m.imdbID === updatedMovie.imdbID);
      if (index !== -1) {
        state.movies[index] = updatedMovie;
      }
    })
    .addCase(editMovie.rejected, (state) => {
      state.loadings.loadingMovie = false;
    });
};

export const deleteMovieExtra = (builder: ActionReducerMapBuilder<MoviesState>) => {
  builder
    .addCase(deleteMovie.pending, (state) => {
      state.loadings.loadingMovies = true;
    })
    .addCase(deleteMovie.fulfilled, (state, action) => {
      state.deleteMovie = action.payload;
      state.loadings.loadingMovies = false;
    })
    .addCase(deleteMovie.rejected, (state) => {
      state.loadings.loadingMovies = false;
    });
};

export const addMovieExtra = (builder: ActionReducerMapBuilder<MoviesState>) => {
  builder
    .addCase(addMovie.pending, (state) => {
      state.loadings.loadingAdding = true;
    })
    .addCase(addMovie.fulfilled, (state, action) => {
      state.movie = action.payload;
      state.loadings.loadingAdding = false;
    })
    .addCase(addMovie.rejected, (state) => {
      state.loadings.loadingAdding = false;
    });
};
