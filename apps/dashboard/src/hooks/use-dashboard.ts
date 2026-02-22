import { useQuery } from "@tanstack/react-query";
import { getAuthHeaders } from "@/lib/auth";
import { api } from "@/lib/api";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["DASHBOARD_STATS"],
    queryFn: async () => {
      const res = await fetch(api.admin.dashboard.stats, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to fetch dashboard stats");
      const data = await res.json();
      return data;
    },
  });
}
