import express from "express";
import cors from "cors";
import { sessionManager } from "@/lib/whatsapp/session";
import authRoutes from "./routes/schoolAuth";
import adminAuthRoutes from "./routes/adminAuth";
import schoolManagementRoutes from "./routes/schoolManagement";
import schoolsRoutes from "./routes/schools";
import sessionsRoutes from "./routes/sessions";

export const STORE_TYPE: "memory" | "file" =
  process.env.STORE_TYPE === "file" ? "file" : "memory";
console.log("🚀 App started with PID", process.pid);

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
  }),
);

app.use("/school/auth", authRoutes);
app.use("/admin/auth", adminAuthRoutes);
app.use("/admin/schools", schoolManagementRoutes);
app.use("/schools", schoolsRoutes);
app.use("/sessions", sessionsRoutes);

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
