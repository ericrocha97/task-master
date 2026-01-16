import { format } from "date-fns";
import { Calendar, Flag, Trash2 } from "lucide-react";
import { TagBadge } from "@/components/tags/tag-badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { PriorityType, Task } from "@/types/task";
import { PRIORITY_COLORS } from "@/types/task";

interface TaskItemProps {
  task: Task;
  isEditing: boolean;
  isOtherEditing: boolean;
  onToggleComplete: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const priorityLabels: Record<PriorityType, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

export function TaskItem({
  task,
  isEditing,
  isOtherEditing,
  onToggleComplete,
  onEdit,
  onDelete,
}: TaskItemProps) {
  const handleClick = () => {
    if (!(isOtherEditing || task.completed)) {
      onEdit(task.id);
    }
  };

  if (isEditing) {
    return null;
  }

  return (
    <div
      className={cn(
        "group flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-all",
        task.completed && "opacity-60",
        isOtherEditing && "pointer-events-none opacity-40",
        !(task.completed || isOtherEditing) &&
          "cursor-pointer hover:border-primary/30 hover:shadow-sm"
      )}
    >
      {/* Checkbox */}
      <div className="pt-0.5">
        <Checkbox
          aria-label={`Mark "${task.title}" as ${task.completed ? "incomplete" : "complete"}`}
          checked={task.completed}
          className="h-5 w-5"
          onCheckedChange={() => onToggleComplete(task.id)}
        />
      </div>

      {/* Content - Clickable area */}
      <button
        className="min-w-0 flex-1 text-left"
        disabled={task.completed || isOtherEditing}
        onClick={handleClick}
        type="button"
      >
        <p
          className={cn(
            "font-medium text-base text-foreground",
            task.completed && "text-muted-foreground line-through"
          )}
        >
          {task.title}
        </p>

        {/* Meta info */}
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {/* Due Date */}
          {task.dueDate && (
            <span className="flex items-center gap-1 text-muted-foreground text-xs">
              <Calendar className="h-3 w-3" />
              {format(new Date(task.dueDate), "MMM d, yyyy")}
            </span>
          )}

          {/* Priority */}
          {task.priority && (
            <span
              className={cn(
                "flex items-center gap-1 text-xs",
                PRIORITY_COLORS[task.priority].text
              )}
            >
              <Flag className="h-3 w-3" />
              {priorityLabels[task.priority]}
            </span>
          )}

          {/* Tag */}
          {task.tag && <TagBadge className="text-xs" tag={task.tag} />}
        </div>
      </button>

      {/* Delete Button */}
      <Button
        aria-label={`Delete "${task.title}"`}
        className="h-8 w-8 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
        onClick={() => onDelete(task.id)}
        size="icon"
        variant="ghost"
      >
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  );
}
