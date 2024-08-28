"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secretKey = process.env.TOKEN_SECRET;
if (!secretKey) {
    throw new Error("TOKEN_SECRET is not defined");
}
const isAuthenticated = (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader) {
            return res.status(401).json({ message: "Token not provided" });
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Token not provided" });
        }
        const payload = jsonwebtoken_1.default.verify(token, secretKey);
        req.payload = payload;
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Token not valid" });
    }
};
exports.default = isAuthenticated;
