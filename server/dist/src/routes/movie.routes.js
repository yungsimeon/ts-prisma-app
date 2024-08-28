"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("../../prisma/index"));
const router = express_1.default.Router();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const movies = yield index_1.default.movie.findMany();
        res.json(movies);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching movies" });
    }
}));
router.get("/:movieId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { movieId } = req.params;
        const movie = yield index_1.default.movie.findUnique({ where: { id: movieId } });
        res.json(movie);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching movie" });
    }
}));
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.payload.userId;
    const { title, duration, year, producer, genre, rating } = req.body;
    try {
        const newMovie = yield index_1.default.movie.create({
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
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error creating movie" });
    }
}));
router.put("/:movieId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { movieId } = req.params;
    try {
        const { title, duration, year, producer, genre, rating } = req.body;
        const updatedMovie = yield index_1.default.movie.update({
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
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error updating movie" });
    }
}));
router.delete("/:movieId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { movieId } = req.params;
    try {
        const deletedMovie = yield index_1.default.movie.delete({ where: { id: movieId } });
        res.status(204).json({ message: "Movie deleted successfully" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error deleting movie" });
    }
}));
exports.default = router;
