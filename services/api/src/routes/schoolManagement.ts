import { Router } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../lib/db";
import {
  requireAdminAuth,
  AdminAuthRequest,
} from "../lib/middlewares/adminAuth";

const router = Router();

// All routes require admin authentication
router.use(requireAdminAuth);

// List all schools
router.get("/", async (req: AdminAuthRequest, res) => {
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

// Get single school
router.get("/:id", async (req: AdminAuthRequest, res) => {
  try {
    const { id } = req.params;
    if (typeof id !== "string") throw new Error("Enter valid school ID");
    const school = await prisma.school.findUnique({
      where: { id },
      include: {
        messageLogs: {
          orderBy: { createdAt: "desc" },
          take: 50, // recent logs
        },
      },
    });
    if (!school) {
      return res
        .status(404)
        .json({ success: false, error: "School not found" });
    }
    res.json({ success: true, data: school });
  } catch (error) {
    console.error("Error fetching school:", error);
    res.status(500).json({ success: false, error: "Failed to fetch school" });
  }
});

// Create new school
router.post("/", async (req: AdminAuthRequest, res) => {
  try {
    const { name, email, password, lmsType } = req.body;
    if (!name || !email || !password || !lmsType) {
      return res
        .status(400)
        .json({ success: false, error: "Missing required fields" });
    }

    // Validate lmsType enum
    if (!["LERNOVIA", "CLASSERA", "TEAMS", "COLIGO"].includes(lmsType)) {
      return res.status(400).json({ success: false, error: "Invalid lmsType" });
    }

    const existing = await prisma.school.findUnique({ where: { email } });
    if (existing) {
      return res
        .status(409)
        .json({ success: false, error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const school = await prisma.school.create({
      data: {
        name,
        email,
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

// Update school
router.put("/:id", async (req: AdminAuthRequest, res) => {
  try {
    const { id } = req.params;
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

    if (typeof id !== "string") throw new Error("Enter valid school ID");

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

// Delete school
router.delete("/:id", async (req: AdminAuthRequest, res) => {
  try {
    const { id } = req.params;
    if (typeof id !== "string") throw new Error("Enter valid school ID");
    // First delete related message logs? Prisma can cascade if set in schema.
    // We have no cascade defined, so we'll need to delete logs manually or let them be orphaned? Better to cascade.
    // For now, we'll rely on schema with onDelete: Cascade? We didn't set it. Let's update schema to cascade.
    // We'll implement manually:
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
