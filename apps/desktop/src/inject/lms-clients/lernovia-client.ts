import { LmsClient } from "./types";
import { User } from "../types";
import { API_BASE_URL } from "../constants"; // Lernovia API base

export class LernoviaClient implements LmsClient {
  async fetchAllUsers(): Promise<User[]> {
    const token = localStorage.getItem("token"); // LMS token from Lernovia login
    if (!token) throw new Error("No LMS authentication token found");

    let page = 1;
    const allUsers: User[] = [];

    while (true) {
      const params = new URLSearchParams({
        paginate: "500",
        page: String(page),
      });
      const res = await fetch(`${API_BASE_URL}/user/get-all?${params}`, {
        headers: {
          accept: "application/json",
          authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      const json = await res.json();
      const body = json.body;
      if (!body || !Array.isArray(body.data)) break;

      allUsers.push(...body.data);
      if (!body.next_page_url) break;
      page++;
    }
    return allUsers;
  }
}
