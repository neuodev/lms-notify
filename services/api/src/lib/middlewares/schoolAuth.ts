import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../common/jwt";
import { SchoolTokenPayload } from "../../types/auth";

export interface SchoolAuthRequest extends Request {
  school?: SchoolTokenPayload;
}

export function requireSchoolAuth(
  req: SchoolAuthRequest,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, error: "No token provided" });
  }

  const token = authHeader.substring(7);
  const payload = verifyToken<SchoolTokenPayload>(token);
  if (!payload) {
    return res
      .status(401)
      .json({ success: false, error: "Invalid or expired token" });
  }

  req.school = payload;
  next();
}
