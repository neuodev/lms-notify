import { useQuery } from "@tanstack/react-query";
import { getAuthHeaders } from "@/lib/auth";
import { api } from "@/lib/api";

interface LogsFilters {
  schoolId?: string;
  startDate?: string;
  endDate?: string;
}

export function useLogs(filters?: LogsFilters) {
  return useQuery({
    queryKey: ["Message_LOGS", filters],
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
      return data;
    },
  });
}
