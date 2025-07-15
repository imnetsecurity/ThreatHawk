
"use client";

import * as React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

export function SortableRuleCard({
  id,
  title,
  children,
  className,
}: {
  id: string;
  title: string;
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
        className="absolute top-3 left-2 cursor-grab focus-visible:ring-ring"
        aria-label="Drag to reorder"
      >
        <GripVertical />
      </Button>
      <Card className={cn("pl-12", className)}>
        <CardHeader>
            <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
            {children}
        </CardContent>
      </Card>
    </div>
  );
}
