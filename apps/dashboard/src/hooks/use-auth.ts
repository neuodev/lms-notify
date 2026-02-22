import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { setToken, removeToken, getAuthHeaders } from "@/lib/auth";
import { useLocation } from "wouter";
import type { AdminLoginInput } from "@/types/auth";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { queryClient } from "@/lib/queryClient";

export function useAuth() {
  return useQuery({
    queryKey: ["AUTH"],
    queryFn: async () => {
      const res = await fetch(api.admin.auth.me, { headers: getAuthHeaders() });
      if (res.status === 401) {
        removeToken();
        return null;
      }
      if (!res.ok) throw new Error("Failed to authenticate");
      const data = await res.json();
      return data;
    },
    retry: false,
  });
}

export function useLogin() {
  const [, setLocation] = useLocation();

  return useMutation({
    mutationFn: async (credentials: AdminLoginInput) => {
      const res = await fetch(api.admin.auth.login, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Login failed");
      }

      const data = await res.json();

      return data;
    },
    onSuccess: (data) => {
      setToken(data.token);
      toast("Welcome Back!");
      setLocation("/");
    },
    onError: (err: Error) => {
      toast("Couldn't Login", {
        description: err.message,
      });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  return () => {
    removeToken();
    queryClient.setQueryData(["Auth"], null);
    queryClient.clear();
    toast("Logged Out Successfully!");
    setLocation("/login");
  };
}
