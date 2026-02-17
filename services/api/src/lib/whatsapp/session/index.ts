import { Session, SessionManagerConfig } from "@/types/sessions.js";
import { EventEmitter } from "events";
import { v4 as uuidv4 } from "uuid";
import { WhatsApp } from "../index.js";

export class SessionManager extends EventEmitter {
  private sessions: Map<string, Session> = new Map();
  private config: SessionManagerConfig;
  private cleanupTimer: NodeJS.Timeout | null = null;

  constructor(config?: Partial<SessionManagerConfig>) {
    super();
    this.config = {
      sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
      cleanupInterval: 5 * 60 * 1000, // 5 minutes
      maxSessions: 100,
      qrTimeout: 10 * 60 * 1000, // 10 minutes for QR to be scanned
      ...config,
    };

    this.startCleanupInterval();
  }

  async createSession(
    storeType: "memory" | "file" = "memory",
    schoolId: string,
    metadata: Session["metadata"],
  ): Promise<{ sessionId: string; qr?: string }> {
    await this.destroyOldestSession();

    const sessionId = uuidv4();
    const wa = new WhatsApp();
    await wa.withStore(storeType, sessionId);

    if (!wa.store) throw new Error("Failed to initialize store for session");

    const session: Session = {
      id: sessionId,
      waInstance: wa,
      store: wa.store,
      schoolId,
      createdAt: Date.now(),
      lastActivity: Date.now(),
      status: "initializing",
      metadata: metadata,
    };

    this.sessions.set(sessionId, session);

    try {
      await this.initializeWhatsAppSession(session);
      this.emit("session:created", { sessionId });
      return { sessionId };
    } catch (error) {
      console.error(`Failed to initialize session ${sessionId}:`, error);
      this.emit("session:error", { sessionId, error });
      return { sessionId };
    }
  }

  private async initializeWhatsAppSession(session: Session) {
    try {
      session.status = "qr_pending";

      session.waInstance.events.on("qr", (qr: string) => {
        this.updateSession(session.id, {
          lastActivity: Date.now(),
          status: "qr_pending",
        });
        this.emit("session:qr", { sessionId: session.id, qr });
      });

      session.waInstance.events.on("connection.update", (update) => {
        if (update.connection) {
          const isOpen = update.connection === "open";
          this.updateSession(session.id, {
            lastActivity: Date.now(),
            status: isOpen ? "authenticated" : "disconnected",
          });
          if (isOpen) {
            this.emit("session:authenticated", { sessionId: session.id });
          }
        }
      });

      await session.waInstance.connectAsync();
    } catch (error) {
      session.status = "error";
      throw error;
    }
  }

  getSession(sessionId: string): Session | null {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.lastActivity = Date.now();
      return session;
    }
    return null;
  }

  getAllSessions(): Session[] {
    return Array.from(this.sessions.values());
  }

  updateSession(sessionId: string, updates: Partial<Session>): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    Object.assign(session, updates);
    session.lastActivity = Date.now();
    return true;
  }

  async destroySession(sessionId: string): Promise<boolean> {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    try {
      session.waInstance.events.removeAllListeners();
      if (session.waInstance.isConnected()) {
        await session.waInstance.disconnect();
      }
      if (session.store.cleanup) {
        await session.store.cleanup();
      }
    } catch (error) {
      console.error(`Error cleaning up session ${sessionId}:`, error);
    } finally {
      this.sessions.delete(sessionId);
      this.emit("session:destroyed", { sessionId });
    }
    return true;
  }

  private cleanupExpiredSessions(): void {
    const now = Date.now();
    const expiredSessions: string[] = [];

    for (const [sessionId, session] of this.sessions.entries()) {
      const sessionAge = now - session.lastActivity;
      const isExpired = sessionAge > this.config.sessionTimeout;

      // clean up sessions that have QR pending for too long
      const qrPendingTooLong =
        session.status === "qr_pending" &&
        now - session.lastActivity > this.config.qrTimeout;

      if (isExpired || qrPendingTooLong) {
        expiredSessions.push(sessionId);
      }
    }

    expiredSessions.forEach(async (sessionId) => {
      console.log(`Cleaning up expired session: ${sessionId}`);
      await this.destroySession(sessionId);
    });

    if (expiredSessions.length > 0) {
      this.emit("cleanup:completed", { cleanedCount: expiredSessions.length });
    }
  }

  private getOldestSession(): Session | null {
    let oldest: Session | null = null;

    for (const session of this.sessions.values()) {
      if (!oldest || session.lastActivity < oldest.lastActivity) {
        oldest = session;
      }
    }

    return oldest;
  }

  private async destroyOldestSession(): Promise<void> {
    if (this.sessions.size >= this.config.maxSessions) {
      const oldestSession = this.getOldestSession();
      if (oldestSession) {
        await this.destroySession(oldestSession.id);
      } else {
        throw new Error("Maximum session limit reached");
      }
    }
  }

  /**
   *
   * Periodic cleanup
   */
  private startCleanupInterval(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanupExpiredSessions();
    }, this.config.cleanupInterval);

    process.on("SIGTERM", () => this.shutdown());
    process.on("SIGINT", () => this.shutdown());
  }

  async shutdown(): Promise<void> {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }

    const sessionIds = Array.from(this.sessions.keys());
    const cleanupPromises = sessionIds.map((sessionId) =>
      this.destroySession(sessionId).catch((error) =>
        console.error(`Failed to cleanup session ${sessionId}:`, error),
      ),
    );

    await Promise.allSettled(cleanupPromises);
    this.emit("manager:shutdown");
  }

  /**
   * Session statistics
   */
  getStats() {
    const stats = {
      total: this.sessions.size,
      byStatus: {
        initializing: 0,
        qr_pending: 0,
        authenticated: 0,
        disconnected: 0,
        error: 0,
      },
      memoryUsage: process.memoryUsage(),
    };

    for (const session of this.sessions.values()) {
      stats.byStatus[session.status]++;
    }

    return stats;
  }
}
