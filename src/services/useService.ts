import { INITIAL_ADD_DATA } from "../components/movie-form-modal/constants";
import api from "./api";
import type { Movie } from "./types";

export const movieService = {
  search: async (query: string): Promise<Movie[]> => {
    const username = await localStorage.getItem("username");
    console.log('USERNAME QUERY: ', username);
    const res = await api.get(`/search?title=${query}&username=${username}`);
    return res.data;
  },

  create: async (data: Movie): Promise<Movie> => {
    const res = await api.post("/", data);
    return res.data;
  },

  edit: async ({imdbID, data}: {imdbID: string, data: Partial<Movie>}): Promise<Movie> => {
    const username = await localStorage.getItem("username");
    const editData = {
      username,
      movie: data,
    };
    const res = await api.patch(`/${imdbID}`, editData);
    return res.data[0];
  },

  delete: async (imdbID: string): Promise<string> => {
    const data = await api.delete(`/${imdbID}`);
    return data.data;
  },

  getFavorites: async (query: string) => {
    const res = await api.get(`/favorites?title=${query}`);
    return res.data;
  },

  getMovieInfo: async (imdbID: string) => {
    const username = await localStorage.getItem("username");
    const res = await api.get(`/movie-info/${imdbID}??username=${username}`);
    if (res.data.Response === 'False') {
      return {Poster: 'N/A', ...res.data, ...INITIAL_ADD_DATA}
    }
    return res.data;
  },
};
