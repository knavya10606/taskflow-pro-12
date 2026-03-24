import { Bell, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { MobileMenuButton } from "@/components/MobileNav";
interface TopNavbarProps {
  onSearch?: (query: string) => void;
  searchValue?: string;
  onCreateTask?: () => void;
}

export default function TopNavbar({ onSearch, searchValue, onCreateTask }: TopNavbarProps) {
  const { user } = useAuth();
  const name = (user?.user_metadata?.full_name as string)?.split(" ")[0] || "there";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-4 md:px-6 bg-background/80 backdrop-blur-sm sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <MobileMenuButton />
        <div className="flex flex-col">
        <h2 className="font-display font-semibold text-foreground text-sm leading-none">
          {greeting}, {name} 👋
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {onSearch !== undefined && (
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchValue}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-9 h-9 w-56 bg-secondary border-border text-foreground placeholder:text-muted-foreground rounded-xl text-sm"
            />
          </div>
        )}

        <button className="relative p-2 rounded-xl hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full" />
        </button>

        {onCreateTask && (
          <Button
            onClick={onCreateTask}
            size="sm"
            className="gradient-primary text-white rounded-xl h-9 px-4 gap-2 hover:opacity-90 transition-opacity font-medium shadow-glow"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Task</span>
          </Button>
        )}
      </div>
    </header>
  );
}
