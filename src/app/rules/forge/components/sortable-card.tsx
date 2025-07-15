"use client";

import * as React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

export function SortableCard({
  id,
  children,
  className,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <Button
        variant="ghost"
        size="icon"
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 cursor-grab focus-visible:ring-ring"
        aria-label="Drag to reorder"
      >
        <GripVertical />
      </Button>
      <Card className={cn("p-4 pl-12", className)}>{children}</Card>
    </div>
  );
}
