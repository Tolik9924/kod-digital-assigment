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
import { MovieCard } from "../../components/MovieCard";
import MovieFormModal from "../../components/MovieFormModal";
import { SearchBar } from "../../components/SearchBar";
import { ToggleFavorites } from "../../components/ToggleFavorites";
import type { Movie } from "../../features/movies/types";

import styles from "./home.module.scss";
import { Header } from "../../ui-components/header/Header";
import { Input } from "../../ui-components/input/Input";

export const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { movies, loading } = useSelector((state: RootState) => state.movies);

  const [searchMovie, setSearchMovie] = useState("Batman");
  const [showFavorites, setShowFavorites] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getMoviesData(searchMovie);
  }, [searchMovie]);

  const getMoviesData = (query: string) => {
    dispatch(fetchMovies(query));
  };

  const filteredMovies = showFavorites
    ? movies.filter((m) => m.isFavorite)
    : movies;

  const onSave = (m: Movie) => {
    if (editingMovie) dispatch(editMovie(m));
    else dispatch(addMovie(m));
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
            <Input value={searchMovie} handleChange={handleChange} />
          </div>
        }
      />
      <div className={styles.searchFilm}>
        {/* <SearchBar searchQuery={searchMovie} setSearchQuery={setSearchMovie} /> */}
        <ToggleFavorites
          showFavorites={showFavorites}
          setShowFavorites={setShowFavorites}
        />
        <button
          onClick={() => {
            setEditingMovie(null);
            setShowModal(true);
          }}
        >
          + Add Movie
        </button>
      </div>
      {loading && <p>Loading...</p>}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))",
          gap: 10,
        }}
      >
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
      {showModal && (
        <MovieFormModal
          movie={editingMovie || undefined}
          onSave={onSave}
          onCancel={() => setShowModal(false)}
          existingTitles={movies.map((m) => m.Title.toLocaleLowerCase())}
        />
      )}
    </div>
  );
};
