import React, { useState, type SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";
import type { Movie } from "../../features/movies/types";
import { Link } from "react-router-dom";
import { Button } from "../../ui-components/button/Button";
import { StarIcon } from "../../assets/StarIcon";
import noPhoto from "../../assets/no-photo-available.png";

import styles from "./movieCard.module.scss";
import { classes } from "../../common_utils/classes/classes";

interface Props {
  movie: Movie;
  onEdit: () => void;
  onDelete: () => void;
  onToggleFavorite: () => void;
}

export const MovieCard: React.FC<Props> = ({
  movie,
  onEdit,
  onDelete,
  onToggleFavorite,
}) => {
  const navigate = useNavigate();
  const [errorImg, setErrorImg] = useState(false);

  const goToDetails = () => {
    navigate(`/movie/${encodeURIComponent(movie.imdbID)}`);
  };

  return (
    <div className={styles.movieCard}>
      <div className={styles.imgContainer}>
        <img
          className={classes(styles.imgMovie, {
            [styles.haveImg]: movie.Poster !== "N/A" && !errorImg,
            [styles.haveNotImg]: movie.Poster === "N/A" || errorImg,
          })}
          src={movie.Poster !== "N/A" ? movie.Poster : noPhoto}
          alt="movie_img"
          onError={(error: SyntheticEvent<HTMLImageElement, Event>) => {
            setErrorImg(true);
            error.currentTarget.src = noPhoto;
          }}
          onClick={goToDetails}
        />
      </div>
      <div className={styles.cardContainer}>
        <div className={styles.info}>
          <div className={styles.titleContainer}>
            <Link className={styles.movieTitle} to={`/movie/${movie.imdbID}`}>
              {movie.Title}
            </Link>
            <Button onClick={onToggleFavorite} size="xs" variant="primary">
              <StarIcon
                width="12"
                height="12"
                stroke="#fff"
                fill={movie.isFavorite ? "#fff" : "none"}
              />
            </Button>
          </div>
          <div className={styles.description}>
            <span>Year: {movie.Year}</span>
            <span>Type: {movie.Type}</span>
          </div>
        </div>
        <div className={styles.editContainer}>
          <Button onClick={onEdit} size="xs" variant="secondary">
            <span className={styles.editTitle}>Edit</span>
          </Button>
          <Button onClick={onDelete} size="xs" variant="error">
            <span className={styles.editTitle}>Delete</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
