import express from "express";
import cors from "cors";
import indexRoutes from "./routes/index.routes";
import authRoutes from "./routes/auth.routes";
import movieRoutes from "./routes/movie.routes";
import isAuthenticated from "./middleware/jwt.middleware";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", indexRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/movies", isAuthenticated, movieRoutes);

export default app;
