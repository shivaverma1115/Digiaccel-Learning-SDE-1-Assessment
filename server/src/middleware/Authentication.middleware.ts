import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      userID?: string;
    }
  }
}

export function authentication(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : undefined;

  if (!token) {
    res.status(401).json({ message: "Please login first" });
    return;
  }

  const secretKey = process.env.SECRET_KEY;
  if (!secretKey) {
    res.status(500).json({ message: "Missing environment variable: SECRET_KEY" });
    return;
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    if (typeof decoded === "string" || typeof decoded.userID !== "string") {
      res.status(401).json({ message: "Please login first" });
      return;
    }

    req.userID = decoded.userID;
    next();
  } catch {
    res.status(401).json({ message: "Please login first" });
  }
}
