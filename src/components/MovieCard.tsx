import React from "react";
import { useNavigate } from "react-router-dom";
import type { Movie } from "../features/movies/types";

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
    <div
      style={{
        border: "1px solid #ddd",
        margin: 5,
        padding: 10,
        borderRadius: 8,
      }}
    >
      <h3>{movie.Title}</h3>
      <p>
        {movie.Year} | {movie.Runtime} | {movie.Genre}
      </p>
      <p>Director: {movie.Director}</p>
      <div>
        <button onClick={onEdit}>Edit</button>
        <button onClick={onDelete}>Delete</button>
        <button onClick={onToggleFavorite}>
          {movie.isFavorite ? "★" : "☆"}
        </button>
        <button onClick={goToDetails}>Details</button>
      </div>
    </div>
  );
};
