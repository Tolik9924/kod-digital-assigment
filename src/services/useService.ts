import api from "./api";

type Search = {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
};

type Create = {
  imdb_id: string;
  Title: string;
  Year: string;
  Type: string;
  Poster: string;
};

export const movieService = {
  search: async (query: string): Promise<Search[]> => {
    const res = await api.get(`/search?title=${query}`);
    return res.data;
  },

  create: async (data: Create): Promise<Create> => {
    const res = await api.post("/", data);
    return res.data;
  },

  edit: async (imdbID: string, data: Partial<Create>): Promise<Create> => {
    const res = await api.patch(`/${imdbID}`, data);
    return res.data;
  },

  delete: async (imdbID: string): Promise<void> => {
    await api.delete(`/users/${imdbID}`);
  },

  addFavorites: async (data: Partial<Create>): Promise<Create> => {
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
