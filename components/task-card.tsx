"use client"

import type React from "react"

import type { Tables } from "@/lib/supabase/database.types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getEffortColorClass } from "@/lib/see-model"
import { Zap, GripVertical } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface TaskCardProps {
  task: Tables<"tasks">
  onClick: () => void
  onDragStart?: () => void
  onDragEnd?: () => void
}

export function TaskCard({ task, onClick, onDragStart, onDragEnd }: TaskCardProps) {
  const [isDragging, setIsDragging] = useState(false)
  const effortColorClass = task.estimated_effort_pm ? getEffortColorClass(task.estimated_effort_pm) : ""

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true)
    e.dataTransfer.effectAllowed = "move"
    // Set data for compatibility (though we use state management)
    e.dataTransfer.setData("text/plain", task.id)
    if (onDragStart) {
      onDragStart()
    }
  }

  const handleDragEnd = () => {
    setIsDragging(false)
    if (onDragEnd) {
      onDragEnd()
    }
  }

  return (
    <Card
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={cn(
        "cursor-move transition-all hover:shadow-md hover:border-primary/50 group",
        isDragging && "opacity-40 cursor-grabbing",
      )}
      onClick={(e) => {
        if (!isDragging) {
          onClick()
        }
      }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start gap-2">
          <GripVertical className="size-4 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors shrink-0 mt-0.5" />
          <CardTitle className="text-sm font-medium leading-tight line-clamp-2 flex-1">{task.title}</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {task.description && <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{task.description}</p>}

        {task.estimated_effort_pm && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={effortColorClass}>
              <Zap className="size-3 mr-1" />
              {task.estimated_effort_pm.toFixed(1)} PM
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
