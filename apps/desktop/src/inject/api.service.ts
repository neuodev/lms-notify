import { User } from "./types";
import { API_BASE_URL, WHATSAPP_API_URL } from "./constants";

export type WhatsAppStatus = {
  authenticated: boolean;
  qr?: string;
  message?: string;
};

export type CreateSessionResponse = {
  success: true;
  sessionId: string;
  message: string;
};

export type SessionStatusResponse = {
  success: true;
  sessionId: string;
  authenticated: boolean;
  connection: string;
  qr: string | null;
  status:
    | "initializing"
    | "qr_pending"
    | "authenticated"
    | "disconnected"
    | "error";
  createdAt: number;
  lastActivity: number;
};

export type SendBulkResponse = {
  success: true;
  sessionId: string;
  sentCount: number;
  failedCount: number;
  results: Array<{
    number: string;
    status: "sent" | "failed";
    error?: string;
    timestamp: number;
  }>;
};

export type DeleteSessionResponse = {
  success: true;
  message: string;
};

export type SendBulkResult = {
  results: { number: string; status: "sent" | "failed" }[];
};

class ApiService {
  private token: string;

  constructor() {
    this.token = localStorage.getItem("token") || "";
  }

  async fetchAllUsers(): Promise<User[]> {
    let page = 1;
    const allUsers: User[] = [];

    while (true) {
      console.log("Fetching page", page);

      const params = new URLSearchParams({
        paginate: "500",
        page: String(page),
      });

      try {
        const res = await fetch(
          `${API_BASE_URL}/user/get-all?${params.toString()}`,
          {
            headers: {
              accept: "application/json",
              authorization: `Bearer ${this.token}`,
            },
            credentials: "include",
          },
        );

        const json = await res.json();
        const body = json.body;

        if (!body || !Array.isArray(body.data)) {
          console.warn("Invalid response structure", json);
          break;
        }

        allUsers.push(...body.data);
        console.log(`Page ${page}: ${body.data.length} users`);

        if (!body.next_page_url) {
          break;
        }

        page++;
      } catch (err) {
        console.error("Error fetching users:", err);
        break;
      }
    }

    console.log(`Total users fetched: ${allUsers.length}`);
    return allUsers;
  }

  async createSession(): Promise<CreateSessionResponse> {
    const res = await fetch(`${WHATSAPP_API_URL}/sessions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}), // storeType is now server‑controlled
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: "Unknown error" }));
      throw new Error(error.error || `HTTP ${res.status}: ${res.statusText}`);
    }

    return res.json();
  }

  async getSessionStatus(sessionId: string): Promise<SessionStatusResponse> {
    const res = await fetch(`${WHATSAPP_API_URL}/sessions/${sessionId}/status`);

    if (res.status === 404) {
      // Session not found – throw a special error that the component can catch
      const error = new Error("Session not found") as any;
      error.status = 404;
      throw error;
    }

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: "Unknown error" }));
      throw new Error(error.error || `HTTP ${res.status}: ${res.statusText}`);
    }

    return res.json();
  }

  async sendBulkMessages(
    sessionId: string,
    message: string,
    numbers: string[],
  ): Promise<SendBulkResponse> {
    const res = await fetch(
      `${WHATSAPP_API_URL}/sessions/${sessionId}/send-bulk`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, numbers }),
      },
    );

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: "Unknown error" }));
      throw new Error(error.error || `HTTP ${res.status}: ${res.statusText}`);
    }

    return res.json();
  }

  async deleteSession(sessionId: string): Promise<DeleteSessionResponse> {
    const res = await fetch(`${WHATSAPP_API_URL}/sessions/${sessionId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: "Unknown error" }));
      throw new Error(error.error || `HTTP ${res.status}: ${res.statusText}`);
    }

    return res.json();
  }
}

export const apiService = new ApiService();
