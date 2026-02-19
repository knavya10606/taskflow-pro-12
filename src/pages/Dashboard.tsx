import { useTasks } from "@/hooks/useTasks";
import StatCard from "@/components/StatCard";
import ProgressBar from "@/components/ProgressBar";
import TopNavbar from "@/components/TopNavbar";
import TaskDialog from "@/components/TaskDialog";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import { Task, CreateTaskInput } from "@/hooks/useTasks";
import { useState } from "react";
import {
  CheckSquare, Clock, ListTodo, TrendingUp, AlertTriangle, Target
} from "lucide-react";
import { format, isAfter, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import TaskCard from "@/components/TaskCard";

export default function Dashboard() {
  const { tasks, loading, stats, createTask, updateTask, deleteTask, getProgress } = useTasks();
  const [showDialog, setShowDialog] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);

  const recentTasks = tasks.slice(0, 5);
  const overdueTasks = tasks.filter(
    (t) => t.deadline && t.status !== "completed" && !isAfter(parseISO(t.deadline), new Date())
  );

  const handleSave = async (data: CreateTaskInput) => {
    if (editTask) {
      await updateTask(editTask.id, data);
    } else {
      await createTask(data);
    }
    setEditTask(null);
  };

  const handleEdit = (task: Task) => {
    setEditTask(task);
    setShowDialog(true);
  };

  const handleDelete = async () => {
    if (deleteTarget) {
      await deleteTask(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  const handleStatusChange = async (id: string, status: Task["status"]) => {
    await updateTask(id, { status });
  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      <TopNavbar onCreateTask={() => { setEditTask(null); setShowDialog(true); }} />

      <div className="p-6 space-y-8 max-w-7xl mx-auto">
        {/* Welcome banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-primary p-6 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(0_0%_100%_/_0.1),_transparent_60%)]" />
          <div className="relative z-10 flex items-center justify-between gap-6">
            <div className="space-y-2">
              <h1 className="font-display text-2xl font-bold">Project Overview</h1>
              <p className="text-white/70 text-sm max-w-sm">
                You have <strong className="text-white">{stats.inProgress}</strong> tasks in progress and{" "}
                <strong className="text-white">{stats.todo}</strong> tasks waiting to start.
              </p>
            </div>
            <div className="hidden sm:flex flex-col items-center text-center shrink-0">
              <div className="relative w-24 h-24">
                <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
                  <circle
                    cx="50" cy="50" r="40" fill="none"
                    stroke="white" strokeWidth="8"
                    strokeDasharray={`${stats.overallProgress * 2.51} 251`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-display text-xl font-bold">{stats.overallProgress}%</span>
                </div>
              </div>
              <p className="text-white/70 text-xs mt-1">Overall Progress</p>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Tasks"
            value={stats.total}
            icon={Target}
            iconBg="gradient-primary"
            delay={0}
          />
          <StatCard
            title="Completed"
            value={stats.completed}
            icon={CheckSquare}
            iconBg="bg-success"
            progress={stats.total ? (stats.completed / stats.total) * 100 : 0}
            progressVariant="success"
            delay={50}
          />
          <StatCard
            title="In Progress"
            value={stats.inProgress}
            icon={Clock}
            iconBg="bg-info"
            progress={stats.total ? (stats.inProgress / stats.total) * 100 : 0}
            progressVariant="info"
            delay={100}
          />
          <StatCard
            title="To Do"
            value={stats.todo}
            icon={ListTodo}
            iconBg="bg-warning"
            progress={stats.total ? (stats.todo / stats.total) * 100 : 0}
            progressVariant="warning"
            delay={150}
          />
        </div>

        {/* Overall progress */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4 card-glow animate-fade-in-up stagger-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground">Overall Completion</h3>
                <p className="text-xs text-muted-foreground">{stats.completed} of {stats.total} tasks completed</p>
              </div>
            </div>
            <span className="font-display text-2xl font-bold gradient-text">{stats.overallProgress}%</span>
          </div>
          <ProgressBar value={stats.overallProgress} size="lg" showLabel={false} />

          {/* Status breakdown */}
          <div className="grid grid-cols-3 gap-4 pt-2">
            {[
              { label: "To Do", count: stats.todo, color: "bg-muted-foreground", pct: stats.total ? Math.round((stats.todo / stats.total) * 100) : 0 },
              { label: "In Progress", count: stats.inProgress, color: "bg-info", pct: stats.total ? Math.round((stats.inProgress / stats.total) * 100) : 0 },
              { label: "Completed", count: stats.completed, color: "bg-success", pct: stats.total ? Math.round((stats.completed / stats.total) * 100) : 0 },
            ].map((s) => (
              <div key={s.label} className="text-center space-y-1.5">
                <div className={cn("w-2 h-2 rounded-full mx-auto", s.color)} />
                <p className="font-display font-bold text-xl text-foreground">{s.count}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-xs font-semibold text-foreground">{s.pct}%</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent tasks */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold text-foreground">Recent Tasks</h3>
              <a href="/tasks" className="text-primary text-sm hover:underline">View all →</a>
            </div>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-card border border-border rounded-2xl p-5 h-32 animate-pulse" />
                ))}
              </div>
            ) : recentTasks.length === 0 ? (
              <div className="bg-card border border-border rounded-2xl p-10 text-center">
                <p className="text-muted-foreground text-sm">No tasks yet. Create your first task!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentTasks.map((task, i) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    progress={getProgress(task.status)}
                    onEdit={handleEdit}
                    onDelete={setDeleteTarget}
                    onStatusChange={handleStatusChange}
                    className={`stagger-${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Side panel */}
          <div className="space-y-4">
            {/* Overdue */}
            {overdueTasks.length > 0 && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                  <h4 className="font-display font-semibold text-destructive text-sm">
                    {overdueTasks.length} Overdue
                  </h4>
                </div>
                <div className="space-y-2">
                  {overdueTasks.slice(0, 3).map((t) => (
                    <div key={t.id} className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full bg-destructive mt-1.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-foreground line-clamp-1">{t.title}</p>
                        {t.deadline && (
                          <p className="text-xs text-destructive/70">
                            Due {format(parseISO(t.deadline), "MMM d")}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Priority breakdown */}
            <div className="bg-card border border-border rounded-2xl p-5 space-y-4 card-glow">
              <h4 className="font-display font-semibold text-foreground text-sm">Priority Breakdown</h4>
              {(["high", "medium", "low"] as const).map((p) => {
                const count = tasks.filter((t) => t.priority === p).length;
                const pct = tasks.length ? Math.round((count / tasks.length) * 100) : 0;
                const colors = { high: "success" as const, medium: "warning" as const, low: "info" as const };
                const labels = { high: "🔴 High", medium: "🟡 Medium", low: "🟢 Low" };
                return (
                  <div key={p} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground font-medium">{labels[p]}</span>
                      <span className="text-foreground font-semibold">{count}</span>
                    </div>
                    <ProgressBar value={pct} variant={colors[p]} size="sm" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <TaskDialog
        open={showDialog || !!editTask}
        onClose={() => { setShowDialog(false); setEditTask(null); }}
        onSave={handleSave}
        task={editTask}
      />
      <DeleteConfirmDialog
        task={deleteTarget}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
