import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState, useCallback } from "react";
import { toast } from "@/hooks/use-toast";

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  deadline: string | null;
  priority: "low" | "medium" | "high";
  status: "todo" | "in_progress" | "completed";
  created_at: string;
  updated_at: string;
}

export type CreateTaskInput = Omit<Task, "id" | "user_id" | "created_at" | "updated_at">;
export type UpdateTaskInput = Partial<CreateTaskInput>;

export function useTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setTasks((data as Task[]) ?? []);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = async (input: CreateTaskInput) => {
    if (!user) return;
    const { data, error } = await supabase
      .from("tasks")
      .insert({ ...input, user_id: user.id })
      .select()
      .single();

    if (error) {
      toast({ title: "Error creating task", description: error.message, variant: "destructive" });
    } else {
      setTasks((prev) => [data as Task, ...prev]);
      toast({ title: "✅ Task created", description: `"${input.title}" added successfully.` });
    }
  };

  const updateTask = async (id: string, updates: UpdateTaskInput) => {
    const { data, error } = await supabase
      .from("tasks")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      toast({ title: "Error updating task", description: error.message, variant: "destructive" });
    } else {
      setTasks((prev) => prev.map((t) => (t.id === id ? (data as Task) : t)));
    }
  };

  const deleteTask = async (id: string) => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) {
      toast({ title: "Error deleting task", description: error.message, variant: "destructive" });
    } else {
      setTasks((prev) => prev.filter((t) => t.id !== id));
      toast({ title: "🗑️ Task deleted", description: "Task removed successfully." });
    }
  };

  // Progress helpers
  const getProgress = (status: Task["status"]) => {
    if (status === "todo") return 0;
    if (status === "in_progress") return 50;
    return 100;
  };

  const overallProgress =
    tasks.length === 0
      ? 0
      : Math.round(tasks.reduce((acc, t) => acc + getProgress(t.status), 0) / tasks.length);

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === "completed").length,
    inProgress: tasks.filter((t) => t.status === "in_progress").length,
    todo: tasks.filter((t) => t.status === "todo").length,
    overallProgress,
  };

  return { tasks, loading, createTask, updateTask, deleteTask, getProgress, stats, refetch: fetchTasks };
}
