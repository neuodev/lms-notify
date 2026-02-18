import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../common/jwt";
import { AdminTokenPayload } from "../../types/auth";

export interface AdminAuthRequest extends Request {
  admin?: AdminTokenPayload;
}

export function requireAdminAuth(
  req: AdminAuthRequest,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, error: "No token provided" });
  }

  const token = authHeader.substring(7);
  const payload = verifyToken<AdminTokenPayload>(token);
  if (!payload || payload.role !== "admin") {
    return res.status(403).json({ success: false, error: "Forbidden" });
  }

  req.admin = payload;
  next();
}
