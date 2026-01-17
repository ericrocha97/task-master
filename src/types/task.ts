import type { Timestamp } from "firebase/firestore";

export type TagType = "work" | "personal" | "projects";

export type PriorityType = "low" | "medium" | "high";

export type FilterType = "all" | "today" | "upcoming" | "completed";

export type SortType = "created" | "dueDate" | "priority" | "name";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  dueDate?: string;
  tag?: TagType;
  priority?: PriorityType;
}

// Task data as stored in Firestore (before conversion)
export interface FirestoreTask {
  title: string;
  completed: boolean;
  createdAt: Timestamp;
  dueDate?: string;
  tag?: TagType;
  priority?: PriorityType;
}

export interface TasksState {
  tasks: Task[];
  filter: FilterType;
  activeTag: TagType | null;
  editingTaskId: string | null;
  sortBy: SortType;
  searchQuery: string;
}

export const TAG_COLORS: Record<
  TagType,
  { bg: string; text: string; dot: string }
> = {
  work: { bg: "bg-love/20", text: "text-love", dot: "bg-love" },
  personal: { bg: "bg-foam/20", text: "text-foam", dot: "bg-foam" },
  projects: { bg: "bg-iris/20", text: "text-iris", dot: "bg-iris" },
};

export const PRIORITY_COLORS: Record<
  PriorityType,
  { bg: string; text: string }
> = {
  low: { bg: "bg-foam/20", text: "text-foam" },
  medium: { bg: "bg-gold/20", text: "text-gold" },
  high: { bg: "bg-love/20", text: "text-love" },
};
