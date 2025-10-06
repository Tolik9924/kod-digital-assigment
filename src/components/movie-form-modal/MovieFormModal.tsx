import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import type { Movie } from "../../features/movies/types";
import type { Values } from "./types";
import { Input } from "../../ui-components/input/Input";
import { Button } from "../../ui-components/button/Button";
import { Loading } from "../../ui-components/loading/Loading";
import { classes } from "../../common_utils/classes/classes";
import { Dropdown } from "../dropdown/Dropdown";
import { GENRES, INITIAL_ADD_DATA, INITIAL_VALUES } from "./constants";
import { useMovie } from "../../hooks/useMovie";
import { formatTitle } from "../../utils/formatTitle";
import type { AppDispatch, RootState } from "../../app/store";
import { fetchMovies } from "../../features/movies/moviesThunks";

import styles from "./movieFormModal.module.scss";

const MovieFormModal = ({
  movieData,
  onSave,
  onCancel,
}: {
  movieData?: Movie;
  onSave: (
    movieData: { username: string; movie: Movie },
    saveOrEdit: string
  ) => Promise<{ username: string; movie: Movie }>;
  onCancel: () => void;
}) => {
  const movie = useMovie(movieData?.imdbID ?? "");
  const dispatch = useDispatch<AppDispatch>();
  const { searchTitle, movies, loadings } = useSelector(
    (state: RootState) => state.movies
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  const username = localStorage.getItem("username") || "";

  const movieFormData: Values = {
    ...movie,
    Username: username,
    Title: movie.Title,
    Runtime: Number(movie.Runtime && movie.Runtime.split(" ")[0]),
    Year: movie.Year,
    Genre: movie?.Genre ? movie.Genre?.split(", ") : [],
    Director: movie.Director || "",
  };

  const { control, handleSubmit, reset } = useForm<Values>({
    values: movieData ? movieFormData : INITIAL_VALUES,
  });

  const submit = async (data: Values) => {
    try {
      const saveOrEdit = movieData ? "edit" : "save";
      const format = formatTitle(data.Title);

      localStorage.setItem("username", data.Username);

      const movieSubmited = {
        ...data,
        Title: format,
        imdbID: movieData
          ? movieData.imdbID
          : data.Title.split(" ").join("_").toLocaleLowerCase(),
        Year: `${data.Year.replace(/\s+/g, "")}`,
        Genre: data.Genre.join(", "),
        isFavorite: movieData ? movie.isFavorite : false,
        Poster: movieData ? movieData.Poster : "N/A",
        Type: movieData ? movieData.Type : "N/A",
        Runtime: `${data.Runtime} min`,
        ...INITIAL_ADD_DATA,
      };

      const result = {
        username: data.Username,
        movie: movieSubmited,
      };

      const submittedData = await onSave(result, saveOrEdit);

      if (submittedData && !loadings.loadingAdding) {
        setIsSubmitted(true);
        if (
          data.Title.toLocaleLowerCase()
            .toLocaleLowerCase()
            .includes(searchTitle)
        ) {
          await dispatch(fetchMovies(searchTitle));
        }
        if (!movieData) {
          reset({ ...INITIAL_VALUES });
        }
        setTimeout(() => {
          setIsSubmitted(false);
        }, 3000);
      }
    } catch (err) {
      console.log("ERROR: ", err);
    }
  };

  return (
    <div className={styles.movieFormModal}>
      {loadings.loadingMovie ? (
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
              name="Username"
              control={control}
              rules={{
                required: "Username is required.",
              }}
              render={({ field, fieldState }) => (
                <div className={styles.field}>
                  <label className={styles.label}>Username</label>
                  <Input
                    label="username"
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
              name="Title"
              control={control}
              rules={{
                validate: (value) => {
                  const sameMovie = movies.find(
                    (movie: Movie) =>
                      movie.imdbID.toLocaleLowerCase() ===
                      value.toLocaleLowerCase()
                  );

                  if (sameMovie) {
                    return "That movie exist. Write another title.";
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
                required: "Year(s) is required",
                validate: (value) => {
                  const regex = /^\d{4}(?:[-–—]\d{4})?$/;
                  const minYear = 1880;

                  if (!regex.test(value)) {
                    return "Year must be in the format 'YYYY' or 'YYYY-YYYY'.";
                  }

                  if (value.includes("-")) {
                    const [start, end] = value
                      .split("-")
                      .map((s) => parseInt(s.trim(), 10));
                    if (start < minYear)
                      return "First movie was released in 1880";
                    if (start > end)
                      return "Start year must be before end year";
                  }

                  return true;
                },
              }}
              render={({ field, fieldState }) => (
                <div className={styles.field}>
                  <label className={styles.label}>Year</label>
                  <Input
                    type="text"
                    label="1990 or 1990 - 2000"
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
                  if (
                    !/^[A-Z][a-z]*(?:-[A-Z][a-z]*)*(?: [A-Z][a-z]*(?:-[A-Z][a-z]*)*)*$/.test(
                      value
                    )
                  ) {
                    return "Director name can only contain letters and spaces, each part starting with uppercase.";
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
            <div className={styles.loadingAdding}>
              {loadings.loadingAdding && (
                <div className={styles.creatingContainer}>
                  <div>
                    <Loading size="sm" variant="spinner" color="warning" />
                  </div>
                  <span className={styles.warningText}>Creating movie</span>
                </div>
              )}
              {isSubmitted && !loadings.loadingAdding && (
                <span className={styles.createdText}>
                  {movieData ? "✓ Movie is edited" : "✓ Movie is created"}
                </span>
              )}
            </div>
            <div className={styles.buttonsContainer}>
              <Button type="submit" size="s" disabled={loadings.loadingAdding}>
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
