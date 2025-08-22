import React from "react";
import { useNavigate } from "react-router-dom";
import type { Movie } from "../../features/movies/types";
import { Link } from "react-router-dom";
import { Button } from "../../ui-components/button/Button";
import { StarIcon } from "../../assets/StarIcon";

import styles from "./movieCard.module.scss";

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

  const goToDetails = () => {
    navigate(`/movie/${encodeURIComponent(movie.Title)}`);
  };

  return (
    <div className={styles.movieCard}>
      <div className={styles.imgContainer}>
        <img
          className={styles.imgMovie}
          src={movie.Poster}
          alt="movie_img"
          onClick={goToDetails}
        />
      </div>
      <div className={styles.titleContainer}>
        <Link className={styles.movieTitle} to={`/movie/${movie.Title}`}>
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
      <div className={styles.editContainer}>
        <Button onClick={onEdit} size="xs" variant="secondary">
          <span className={styles.editTitle}>Edit</span>
        </Button>
        <Button onClick={onDelete} size="xs" variant="error">
          <span className={styles.editTitle}>Delete</span>
        </Button>
      </div>
    </div>
  );
};
