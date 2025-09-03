import React, { useEffect, useRef, useState, type ChangeEvent } from "react";
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
import { DeleteModal } from "../../components/delete-modal/DeleteModal";
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

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTitle, setDeleteTitle] = useState("");

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    dispatch(fetchMovies(searchMovie));
  }, []);

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

  const onDelete = () => {
    dispatch(deleteMovie(deleteTitle));
    setShowDeleteModal(false);
  };

  const deleteMovieCard = (title: string) => {
    setShowDeleteModal(true);
    setDeleteTitle(title);
  };

  const onEdit = (movie: Movie) => {
    setEditingMovie(movie);
    setShowModal(true);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchMovie(value);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      dispatch(fetchMovies(value));
    }, 500);
  };

  console.log('MOVIES: ', movies);

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
              size="m"
            />
            <div className={styles.buttonsContainer}>
              <Button
                onClick={() => {
                  setEditingMovie(null);
                  setShowModal(true);
                }}
                size="m"
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
            {Array.from({ length: 18 }, (_, i) => i + 1).map((_, index) => (
              <div key={index} className={styles.movieCardSkeleton}></div>
            ))}
          </div>
        </Loading>
      )}
      {filteredMovies.length > 0 && (
        <div className={styles.cardsContainer}>
          {filteredMovies.map((m, index) => (
            <MovieCard
              key={index}
              movie={m}
              onEdit={() => onEdit(m)}
              onDelete={() => deleteMovieCard(m.Title)}
              onToggleFavorite={() => dispatch(toggleFavorite(m.Title))}
            />
          ))}
        </div>
      )}
      {filteredMovies.length === 0 && (
        <div className={styles.noData}>
          <span className={styles.noDataText}>No data available.</span>
        </div>
      )}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <DeleteModal handleDelete={onDelete} />
      </Modal>
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
