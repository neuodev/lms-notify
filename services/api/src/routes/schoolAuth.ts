import { Router } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../lib/db";
import { generateSchoolToken, verifyToken } from "../lib/common/jwt";
import { AdminTokenPayload } from "@/types/auth";

const router = Router();

router.post("/login", async (req, res) => {
  try {
    const { id, password } = req.body;
    if (!id || !password) {
      return res
        .status(400)
        .json({ success: false, error: "Id and password required" });
    }

    const school = await prisma.school.findUnique({ where: { id } });
    if (!school) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, school.password);
    if (!valid) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials" });
    }

    const token = generateSchoolToken({
      schoolId: school.id,
      lmsType: school.lmsType,
    });
    res.json({ success: true, token, lmsType: school.lmsType });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

export default router;
