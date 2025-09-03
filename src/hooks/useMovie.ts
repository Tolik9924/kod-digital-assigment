import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../app/store";
import { fetchMovie, showLocalMovie } from "../features/movies/moviesSlice";
import type { Movie } from "../features/movies/types";
import { useEffect } from "react";

export const useMovie = (query: string, movieData: Movie) => {
    const dispatch = useDispatch<AppDispatch>();
    const { movie, movies, loadingMovie } = useSelector(
        (state: RootState) => state.movies
    );

    useEffect(() => {
        getMovieData();
    }, [movie.Title, movieData?.Title]);

    const getMovieData = async () => {
        const result = await dispatch(fetchMovie(query));

    if (result.type.endsWith("/rejected")) {
        const foundMovie = movies.find((m) => m.imdbID === movieData?.imdbID);
        if (foundMovie) {
            dispatch(showLocalMovie(foundMovie));
        }
    }
    };

    console.log('LOADING MOVIE: ', loadingMovie);

    return loadingMovie;
};