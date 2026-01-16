import { ClipboardList } from "lucide-react";
import type {
  FilterType,
  PriorityType,
  SortType,
  TagType,
  Task,
} from "@/types/task";
import { TaskForm } from "./task-form";
import { TaskItem } from "./task-item";

function getEmptyMessage(searchQuery: string, filter: FilterType): string {
  if (searchQuery) {
    return "Try adjusting your search query";
  }
  if (filter === "completed") {
    return "Complete some tasks to see them here";
  }
  return "Create a new task to get started";
}

interface TaskListProps {
  tasks: Task[];
  filter: FilterType;
  activeTag: TagType | null;
  sortBy: SortType;
  searchQuery: string;
  editingTaskId: string | null;
  isCreating: boolean;
  getFilteredTasks: (
    filter: FilterType,
    activeTag: TagType | null,
    searchQuery: string,
    sortBy: SortType
  ) => Task[];
  onToggleComplete: (id: string) => void;
  onEdit: (id: string | null) => void;
  onDelete: (id: string) => void;
  onUpdate: (
    id: string,
    data: {
      title: string;
      dueDate?: string;
      tag?: TagType;
      priority?: PriorityType;
    }
  ) => void;
  onCreate: (data: {
    title: string;
    dueDate?: string;
    tag?: TagType;
    priority?: PriorityType;
  }) => void;
  onCancelCreate: () => void;
}

export function TaskList({
  filter,
  activeTag,
  sortBy,
  searchQuery,
  editingTaskId,
  isCreating,
  getFilteredTasks,
  onToggleComplete,
  onEdit,
  onDelete,
  onUpdate,
  onCreate,
  onCancelCreate,
}: TaskListProps) {
  const filteredTasks = getFilteredTasks(
    filter,
    activeTag,
    searchQuery,
    sortBy
  );
  const isAnyEditing = editingTaskId !== null || isCreating;

  return (
    <div className="space-y-3 p-4 md:p-6">
      {/* New Task Form */}
      {isCreating && <TaskForm onCancel={onCancelCreate} onSave={onCreate} />}

      {/* Task Items */}
      {filteredTasks.map((task) => (
        <div key={task.id}>
          {editingTaskId === task.id ? (
            <TaskForm
              onCancel={() => onEdit(null)}
              onSave={(data) => {
                onUpdate(task.id, data);
                onEdit(null);
              }}
              task={task}
            />
          ) : (
            <TaskItem
              isEditing={editingTaskId === task.id}
              isOtherEditing={isAnyEditing && editingTaskId !== task.id}
              onDelete={onDelete}
              onEdit={onEdit}
              onToggleComplete={onToggleComplete}
              task={task}
            />
          )}
        </div>
      ))}

      {/* Empty State */}
      {filteredTasks.length === 0 && !isCreating && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 rounded-full bg-muted p-4">
            <ClipboardList className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-medium text-foreground text-lg">
            No tasks found
          </h3>
          <p className="mt-1 text-muted-foreground text-sm">
            {getEmptyMessage(searchQuery, filter)}
          </p>
        </div>
      )}
    </div>
  );
}
