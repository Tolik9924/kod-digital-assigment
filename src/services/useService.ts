import api from "./api";
import type { Movie } from "./types";

export const movieService = {
  search: async (query: string): Promise<Movie[]> => {
    const res = await api.get(`/search?title=${query}`);
    return res.data;
  },

  create: async (data: Movie): Promise<Movie> => {
    const result = {
      imdbID: data.imdbID,
      Title: data.Title,
      Year: data.Year,
      Runtime: data.Runtime,
      Genre: data.Genre,
      Director: data.Director,
      isFavorite: false,
      Poster: "",
    };
    const res = await api.post("/", result);
    console.log('RES DATA: ', res.data);
    return res.data;
  },

  edit: async ({imdbID, data}: {imdbID: string, data: Partial<Movie>}): Promise<Movie> => {
    const res = await api.patch(`/${imdbID}`, data);
    return res.data;
  },

  delete: async (imdbID: string): Promise<string> => {
    const data = await api.delete(`/${imdbID}`);
    return data.data;
  },

  getFavorites: async () => {
    const res = await api.get(`/favorites`);
    return res.data;
  },

  getMovieInfo: async (imdbID: string) => {
    const res = await api.get(`"/movie-info/${imdbID}`);
    return res.data;
  },
};
