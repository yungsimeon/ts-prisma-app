import { Request, Response } from "express";
import express from "express";
import prisma from "../../prisma/index";
import { Movie } from "../interfaces/movie.interface";
const router = express.Router();
import { JwtPayload } from "jsonwebtoken";

router.get("/", async (req: Request, res: Response) => {
  try {
    const movies = await prisma.movie.findMany();
    res.json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching movies" });
  }
});

router.get("/:movieId", async (req: Request, res: Response) => {
  try {
    const { movieId } = req.params;
    const movie = await prisma.movie.findUnique({ where: { id: movieId } });
    res.json(movie);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching movie" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  const userId = (req.payload as JwtPayload)?.userId;
  const { title, duration, year, producer, genre, rating } = req.body;

  try {
    const newMovie = await prisma.movie.create({
      data: {
        title,
        duration,
        year,
        producer,
        genre,
        rating,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
    res.json(newMovie);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating movie" });
  }
});

router.put("/:movieId", async (req: Request, res: Response) => {
  const { movieId } = req.params;
  try {
    const { title, duration, year, producer, genre, rating } = req.body;
    const updatedMovie = await prisma.movie.update({
      where: { id: movieId },
      data: {
        title,
        duration,
        year,
        producer,
        genre,
        rating,
      },
    });
    res.json(updatedMovie);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating movie" });
  }
});

router.delete("/:movieId", async (req: Request, res: Response) => {
  const { movieId } = req.params;
  try {
    const deletedMovie = await prisma.movie.delete({ where: { id: movieId } });
    res.status(204).json({ message: "Movie deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error deleting movie" });
  }
});

export default router;
