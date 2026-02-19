import { useTasks, Task, CreateTaskInput } from "@/hooks/useTasks";
import TaskCard from "@/components/TaskCard";
import TaskDialog from "@/components/TaskDialog";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import TopNavbar from "@/components/TopNavbar";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Filter, SortAsc, LayoutGrid, List } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type SortKey = "created_at" | "deadline" | "priority" | "title";
type ViewMode = "grid" | "list";

const priorityOrder = { high: 0, medium: 1, low: 2 };

export default function TasksPage() {
  const { tasks, loading, createTask, updateTask, deleteTask, getProgress } = useTasks();
  const [showDialog, setShowDialog] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const filtered = useMemo(() => {
    let result = [...tasks];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) => t.title.toLowerCase().includes(q) || (t.description || "").toLowerCase().includes(q)
      );
    }
    if (filterStatus !== "all") result = result.filter((t) => t.status === filterStatus);
    if (filterPriority !== "all") result = result.filter((t) => t.priority === filterPriority);

    result.sort((a, b) => {
      if (sortKey === "deadline") {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      if (sortKey === "priority") return priorityOrder[a.priority] - priorityOrder[b.priority];
      if (sortKey === "title") return a.title.localeCompare(b.title);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    return result;
  }, [tasks, search, filterStatus, filterPriority, sortKey]);

  const handleSave = async (data: CreateTaskInput) => {
    if (editTask) await updateTask(editTask.id, data);
    else await createTask(data);
    setEditTask(null);
  };

  const handleEdit = (task: Task) => { setEditTask(task); setShowDialog(true); };
  const handleDelete = async () => {
    if (deleteTarget) { await deleteTask(deleteTarget.id); setDeleteTarget(null); }
  };
  const handleStatusChange = (id: string, status: Task["status"]) => updateTask(id, { status });

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      <TopNavbar
        onSearch={setSearch}
        searchValue={search}
        onCreateTask={() => { setEditTask(null); setShowDialog(true); }}
      />

      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">My Tasks</h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              {filtered.length} of {tasks.length} tasks
            </p>
          </div>
        </div>

        {/* Filters toolbar */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 text-muted-foreground shrink-0">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filter:</span>
          </div>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-36 h-9 bg-secondary border-border text-foreground rounded-xl text-sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border text-foreground rounded-xl">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-36 h-9 bg-secondary border-border text-foreground rounded-xl text-sm">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border text-foreground rounded-xl">
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="high">🔴 High</SelectItem>
              <SelectItem value="medium">🟡 Medium</SelectItem>
              <SelectItem value="low">🟢 Low</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-1.5 text-muted-foreground ml-auto shrink-0">
            <SortAsc className="w-4 h-4" />
            <span className="text-sm font-medium">Sort:</span>
          </div>

          <Select value={sortKey} onValueChange={(v) => setSortKey(v as SortKey)}>
            <SelectTrigger className="w-36 h-9 bg-secondary border-border text-foreground rounded-xl text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border text-foreground rounded-xl">
              <SelectItem value="created_at">Newest First</SelectItem>
              <SelectItem value="deadline">Deadline</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="title">Title A–Z</SelectItem>
            </SelectContent>
          </Select>

          {/* View toggle */}
          <div className="flex bg-secondary rounded-xl p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={cn("p-1.5 rounded-lg transition-colors", viewMode === "grid" ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground")}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn("p-1.5 rounded-lg transition-colors", viewMode === "list" ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground")}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Status tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {["all", "todo", "in_progress", "completed"].map((s) => {
            const labels: Record<string, string> = { all: "All", todo: "To Do", in_progress: "In Progress", completed: "Completed" };
            const counts: Record<string, number> = {
              all: tasks.length,
              todo: tasks.filter((t) => t.status === "todo").length,
              in_progress: tasks.filter((t) => t.status === "in_progress").length,
              completed: tasks.filter((t) => t.status === "completed").length,
            };
            return (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
                  filterStatus === s
                    ? "bg-primary text-primary-foreground shadow-glow"
                    : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {labels[s]}
                <span className={cn("text-xs px-1.5 py-0.5 rounded-md", filterStatus === s ? "bg-white/20" : "bg-muted")}>
                  {counts[s]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Task grid/list */}
        {loading ? (
          <div className={cn("gap-4", viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3" : "flex flex-col")}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-5 h-40 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-16 text-center space-y-3">
            <p className="text-4xl">📋</p>
            <p className="font-display font-semibold text-foreground">No tasks found</p>
            <p className="text-muted-foreground text-sm">
              {search || filterStatus !== "all" || filterPriority !== "all"
                ? "Try adjusting your filters."
                : "Create your first task to get started!"}
            </p>
            {!search && filterStatus === "all" && filterPriority === "all" && (
              <Button
                onClick={() => { setEditTask(null); setShowDialog(true); }}
                className="gradient-primary text-white rounded-xl mt-2 hover:opacity-90 shadow-glow"
              >
                Create Task
              </Button>
            )}
          </div>
        ) : (
          <div className={cn("gap-4", viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3" : "flex flex-col")}>
            {filtered.map((task, i) => (
              <TaskCard
                key={task.id}
                task={task}
                progress={getProgress(task.status)}
                onEdit={handleEdit}
                onDelete={setDeleteTarget}
                onStatusChange={handleStatusChange}
                className={`stagger-${Math.min(i + 1, 5)}`}
              />
            ))}
          </div>
        )}
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
