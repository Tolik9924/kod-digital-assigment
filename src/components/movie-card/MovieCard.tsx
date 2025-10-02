import React, { useState, type SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";
import type { Movie } from "../../features/movies/types";
import { Link } from "react-router-dom";
import { Button } from "../../ui-components/button/Button";
import { Loading } from "../../ui-components/loading/Loading";
import { StarIcon } from "../../assets/StarIcon";
import noPhoto from "../../assets/no-photo-available.png";
import { Modal } from "../modal/Modal";
import { UsernameModal } from "../username-modal/UsernameModal";
import { classes } from "../../common_utils/classes/classes";

import styles from "./movieCard.module.scss";

interface Props {
  movie: Movie;
  onEdit: () => void;
  onDelete: () => void;
  onToggleFavorite: (imdbID: string, movie: Movie) => Promise<Movie>;
}

export const MovieCard: React.FC<Props> = ({
  movie,
  onEdit,
  onDelete,
  onToggleFavorite,
}) => {
  const navigate = useNavigate();
  const [errorImg, setErrorImg] = useState(false);
  const [loadingFavorite, setLoadingFavorite] = useState(false);
  const [showUsername, setShowUsername] = useState(false);
  const [favorite, setFavorite] = useState(movie.isFavorite);

  const goToDetails = () => {
    navigate(`/movie/${encodeURIComponent(movie.imdbID)}`);
  };

  const handleFavorite = async () => {
    try {
      setShowUsername(false);
      setLoadingFavorite(true);
      const updateFavorite = !favorite;
      setFavorite(!favorite);
      const toggled = {...movie, isFavorite: updateFavorite}
      await onToggleFavorite(movie.imdbID, toggled);
    } finally {
      setLoadingFavorite(false);
    }
  };

  return (
    <div className={styles.movieCard}>
      <div className={styles.imgContainer}>
        <img
          className={classes(styles.imgMovie, {
            [styles.haveImg]: movie.Poster !== "N/A" && !errorImg,
            [styles.haveNotImg]: movie.Poster === "N/A" || errorImg,
          })}
          src={
            movie.Poster !== null &&
            movie.Poster !== undefined &&
            movie.Poster !== "N/A"
              ? movie.Poster
              : noPhoto
          }
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
            <Button
              onClick={() => setShowUsername(true)}
              size="xs"
              variant="primary"
              disabled={loadingFavorite}
            >
              {!loadingFavorite ? (
                <StarIcon
                  width="12"
                  height="12"
                  stroke="#fff"
                  fill={movie.isFavorite ? "#fff" : "none"}
                />
              ) : (
                <Loading size="xs" variant="spinner" color="white" />
              )}
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
      <Modal isOpen={showUsername} onClose={() => setShowUsername(false)}>
        <UsernameModal sendData={handleFavorite} />
      </Modal>
    </div>
  );
};
