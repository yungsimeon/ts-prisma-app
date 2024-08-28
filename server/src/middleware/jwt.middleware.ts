import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const secretKey = process.env.TOKEN_SECRET;
if (!secretKey) {
  throw new Error("TOKEN_SECRET is not defined");
}

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ message: "Token not provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token not provided" });
    }

    const payload = jwt.verify(token, secretKey) as JwtPayload;
    req.payload = payload;

    next();
  } catch (error) {
    res.status(401).json({ message: "Token not valid" });
  }
};

export default isAuthenticated;
