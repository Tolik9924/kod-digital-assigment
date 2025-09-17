import React, { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../app/store";
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
import {
  addMovie,
  deleteMovie,
  editMovie,
  fetchMovie,
  fetchMovies,
} from "../../features/movies/moviesThunks";

import styles from "./home.module.scss";

export const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { movies, loadings } = useSelector((state: RootState) => state.movies);

  const [searchMovie, setSearchMovie] = useState("batman");
  const [showFavorites, setShowFavorites] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteCard, setDeleteCard] = useState<{
    title: string;
    imdbID: string;
  }>({ title: "", imdbID: "" });

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (searchMovie !== "") {
      dispatch(fetchMovies(searchMovie));
    }
  }, []);

  const filteredMovies = movies;

  const onSave = async (m: Movie, saveOrEdit: string): Movie => {
    if (saveOrEdit === "edit") {
      //dispatch(editMovie(m));
      console.log("EDIT");
      setShowModal(false);
    }

    if (saveOrEdit === "save") {
      console.log("DATA TO ADD M: ", m);
      const data = await dispatch(addMovie(m)).unwrap();
      console.log("ADDING DATA: ", data);
      return data;
    }
  };

  const onDelete = async () => {
    try {
      const data = await dispatch(deleteMovie(deleteCard.imdbID)).unwrap();
      if (data) {
        await dispatch(fetchMovies(searchMovie));
      }
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Failed to delete the movie: ", error);
    }
  };

  const deleteMovieCard = (title: string, imdbID: string) => {
    setShowDeleteModal(true);
    setDeleteCard({ title, imdbID });
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

  const handleFavorite = async (imdbID: string, data: Movie) => {
    const movie = await dispatch(fetchMovie(imdbID)).unwrap();
    if (movie) {
      const result: Movie = {
        ...data,
        Poster: movie.Poster,
        Director: movie.Director,
        Genre: movie.Genre,
        Runtime: movie.Runtime,
        isFavorite: !data.isFavorite,
      };

      const editData = await dispatch(
        editMovie({ imdbID, data: result })
      ).unwrap();

      return editData;
    }
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
      {loadings.loadingMovies && (
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
              onDelete={() => deleteMovieCard(m.Title, m.imdbID)}
              onToggleFavorite={() => handleFavorite(m.imdbID, m)}
            />
          ))}
        </div>
      )}
      {filteredMovies.length === 0 && (
        <div className={styles.noData}>
          <span className={styles.noDataText}>
            {searchMovie === ""
              ? "Enter the movie title to start searching."
              : "No data available."}
          </span>
        </div>
      )}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <DeleteModal title={deleteCard.title} handleDelete={onDelete} />
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
