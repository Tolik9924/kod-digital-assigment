import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import type { AppDispatch, RootState } from "../../app/store";
import type { Movie } from "../../features/movies/types";
import { fetchMovie } from "../../features/movies/moviesSlice";
import styled from "styled-components";

import styles from "./movieFormModal.module.scss";
import { Input } from "../../ui-components/input/Input";

interface Props {
  movieData?: Movie;
  existingTitles: string;
  onSave: (movie: Movie) => void;
  onCancel: () => void;
}

const INITIAL_VALUES = {
  Title: "",
  Year: "",
  Runtime: "",
  Genre: "",
  Director: "",
};

const MovieFormModal: React.FC<Props> = ({
  movieData,
  existingTitles,
  onSave,
  onCancel,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { movie, movies, loading } = useSelector(
    (state: RootState) => state.movies
  );
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Movie>({
    values: movieData ? movie : INITIAL_VALUES,
  });

  useEffect(() => {
    if (movieData) {
      getMovieData(movieData.Title);
    }
  }, [movie.Title, movieData?.Title]);

  const getMovieData = (query: string) => {
    dispatch(fetchMovie(query));
  };

  const submit = (data: Movie) => {
    console.log("DATA: ", data);
    const sameError = "";
    // if (!movieData) {
    //   sameError = checkSameMovie(data.Title);
    // }

    if (sameError === "") {
      onSave(data);
    }
  };

  return (
    <div className={styles.movieFormModal}>
      {loading ? (
        <div>loading...</div>
      ) : (
        <form onSubmit={handleSubmit(submit)}>
          <Controller
            name="Title"
            control={control}
            rules={{
              validate: (value) => {
                const sameMovie = movies.find(
                  (item) =>
                    value.toLocaleLowerCase() === item.Title.toLocaleLowerCase()
                );

                if (sameMovie) {
                  return "SAME MOVIE";
                }

                return "";
              },
            }}
            render={({ field, fieldState }) => (
              <div className={styles.field}>
                <label>Title</label>
                <Input {...field} />
                {fieldState.error && <p>{fieldState.error.message}</p>}
              </div>
            )}
          />
          <Controller
            name="Year"
            control={control}
            render={({ field, fieldState }) => (
              <div className={styles.field}>
                <label>Year</label>
                <Input {...field} />
              </div>
            )}
          />
          <Controller
            name="Runtime"
            control={control}
            render={({ field, fieldState }) => (
              <div className={styles.field}>
                <label>Runtime</label>
                <Input {...field} />
              </div>
            )}
          />
          <Controller
            name="Genre"
            control={control}
            render={({ field, fieldState }) => (
              <div className={styles.field}>
                <label>Genre</label>
                <Input {...field} />
              </div>
            )}
          />
          <Controller
            name="Director"
            control={control}
            render={({ field, fieldState }) => (
              <div className={styles.field}>
                <label>Director</label>
                <Input {...field} />
              </div>
            )}
          />
          <button type="submit">Save</button>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default MovieFormModal;
