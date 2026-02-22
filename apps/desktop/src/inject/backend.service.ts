import {
  BACKEND_URL,
  STORAGE_TOKEN_KEY,
  STORAGE_LMS_TYPE_KEY,
  STORAGE_SCHOOL_ID_KEY,
} from "./constants";

class BackendService {
  private getToken(): string | null {
    return localStorage.getItem(STORAGE_TOKEN_KEY);
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const token = this.getToken();
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };
    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      ...options,
      headers,
    });
    if (response.status === 401) {
      // Token expired or invalid – trigger logout
      localStorage.removeItem(STORAGE_TOKEN_KEY);
      localStorage.removeItem(STORAGE_SCHOOL_ID_KEY);
      localStorage.removeItem(STORAGE_LMS_TYPE_KEY);
      window.location.reload(); // simple reload to show login screen
      throw new Error("Session expired");
    }
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || `HTTP ${response.status}`);
    }
    return response.json();
  }

  async createSession() {
    return this.request("/sessions", { method: "POST" });
  }

  async getSessionStatus(sessionId: string) {
    return this.request(`/sessions/${sessionId}/status`);
  }

  async sendBulkMessages(
    sessionId: string,
    message: string,
    numbers: string[],
  ) {
    return this.request(`/sessions/${sessionId}/send-bulk`, {
      method: "POST",
      body: JSON.stringify({ message, numbers }),
    });
  }

  async deleteSession(sessionId: string) {
    return this.request(`/sessions/${sessionId}`, { method: "DELETE" });
  }
}

export const backendService = new BackendService();
