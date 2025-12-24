"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/lib/supabase/database.types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, FolderOpen } from "lucide-react";

interface ProjectSelectorProps {
  currentProject: Tables<"projects"> | null;
  onProjectChange: (project: Tables<"projects">) => void;
}

export function ProjectSelector({
  currentProject,
  onProjectChange,
}: ProjectSelectorProps) {
  const [projects, setProjects] = useState<Tables<"projects">[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    const supabase = createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (authUser) {
      const { data: dbUser } = await supabase
        .from("users")
        .select("id, is_admin")
        .eq("user_auth_id", authUser.id)
        .single();

      if (dbUser) {
        setCurrentUserId(dbUser.id);
        setIsAdmin(dbUser.is_admin === true);
      }
    }
  };

  const fetchProjects = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setProjects(data);
  };

  const handleCreate = async () => {
    if (!newName.trim() || !currentUserId) return;
    setIsLoading(true);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          description: newDescription,
          creator_user_id: currentUserId,
        }),
      });

      if (res.ok) {
        const project = await res.json();
        setProjects((prev) => [project, ...prev]);
        onProjectChange(project);
        setIsCreateOpen(false);
        setNewName("");
        setNewDescription("");
      } else {
        const error = await res.json();
        console.error("Error creating project:", error.error);
        alert(error.error);
      }
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Select
        value={currentProject?.id || ""}
        onValueChange={(id) => {
          const project = projects.find((p) => p.id === id);
          if (project) onProjectChange(project);
        }}>
        <SelectTrigger className="w-[200px]">
          <FolderOpen className="size-4 mr-2" />
          <SelectValue placeholder="Select project" />
        </SelectTrigger>
        <SelectContent>
          {projects.map((project) => (
            <SelectItem key={project.id} value={project.id}>
              {project.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {isAdmin && (
        <Button
          size="icon"
          variant="outline"
          onClick={() => setIsCreateOpen(true)}>
          <Plus className="size-4" />
        </Button>
      )}

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Create a new project to organize your tasks
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="project-name">Project Name</Label>
              <Input
                id="project-name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter project name..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-desc">Description</Label>
              <Textarea
                id="project-desc"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Project description..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!newName.trim() || isLoading}>
              Create Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
