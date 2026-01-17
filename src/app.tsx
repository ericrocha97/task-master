import { useState } from "react";
import { Toaster } from "sonner";
import "./app.css";
import { AuthGuard } from "@/components/auth/auth-guard";
import { Header } from "@/components/layout/header";
import { MainLayout } from "@/components/layout/main-layout";
import { Sidebar } from "@/components/layout/sidebar";
import { TaskList } from "@/components/tasks/task-list";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/auth-context";
import { useTasks } from "@/hooks/use-tasks";
import type { FilterType, PriorityType, SortType, TagType } from "@/types/task";

function TaskApp() {
  const {
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    getFilteredTasks,
    counts,
  } = useTasks();

  const [filter, setFilter] = useState<FilterType>("all");
  const [activeTag, setActiveTag] = useState<TagType | null>(null);
  const [sortBy, setSortBy] = useState<SortType>("created");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const filteredTasks = getFilteredTasks(
    filter,
    activeTag,
    searchQuery,
    sortBy
  );

  const handleNewTask = () => {
    setEditingTaskId(null);
    setIsCreating(true);
  };

  const handleCreate = (data: {
    title: string;
    dueDate?: string;
    tag?: TagType;
    priority?: PriorityType;
  }) => {
    addTask(data.title, {
      dueDate: data.dueDate,
      tag: data.tag,
      priority: data.priority,
    });
    setIsCreating(false);
  };

  const handleUpdate = (
    id: string,
    data: {
      title: string;
      dueDate?: string;
      tag?: TagType;
      priority?: PriorityType;
    }
  ) => {
    updateTask(id, data);
    setEditingTaskId(null);
  };

  const handleEdit = (id: string | null) => {
    setIsCreating(false);
    setEditingTaskId(id);
  };

  return (
    <MainLayout
      sidebar={
        <Sidebar
          activeTag={activeTag}
          counts={counts}
          filter={filter}
          onFilterChange={setFilter}
          onNewTask={handleNewTask}
          onTagChange={setActiveTag}
        />
      }
    >
      <div className="flex h-screen flex-col">
        <Header
          activeTag={activeTag}
          filter={filter}
          onSearchChange={setSearchQuery}
          onSortChange={setSortBy}
          remainingCount={filteredTasks.length}
          searchQuery={searchQuery}
          sortBy={sortBy}
        />
        <div className="flex-1 overflow-auto">
          <TaskList
            activeTag={activeTag}
            editingTaskId={editingTaskId}
            filter={filter}
            getFilteredTasks={getFilteredTasks}
            isCreating={isCreating}
            onCancelCreate={() => setIsCreating(false)}
            onCreate={handleCreate}
            onDelete={deleteTask}
            onEdit={handleEdit}
            onToggleComplete={toggleComplete}
            onUpdate={handleUpdate}
            searchQuery={searchQuery}
            sortBy={sortBy}
            tasks={filteredTasks}
          />
        </div>
      </div>
    </MainLayout>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="taskmaster-theme">
      <AuthProvider>
        <AuthGuard>
          <TaskApp />
        </AuthGuard>
        <Toaster position="bottom-right" richColors />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
