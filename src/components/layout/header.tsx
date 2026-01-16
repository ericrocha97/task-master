import {
  ArrowDownAZ,
  ArrowUpDown,
  Calendar,
  Clock,
  Flag,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import type { FilterType, SortType, TagType } from "@/types/task";

interface HeaderProps {
  filter: FilterType;
  activeTag: TagType | null;
  sortBy: SortType;
  searchQuery: string;
  remainingCount: number;
  onSortChange: (sort: SortType) => void;
  onSearchChange: (query: string) => void;
}

const filterLabels: Record<FilterType, string> = {
  all: "All Tasks",
  today: "Today",
  upcoming: "Upcoming",
  completed: "Completed",
};

const tagLabels: Record<TagType, string> = {
  work: "Work",
  personal: "Personal",
  projects: "Projects",
};

const sortOptions: { id: SortType; label: string; icon: typeof Clock }[] = [
  { id: "created", label: "Date Created", icon: Clock },
  { id: "dueDate", label: "Due Date", icon: Calendar },
  { id: "priority", label: "Priority", icon: Flag },
  { id: "name", label: "Name", icon: ArrowDownAZ },
];

export function Header({
  filter,
  activeTag,
  sortBy,
  searchQuery,
  remainingCount,
  onSortChange,
  onSearchChange,
}: HeaderProps) {
  const title = activeTag ? tagLabels[activeTag] : filterLabels[filter];
  const currentSort = sortOptions.find((s) => s.id === sortBy);

  return (
    <header className="border-border border-b bg-card px-4 py-4 md:px-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Title and count */}
        <div>
          <h1 className="font-bold text-2xl text-foreground">{title}</h1>
          <p className="text-muted-foreground text-sm">
            {remainingCount} {remainingCount === 1 ? "task" : "tasks"}{" "}
            {filter === "completed" ? "completed" : "remaining"}
          </p>
        </div>

        {/* Search and Sort */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative flex-1 md:w-64 md:flex-none">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search tasks..."
              type="text"
              value={searchQuery}
            />
          </div>

          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="shrink-0" size="icon" variant="outline">
                <ArrowUpDown className="h-4 w-4" />
                <span className="sr-only">Sort by {currentSort?.label}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {sortOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <DropdownMenuItem
                    className={sortBy === option.id ? "bg-accent" : ""}
                    key={option.id}
                    onClick={() => onSortChange(option.id)}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {option.label}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
