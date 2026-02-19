import { LayoutDashboard, CheckSquare, ListTodo, BarChart3, Settings, LogOut, Zap, Menu } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/" },
  { label: "My Tasks", icon: CheckSquare, to: "/tasks" },
  { label: "To Do", icon: ListTodo, to: "/tasks?status=todo" },
  { label: "Analytics", icon: BarChart3, to: "/analytics" },
];

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const { user, signOut } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const initials = (user?.user_metadata?.full_name as string || user?.email || "U")
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 shrink-0",
        collapsed ? "w-16" : "w-60",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border h-16">
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-sm text-foreground">TaskFlow Pro</span>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center mx-auto">
            <Zap className="w-4 h-4 text-white" />
          </div>
        )}
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="p-1.5 rounded-lg hover:bg-sidebar-accent text-muted-foreground hover:text-foreground transition-colors"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}
      </div>

      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="mx-auto mt-2 p-1.5 rounded-lg hover:bg-sidebar-accent text-muted-foreground hover:text-foreground transition-colors"
        >
          <Menu className="w-4 h-4" />
        </button>
      )}

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground group",
              collapsed && "justify-center px-2"
            )}
            activeClassName="bg-primary/15 text-primary hover:bg-primary/20 hover:text-primary"
          >
            <item.icon className="w-4 h-4 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border space-y-1">
        <NavLink
          to="/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground",
            collapsed && "justify-center px-2"
          )}
          activeClassName="bg-primary/15 text-primary"
        >
          <Settings className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Settings</span>}
        </NavLink>

        {/* User */}
        <div className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl", collapsed && "justify-center px-2")}>
          <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-white">{initials}</span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">
                {(user?.user_metadata?.full_name as string) || "User"}
              </p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={signOut}
              className="p-1 rounded-md hover:bg-destructive/15 text-muted-foreground hover:text-destructive transition-colors"
              title="Sign out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
