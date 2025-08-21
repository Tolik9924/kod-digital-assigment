import React from "react";
import { useNavigate } from "react-router-dom";
import type { Movie } from "../../features/movies/types";

import styles from "./movieCard.module.scss";
import { Link } from "react-router-dom";

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
        <button onClick={onToggleFavorite}>
          {movie.isFavorite ? "★" : "☆"}
        </button>
      </div>
      <span>{movie.Year}</span>
      <span>{movie.Type}</span>
      <div>
        <button onClick={onEdit}>Edit</button>
        <button onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
};
