import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      payload?: JwtPayload; // or use `any` if you don't want to be specific
    }
  }
}

export {};
