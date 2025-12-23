"use client"

import type { Tables } from "@/lib/supabase/database.types"
import { Button } from "@/components/ui/button"
import { BarChart3, Calendar, TrendingUp } from "lucide-react"

interface ProjectHeaderProps {
  project: Tables<"projects">
  tasks: Tables<"tasks">[]
}

export function ProjectHeader({ project, tasks }: ProjectHeaderProps) {
  const totalTasks = tasks.length
  const totalEffort = tasks.reduce((sum, task) => sum + (task.estimated_effort_pm || 0), 0)

  return (
    <header className="border-b bg-card">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-foreground tracking-tight">{project.name}</h1>
            {project.description && <p className="text-sm text-muted-foreground max-w-2xl">{project.description}</p>}
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="size-4 text-muted-foreground" />
              <div className="text-sm">
                <span className="font-semibold text-foreground">{totalTasks}</span>
                <span className="text-muted-foreground ml-1">tasks</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <TrendingUp className="size-4 text-muted-foreground" />
              <div className="text-sm">
                <span className="font-semibold text-foreground">{totalEffort.toFixed(1)}</span>
                <span className="text-muted-foreground ml-1">PM estimated</span>
              </div>
            </div>

            <Button size="sm" variant="outline">
              <Calendar className="size-4" />
              Timeline
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
