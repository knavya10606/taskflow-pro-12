import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import ProgressBar from "./ProgressBar";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  progress?: number;
  progressVariant?: "primary" | "success" | "warning" | "info";
  iconBg?: string;
  className?: string;
  delay?: number;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendUp,
  progress,
  progressVariant = "primary",
  iconBg = "gradient-primary",
  className,
  delay = 0,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "bg-card border border-border rounded-2xl p-5 card-glow space-y-4 animate-fade-in-up",
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-muted-foreground text-sm font-medium">{title}</p>
          <p className="font-display text-3xl font-bold text-foreground">{value}</p>
          {trend && (
            <p className={cn("text-xs font-medium", trendUp ? "text-success" : "text-muted-foreground")}>
              {trend}
            </p>
          )}
        </div>
        <div
          className={cn(
            "w-11 h-11 rounded-xl flex items-center justify-center shrink-0",
            iconBg
          )}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>

      {progress !== undefined && (
        <ProgressBar value={progress} variant={progressVariant} size="sm" showLabel />
      )}
    </div>
  );
}
