"use client";

import { useState } from "react";
import type { Tables } from "@/lib/supabase/database.types";
import type { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/user-menu";
import { ProjectSelector } from "@/components/project-selector";
import { MemberManager } from "@/components/member-manager";
import { BarChart3, Calendar, TrendingUp, Users } from "lucide-react";

interface ProjectHeaderProps {
  project: Tables<"projects">;
  tasks: Tables<"tasks">[];
  user: User;
  onProjectChange?: (project: Tables<"projects">) => void;
}

export function ProjectHeader({
  project,
  tasks,
  user,
  onProjectChange,
}: ProjectHeaderProps) {
  const [isMemberManagerOpen, setIsMemberManagerOpen] = useState(false);

  const totalTasks = tasks.length;
  const totalEffort = tasks.reduce(
    (sum, task) => sum + (task.estimated_effort_pm || 0),
    0
  );

  return (
    <header className="border-b bg-card">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {onProjectChange && (
              <ProjectSelector
                currentProject={project}
                onProjectChange={onProjectChange}
              />
            )}
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                {project.name}
              </h1>
              {project.description && (
                <p className="text-sm text-muted-foreground max-w-2xl">
                  {project.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="size-4 text-muted-foreground" />
              <div className="text-sm">
                <span className="font-semibold text-foreground">
                  {totalTasks}
                </span>
                <span className="text-muted-foreground ml-1">tasks</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <TrendingUp className="size-4 text-muted-foreground" />
              <div className="text-sm">
                <span className="font-semibold text-foreground">
                  {totalEffort.toFixed(1)}
                </span>
                <span className="text-muted-foreground ml-1">PM estimated</span>
              </div>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsMemberManagerOpen(true)}>
              <Users className="size-4" />
              Members
            </Button>

            <Button size="sm" variant="outline">
              <Calendar className="size-4" />
              Timeline
            </Button>

            <UserMenu user={user} />
          </div>
        </div>
      </div>

      <MemberManager
        projectId={project.id}
        open={isMemberManagerOpen}
        onOpenChange={setIsMemberManagerOpen}
      />
    </header>
  );
}
