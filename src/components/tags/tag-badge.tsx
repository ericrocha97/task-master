import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { TagType } from "@/types/task";
import { TAG_COLORS } from "@/types/task";

interface TagBadgeProps {
  tag: TagType;
  className?: string;
}

const tagLabels: Record<TagType, string> = {
  work: "Work",
  personal: "Personal",
  projects: "Projects",
};

export function TagBadge({ tag, className }: TagBadgeProps) {
  const colors = TAG_COLORS[tag];

  return (
    <Badge
      className={cn(colors.bg, colors.text, "font-medium", className)}
      variant="secondary"
    >
      {tagLabels[tag]}
    </Badge>
  );
}
