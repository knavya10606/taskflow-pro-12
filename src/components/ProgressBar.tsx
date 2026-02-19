import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 0–100
  className?: string;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "success" | "warning" | "info";
  animated?: boolean;
}

const variants = {
  primary: "from-primary to-primary-glow",
  success: "from-success to-emerald-400",
  warning: "from-warning to-amber-300",
  info: "from-info to-sky-400",
};

const sizes = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
};

export default function ProgressBar({
  value,
  className,
  showLabel = false,
  size = "md",
  variant = "primary",
  animated = true,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "flex-1 rounded-full bg-secondary overflow-hidden",
          sizes[size]
        )}
      >
        <div
          className={cn(
            "h-full rounded-full bg-gradient-to-r transition-all duration-1000 ease-out",
            variants[variant],
            animated && "animate-[progress-fill_1s_ease-out_forwards]"
          )}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-sm font-semibold text-foreground tabular-nums w-9 text-right">
          {clamped}%
        </span>
      )}
    </div>
  );
}
