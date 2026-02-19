import { cn } from "@/lib/utils";
import { Task } from "@/hooks/useTasks";
import { Flag, Calendar, Pencil, Trash2, CheckCircle2, Clock, Circle } from "lucide-react";
import ProgressBar from "./ProgressBar";
import { format, isAfter, parseISO } from "date-fns";

interface TaskCardProps {
  task: Task;
  progress: number;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (id: string, status: Task["status"]) => void;
  className?: string;
}

const priorityConfig = {
  high: { label: "High", className: "priority-badge-high", icon: "🔴" },
  medium: { label: "Medium", className: "priority-badge-medium", icon: "🟡" },
  low: { label: "Low", className: "priority-badge-low", icon: "🟢" },
};

const statusConfig = {
  todo: { label: "To Do", icon: Circle, className: "status-badge-todo" },
  in_progress: { label: "In Progress", icon: Clock, className: "status-badge-in_progress" },
  completed: { label: "Completed", icon: CheckCircle2, className: "status-badge-completed" },
};

const nextStatus: Record<Task["status"], Task["status"]> = {
  todo: "in_progress",
  in_progress: "completed",
  completed: "todo",
};

export default function TaskCard({ task, progress, onEdit, onDelete, onStatusChange, className }: TaskCardProps) {
  const priority = priorityConfig[task.priority];
  const status = statusConfig[task.status];
  const StatusIcon = status.icon;

  const isOverdue =
    task.deadline &&
    task.status !== "completed" &&
    !isAfter(parseISO(task.deadline), new Date());

  return (
    <div
      className={cn(
        "bg-card border border-border rounded-2xl p-5 card-glow group space-y-4 animate-fade-in-up",
        task.status === "completed" && "opacity-75",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3
            className={cn(
              "font-display font-semibold text-foreground text-base leading-snug",
              task.status === "completed" && "line-through text-muted-foreground"
            )}
          >
            {task.title}
          </h3>
          {task.description && (
            <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{task.description}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-lg hover:bg-primary/15 text-muted-foreground hover:text-primary transition-colors"
            title="Edit task"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(task)}
            className="p-1.5 rounded-lg hover:bg-destructive/15 text-muted-foreground hover:text-destructive transition-colors"
            title="Delete task"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Badges */}
      <div className="flex items-center flex-wrap gap-2">
        <span className={cn("flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg", priority.className)}>
          <Flag className="w-3 h-3" />
          {priority.label}
        </span>

        <button
          onClick={() => onStatusChange(task.id, nextStatus[task.status])}
          className={cn(
            "flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg transition-all hover:opacity-80 active:scale-95",
            status.className
          )}
          title="Click to advance status"
        >
          <StatusIcon className="w-3 h-3" />
          {status.label}
        </button>

        {task.deadline && (
          <span
            className={cn(
              "flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg",
              isOverdue
                ? "bg-destructive/15 text-destructive border border-destructive/30"
                : "bg-muted text-muted-foreground border border-border"
            )}
          >
            <Calendar className="w-3 h-3" />
            {format(parseISO(task.deadline), "MMM d")}
            {isOverdue && " · Overdue"}
          </span>
        )}
      </div>

      {/* Progress */}
      <div className="space-y-1.5">
        <ProgressBar
          value={progress}
          variant={task.status === "completed" ? "success" : task.status === "in_progress" ? "info" : "primary"}
          size="sm"
          showLabel
        />
      </div>
    </div>
  );
}
