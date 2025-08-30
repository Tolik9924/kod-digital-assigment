import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import type { AppDispatch, RootState } from "../../app/store";
import type { Movie } from "../../features/movies/types";
import type { Values } from "./types";
import { fetchMovie, showLocalMovie } from "../../features/movies/moviesSlice";
import { Input } from "../../ui-components/input/Input";
import { Button } from "../../ui-components/button/Button";
import { Loading } from "../../ui-components/loading/Loading";
import { classes } from "../../common_utils/classes/classes";
import { Dropdown } from "../dropdown/Dropdown";
import { GENRES, INITIAL_VALUES } from "./constants";

import styles from "./movieFormModal.module.scss";

const MovieFormModal = ({
  movieData,
  onSave,
  onCancel,
}: {
  movieData?: Movie;
  onSave: (movie: Movie, saveOrEdit: string) => void;
  onCancel: () => void;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { movie, movies, loadingMovie } = useSelector(
    (state: RootState) => state.movies
  );

  const movieFormData: Values = {
    ...movie,
    Title: movie.Title,
    Runtime: Number(movie.Runtime && movie.Runtime.split(" ")[0]),
    Year: Number(movie.Year),
    Genre: movie?.Genre ? movie.Genre?.split(", ") : [],
    Director: movie.Director || "",
  };

  const { control, handleSubmit } = useForm<Values>({
    values: movieData ? movieFormData : INITIAL_VALUES,
  });

  useEffect(() => {
    if (movieData) {
      getMovieData(movieData.imdbID);
    }
  }, [movie.Title, movieData?.Title]);

  const getMovieData = async (query: string) => {
    const result = await dispatch(fetchMovie(query));

    if (result.type.endsWith("/rejected")) {
      const foundMovie = movies.find((m) => m.imdbID === movieData?.imdbID);
      if (foundMovie) {
        dispatch(showLocalMovie(foundMovie));
      }
    }
  };

  const submit = (data: Values) => {
    const saveOrEdit = movieData ? "edit" : "save";
    const result = {
      ...data,
      imdbID: movieData ? movieData.imdbID : data.Title,
      Year: `${data.Year}`,
      Genre: data.Genre.join(", "),
      isFavorite: movieData ? movie.isFavorite : false,
      Poster: movieData ? movieData.Poster : "N/A",
      Runtime: `${data.Runtime} min.`,
      Type: "",
    };

    onSave(result, saveOrEdit);
  };

  return (
    <div className={styles.movieFormModal}>
      {loadingMovie ? (
        <div className={styles.loadingContainer}>
          <Loading variant="dots" />
        </div>
      ) : (
        <div className={styles.content}>
          <h2 className={styles.formTitle}>
            Let's {movieData ? "Edit" : "Create"} Movie
          </h2>
          <form className={styles.form} onSubmit={handleSubmit(submit)}>
            <Controller
              name="Title"
              control={control}
              rules={{
                validate: (value) => {
                  const sameMovie = movies.find(
                    (item) =>
                      movie.Title !== value &&
                      value.toLocaleLowerCase() ===
                        item.Title.toLocaleLowerCase()
                  );

                  if (sameMovie) {
                    return "SAME MOVIE";
                  }
                },
                required: "Title is required.",
              }}
              render={({ field, fieldState }) => (
                <div className={styles.field}>
                  <label className={styles.label}>Title</label>
                  <Input
                    label="Star Wars"
                    value={field.value ?? ""}
                    handleChange={(e) => field.onChange(e.target.value)}
                  />
                  <p className={classes(styles.error, styles.showError)}>
                    {fieldState.error?.message || ""}
                  </p>
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
                  <label className={styles.label}>Year</label>
                  <Input
                    type="number"
                    label="1990"
                    value={field.value ?? ""}
                    handleChange={(e) => field.onChange(Number(e.target.value))}
                  />
                  <p className={classes(styles.error, styles.showError)}>
                    {fieldState.error?.message || ""}
                  </p>
                </div>
              )}
            />
            <Controller
              name="Runtime"
              control={control}
              rules={{
                required: "Runtime is required",
                min: {
                  value: 1,
                  message: "1 minute is minimum for movie.",
                },
                max: {
                  value: 600,
                  message: `600 minutes is maximum for movie.`,
                },
              }}
              render={({ field, fieldState }) => (
                <div className={styles.field}>
                  <label className={styles.label}>Runtime</label>
                  <Input
                    type="number"
                    label="120"
                    value={field.value ?? ""}
                    handleChange={(e) => field.onChange(e.target.value)}
                  />
                  <p className={classes(styles.error, styles.showError)}>
                    {fieldState.error?.message || ""}
                  </p>
                </div>
              )}
            />
            <Controller
              name="Genre"
              control={control}
              rules={{
                required: "Genre is required",
              }}
              render={({ field, fieldState }) => {
                return (
                  <div className={styles.field}>
                    <label className={styles.label}>Genre</label>
                    <Dropdown
                      id="Genre"
                      isMultiple={true}
                      options={GENRES}
                      selectedIds={field.value}
                      onSelect={(selectIds: string | string[]) => {
                        field.onChange(selectIds);
                      }}
                      fullWidth
                    />
                    <p className={classes(styles.error, styles.showError)}>
                      {fieldState.error?.message || ""}
                    </p>
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
                  <label className={styles.label}>Director</label>
                  <Input
                    type="text"
                    value={field.value ?? ""}
                    label="George Lucas"
                    handleChange={(e) => field.onChange(e.target.value)}
                  />
                  <p className={classes(styles.error, styles.showError)}>
                    {fieldState.error?.message || ""}
                  </p>
                </div>
              )}
            />
            <div className={styles.buttonsContainer}>
              <Button type="submit" size="s">
                Save
              </Button>
              <Button type="button" onClick={onCancel} size="s">
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default MovieFormModal;
