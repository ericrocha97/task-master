import { useCallback, useMemo } from "react";
import type {
  FilterType,
  PriorityType,
  SortType,
  TagType,
  Task,
} from "@/types/task";
import { useLocalStorage } from "./use-local-storage";

const STORAGE_KEY = "taskmaster-tasks";

function isToday(date: Date, today: Date): boolean {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.getTime() === today.getTime();
}

function isUpcoming(date: Date, tomorrow: Date): boolean {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.getTime() >= tomorrow.getTime();
}

function filterByStatus(
  tasks: Task[],
  filter: FilterType,
  today: Date,
  tomorrow: Date
): Task[] {
  switch (filter) {
    case "today": {
      return tasks.filter((task) => {
        if (!task.dueDate) {
          return false;
        }
        return isToday(new Date(task.dueDate), today) && !task.completed;
      });
    }
    case "upcoming": {
      return tasks.filter((task) => {
        if (!task.dueDate) {
          return false;
        }
        return isUpcoming(new Date(task.dueDate), tomorrow) && !task.completed;
      });
    }
    case "completed": {
      return tasks.filter((task) => task.completed);
    }
    default: {
      return tasks.filter((task) => !task.completed);
    }
  }
}

function sortTasks(tasks: Task[], sortBy: SortType): Task[] {
  return [...tasks].sort((a, b) => {
    switch (sortBy) {
      case "name": {
        return a.title.localeCompare(b.title);
      }
      case "dueDate": {
        if (!(a.dueDate || b.dueDate)) {
          return 0;
        }
        if (!a.dueDate) {
          return 1;
        }
        if (!b.dueDate) {
          return -1;
        }
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      case "priority": {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        const aPriority = a.priority ? priorityOrder[a.priority] : 3;
        const bPriority = b.priority ? priorityOrder[b.priority] : 3;
        return aPriority - bPriority;
      }
      default: {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
    }
  });
}

export function useTasks() {
  const [tasks, setTasks] = useLocalStorage<Task[]>(STORAGE_KEY, []);

  const addTask = useCallback(
    (
      title: string,
      options?: { dueDate?: string; tag?: TagType; priority?: PriorityType }
    ) => {
      const newTask: Task = {
        id: crypto.randomUUID(),
        title,
        completed: false,
        createdAt: new Date().toISOString(),
        ...options,
      };
      setTasks((prev) => [newTask, ...prev]);
      return newTask;
    },
    [setTasks]
  );

  const updateTask = useCallback(
    (id: string, updates: Partial<Omit<Task, "id" | "createdAt">>) => {
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
      );
    },
    [setTasks]
  );

  const deleteTask = useCallback(
    (id: string) => {
      setTasks((prev) => prev.filter((task) => task.id !== id));
    },
    [setTasks]
  );

  const toggleComplete = useCallback(
    (id: string) => {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, completed: !task.completed } : task
        )
      );
    },
    [setTasks]
  );

  const getFilteredTasks = useCallback(
    (
      filter: FilterType,
      activeTag: TagType | null,
      searchQuery: string,
      sortBy: SortType
    ): Task[] => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      let filtered = [...tasks];

      // Apply tag filter
      if (activeTag) {
        filtered = filtered.filter((task) => task.tag === activeTag);
      }

      // Apply search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter((task) =>
          task.title.toLowerCase().includes(query)
        );
      }

      // Apply status filter
      filtered = filterByStatus(filtered, filter, today, tomorrow);

      // Apply sorting
      return sortTasks(filtered, sortBy);
    },
    [tasks]
  );

  const counts = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const pending = tasks.filter((t) => !t.completed);
    const completed = tasks.filter((t) => t.completed);

    const todayTasks = pending.filter((task) => {
      if (!task.dueDate) {
        return false;
      }
      return isToday(new Date(task.dueDate), today);
    });

    const upcomingTasks = pending.filter((task) => {
      if (!task.dueDate) {
        return false;
      }
      return isUpcoming(new Date(task.dueDate), tomorrow);
    });

    return {
      all: pending.length,
      today: todayTasks.length,
      upcoming: upcomingTasks.length,
      completed: completed.length,
      work: tasks.filter((t) => t.tag === "work" && !t.completed).length,
      personal: tasks.filter((t) => t.tag === "personal" && !t.completed)
        .length,
      projects: tasks.filter((t) => t.tag === "projects" && !t.completed)
        .length,
    };
  }, [tasks]);

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    getFilteredTasks,
    counts,
  };
}
