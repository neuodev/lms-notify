import { Router } from "express";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/db/index.js";
import { generateAdminToken, verifyToken } from "@/lib/common/jwt.js";
import { AdminTokenPayload } from "@/types/auth";

const router = Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, error: "Email and password required" });
    }

    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials" });
    }

    const token = generateAdminToken({
      id: admin.id,
      email: admin.email,
      role: admin.role,
    });
    res.json({ success: true, token });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

router.get("/me", async (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ success: false });
  const payload = verifyToken<AdminTokenPayload>(token);
  if (!payload || payload.role !== "admin") {
    return res.status(403).json({ success: false, error: "Forbidden" });
  }

  res.json({ username: "admin" });
});

export default router;
