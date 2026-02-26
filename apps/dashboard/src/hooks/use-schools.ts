import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { CreateSchoolPayload, UpdateSchoolPayload } from "@/types/school";
import { api, buildUrl } from "@/lib/api";
import { toast } from "sonner";
import z from "zod";

export const schoolSchema = z.object({
  id: z.string(),
  name: z.string(),
  lmsType: z.union([
    z.literal("LERNOVIA"),
    z.literal("CLASSERA"),
    z.literal("TEAMS"),
    z.literal("COLIGO"),
  ]),
  sessions: z.number(),
  password: z.string().nullable().optional(),
  messageCount: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const messageLogSchema = z.object({
  error: z.string().nullable(),
  id: z.string(),
  createdAt: z.string(),
  schoolId: z.string(),
  sessionId: z.string().nullable(),
  message: z.string(),
  recipient: z.string(),
  status: z.union([z.literal("SENT"), z.literal("FAILED")]),
});

export const individualSchoolSchema = z.object({
  id: z.string(),
  name: z.string(),
  lmsType: z.union([
    z.literal("LERNOVIA"),
    z.literal("CLASSERA"),
    z.literal("TEAMS"),
    z.literal("COLIGO"),
  ]),
  password: z.string().nullable().optional(),
  messageLogs: z.array(messageLogSchema),
  sessions: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const findSchoolsSchema = z.object({
  success: z.boolean(),
  data: z.object({
    schools: z.array(schoolSchema),
  }),
});

export const findSchoolSchema = z.object({
  success: z.boolean(),
  data: individualSchoolSchema,
});

export function useSchools() {
  return useQuery({
    queryKey: [api.admin.dashboard.list],
    queryFn: async () => {
      const res = await apiRequest("GET", api.admin.dashboard.list);
      const json = await res.json();

      return findSchoolsSchema.parse(json);
    },
  });
}

export function useSchool(id: string) {
  return useQuery({
    queryKey: [api.admin.dashboard.school, id],
    queryFn: async () => {
      if (!id) return null;
      const url = buildUrl(api.admin.dashboard.school, { id });
      const res = await apiRequest("GET", url);
      const json = await res.json();
      console.log({ json });

      console.log(findSchoolSchema.safeParse(json).error?.message);

      return findSchoolSchema.parse(json);
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
      queryClient.invalidateQueries({
        queryKey: [api.admin.dashboard.createSchool],
      });
      queryClient.invalidateQueries({ queryKey: [api.admin.dashboard.list] });
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
      queryClient.invalidateQueries({
        queryKey: [api.admin.dashboard.updateSchool],
      });
      queryClient.invalidateQueries({ queryKey: [api.admin.dashboard.list] });
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
      queryClient.invalidateQueries({
        queryKey: [api.admin.dashboard.deleteSchool],
      });
      queryClient.invalidateQueries({ queryKey: [api.admin.dashboard.list] });
      toast("School deleted successfully");
    },
    onError: (err: Error) => {
      toast("Error deleting school", {
        description: err.message,
      });
    },
  });
}
