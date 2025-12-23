"use client"

import type React from "react"

import { useState } from "react"
import type { Tables } from "@/lib/supabase/database.types"

interface DragState {
  draggedTaskId: string | null
  sourceSwimLaneId: string | null
  targetSwimLaneId: string | null
}

export function useTaskDragDrop() {
  const [dragState, setDragState] = useState<DragState>({
    draggedTaskId: null,
    sourceSwimLaneId: null,
    targetSwimLaneId: null,
  })

  const handleDragStart = (taskId: string, swimlaneId: string) => {
    setDragState({
      draggedTaskId: taskId,
      sourceSwimLaneId: swimlaneId,
      targetSwimLaneId: null,
    })
  }

  const handleDragOver = (e: React.DragEvent, swimlaneId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"

    setDragState((prev) => ({
      ...prev,
      targetSwimLaneId: swimlaneId,
    }))
  }

  const handleDragLeave = () => {
    setDragState((prev) => ({
      ...prev,
      targetSwimLaneId: null,
    }))
  }

  const handleDrop = async (
    e: React.DragEvent,
    targetSwimLaneId: string,
    tasks: Tables<"tasks">[],
    allTasks: Tables<"tasks">[],
    onTasksReorder: (tasks: Tables<"tasks">[]) => void,
  ) => {
    e.preventDefault()

    const { draggedTaskId, sourceSwimLaneId } = dragState

    if (!draggedTaskId) return

    // Find the dragged task
    const draggedTask = allTasks.find((t) => t.id === draggedTaskId)
    if (!draggedTask) return

    // Get tasks in target swimlane (excluding the dragged task if it's already there)
    const targetTasks = tasks.filter((t) => t.id !== draggedTaskId)

    // Calculate drop position (append to end by default)
    const dropPosition = targetTasks.length

    // Create optimistic update
    const updatedTask = {
      ...draggedTask,
      swimlane_id: targetSwimLaneId,
      position: dropPosition,
    }

    // Optimistically update UI
    const optimisticTasks = allTasks.map((t) => (t.id === draggedTaskId ? updatedTask : t))
    onTasksReorder(optimisticTasks)

    // Prepare task IDs in new order for the target swimlane
    const reorderedTaskIds = [...targetTasks.map((t) => t.id), draggedTaskId]

    // Persist to backend
    try {
      const response = await fetch("/api/tasks/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskIds: reorderedTaskIds,
          swimlaneId: targetSwimLaneId,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to reorder tasks")
      }

      const { tasks: updatedTasks } = await response.json()

      // Update with server response
      const finalTasks = allTasks.map((t) => {
        const serverTask = updatedTasks.find((ut: Tables<"tasks">) => ut.id === t.id)
        return serverTask || t
      })

      onTasksReorder(finalTasks)
    } catch (error) {
      console.error("[v0] Error persisting task reorder:", error)
      // Rollback optimistic update
      onTasksReorder(allTasks)
    }

    // Reset drag state
    setDragState({
      draggedTaskId: null,
      sourceSwimLaneId: null,
      targetSwimLaneId: null,
    })
  }

  const handleDragEnd = () => {
    setDragState({
      draggedTaskId: null,
      sourceSwimLaneId: null,
      targetSwimLaneId: null,
    })
  }

  return {
    dragState,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
  }
}
