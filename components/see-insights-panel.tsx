"use client"

import type { Tables } from "@/lib/supabase/database.types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { calculateEAF, getEffortColorClass } from "@/lib/see-model"
import { TrendingUp, TrendingDown, AlertCircle, BarChart3 } from "lucide-react"

interface SEEInsightsPanelProps {
  tasks: Tables<"tasks">[]
}

export function SEEInsightsPanel({ tasks }: SEEInsightsPanelProps) {
  const tasksWithEffort = tasks.filter((t) => t.estimated_effort_pm)

  const totalEstimatedEffort = tasksWithEffort.reduce((sum, task) => sum + (task.estimated_effort_pm || 0), 0)

  const averageComplexity =
    tasksWithEffort.length > 0
      ? tasksWithEffort.reduce((sum, task) => sum + (task.attr_cplx || 1.0), 0) / tasksWithEffort.length
      : 1.0

  const highComplexityTasks = tasksWithEffort.filter((t) => (t.attr_cplx || 1.0) > 1.2)

  const averageEAF =
    tasksWithEffort.length > 0
      ? tasksWithEffort.reduce((sum, task) => {
          return (
            sum +
            calculateEAF({
              rely: task.attr_rely || 1.0,
              cplx: task.attr_cplx || 1.0,
              acap: task.attr_acap || 1.0,
              pcap: task.attr_pcap || 1.0,
              tool: task.attr_tool || 1.0,
              sced: task.attr_sced || 1.0,
            })
          )
        }, 0) / tasksWithEffort.length
      : 1.0

  return (
    <div className="w-80 border-l bg-muted/30">
      <ScrollArea className="h-full">
        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-1">SEE Insights</h2>
            <p className="text-xs text-muted-foreground">Real-time effort estimation analytics</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <BarChart3 className="size-4" />
                Total Effort
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {totalEstimatedEffort.toFixed(1)}
                <span className="text-sm font-normal text-muted-foreground ml-2">PM</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Across {tasksWithEffort.length} estimated tasks</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="size-4" />
                Average Complexity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageComplexity.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {averageComplexity > 1.2
                  ? "High complexity detected"
                  : averageComplexity > 1.0
                    ? "Moderate complexity"
                    : "Low complexity"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingDown className="size-4" />
                Effort Adjustment Factor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageEAF.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">Average EAF across project</p>
            </CardContent>
          </Card>

          {highComplexityTasks.length > 0 && (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2 text-orange-900">
                  <AlertCircle className="size-4" />
                  High Complexity Alert
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-orange-800 mb-3">
                  {highComplexityTasks.length} task(s) marked as high complexity
                </p>
                <div className="space-y-2">
                  {highComplexityTasks.slice(0, 3).map((task) => (
                    <div key={task.id} className="text-xs bg-white p-2 rounded border border-orange-200">
                      <div className="font-medium text-orange-900 line-clamp-1">{task.title}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-orange-700 bg-orange-100 border-orange-300">
                          CPLX: {task.attr_cplx?.toFixed(2)}
                        </Badge>
                        <span className="text-orange-600">{task.estimated_effort_pm?.toFixed(1)} PM</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Effort Distribution</h3>
            {tasksWithEffort.length > 0 ? (
              <div className="space-y-2">
                {tasksWithEffort
                  .sort((a, b) => (b.estimated_effort_pm || 0) - (a.estimated_effort_pm || 0))
                  .slice(0, 5)
                  .map((task) => (
                    <div key={task.id} className="flex items-center justify-between text-xs p-2 rounded bg-card border">
                      <span className="font-medium truncate flex-1 mr-2">{task.title}</span>
                      <Badge variant="outline" className={getEffortColorClass(task.estimated_effort_pm || 0)}>
                        {task.estimated_effort_pm?.toFixed(1)} PM
                      </Badge>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">No tasks with effort estimates yet</p>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
