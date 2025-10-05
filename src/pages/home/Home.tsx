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
import { handleSearch } from "../../features/movies/moviesSlice";
import type { Movie } from "../../features/movies/types";
import {
  addMovie,
  deleteMovie,
  editMovie,
  fetchMovie,
  fetchMovies,
  getFavorites,
} from "../../features/movies/moviesThunks";

import styles from "./home.module.scss";
import { UsernameModal } from "../../components/username-modal/UsernameModal";
import { ACTION } from "../../components/username-modal/constants";
import { classes } from "../../common_utils/classes/classes";
import { useLockBodyScroll } from "../../shared/hooks/useLockBodyScroll";
//import { UsernameModal } from "../../components/username-modal/UsernameModal";

export const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { searchTitle, movies, loadings } = useSelector(
    (state: RootState) => state.movies
  );

  const [showFavorites, setShowFavorites] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [showModal, setShowModal] = useState(false);
  //const [showUsername, setShowUsername] = useState(false);
  const [lastSearch, setLastSearch] = useState(searchTitle);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteCard, setDeleteCard] = useState<{
    title: string;
    imdbID: string;
  }>({ title: "", imdbID: "" });

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useLockBodyScroll(showModal);

  useEffect(() => {
    renderingMovies();
  }, [showFavorites]);

  const renderingMovies = async () => {
    if (!showFavorites) {
      await dispatch(handleSearch(lastSearch));
      await dispatch(fetchMovies(lastSearch));
    }

    if (showFavorites) {
      setLastSearch(searchTitle);
      await dispatch(getFavorites(searchTitle));
    }
  };

  const onSave = async (
    movieData: { username: string; movie: Movie },
    saveOrEdit: string
  ): Promise<{ username: string; movie: Movie }> => {
    try {
      if (saveOrEdit === "edit") {
        const data = await dispatch(
          editMovie({ imdbID: movieData.movie.imdbID, data: movieData })
        ).unwrap();
        //setShowModal(false);
        return data;
      }

      if (saveOrEdit === "save") {
        const data = await dispatch(addMovie(movieData)).unwrap();
        return data;
      }

      throw new Error(`Invalid saveOrEdit option: ${saveOrEdit}`);
    } catch (error) {
      console.log("Failed to save movie:", error);
      throw error;
    }
  };

  const onDelete = async () => {
    try {
      const data = await dispatch(deleteMovie(deleteCard.imdbID)).unwrap();
      if (data) {
        await dispatch(fetchMovies(searchTitle));
      }
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Failed to delete movie: ", error);
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
    dispatch(handleSearch(value));

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (!showFavorites) dispatch(fetchMovies(value));
      if (showFavorites) dispatch(getFavorites(value));
    }, 500);
  };

  const handleFavorite = async (imdbID: string, data: Movie) => {
    const movie = await dispatch(fetchMovie(imdbID)).unwrap();
    const username = localStorage.getItem("username") || "Guest";
    if (movie) {
      const movieData: Movie = {
        ...data,
        Poster: movie.Poster,
        Director: movie.Director,
        Genre: movie.Genre,
        Runtime: movie.Runtime,
        isFavorite: data.isFavorite,
      };

      const result = {
        username: username,
        movie: movieData,
      };

      const editData: { username: string; movie: Movie } = await dispatch(
        editMovie({ imdbID, data: result })
      ).unwrap();

      return editData;
    }

    return { username: username, movie: data };
  };

  return (
    <div
      className={classes(styles.home, {
        [styles.locked]: showModal,
      })}
    >
      <Header
        title="Cinema"
        content={
          <div className={styles.headerContent}>
            <Input
              value={searchTitle}
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
      {movies.length > 0 && (
        <div className={styles.cardsContainer}>
          {movies.map((m, index) => (
            <MovieCard
              key={index}
              movie={m}
              onEdit={() => onEdit(m)}
              onDelete={() => deleteMovieCard(m.Title, m.imdbID)}
              onToggleFavorite={handleFavorite}
            />
          ))}
        </div>
      )}
      {movies.length === 0 && !loadings.loadingMovies && (
        <div className={styles.noData}>
          <span className={styles.noDataText}>
            {searchTitle === ""
              ? "Enter the movie title to start searching."
              : "No data available."}
          </span>
        </div>
      )}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        {/* <DeleteModal title={deleteCard.title} handleDelete={onDelete} /> */}
        <UsernameModal
          cardTitle={deleteCard.title}
          action={ACTION.delete}
          sendData={onDelete}
        />
      </Modal>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <MovieFormModal
          movieData={editingMovie || undefined}
          onSave={onSave}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
      {/* <Modal isOpen={showUsername} onClose={() => setShowUsername(false)}>
        <UsernameModal />
      </Modal> */}
    </div>
  );
};
