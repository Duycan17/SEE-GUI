"use client";

import type React from "react";

import type { Tables } from "@/lib/supabase/database.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getEffortColorClass } from "@/lib/see-model";
import { Zap, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface TaskAssignment {
  id: string;
  users: {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

interface TaskCardProps {
  task: Tables<"tasks"> & { task_assignments?: TaskAssignment[] };
  onClick: () => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  isInDoneSwimlane?: boolean;
}

export function TaskCard({
  task,
  onClick,
  onDragStart,
  onDragEnd,
  isInDoneSwimlane = false,
}: TaskCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const effortColorClass = task.estimated_effort_pm
    ? getEffortColorClass(task.estimated_effort_pm)
    : "";

  const handleDragStart = (e: React.DragEvent) => {
    // Prevent dragging if task is in Done swimlane
    if (isInDoneSwimlane) {
      e.preventDefault();
      return;
    }
    setIsDragging(true);
    e.dataTransfer.effectAllowed = "move";
    // Set data for compatibility (though we use state management)
    e.dataTransfer.setData("text/plain", task.id);
    if (onDragStart) {
      onDragStart();
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    if (onDragEnd) {
      onDragEnd();
    }
  };

  const getInitials = (name: string | null, email: string) => {
    if (name)
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
    return email[0].toUpperCase();
  };

  const assignments = task.task_assignments || [];

  return (
    <Card
      draggable={!isInDoneSwimlane}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={cn(
        "transition-all hover:shadow-md hover:border-primary/50 group",
        !isInDoneSwimlane && "cursor-move",
        isInDoneSwimlane && "cursor-default opacity-75",
        isDragging && "opacity-40 cursor-grabbing"
      )}
      onClick={(e) => {
        if (!isDragging) {
          onClick();
        }
      }}>
      <CardHeader className="pb-3">
        <div className="flex items-start gap-2">
          {!isInDoneSwimlane && (
            <GripVertical className="size-4 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors shrink-0 mt-0.5" />
          )}
          <CardTitle className={cn(
            "text-sm font-medium leading-tight line-clamp-2 flex-1",
            isInDoneSwimlane && "line-through text-muted-foreground"
          )}>
            {task.title}
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
            {task.description}
          </p>
        )}

        <div className="flex items-center justify-between gap-2">
          {task.estimated_effort_pm && (
            <Badge variant="outline" className={effortColorClass}>
              <Zap className="size-3 mr-1" />
              {task.estimated_effort_pm.toFixed(1)} PM
            </Badge>
          )}

          {assignments.length > 0 && (
            <div className="flex -space-x-2">
              {assignments.slice(0, 3).map((assignment) => (
                <Avatar
                  key={assignment.id}
                  className="size-6 border-2 border-background">
                  <AvatarImage
                    src={assignment.users?.avatar_url || undefined}
                  />
                  <AvatarFallback className="text-[10px]">
                    {getInitials(
                      assignment.users?.full_name || null,
                      assignment.users?.email || ""
                    )}
                  </AvatarFallback>
                </Avatar>
              ))}
              {assignments.length > 3 && (
                <div className="size-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                  <span className="text-[10px] text-muted-foreground">
                    +{assignments.length - 3}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
