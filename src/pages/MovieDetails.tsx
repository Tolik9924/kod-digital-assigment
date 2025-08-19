import { useEffect, useState } from "react";
import type { Movie } from "../features/movies/types";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import type { RootState } from "../app/store";

export const MovieDetails = () => {
  const { title } = useParams();
  const { movies, loading } = useSelector((state: RootState) => state.movies);
  const [movie, setMovie] = useState<Movie>();

  console.log("TITLE: ", title);
  console.log("MOVIES: ", movies);
  console.log("MOVIE: ", movie);

  useEffect(() => {
    const filtered = movies.find((movie) => movie.Title === title);
    setMovie(filtered);
  }, []);

  return (
    <div>
      <div>Movie Details</div>
      {loading && <div>loading</div>}
      <div>Title: {title}</div>
      <div>Year: {movie?.Year}</div>
      <div>Runtime: {movie?.Runtime}</div>
      <div>Genre: {movie?.Genre}</div>
      <div>Director: {movie?.Director}</div>
    </div>
  );
};
