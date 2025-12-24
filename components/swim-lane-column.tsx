"use client";

import type React from "react";

import { useState } from "react";
import type { Tables } from "@/lib/supabase/database.types";
import { TaskCard } from "@/components/task-card";
import { TaskDialog } from "@/components/task-dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface SwimLaneColumnProps {
  projectId: string;
  swimlane: Tables<"swimlanes">;
  tasks: Tables<"tasks">[];
  allTasks: Tables<"tasks">[];
  onTaskUpdate: (task: Tables<"tasks">) => void;
  onTaskCreate: (task: Tables<"tasks">) => void;
  onTaskDelete: (taskId: string) => void;
  onDragStart: (taskId: string, swimlaneId: string) => void;
  onDragOver: (e: React.DragEvent, swimlaneId: string) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onDragEnd: () => void;
  isDropTarget: boolean;
  isDragging: boolean;
}

export function SwimLaneColumn({
  projectId,
  swimlane,
  tasks,
  allTasks,
  onTaskUpdate,
  onTaskCreate,
  onTaskDelete,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
  isDropTarget,
  isDragging,
}: SwimLaneColumnProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Tables<"tasks"> | null>(
    null
  );

  const handleTaskClick = (task: Tables<"tasks">) => {
    setSelectedTask(task);
    setIsDialogOpen(true);
  };

  const handleCreateTask = () => {
    setSelectedTask(null);
    setIsDialogOpen(true);
  };

  const totalEffort = tasks.reduce(
    (sum, task) => sum + (task.estimated_effort_pm || 0),
    0
  );

  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <div className="space-y-0.5">
            <h3 className="font-semibold text-sm text-foreground">
              {swimlane.name}
            </h3>
            <p className="text-xs text-muted-foreground">
              {tasks.length} tasks · {totalEffort.toFixed(1)} PM
            </p>
          </div>

          <Button size="icon-sm" variant="ghost" onClick={handleCreateTask}>
            <Plus className="size-4" />
          </Button>
        </div>

        <div
          className={cn(
            "space-y-2 min-h-[200px] rounded-lg transition-all p-2 -m-2",
            isDropTarget &&
              "bg-primary/5 border-2 border-dashed border-primary",
            isDragging && !isDropTarget && "bg-muted/30"
          )}
          onDragOver={(e) => onDragOver(e, swimlane.id)}
          onDragLeave={onDragLeave}
          onDrop={onDrop}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => handleTaskClick(task)}
              onDragStart={() => onDragStart(task.id, swimlane.id)}
              onDragEnd={onDragEnd}
            />
          ))}

          {tasks.length === 0 && (
            <Card className="p-8">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {isDragging ? "Drop task here" : "No tasks yet"}
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>

      <TaskDialog
        projectId={projectId}
        swimlaneId={swimlane.id}
        task={selectedTask}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onTaskUpdate={onTaskUpdate}
        onTaskCreate={onTaskCreate}
        onTaskDelete={onTaskDelete}
      />
    </>
  );
}
