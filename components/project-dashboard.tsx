"use client";

import { useState, useEffect } from "react";
import type { Tables } from "@/lib/supabase/database.types";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { SwimLaneBoard } from "@/components/swim-lane-board";
import { ProjectHeader } from "@/components/project-header";
import { SEEInsightsPanel } from "@/components/see-insights-panel";
import { TeamView } from "@/components/views/team-view";
import { ProjectSelector } from "@/components/project-selector";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  LayoutDashboard,
  Settings,
  Users,
  Menu,
  ChevronLeft,
  ChevronRight,
  PieChart
} from "lucide-react";
import { UserMenu } from "@/components/user-menu";
import { cn } from "@/lib/utils";

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

type DashboardView = "board" | "team" | "reports" | "settings";

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState<DashboardView>("board");

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

  // Sidebar Nav Item Helper
  const NavItem = ({ view, icon: Icon, label }: { view: DashboardView; icon: any; label: string }) => (
    <Button
      variant="ghost"
      onClick={() => setCurrentView(view)}
      className={cn(
        "w-full justify-start hover:text-white hover:bg-white/10 cursor-pointer transition-colors relative",
        currentView === view ? "bg-white/10 text-white" : "text-indigo-200"
      )}
    >
      {currentView === view && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-400 rounded-r-full" />
      )}
      <Icon className="w-5 h-5 shrink-0" />
      {isSidebarOpen && <span className="ml-3 font-medium">{label}</span>}
    </Button>
  );

  // Không có project nào
  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center space-y-4 max-w-md p-8 bg-white rounded-xl shadow-lg border border-slate-100">
          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <LayoutDashboard className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            Welcome to Velociti AI
          </h2>
          <p className="text-slate-500">
            Create your first project to start managing your workflow with AI superpowers.
          </p>
          <div className="pt-4">
            <ProjectSelector
              currentProject={null}
              onProjectChange={handleProjectChange}
            />
          </div>
        </div>
      </div>
    );
  }

  // Loading ban đầu - full screen loader
  if (isInitialLoad) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-white rounded-full"></div>
            </div>
          </div>
          <p className="text-sm font-medium text-slate-500 animate-pulse">Initializing Interface...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900">
      {/* Sidebar - Jira style */}
      <aside
        className={cn(
          "bg-indigo-950 text-white flex flex-col transition-all duration-300 relative z-20 shrink-0 shadow-xl",
          isSidebarOpen ? "w-64" : "w-16"
        )}
      >
        <div className="h-16 flex items-center px-4 border-b border-white/10 shrink-0 bg-indigo-950/50 backdrop-blur-sm">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 shadow-lg">
            <span className="font-bold text-lg text-white">V</span>
          </div>
          {isSidebarOpen && <span className="ml-3 font-bold truncate">Velociti AI</span>}
        </div>

        <div className="flex-1 py-6 overflow-y-auto overflow-x-hidden scrollbar-none">
          <nav className="space-y-1.5 px-3">
            <NavItem view="board" icon={LayoutDashboard} label="Board" />
            <NavItem view="team" icon={Users} label="Team Members" />
            <NavItem view="reports" icon={PieChart} label="Reports" />
          </nav>

          <div className="mt-8 px-4">
            {isSidebarOpen && <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-3 px-2">Settings</p>}
            <nav className="space-y-1.5">
              <Button variant="ghost" className="w-full justify-start text-indigo-200 hover:text-white hover:bg-white/10 px-2 cursor-pointer">
                <Settings className="w-5 h-5 shrink-0" />
                {isSidebarOpen && <span className="ml-3">System</span>}
              </Button>
              <Button variant="ghost" className="w-full justify-start text-indigo-200 hover:text-white hover:bg-white/10 px-2 cursor-pointer">
                <CreditCard className="w-5 h-5 shrink-0" />
                {isSidebarOpen && <span className="ml-3">Billing</span>}
              </Button>
            </nav>
          </div>
        </div>

        <div className="p-4 border-t border-white/10 shrink-0 bg-indigo-950/50">
          {isSidebarOpen ? (
            <div className="flex items-center gap-3">
              <UserMenu user={user} showName={true} side="top" />
            </div>
          ) : (
            <div className="flex justify-center">
              <UserMenu user={user} showName={false} side="right" />
            </div>
          )}
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-3 top-20 bg-white border border-slate-200 rounded-full p-1 text-slate-500 shadow-sm hover:text-indigo-600 transition-colors z-30 cursor-pointer hover:shadow-md"
        >
          {isSidebarOpen ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        </button>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50">
        <ProjectHeader
          project={project}
          tasks={tasks}
          user={user}
          onProjectChange={handleProjectChange}
        />

        <div className="flex flex-1 overflow-hidden relative">

          {/* VIEW: BOARD */}
          {currentView === "board" && (
            <div className="flex-1 overflow-y-auto overflow-x-auto bg-slate-50/50">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground animate-pulse">Loading Board...</p>
                </div>
              ) : (
                <div className="h-full p-6">
                  <SwimLaneBoard
                    projectId={project.id}
                    swimlanes={swimlanes}
                    tasks={tasks}
                    onTaskUpdate={handleTaskUpdate}
                    onTaskCreate={handleTaskCreate}
                    onTaskDelete={handleTaskDelete}
                    onTasksReorder={handleTasksReorder}
                  />
                </div>
              )}
            </div>
          )}

          {/* VIEW: TEAM */}
          {currentView === "team" && (
            <div className="flex-1 overflow-y-auto bg-slate-50">
              <TeamView projectId={project.id} />
            </div>
          )}

          {/* VIEW: REPORTS */}
          {currentView === "reports" && (
            <div className="flex-1 overflow-y-auto bg-slate-50 p-8">
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-2 text-slate-900">Project Analytics</h2>
                  <p className="text-slate-600">Real-time insights and effort estimation metrics</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                  <SEEInsightsPanel tasks={tasks} />
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
