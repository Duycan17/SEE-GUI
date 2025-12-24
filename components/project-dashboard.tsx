"use client";

import { useState, useEffect } from "react";
import type { Tables } from "@/lib/supabase/database.types";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { SwimLaneBoard } from "@/components/swim-lane-board";
import { ProjectHeader } from "@/components/project-header";
import { SEEInsightsPanel } from "@/components/see-insights-panel";
import { ProjectSelector } from "@/components/project-selector";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface TaskWithAssignments extends Tables<"tasks"> {
  task_assignments?: {
    id: string;
    users: {
      id: string;
      email: string;
      full_name: string | null;
      avatar_url: string | null;
    } | null;
  }[];
}

interface ProjectDashboardProps {
  project: Tables<"projects"> | null;
  initialSwimlanes: Tables<"swimlanes">[];
  initialTasks: TaskWithAssignments[];
  user: User;
}

export function ProjectDashboard({
  project: initialProject,
  initialSwimlanes,
  initialTasks,
  user,
}: ProjectDashboardProps) {
  const [project, setProject] = useState(initialProject);
  const [swimlanes, setSwimlanes] = useState(initialSwimlanes);
  const [tasks, setTasks] = useState<TaskWithAssignments[]>(initialTasks);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Load data khi mới vào project
  useEffect(() => {
    if (initialProject) {
      loadProjectData(initialProject.id).then(() => {
        setIsInitialLoad(false);
      });
    } else {
      setIsLoading(false);
      setIsInitialLoad(false);
    }
  }, []);

  const loadProjectData = async (projectId: string) => {
    setIsLoading(true);
    try {
      const supabase = createClient();

      const [swimlanesRes, tasksRes] = await Promise.all([
        supabase
          .from("swimlanes")
          .select("*")
          .eq("project_id", projectId)
          .order("position"),
        fetch(`/api/projects/${projectId}/tasks`).then((res) => res.json()),
      ]);

      setSwimlanes(swimlanesRes.data || []);
      setTasks(tasksRes || []);
    } catch (error) {
      console.error("Error loading project data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProjectChange = async (newProject: Tables<"projects">) => {
    setProject(newProject);
    await loadProjectData(newProject.id);
  };

  const handleTaskUpdate = (updatedTask: Tables<"tasks">) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? { ...t, ...updatedTask } : t))
    );
  };

  const handleTaskCreate = (newTask: Tables<"tasks">) => {
    setTasks((prev) => [...prev, newTask as TaskWithAssignments]);
  };

  const handleTaskDelete = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const handleTasksReorder = (reorderedTasks: Tables<"tasks">[]) => {
    setTasks(reorderedTasks as TaskWithAssignments[]);
  };

  // Không có project nào
  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
            Welcome! Create your first project
          </h2>
          <p className="text-sm text-muted-foreground">
            Start by creating a project to organize your tasks
          </p>
          <ProjectSelector
            currentProject={null}
            onProjectChange={handleProjectChange}
          />
        </div>
      </div>
    );
  }

  // Loading ban đầu - full screen loader
  if (isInitialLoad) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading project...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <ProjectHeader
        project={project}
        tasks={tasks}
        user={user}
        onProjectChange={handleProjectChange}
      />

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          ) : (
            <SwimLaneBoard
              projectId={project.id}
              swimlanes={swimlanes}
              tasks={tasks}
              onTaskUpdate={handleTaskUpdate}
              onTaskCreate={handleTaskCreate}
              onTaskDelete={handleTaskDelete}
              onTasksReorder={handleTasksReorder}
            />
          )}
        </div>

        <SEEInsightsPanel tasks={tasks} />
      </div>
    </div>
  );
}
