import { useQuery } from "@tanstack/react-query";
import { getAuthHeaders } from "@/lib/auth";
import { api } from "@/lib/api";
import z from "zod";

const statsSchema = z.object({
  success: z.boolean(),
  data: z.object({
    schoolsCount: z.number(),
    messagesCount: z.number(),
    successRate: z.number(),
    activeSessionsCount: z.number(),
    chartData: z.array(
      z.object({
        date: z.string(),
        messages: z.number(),
      }),
    ),
  }),
});

export function useDashboardStats() {
  return useQuery({
    queryKey: [api.admin.dashboard.stats],
    queryFn: async () => {
      const res = await fetch(api.admin.dashboard.stats, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to fetch dashboard stats");
      const data = await res.json();

      const parsed = statsSchema.parse(data);

      return parsed;
    },
  });
}
