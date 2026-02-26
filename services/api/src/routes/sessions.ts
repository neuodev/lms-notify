import { Router } from "express";
import {
  requireSchoolAuth,
  SchoolAuthRequest,
} from "../lib/middlewares/schoolAuth";
import { sessionManager } from "../lib/whatsapp/session";
import { STORE_TYPE } from "..";
import { prisma } from "../lib/db";

const router = Router();

router.post("/", requireSchoolAuth, async (req: SchoolAuthRequest, res) => {
  try {
    const metadata = {
      userAgent: req.get("User-Agent"),
      ip: req.ip || req.socket.remoteAddress,
    };
    const schoolId = req.school?.schoolId;
    if (!schoolId) throw new Error("No School ID");

    const { sessionId } = await sessionManager.createSession(
      STORE_TYPE,
      schoolId,
      metadata,
    );

    res.status(201).json({
      success: true,
      sessionId,
      message:
        "Session created successfully. Use sessionId for all subsequent requests.",
    });
  } catch (error) {
    console.error("Failed to create session:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create session",
    });
  }
});

router.get(
  "/:sessionId/status",
  requireSchoolAuth,
  async (req: SchoolAuthRequest, res) => {
    const { sessionId } = req.params;
    if (typeof sessionId !== "string") throw new Error("No session ID");
    const session = sessionManager.getSession(sessionId);

    if (!session || session.schoolId !== req.school!.schoolId) {
      return res.status(404).json({
        success: false,
        error: "Session not found or expired",
      });
    }

    const wa = session.waInstance;
    if (!wa.qr) await new Promise((resolve) => setTimeout(resolve, 1500));
    const status = {
      success: true,
      sessionId,
      schoolId: req.school?.schoolId,
      authenticated: wa.connection === "open",
      connection: wa.connection,
      qr: wa.qr ?? null,
      status: session.status,
      createdAt: session.createdAt,
      lastActivity: session.lastActivity,
    };

    res.status(201).json(status);
  },
);

router.post(
  "/:sessionId/send-bulk",
  requireSchoolAuth,
  async (req: SchoolAuthRequest, res) => {
    const { sessionId } = req.params;
    if (typeof sessionId != "string") throw Error("Enter valide session id");
    const { recipients } = req.body;

    if (!Array.isArray(recipients) || recipients.length === 0) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid recipients array" });
    }
    for (const r of recipients) {
      if (typeof r.number !== "string" || typeof r.message !== "string") {
        return res.status(400).json({
          success: false,
          error: "Each recipient must have number and message",
        });
      }
    }

    const session = sessionManager.getSession(sessionId);
    if (!session || session.schoolId !== req.school!.schoolId) {
      return res
        .status(404)
        .json({ success: false, error: "Session not found" });
    }
    if (session.waInstance.connection !== "open") {
      return res
        .status(401)
        .json({ success: false, error: "WhatsApp not authenticated" });
    }

    const results = [];
    for (const { number, message } of recipients) {
      try {
        const jid = session.waInstance.asWhatsAppId(number);
        await session.waInstance.sendPresence(jid, "composing");
        await session.waInstance.sendMessage(jid, { text: message });

        await prisma.messageLog.create({
          data: {
            schoolId: req.school!.schoolId,
            sessionId,
            recipient: number,
            status: "SENT",
            message: message,
          },
        });

        results.push({ number, status: "sent", timestamp: Date.now() });
        const delay = Math.floor(Math.random() * 1500 + 500);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } catch (err) {
        await prisma.messageLog.create({
          data: {
            schoolId: req.school!.schoolId,
            sessionId,
            recipient: number,
            status: "FAILED",
            error: err instanceof Error ? err.message : "Unknown error",
            message: message?.substring(0, 500),
          },
        });
        results.push({
          number,
          status: "failed",
          error: err instanceof Error ? err.message : "Unknown error",
          timestamp: Date.now(),
        });
      }
    }

    res.json({
      success: true,
      sessionId,
      sentCount: results.filter((r) => r.status === "sent").length,
      failedCount: results.filter((r) => r.status === "failed").length,
      results,
    });
  },
);

router.delete("/:sessionId", async (req, res) => {
  const { sessionId } = req.params;

  const destroyed = await sessionManager.destroySession(sessionId);

  if (!destroyed) {
    return res.status(404).json({
      success: false,
      error: "Session not found",
    });
  }

  res.json({
    success: true,
    message: "Session destroyed successfully",
  });
});

export default router;
