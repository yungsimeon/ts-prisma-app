import { User } from "./user.interface";

export interface Movie {
  id: string;
  title: string;
  duration: number;
  year: number;
  producer: string;
  genre: Genre;
  rating: number;
  userId: string;
  user: User;
}

export type Genre =
  | "ACTION"
  | "DRAMA"
  | "COMEDY"
  | "HORROR"
  | "SCI_FI"
  | "ROMANCE"
  | "THRILLER"
  | "DOCUMENTARY";
