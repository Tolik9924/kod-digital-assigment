import { Controller, useForm } from "react-hook-form";
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
  const { movie, movies, loadingMovie } = useMovie(movieData?.imdbID ?? "");

  const movieFormData: Values = {
    ...movie,
    Title: movie.Title,
    Runtime: Number(movie.Runtime && movie.Runtime.split(" ")[0]),
    Year: movie.Year,
    Genre: movie?.Genre ? movie.Genre?.split(", ") : [],
    Director: movie.Director || "",
  };

  const { control, handleSubmit } = useForm<Values>({
    values: movieData ? movieFormData : INITIAL_VALUES,
  });

  const submit = (data: Values) => {
    const saveOrEdit = movieData ? "edit" : "save";
    const format = formatTitle(data.Title);

    const result = {
      ...data,
      Title: format,
      imdbID: movieData ? movieData.imdbID : data.Title,
      Year: `${data.Year.replace(/\s+/g, "")}`,
      Genre: data.Genre.join(", "),
      isFavorite: movieData ? movie.isFavorite : false,
      Poster: movieData ? movieData.Poster : "N/A",
      Runtime: `${data.Runtime} min.`,
      ...INITIAL_ADD_DATA,
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
                    return "A movie with the same name already exists.";
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
                  const regex = /^\d{4}(?:\s*[-–—]\s*\d{4})?$/;
                  const minYear = 1880;

                  if (!regex.test(value)) {
                    return "Enter a valid year or range";
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
