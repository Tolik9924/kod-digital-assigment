import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../app/store";
import { showLocalMovie } from "../features/movies/moviesSlice";
import { fetchMovie } from "../features/movies/moviesThunks";

export const useMovie = (query: string) => {
  const dispatch = useDispatch<AppDispatch>();
  const { movie, movies } = useSelector(
    (state: RootState) => state.movies
  );

  console.log('QUERY: ', query);

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
  }, [query]);

  return movie;
};
