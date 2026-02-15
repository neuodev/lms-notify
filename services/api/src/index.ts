import express from "express";
import cors from "cors";
import { SessionManager } from "./lib/whatsapp/session/index.js";

const STORE_TYPE: "memory" | "file" =
  process.env.STORE_TYPE === "file" ? "file" : "memory";
console.log("🚀 App started with PID", process.pid);

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
  }),
);

const sessionManager = new SessionManager({
  sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
  cleanupInterval: 5 * 60 * 1000, // 5 minutes
  maxSessions: 50,
});

sessionManager.on("session:created", ({ sessionId }) => {
  console.log(`Session created: ${sessionId}`);
});

sessionManager.on("session:authenticated", ({ sessionId }) => {
  console.log(`Session authenticated: ${sessionId}`);
});

sessionManager.on("session:destroyed", ({ sessionId }) => {
  console.log(`Session destroyed: ${sessionId}`);
});

sessionManager.on("manager:shutdown", () => {
  console.log(`All Sessions destroyed`);
});

app.get("/health", (_, res) => {
  const stats = sessionManager.getStats();
  res.json({
    status: "ok",
    uptime: process.uptime(),
    sessions: stats,
    timestamp: new Date().toISOString(),
  });
});

app.post("/sessions", async (req, res) => {
  try {
    const metadata = {
      userAgent: req.get("User-Agent"),
      ip: req.ip || req.socket.remoteAddress,
    };

    const { sessionId } = await sessionManager.createSession(
      STORE_TYPE,
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

app.get("/sessions/:sessionId/status", async (req, res) => {
  const { sessionId } = req.params;
  const session = sessionManager.getSession(sessionId);

  if (!session) {
    return res.status(404).json({
      success: false,
      error: "Session not found or expired",
    });
  }

  // wait to ensure qr creation
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const wa = session.waInstance;
  const status = {
    success: true,
    sessionId,
    authenticated: wa.connection === "open",
    connection: wa.connection,
    qr: wa.qr ?? null,
    status: session.status,
    createdAt: session.createdAt,
    lastActivity: session.lastActivity,
  };

  res.status(201).json(status);
});

app.post("/sessions/:sessionId/send-bulk", async (req, res) => {
  const { sessionId } = req.params;
  const { numbers, message } = req.body;

  const session = sessionManager.getSession(sessionId);
  if (!session)
    return res.status(404).json({
      success: false,
      error: "Session not found or expired",
    });

  if (session.waInstance.connection !== "open")
    return res.status(401).json({
      success: false,
      error: "WhatsApp not authenticated for this session",
    });

  if (!numbers || !Array.isArray(numbers) || numbers.length === 0) {
    return res.status(400).json({
      success: false,
      error: "Invalid numbers array",
    });
  }

  if (!message || typeof message !== "string") {
    return res.status(400).json({
      success: false,
      error: "Invalid message",
    });
  }

  const results = [];
  for (const number of numbers) {
    try {
      const jid = session.waInstance.asWhatsAppId(number);
      await session.waInstance.sendPresence(jid, "composing");
      await session.waInstance.sendMessage(jid, { text: message });
      const delay = Math.floor(Math.random() * 1500 + 1000);
      await new Promise((resolve) => setTimeout(resolve, delay));
      results.push({ number, status: "sent", timestamp: Date.now() });
    } catch (err) {
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
});

app.delete("/sessions/:sessionId", async (req, res) => {
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

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(sessionManager.getAllSessions());
  console.log(`Server running on store: ${STORE_TYPE}`);
  console.log(`Server running on port ${PORT}`);
  console.log(`Session manager initialized with cleanup every 5 minutes`);
});
server.on("error", (err) => {
  console.error("Server failed to start:", err.message);
  process.exit(1);
});

process.on("SIGTERM", async () => {
  console.log("SIGTERM received. Starting graceful shutdown...");
  await sessionManager.shutdown();
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

process.on("SIGINT", async () => {
  console.log("SIGINT received. Starting graceful shutdown...");
  await sessionManager.shutdown();
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
