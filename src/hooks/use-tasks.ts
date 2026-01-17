import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-context";
import { db } from "@/lib/firebase";
import type {
  FilterType,
  FirestoreTask,
  PriorityType,
  SortType,
  TagType,
  Task,
} from "@/types/task";

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
        return b.createdAt.getTime() - a.createdAt.getTime();
      }
    }
  });
}

export function useTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Real-time listener for user's tasks
  useEffect(() => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    const tasksRef = collection(db, "users", user.uid, "tasks");
    const q = query(tasksRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const tasksData = snapshot.docs.map((docSnapshot) => {
          const data = docSnapshot.data() as FirestoreTask;
          return {
            id: docSnapshot.id,
            title: data.title,
            completed: data.completed,
            createdAt: data.createdAt?.toDate() ?? new Date(),
            dueDate: data.dueDate,
            tag: data.tag,
            priority: data.priority,
          } as Task;
        });

        setTasks(tasksData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching tasks:", error);
        toast.error("Erro ao carregar tarefas");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const addTask = useCallback(
    async (
      title: string,
      options?: { dueDate?: string; tag?: TagType; priority?: PriorityType }
    ) => {
      if (!user) {
        throw new Error("User not authenticated");
      }

      try {
        const tasksRef = collection(db, "users", user.uid, "tasks");
        const newTask = {
          title,
          completed: false,
          createdAt: serverTimestamp(),
          ...options,
        };

        await addDoc(tasksRef, newTask);
        toast.success("Tarefa criada");
      } catch (error) {
        console.error("Error adding task:", error);
        toast.error("Erro ao criar tarefa");
        throw error;
      }
    },
    [user]
  );

  const updateTask = useCallback(
    async (id: string, updates: Partial<Omit<Task, "id" | "createdAt">>) => {
      if (!user) {
        throw new Error("User not authenticated");
      }

      try {
        const taskRef = doc(db, "users", user.uid, "tasks", id);
        await updateDoc(taskRef, updates);
        toast.success("Tarefa atualizada");
      } catch (error) {
        console.error("Error updating task:", error);
        toast.error("Erro ao atualizar tarefa");
        throw error;
      }
    },
    [user]
  );

  const deleteTask = useCallback(
    async (id: string) => {
      if (!user) {
        throw new Error("User not authenticated");
      }

      try {
        const taskRef = doc(db, "users", user.uid, "tasks", id);
        await deleteDoc(taskRef);
        toast.success("Tarefa excluída");
      } catch (error) {
        console.error("Error deleting task:", error);
        toast.error("Erro ao excluir tarefa");
        throw error;
      }
    },
    [user]
  );

  const toggleComplete = useCallback(
    async (id: string) => {
      if (!user) {
        throw new Error("User not authenticated");
      }

      const task = tasks.find((t) => t.id === id);
      if (task) {
        try {
          const taskRef = doc(db, "users", user.uid, "tasks", id);
          await updateDoc(taskRef, { completed: !task.completed });
        } catch (error) {
          console.error("Error toggling task:", error);
          toast.error("Erro ao atualizar tarefa");
          throw error;
        }
      }
    },
    [user, tasks]
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
        const queryLower = searchQuery.toLowerCase();
        filtered = filtered.filter((task) =>
          task.title.toLowerCase().includes(queryLower)
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
    loading,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    getFilteredTasks,
    counts,
  };
}
