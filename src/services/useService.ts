import api from "./api";
import type { Movie } from "./types";

export const movieService = {
  search: async (query: string): Promise<Movie[]> => {
    const res = await api.get(`/search?title=${query}`);
    console.log('RES SERVICE: ', res);
    return res.data;
  },

  create: async (data: Movie): Promise<Movie> => {
    const res = await api.post("/", data);
    return res.data;
  },

  edit: async (imdbID: string, data: Partial<Movie>): Promise<Movie> => {
    const res = await api.patch(`/${imdbID}`, data);
    return res.data;
  },

  delete: async (imdbID: string): Promise<void> => {
    await api.delete(`/users/${imdbID}`);
  },

  addFavorites: async (data: Partial<Movie>): Promise<Movie> => {
    const res = await api.post("/favorites", data);
    return res.data;
  },

  removeFavorites: async (imdbID: string): Promise<void> => {
    await api.delete(`/favorites/${imdbID}`);
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
