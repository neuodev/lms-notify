import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./adminSidebar";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      setLocation("/login");
    }
  }, [user, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background/50 overflow-hidden">
        <AdminSidebar />
        <div className="flex flex-col flex-1 w-full">
          <header className="h-16 flex items-center justify-between px-6 border-b bg-card/50 backdrop-blur-sm z-10">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-muted-foreground hover:text-foreground transition-colors" />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold leading-none">
                    {user.username}
                  </p>
                  <p className="text-xs text-muted-foreground">Administrator</p>
                </div>
                <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold border border-primary/20">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-6 md:p-8">
            <div className="max-w-7xl mx-auto w-full h-full">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
