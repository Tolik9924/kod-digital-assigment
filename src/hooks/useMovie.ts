import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../app/store";
import { fetchMovie } from "../features/movies/moviesThunks";

export const useMovie = (query: string) => {
  const dispatch = useDispatch<AppDispatch>();
  const { movie } = useSelector(
    (state: RootState) => state.movies
  );

  useEffect(() => {
    const fetchData = async () => {
      const result = await dispatch(fetchMovie(query)).unwrap();
      console.log('RESULT: ', result);
    };

    if (query) {
      fetchData().catch((err) =>
        console.error("Error fetching movie data: ", err)
      );
    }
  }, [query]);

  return movie;
};
