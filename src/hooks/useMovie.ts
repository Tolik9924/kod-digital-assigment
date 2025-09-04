import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../app/store";
import { fetchMovie, showLocalMovie } from "../features/movies/moviesSlice";

export const useMovie = (query: string) => {
  const dispatch = useDispatch<AppDispatch>();
  const { movie, movies, loadingMovie } = useSelector(
    (state: RootState) => state.movies
  );

  useEffect(() => {
    const fetchData = async () => {
      const result = await dispatch(fetchMovie(query));

      if (result.type.endsWith("/rejected")) {
        const foundMovie = movies.find((m) => m.imdbID === query);
        if (foundMovie) {
          dispatch(showLocalMovie(foundMovie));
        }
      }
    };

    if (query) {
      fetchData().catch((err) =>
        console.error("Error fetching movie data: ", err)
      );
    }
  }, [query, dispatch, movies]);

  return { movie, movies, loadingMovie };
};
