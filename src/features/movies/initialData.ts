import type { Movie } from "./types";

export const MOVIES: Movie[] = [
   {
    Title: 'Blade Runner',
    Year: '1982',
    Runtime: '117 min',
    Genre: 'Action, Drama, Sci-Fi',
    Director: 'Ridley Scott',
    isFavorite: false
  },
  {
    Title: 'Inception',
    Year: '2010',
    Runtime: '148 min',
    Genre: 'Action, Adventure, Sci-Fi',
    Director: 'Christopher Nolan',
    isFavorite: true
  },
  {
    Title: 'The Matrix',
    Year: '1999',
    Runtime: '136 min',
    Genre: 'Action, Sci-Fi',
    Director: 'Lana Wachowski, Lilly Wachowski',
    isFavorite: false
  },
  {
    Title: 'Interstellar',
    Year: '2014',
    Runtime: '169 min',
    Genre: 'Adventure, Drama, Sci-Fi',
    Director: 'Christopher Nolan',
    isFavorite: true
  },
  {
    Title: 'The Godfather',
    Year: '1972',
    Runtime: '175 min',
    Genre: 'Crime, Drama',
    Director: 'Francis Ford Coppola',
    isFavorite: false
  }
];