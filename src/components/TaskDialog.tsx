import { useState, useEffect } from "react";
import { Task, CreateTaskInput } from "@/hooks/useTasks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TaskDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: CreateTaskInput) => void;
  task?: Task | null;
}

const defaultForm: CreateTaskInput = {
  title: "",
  description: "",
  deadline: null,
  priority: "medium",
  status: "todo",
};

export default function TaskDialog({ open, onClose, onSave, task }: TaskDialogProps) {
  const [form, setForm] = useState<CreateTaskInput>(defaultForm);
  const isEditing = !!task;

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        description: task.description || "",
        deadline: task.deadline ? task.deadline.slice(0, 10) : null,
        priority: task.priority,
        status: task.status,
      });
    } else {
      setForm(defaultForm);
    }
  }, [task, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave({
      ...form,
      deadline: form.deadline ? new Date(form.deadline).toISOString() : null,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border text-foreground rounded-2xl max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-bold">
            {isEditing ? "Edit Task" : "Create New Task"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-2">
          <div className="space-y-2">
            <Label className="text-foreground font-medium">Task Title *</Label>
            <Input
              placeholder="Enter task title..."
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-foreground font-medium">Description</Label>
            <Textarea
              placeholder="Add more details about this task..."
              value={form.description || ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground rounded-xl resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-foreground font-medium">Priority</Label>
              <Select
                value={form.priority}
                onValueChange={(v) => setForm({ ...form, priority: v as Task["priority"] })}
              >
                <SelectTrigger className="bg-secondary border-border text-foreground rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border text-foreground rounded-xl">
                  <SelectItem value="low" className="hover:bg-secondary">🟢 Low</SelectItem>
                  <SelectItem value="medium" className="hover:bg-secondary">🟡 Medium</SelectItem>
                  <SelectItem value="high" className="hover:bg-secondary">🔴 High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground font-medium">Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) => setForm({ ...form, status: v as Task["status"] })}
              >
                <SelectTrigger className="bg-secondary border-border text-foreground rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border text-foreground rounded-xl">
                  <SelectItem value="todo" className="hover:bg-secondary">⬜ To Do</SelectItem>
                  <SelectItem value="in_progress" className="hover:bg-secondary">🔄 In Progress</SelectItem>
                  <SelectItem value="completed" className="hover:bg-secondary">✅ Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-foreground font-medium">Deadline</Label>
            <Input
              type="date"
              value={form.deadline || ""}
              onChange={(e) => setForm({ ...form, deadline: e.target.value || null })}
              className="bg-secondary border-border text-foreground rounded-xl"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="gradient-primary text-white rounded-xl hover:opacity-90 shadow-glow"
            >
              {isEditing ? "Save Changes" : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
