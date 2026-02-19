import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Task } from "@/hooks/useTasks";

interface DeleteConfirmDialogProps {
  task: Task | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmDialog({ task, onConfirm, onCancel }: DeleteConfirmDialogProps) {
  return (
    <AlertDialog open={!!task} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent className="bg-card border-border text-foreground rounded-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-display text-xl font-bold">Delete Task?</AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">"{task?.title}"</span>? This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel
            onClick={onCancel}
            className="bg-secondary border-border text-foreground hover:bg-muted rounded-xl"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
