import { useQuery } from "@tanstack/react-query";
import { getAuthHeaders } from "@/lib/auth";
import { api } from "@/lib/api";
import z from "zod";

type LogsFilters = {
  schoolId?: string;
  startDate?: string;
  endDate?: string;
};

const LogStatusEnum = z.enum(["SENT", "FAILED"]);

const LogSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  school: z.object({
    id: z.string(),
    name: z.string(),
  }),
  recipient: z.string(),
  message: z.string(),
  status: LogStatusEnum,
  error: z.string().nullable().optional(),
});

export const LogsApiResponseSchema = z.object({
  success: z.literal(true),
  data: z.array(LogSchema),
});

export function useLogs(filters?: LogsFilters) {
  return useQuery({
    queryKey: [api.admin.dashboard.logs, filters],
    queryFn: async () => {
      const url = new URL(api.admin.dashboard.logs);
      if (filters?.schoolId)
        url.searchParams.append("schoolId", filters.schoolId);
      if (filters?.startDate)
        url.searchParams.append("startDate", filters.startDate);
      if (filters?.endDate) url.searchParams.append("endDate", filters.endDate);

      const res = await fetch(url.toString(), { headers: getAuthHeaders() });
      if (!res.ok) throw new Error("Failed to fetch logs");

      const data = await res.json();

      return LogsApiResponseSchema.parse(data);
    },
  });
}
