import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import type { AppDispatch, RootState } from "../../app/store";
import type { Movie } from "../../features/movies/types";
import { fetchMovie } from "../../features/movies/moviesSlice";
import styled from "styled-components";

import styles from "./movieFormModal.module.scss";
import { Input } from "../../ui-components/input/Input";
import { Dropdown } from "../dropdown/Dropdown";

interface Props {
  movieData?: Movie;
  onSave: (movie: Movie, saveOrEdit: string, oldTitle: string) => void;
  onCancel: () => void;
}

const INITIAL_VALUES = {
  Title: "",
  Year: "",
  Runtime: "",
  Genre: "",
  Director: "",
};

const GENRES = [
  { id: "action", name: "Action" },
  { id: "adventure", name: "Adventure" },
  { id: "animation", name: "Animation" },
  { id: "biography", name: "Biography" },
  { id: "comedy", name: "Comedy" },
  { id: "crime", name: "Crime" },
  { id: "documentary", name: "Documentary" },
  { id: "drama", name: "Drama" },
  { id: "family", name: "Family" },
  { id: "fantasy", name: "Fantasy" },
  { id: "film-noir", name: "Film-Noir" },
  { id: "history", name: "History" },
  { id: "horror", name: "Horror" },
  { id: "music", name: "Music" },
  { id: "musical", name: "Musical" },
  { id: "mystery", name: "Mystery" },
  { id: "romance", name: "Romance" },
  { id: "sci-fi", name: "Sci-Fi" },
  { id: "sport", name: "Sport" },
  { id: "thriller", name: "Thriller" },
  { id: "war", name: "War" },
  { id: "western", name: "Western" },
  { id: "short", name: "Short" },
  { id: "reality-tv", name: "Reality-TV" },
  { id: "talk-show", name: "Talk-Show" },
  { id: "game-show", name: "Game-Show" },
  { id: "adult", name: "Adult" },
  { id: "superhero", name: "Superhero" },
  { id: "disaster", name: "Disaster" },
  { id: "teen", name: "Teen" },
  { id: "cyberpunk", name: "Cyberpunk" },
  { id: "survival", name: "Survival" },
  { id: "martial-arts", name: "Martial Arts" },
];

const MovieFormModal: React.FC<Props> = ({ movieData, onSave, onCancel }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { movie, movies, loading } = useSelector(
    (state: RootState) => state.movies
  );

  console.log("MOVIE: ", movie);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Movie>({
    values: movieData
      ? { ...movie, Genre: movie.Genre.split(", ") }
      : INITIAL_VALUES,
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
    const saveOrEdit = movieData ? "edit" : "save";
    const result = {
      ...data,
      Year: `${data.Year}`,
    };
    onSave(result, saveOrEdit, movie.Title);
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
              },
              required: "Title is required.",
            }}
            render={({ field, fieldState }) => (
              <div className={styles.field}>
                <label>Title</label>
                <Input
                  label="Star Wars"
                  value={field.value ?? ""}
                  handleChange={(e) => field.onChange(e.target.value)}
                />
                {fieldState.error && <p>{fieldState.error.message}</p>}
              </div>
            )}
          />
          <Controller
            name="Year"
            control={control}
            rules={{
              required: "Year is required",
              min: {
                value: 1880,
                message: "Year must be later than 1880",
              },
              max: {
                value: new Date().getFullYear() + 1,
                message: `Year cannot be later than ${
                  new Date().getFullYear() + 1
                }`,
              },
            }}
            render={({ field, fieldState }) => (
              <div className={styles.field}>
                <label>Year</label>
                <Input
                  type="number"
                  label="1990"
                  value={field.value ?? ""}
                  handleChange={(e) => field.onChange(Number(e.target.value))}
                />
                {fieldState.error && <p>{fieldState.error.message}</p>}
              </div>
            )}
          />
          <Controller
            name="Runtime"
            control={control}
            rules={{
              required: "Runtime is required",
              validate: (value) => {
                const match = value.match(/^(\d+)\s*min$/i);
                if (!match) return "Runtime must be in format: 120 min";
                const minutes = Number(match[1]);
                if (minutes < 1) return "Runtime must be at least 1 minute";
                if (minutes > 500) return "Runtime cannot exceed 500 minutes";
                return true;
              },
            }}
            render={({ field, fieldState }) => (
              <div className={styles.field}>
                <label>Runtime</label>
                <Input
                  type="text"
                  label="120 min"
                  value={field.value ?? ""}
                  handleChange={(e) => field.onChange(e.target.value)}
                />
                {fieldState.error && <p>{fieldState.error.message}</p>}
              </div>
            )}
          />
          <Controller
            name="Genre"
            control={control}
            render={({ field, fieldState }) => {
              console.log("FIELD: ", field);
              return (
                <div className={styles.field}>
                  <label>Genre</label>
                  <Dropdown
                    isMultiple={true}
                    options={GENRES}
                    selectedIds={field.value}
                    onSelect={(selectIds: string[]) => {
                      const value = selectIds.join(", ");
                      field.onChange(value);
                    }}
                    fullWidth
                  />
                  {fieldState.error && <p>{fieldState.error.message}</p>}
                </div>
              );
            }}
          />
          <Controller
            name="Director"
            control={control}
            rules={{
              minLength: {
                value: 3,
                message: "Director name must be at least 3 characters",
              },
              maxLength: {
                value: 50,
                message: "Director name cannot exceed 50 characters",
              },
              validate: (value) => {
                if (!/^[a-zA-Z\s]+$/.test(value)) {
                  return "Director name can only contain letters and spaces";
                }
                return true;
              },
            }}
            render={({ field, fieldState }) => (
              <div className={styles.field}>
                <label>Director</label>
                <Input
                  type="text"
                  value={field.value ?? ""}
                  handleChange={(e) => field.onChange(e.target.value)}
                />
                {fieldState.error && <p>{fieldState.error.message}</p>}
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
