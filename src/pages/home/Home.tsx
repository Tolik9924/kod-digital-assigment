import React, { useEffect, useState, type ChangeEvent } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../app/store";
import {
  fetchMovies,
  addMovie,
  editMovie,
  deleteMovie,
  toggleFavorite,
} from "../../features/movies/moviesSlice";
import { Header } from "../../ui-components/header/Header";
import { Input } from "../../ui-components/input/Input";
import { Button } from "../../ui-components/button/Button";
import { Loading } from "../../ui-components/loading/Loading";
import { MovieCard } from "../../components/movie-card/MovieCard";
import MovieFormModal from "../../components/movie-form-modal/MovieFormModal";
import { ToggleFavorites } from "../../components/ToggleFavorites";
import { Modal } from "../../components/modal/Modal";
import type { Movie } from "../../features/movies/types";

import styles from "./home.module.scss";

export const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { movies, loadingMovies } = useSelector(
    (state: RootState) => state.movies
  );

  const [searchMovie, setSearchMovie] = useState("Batman");
  const [showFavorites, setShowFavorites] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(fetchMovies(searchMovie));
  }, [searchMovie]);

  const filteredMovies = showFavorites
    ? movies.filter((m) => m.isFavorite)
    : movies;

  const onSave = (m: Movie, saveOrEdit: string) => {
    if (saveOrEdit === "edit") {
      dispatch(editMovie(m));
    }

    if (saveOrEdit === "save") {
      dispatch(addMovie(m));
    }

    setShowModal(false);
  };

  const onDelete = (title: string) => {
    if (window.confirm("Delete this movie?")) {
      dispatch(deleteMovie(title));
    }
  };

  const onEdit = (movie: Movie) => {
    setEditingMovie(movie);
    setShowModal(true);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchMovie(event.target.value);
  };

  return (
    <div className={styles.home}>
      <Header
        title="Cinema"
        content={
          <div className={styles.headerContent}>
            <Input
              value={searchMovie}
              handleChange={handleChange}
              label="Movie"
              size="s"
            />
            <div className={styles.buttonsContainer}>
              <Button
                onClick={() => {
                  setEditingMovie(null);
                  setShowModal(true);
                }}
                size="s"
              >
                + Add Movie
              </Button>
              <ToggleFavorites
                showFavorites={showFavorites}
                setShowFavorites={setShowFavorites}
              />
            </div>
          </div>
        }
      />
      {loadingMovies && (
        <Loading variant="skeleton">
          <div className={styles.cardsSkeletonContainer}>
            {Array.from({ length: 18 }, (_, i) => i + 1).map((m, index) => (
              <div key={index} className={styles.movieCardSkeleton}></div>
            ))}
          </div>
        </Loading>
      )}
      <div className={styles.cardsContainer}>
        {filteredMovies.map((m, index) => (
          <MovieCard
            key={index}
            movie={m}
            onEdit={() => onEdit(m)}
            onDelete={() => onDelete(m.Title)}
            onToggleFavorite={() => dispatch(toggleFavorite(m.Title))}
          />
        ))}
      </div>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <MovieFormModal
          movieData={editingMovie || undefined}
          onSave={onSave}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
};
