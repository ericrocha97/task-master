import {
  Calendar,
  CheckCircle2,
  CheckSquare,
  Clock,
  ListTodo,
  Plus,
  Sun,
} from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { FilterType, TagType } from "@/types/task";
import { TAG_COLORS } from "@/types/task";

interface SidebarProps {
  filter: FilterType;
  activeTag: TagType | null;
  onFilterChange: (filter: FilterType) => void;
  onTagChange: (tag: TagType | null) => void;
  onNewTask: () => void;
  counts: {
    all: number;
    today: number;
    upcoming: number;
    completed: number;
    work: number;
    personal: number;
    projects: number;
  };
}

const navItems: { id: FilterType; label: string; icon: typeof ListTodo }[] = [
  { id: "all", label: "All Tasks", icon: ListTodo },
  { id: "today", label: "Today", icon: Sun },
  { id: "upcoming", label: "Upcoming", icon: Calendar },
  { id: "completed", label: "Completed", icon: CheckCircle2 },
];

const tags: { id: TagType; label: string }[] = [
  { id: "work", label: "Work" },
  { id: "personal", label: "Personal" },
  { id: "projects", label: "Projects" },
];

export function Sidebar({
  filter,
  activeTag,
  onFilterChange,
  onTagChange,
  onNewTask,
  counts,
}: SidebarProps) {
  const handleNavClick = (navFilter: FilterType) => {
    onTagChange(null);
    onFilterChange(navFilter);
  };

  const handleTagClick = (tag: TagType) => {
    if (activeTag === tag) {
      onTagChange(null);
    } else {
      onTagChange(tag);
      onFilterChange("all");
    }
  };

  return (
    <TooltipProvider delayDuration={0}>
      <aside className="flex w-20 flex-col border-sidebar-border border-r bg-sidebar md:w-64">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-sidebar-border border-b px-4 md:px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <CheckSquare className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="hidden font-semibold text-sidebar-foreground text-xl md:block">
            TaskMaster
          </span>
        </div>

        {/* New Task Button */}
        <div className="p-3 md:p-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="w-full justify-center gap-2 md:justify-start"
                onClick={onNewTask}
              >
                <Plus className="h-4 w-4" />
                <span className="hidden md:inline">New Task</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="md:hidden" side="right">
              New Task
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 md:px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const count = counts[item.id];
            const isActive = filter === item.id && !activeTag;

            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <button
                    className={cn(
                      "relative flex w-full items-center justify-center gap-3 rounded-lg px-3 py-2 font-medium text-sm transition-colors md:justify-start",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                    )}
                    onClick={() => handleNavClick(item.id)}
                    type="button"
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span className="hidden flex-1 text-left md:block">
                      {item.label}
                    </span>
                    {count > 0 && (
                      <span
                        className={cn(
                          "hidden rounded-full px-2 py-0.5 text-xs md:block",
                          isActive
                            ? "bg-primary/20 text-primary"
                            : "bg-sidebar-accent text-sidebar-foreground/60"
                        )}
                      >
                        {count}
                      </span>
                    )}
                    {/* Mobile active indicator */}
                    {isActive && (
                      <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary md:hidden" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent className="md:hidden" side="right">
                  {item.label} {count > 0 && `(${count})`}
                </TooltipContent>
              </Tooltip>
            );
          })}

          {/* Tags Section */}
          <div className="pt-6">
            <div className="mb-2 hidden px-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider md:block">
              Tags
            </div>
            <div className="hidden h-px bg-sidebar-border md:hidden" />
            <div className="flex flex-col items-center gap-2 md:items-stretch md:gap-1">
              {tags.map((tag) => {
                const isActive = activeTag === tag.id;
                const count = counts[tag.id];
                const colors = TAG_COLORS[tag.id];

                return (
                  <Tooltip key={tag.id}>
                    <TooltipTrigger asChild>
                      <button
                        className={cn(
                          "relative flex w-full items-center justify-center gap-3 rounded-lg px-3 py-2 font-medium text-sm transition-colors md:justify-start",
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                        )}
                        onClick={() => handleTagClick(tag.id)}
                        type="button"
                      >
                        <span
                          className={cn(
                            "h-3 w-3 shrink-0 rounded-full",
                            colors.dot
                          )}
                        />
                        <span className="hidden flex-1 text-left md:block">
                          {tag.label}
                        </span>
                        {count > 0 && (
                          <span className="hidden rounded-full bg-sidebar-accent px-2 py-0.5 text-sidebar-foreground/60 text-xs md:block">
                            {count}
                          </span>
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="md:hidden" side="right">
                      {tag.label} {count > 0 && `(${count})`}
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Footer - User Profile / Theme Toggle */}
        <div className="border-sidebar-border border-t p-3 md:p-4">
          <div className="flex flex-col-reverse items-center gap-3 md:flex-row md:justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 font-medium text-primary text-sm">
                  <Clock className="h-4 w-4" />
                </div>
                <span className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-sidebar bg-foam" />
              </div>
              <div className="hidden md:block">
                <div className="font-medium text-sidebar-foreground text-sm">
                  User
                </div>
                <div className="text-muted-foreground text-xs">
                  user@email.com
                </div>
              </div>
            </div>
            <ModeToggle />
          </div>
        </div>
      </aside>
    </TooltipProvider>
  );
}
