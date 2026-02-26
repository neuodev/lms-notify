import { Router } from "express";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/db";
import {
  requireAdminAuth,
  AdminAuthRequest,
} from "@/lib/middlewares/adminAuth";
import { sessionManager } from "@/lib/whatsapp/session";
import dayjs from "dayjs";
import z from "zod";

const router = Router();

router.use(requireAdminAuth);

router.get("/", async (_, res) => {
  try {
    const schoolsCount = await prisma.school.count();

    const startOfMonth = dayjs().startOf("month").toISOString();
    const allMessages = await prisma.messageLog.findMany({
      where: {
        createdAt: { gte: startOfMonth },
      },
    });

    const messagesCount = allMessages.length;
    const successMessagesCount = allMessages.filter(
      (message) => message.status === "SENT",
    ).length;

    const last7DaysMessages = allMessages.filter((message) =>
      dayjs(message.createdAt).isAfter(
        dayjs().startOf("day").subtract(7, "days"),
      ),
    );
    const weekDaysMessages: Record<string, number> = {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
    };
    last7DaysMessages.forEach((message) => {
      const day = String(dayjs(message.createdAt).get("day"));
      weekDaysMessages[day]++;
    });
    const today = dayjs().startOf("day");
    const chartData = [];

    for (let i = 6; i >= 0; i--) {
      const date = today.subtract(i, "day");
      const dayNum = date.day();
      chartData.push({
        date: date.format("dddd"),
        messages: weekDaysMessages[String(dayNum)] ?? 0,
      });
    }

    const activeSessionsCount = sessionManager
      .getAllSessions()
      .filter((session) => session.status === "authenticated").length;

    res.json({
      success: true,
      data: {
        schoolsCount,
        messagesCount,
        successRate:
          messagesCount !== 0
            ? (successMessagesCount / messagesCount) * 100
            : 0,
        chartData,
        activeSessionsCount,
      },
    });
  } catch (error) {
    console.error("Error fetching schools:", error);
    res.status(500).json({ success: false, error: "Failed to fetch schools" });
  }
});

router.get("/list", async (_, res) => {
  const schools = await prisma.school.findMany({
    include: {
      _count: {
        select: {
          messageLogs: true,
        },
      },
    },
  });

  return res.status(200).json({
    success: true,
    data: {
      schools: schools.map((school) => ({
        id: school.id,
        name: school.name,
        lmsType: school.lmsType,
        sessions: school.sessions.length,
        createdAt: school.createdAt,
        updatedAt: school.updatedAt,
        messageCount: school._count.messageLogs,
      })),
    },
  });
});

const querySchema = z.object({
  schoolId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

router.get("/logs", async (req, res) => {
  try {
    const query = querySchema.parse(req.query);
    const { schoolId, startDate, endDate } = query;

    const where: any = {};
    if (schoolId) where.schoolId = schoolId;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const logs = await prisma.messageLog.findMany({
      where,
      include: {
        school: {
          select: { id: true, name: true }, // only needed fields
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json({
      success: true,
      data: logs,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: "Invalid query parameters", details: error.message });
    }
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
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

router.get("/:id", async (req: AdminAuthRequest, res) => {
  try {
    const { id } = req.params;
    if (typeof id !== "string") throw new Error("Enter valid school ID");
    const school = await prisma.school.findUnique({
      where: { id },
      include: {
        messageLogs: {
          orderBy: { createdAt: "desc" },
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

export default router;
