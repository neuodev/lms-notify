import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../common/jwt";

export interface AdminAuthRequest extends Request {
  admin?: { adminId: string; email: string; role: string };
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
  const payload = verifyToken<{ adminId: string; email: string; role: string }>(
    token,
  );
  if (!payload || payload.role !== "admin") {
    return res.status(403).json({ success: false, error: "Forbidden" });
  }

  req.admin = payload;
  next();
}
