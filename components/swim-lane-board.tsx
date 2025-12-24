"use client";

import type { Tables } from "@/lib/supabase/database.types";
import { SwimLaneColumn } from "@/components/swim-lane-column";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTaskDragDrop } from "@/hooks/use-task-drag-drop";

interface SwimLaneBoardProps {
  projectId: string;
  swimlanes: Tables<"swimlanes">[];
  tasks: Tables<"tasks">[];
  onTaskUpdate: (task: Tables<"tasks">) => void;
  onTaskCreate: (task: Tables<"tasks">) => void;
  onTaskDelete: (taskId: string) => void;
  onTasksReorder?: (tasks: Tables<"tasks">[]) => void;
}

export function SwimLaneBoard({
  projectId,
  swimlanes,
  tasks,
  onTaskUpdate,
  onTaskCreate,
  onTaskDelete,
  onTasksReorder,
}: SwimLaneBoardProps) {
  const {
    dragState,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
  } = useTaskDragDrop();

  const handleTasksReorder = (updatedTasks: Tables<"tasks">[]) => {
    if (onTasksReorder) {
      onTasksReorder(updatedTasks);
    }
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {swimlanes.map((swimlane) => {
            const swimlaneTasks = tasks.filter(
              (task) => task.swimlane_id === swimlane.id
            );
            const isDropTarget = dragState.targetSwimLaneId === swimlane.id;

            return (
              <SwimLaneColumn
                key={swimlane.id}
                projectId={projectId}
                swimlane={swimlane}
                tasks={swimlaneTasks}
                allTasks={tasks}
                onTaskUpdate={onTaskUpdate}
                onTaskCreate={onTaskCreate}
                onTaskDelete={onTaskDelete}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) =>
                  handleDrop(
                    e,
                    swimlane.id,
                    swimlaneTasks,
                    tasks,
                    handleTasksReorder
                  )
                }
                onDragEnd={handleDragEnd}
                isDropTarget={isDropTarget}
                isDragging={!!dragState.draggedTaskId}
              />
            );
          })}
        </div>
      </div>
    </ScrollArea>
  );
}
