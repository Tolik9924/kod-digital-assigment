import React, { useEffect, useState } from "react";
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

export const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { movies, loading } = useSelector((state: RootState) => state.movies);

  const [searchQuery, setSearchQuery] = useState("Batman");
  const [searchMovie, setSearchMovie] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [showMovies, setShowMovies] = useState<Movie[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(fetchMovies(searchQuery));
  }, [searchQuery]);

  useEffect(() => {
    onSearch(searchMovie);
  }, [movies.length]);

  const filteredMovies = showFavorites
    ? showMovies.filter((m) => m.isFavorite)
    : showMovies;

  const onSearch = (search: string) => {
    const filtered: Movie[] = movies.filter((movie: Movie) =>
      movie.Title.toLowerCase().includes(search.toLowerCase())
    );
    setShowMovies(filtered);
  };

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

  console.log("MOVIES: ", movies);

  return (
    <div className={styles.home}>
      <div className={styles.addFilm}>
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
      <div className={styles.searchFilm}>
        <SearchBar searchQuery={searchMovie} setSearchQuery={setSearchMovie} />
        <button onClick={() => onSearch(searchMovie)}>Search</button>
      </div>
      {loading && <p>Loading...</p>}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))",
          gap: 10,
        }}
      >
        {filteredMovies.map((m) => (
          <MovieCard
            key={m.Title}
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
