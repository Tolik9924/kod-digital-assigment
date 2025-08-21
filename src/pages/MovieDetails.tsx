import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import type { AppDispatch, RootState } from "../app/store";
import { fetchMovie } from "../features/movies/moviesSlice";

export const MovieDetails = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { title = "" } = useParams();
  const { movie, loading } = useSelector((state: RootState) => state.movies);

  useEffect(() => {
    getMovieData(title);
  }, []);

  const getMovieData = (query: string) => {
    console.log("QUERY FUNC: ", query);
    dispatch(fetchMovie(query));
  };

  console.log("MOVIE: ", movie);

  return (
    <div>
      <div>Movie Details</div>
      {loading && <div>loading</div>}
      <div>Title: {title}</div>
      <div>Year: {movie.Year}</div>
      <div>Runtime: {movie.Runtime}</div>
      <div>Genre: {movie.Genre}</div>
      <div>Director: {movie.Director}</div>
    </div>
  );
};
