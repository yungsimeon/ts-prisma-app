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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const jwt_middleware_1 = __importDefault(require("../middleware/jwt.middleware"));
const prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
const saltRounds = 10;
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name, password } = req.body;
    const existingUser = yield prisma.user.findUnique({
        where: { email },
    });
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = yield bcryptjs_1.default.hash(password, saltRounds);
    try {
        const newUser = yield prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
            },
        });
        const token = jsonwebtoken_1.default.sign({ userId: newUser.id, email: newUser.email }, process.env.TOKEN_SECRET || "your_secret_key", { expiresIn: "24h" });
        res.status(201).json({
            user: {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
            },
            token,
        });
    }
    catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const isPasswordMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, process.env.TOKEN_SECRET || "your_secret_key", { expiresIn: "24h" });
        res.status(200).json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
            token,
        });
    }
    catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
router.get("/verify", jwt_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!((_a = req.payload) === null || _a === void 0 ? void 0 : _a.userId)) {
            return res.status(401).json({ error: "User not authenticated" });
        }
        const user = yield prisma.user.findUnique({
            where: {
                id: req.payload.userId,
            },
            select: {
                id: true,
                email: true,
                name: true,
            },
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(user);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
exports.default = router;
