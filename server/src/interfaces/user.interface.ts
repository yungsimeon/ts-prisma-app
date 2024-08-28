import { Movie } from "./movie.interface";

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  movies: Movie[];
}
