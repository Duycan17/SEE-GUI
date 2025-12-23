"use client"

import { useState } from "react"
import type { Tables } from "@/lib/supabase/database.types"
import { SwimLaneBoard } from "@/components/swim-lane-board"
import { ProjectHeader } from "@/components/project-header"
import { SEEInsightsPanel } from "@/components/see-insights-panel"

interface ProjectDashboardProps {
  project: Tables<"projects"> | null
  initialSwimlanes: Tables<"swimlanes">[]
  initialTasks: Tables<"tasks">[]
}

export function ProjectDashboard({ project, initialSwimlanes, initialTasks }: ProjectDashboardProps) {
  const [tasks, setTasks] = useState(initialTasks)

  const handleTaskUpdate = (updatedTask: Tables<"tasks">) => {
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)))
  }

  const handleTaskCreate = (newTask: Tables<"tasks">) => {
    setTasks((prev) => [...prev, newTask])
  }

  const handleTaskDelete = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId))
  }

  const handleTasksReorder = (reorderedTasks: Tables<"tasks">[]) => {
    setTasks(reorderedTasks)
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground">No project found</h2>
          <p className="text-sm text-muted-foreground mt-2">Please create a project to get started</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen">
      <ProjectHeader project={project} tasks={tasks} />

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto">
          <SwimLaneBoard
            projectId={project.id}
            swimlanes={initialSwimlanes}
            tasks={tasks}
            onTaskUpdate={handleTaskUpdate}
            onTaskCreate={handleTaskCreate}
            onTaskDelete={handleTaskDelete}
            onTasksReorder={handleTasksReorder}
          />
        </div>

        <SEEInsightsPanel tasks={tasks} />
      </div>
    </div>
  )
}
