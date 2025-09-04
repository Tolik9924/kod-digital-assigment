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
        getMovieData();
    }, [movie.Title]);

    const getMovieData = async () => {
        console.log('WOR');
        const result = await dispatch(fetchMovie(query));

    if (result.type.endsWith("/rejected")) {
        const foundMovie = movies.find((m) => m.imdbID === query);
        if (foundMovie) {
            dispatch(showLocalMovie(foundMovie));
        }
    }
    };

    console.log('LOADING MOVIE: ', loadingMovie);

    return loadingMovie;
};