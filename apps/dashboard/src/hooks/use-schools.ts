import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { CreateSchoolPayload, UpdateSchoolPayload } from "@/types/school";
import { api, buildUrl } from "@/lib/api";
import { toast } from "sonner";

export function useSchools() {
  return useQuery({
    queryKey: [api.schools.list.path],
    queryFn: async () => {
      const res = await apiRequest("GET", api.admin.dashboard.createSchool);
      const json = await res.json();
      const parsed = api.schools.list.responses[200].parse(json);
      return parsed.data; // Return just the data array
    },
  });
}

export function useSchool(id: string) {
  return useQuery({
    queryKey: [api.schools.get.path, id],
    queryFn: async () => {
      if (!id) return null;
      const url = buildUrl(api.schools.get.path, { id });
      const res = await apiRequest("GET", url);
      const json = await res.json();
      const parsed = api.schools.get.responses[200].parse(json);
      return parsed.data;
    },
    enabled: !!id,
  });
}

export function useSchoolMonthly(id: string) {
  return useQuery({
    queryKey: [api.schools.getMonthly.path, id],
    queryFn: async () => {
      if (!id) return null;
      const url = buildUrl(api.schools.getMonthly.path, { id });
      const res = await apiRequest("GET", url);
      const json = await res.json();
      return api.schools.getMonthly.responses[200].parse(json);
    },
    enabled: !!id,
  });
}

export function useCreateSchool() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateSchoolPayload) => {
      const res = await apiRequest(
        "POST",
        api.admin.dashboard.createSchool,
        data,
      );
      const json = await res.json();
      return json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["CREATE_SCHOOL"] });
      toast("School created successfully");
    },
    onError: (err: Error) => {
      toast("Error creating school", {
        description: err.message,
      });
    },
  });
}

export function useUpdateSchool() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateSchoolPayload;
    }) => {
      const url = buildUrl(api.admin.dashboard.updateSchool, { id });
      const res = await apiRequest("PUT", url, data);
      const json = await res.json();
      return json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["SCHOOLS"] });
      toast("School updated successfully");
    },
    onError: (err: Error) => {
      toast("Error updating school", {
        description: err.message,
      });
    },
  });
}

export function useDeleteSchool() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const url = buildUrl(api.admin.dashboard.deleteSchool, { id });
      await apiRequest("DELETE", url);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["SCHOOLS"] });
      toast("School deleted successfully");
    },
    onError: (err: Error) => {
      toast("Error deleting school", {
        description: err.message,
      });
    },
  });
}
