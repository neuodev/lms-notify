import { Router } from "express";
import { prisma } from "../lib/db";
import {
  requireSchoolAuth,
  SchoolAuthRequest,
} from "../lib/middlewares/schoolAuth";

const router = Router();

router.get("/schools", async (_, res) => {
  const schools = await prisma.school.findMany({});
  res.json({
    schools: schools.map((school) => ({ ...school, password: null })),
  });
});

router.get("/list", requireSchoolAuth, async (req: SchoolAuthRequest, res) => {
  const school = req.school;
  if (!school) throw Error("No school provided");

  const schoolData = await prisma.school.findUnique({
    where: { id: school.schoolId },
  });

  res.json({
    school: { ...schoolData, password: null },
  });
});

router.get("/logs", requireSchoolAuth, async (req: SchoolAuthRequest, res) => {
  const school = req.school;
  if (!school) throw Error("No school provided");

  const messages = await prisma.messageLog.findMany({
    where: { schoolId: school.schoolId },
  });

  res.json({
    messages,
  });
});
export default router;
