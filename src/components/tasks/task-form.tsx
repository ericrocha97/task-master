import { format } from "date-fns";
import { Calendar as CalendarIcon, Flag, Tag, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { PriorityType, TagType, Task } from "@/types/task";
import { PRIORITY_COLORS, TAG_COLORS } from "@/types/task";

interface TaskFormProps {
  task?: Task;
  onSave: (data: {
    title: string;
    dueDate?: string;
    tag?: TagType;
    priority?: PriorityType;
  }) => void;
  onCancel: () => void;
}

const tagOptions: { id: TagType; label: string }[] = [
  { id: "work", label: "Work" },
  { id: "personal", label: "Personal" },
  { id: "projects", label: "Projects" },
];

const priorityOptions: { id: PriorityType; label: string }[] = [
  { id: "high", label: "High" },
  { id: "medium", label: "Medium" },
  { id: "low", label: "Low" },
];

export function TaskForm({ task, onSave, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title ?? "");
  const [dueDate, setDueDate] = useState<Date | undefined>(
    task?.dueDate ? new Date(task.dueDate) : undefined
  );
  const [tag, setTag] = useState<TagType | undefined>(task?.tag);
  const [priority, setPriority] = useState<PriorityType | undefined>(
    task?.priority
  );
  const [calendarOpen, setCalendarOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      return;
    }
    onSave({
      title: title.trim(),
      dueDate: dueDate?.toISOString(),
      tag,
      priority,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <form
      className="space-y-4 rounded-xl border-2 border-primary/30 bg-popover p-4 shadow-lg ring-2 ring-primary/10"
      onSubmit={handleSubmit}
    >
      {/* Title Input */}
      <Input
        autoFocus
        className="border-none bg-transparent font-medium text-lg placeholder:text-muted-foreground focus-visible:ring-0"
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="What needs to be done?"
        type="text"
        value={title}
      />

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Due Date */}
        <Popover onOpenChange={setCalendarOpen} open={calendarOpen}>
          <PopoverTrigger asChild>
            <Button
              className={cn(
                "h-10 w-10 justify-center gap-2 md:h-9 md:w-auto md:px-3",
                dueDate && "text-primary"
              )}
              size="sm"
              type="button"
              variant="outline"
            >
              <CalendarIcon className="h-4 w-4" />
              <span className="hidden md:inline">
                {dueDate ? format(dueDate, "MMM d") : "Due Date"}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto p-0">
            <Calendar
              initialFocus
              mode="single"
              onSelect={(date) => {
                setDueDate(date);
                setCalendarOpen(false);
              }}
              selected={dueDate}
            />
            {dueDate && (
              <div className="border-t p-2">
                <Button
                  className="w-full"
                  onClick={() => {
                    setDueDate(undefined);
                    setCalendarOpen(false);
                  }}
                  size="sm"
                  type="button"
                  variant="ghost"
                >
                  <X className="mr-2 h-4 w-4" />
                  Clear date
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>

        {/* Tag */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className={cn(
                "h-10 w-10 justify-center gap-2 md:h-9 md:w-auto md:px-3",
                tag && TAG_COLORS[tag].text
              )}
              size="sm"
              type="button"
              variant="outline"
            >
              <Tag className="h-4 w-4" />
              <span className="hidden md:inline">
                {tag ? tagOptions.find((t) => t.id === tag)?.label : "Tag"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {tagOptions.map((option) => (
              <DropdownMenuItem
                className={tag === option.id ? "bg-accent" : ""}
                key={option.id}
                onClick={() =>
                  setTag(tag === option.id ? undefined : option.id)
                }
              >
                <span
                  className={cn(
                    "mr-2 h-3 w-3 rounded-full",
                    TAG_COLORS[option.id].dot
                  )}
                />
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Priority */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className={cn(
                "h-10 w-10 justify-center gap-2 md:h-9 md:w-auto md:px-3",
                priority && PRIORITY_COLORS[priority].text
              )}
              size="sm"
              type="button"
              variant="outline"
            >
              <Flag className="h-4 w-4" />
              <span className="hidden md:inline">
                {priority
                  ? priorityOptions.find((p) => p.id === priority)?.label
                  : "Priority"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {priorityOptions.map((option) => (
              <DropdownMenuItem
                className={priority === option.id ? "bg-accent" : ""}
                key={option.id}
                onClick={() =>
                  setPriority(priority === option.id ? undefined : option.id)
                }
              >
                <Flag
                  className={cn(
                    "mr-2 h-4 w-4",
                    PRIORITY_COLORS[option.id].text
                  )}
                />
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Submit Buttons */}
      <div className="flex justify-end gap-2">
        <Button onClick={onCancel} type="button" variant="ghost">
          Cancel
        </Button>
        <Button disabled={!title.trim()} type="submit">
          <span className="hidden md:inline">
            {task ? "Save Changes" : "Add Task"}
          </span>
          <span className="md:hidden">Save</span>
        </Button>
      </div>
    </form>
  );
}
