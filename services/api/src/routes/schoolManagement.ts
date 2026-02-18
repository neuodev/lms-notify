import { Router } from "express";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/db";
import {
  requireAdminAuth,
  AdminAuthRequest,
} from "@/lib/middlewares/adminAuth";
import { sessionManager } from "@/lib/whatsapp/session";

const router = Router();

router.use(requireAdminAuth);

router.get("/", async (_, res) => {
  try {
    const schools = await prisma.school.findMany({
      include: {
        _count: {
          select: { messageLogs: true },
        },
      },
    });
    res.json({ success: true, data: schools });
  } catch (error) {
    console.error("Error fetching schools:", error);
    res.status(500).json({ success: false, error: "Failed to fetch schools" });
  }
});

router.get("/:id", async (req: AdminAuthRequest, res) => {
  try {
    const { id } = req.params;
    if (typeof id !== "string") throw new Error("Enter valid school ID");
    const school = await prisma.school.findUnique({
      where: { id },
      include: {
        messageLogs: {
          orderBy: { createdAt: "desc" },
          take: 50,
        },
      },
    });
    if (!school) {
      return res
        .status(404)
        .json({ success: false, error: "School not found" });
    }

    const activeSessions = sessionManager
      .getAllSessions()
      .filter((session) => session.schoolId === id);

    res.json({ success: true, data: { ...school, activeSessions } });
  } catch (error) {
    console.error("Error fetching school:", error);
    res.status(500).json({ success: false, error: "Failed to fetch school" });
  }
});

router.post("/", async (req: AdminAuthRequest, res) => {
  try {
    const { name, password, lmsType } = req.body;
    if (!name || !password || !lmsType) {
      return res
        .status(400)
        .json({ success: false, error: "Missing required fields" });
    }

    if (!["LERNOVIA", "CLASSERA", "TEAMS", "COLIGO"].includes(lmsType)) {
      return res.status(400).json({ success: false, error: "Invalid lmsType" });
    }

    const existing = await prisma.school.findFirst({ where: { name } });
    if (existing) {
      return res
        .status(409)
        .json({ success: false, error: "School already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const school = await prisma.school.create({
      data: {
        name,
        password: hashedPassword,
        lmsType,
      },
    });

    res.status(201).json({ success: true, data: school });
  } catch (error) {
    console.error("Error creating school:", error);
    res.status(500).json({ success: false, error: "Failed to create school" });
  }
});

router.put("/:id", async (req: AdminAuthRequest, res) => {
  try {
    const { id } = req.params;
    if (typeof id !== "string") throw new Error("Enter valid school ID");
    const { name, password, lmsType } = req.body;

    const updateData: any = {};
    if (name) updateData.name = name;

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }
    if (lmsType) {
      if (!["LERNOVIA", "CLASSERA", "TEAMS", "COLIGO"].includes(lmsType)) {
        return res
          .status(400)
          .json({ success: false, error: "Invalid lmsType" });
      }
      updateData.lmsType = lmsType;
    }

    const school = await prisma.school.update({
      where: { id },
      data: updateData,
    });

    res.json({ success: true, data: school });
  } catch (error) {
    console.error("Error updating school:", error);
    res.status(500).json({ success: false, error: "Failed to update school" });
  }
});

router.delete("/:id", async (req: AdminAuthRequest, res) => {
  try {
    const { id } = req.params;
    if (typeof id !== "string") throw new Error("Enter valid school ID");
    await prisma.$transaction([
      prisma.messageLog.deleteMany({ where: { schoolId: id } }),
      prisma.school.delete({ where: { id } }),
    ]);
    res.json({ success: true, message: "School deleted" });
  } catch (error) {
    console.error("Error deleting school:", error);
    res.status(500).json({ success: false, error: "Failed to delete school" });
  }
});

router.get("/health", (_, res) => {
  const stats = sessionManager.getStats();
  res.json({
    status: "ok",
    uptime: process.uptime(),
    sessions: stats,
    timestamp: new Date().toISOString(),
  });
});

export default router;
