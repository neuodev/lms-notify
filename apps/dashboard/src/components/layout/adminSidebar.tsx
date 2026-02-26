import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  School,
  MessageSquareText,
  LogOut,
  Building2,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useLogout } from "@/hooks/use-auth";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Schools", url: "/schools", icon: School },
  { title: "Message Logs", url: "/logs", icon: MessageSquareText },
];

export function AdminSidebar() {
  const [location] = useLocation();
  const logout = useLogout();

  return (
    <Sidebar className="bg-sidebar-background text-sidebar-foreground border-r-sidebar-border border-r">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/25">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold tracking-tight">
              LMS Connect
            </h2>
            <p className="text-xs text-sidebar-foreground/60 font-medium">
              Admin Portal
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50 uppercase tracking-wider text-xs font-bold mb-2">
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {navItems.map((item) => {
                const isActive =
                  location === item.url ||
                  (item.url !== "/" && location.startsWith(item.url));
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={`
                        h-11 px-4 rounded-lg transition-all duration-200
                        ${
                          isActive
                            ? "bg-primary text-primary-foreground font-semibold shadow-md shadow-primary/20"
                            : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground hover-elevate"
                        }
                      `}
                    >
                      <Link href={item.url} className="flex items-center gap-3">
                        <item.icon
                          className={`w-5 h-5 ${isActive ? "text-primary" : "text-sidebar-foreground/60"}`}
                        />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={logout}
              className="h-11 px-4 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors hover-elevate"
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span className="font-medium">Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
