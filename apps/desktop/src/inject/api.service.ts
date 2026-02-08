import { User } from "./types";
import { API_BASE_URL, WHATSAPP_API_URL } from "./constants";

export interface WhatsAppStatus {
  authenticated: boolean;
  qr?: string;
  message?: string;
}

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

  async checkWhatsAppStatus(): Promise<WhatsAppStatus> {
    try {
      const res = await fetch(`${WHATSAPP_API_URL}/status?_=${Date.now()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      return await res.json();
    } catch (error) {
      console.error("Error checking WhatsApp status:", error);
      return {
        authenticated: false,
        message: "فشل الاتصال بخادم WhatsApp",
      };
    }
  }

  async sendBulkMessages(
    message: string,
    numbers: string[],
  ): Promise<SendBulkResult> {
    try {
      const res = await fetch(`${WHATSAPP_API_URL}/send-bulk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, numbers }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      return await res.json();
    } catch (error) {
      console.error("Error sending bulk messages:", error);
      throw error;
    }
  }
}

export const apiService = new ApiService();
