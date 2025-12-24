"use client";

import { useState, useEffect } from "react";
import type { Tables } from "@/lib/supabase/database.types";
import { createClient } from "@/lib/supabase/client";
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
import { SEEAttributeSlider } from "@/components/see-attribute-slider";
import { TaskAssigneePicker } from "@/components/task-assignee-picker";
import { estimateEffort, SEE_DESCRIPTORS } from "@/lib/see-model";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Trash2, Save, Users } from "lucide-react";

interface TaskAssignment {
  id: string;
  assigned_at: string | null;
  users: Tables<"users"> | null;
}

interface TaskDialogProps {
  projectId: string;
  swimlaneId: string;
  task: Tables<"tasks"> | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTaskUpdate: (task: Tables<"tasks">) => void;
  onTaskCreate: (task: Tables<"tasks">) => void;
  onTaskDelete: (taskId: string) => void;
}

export function TaskDialog({
  projectId,
  swimlaneId,
  task,
  open,
  onOpenChange,
  onTaskUpdate,
  onTaskCreate,
  onTaskDelete,
}: TaskDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sizeKLOC, setSizeKLOC] = useState(1);
  const [attributes, setAttributes] = useState({
    rely: 1.0,
    cplx: 1.0,
    acap: 1.0,
    pcap: 1.0,
    tool: 1.0,
    sced: 1.0,
  });
  const [assignments, setAssignments] = useState<TaskAssignment[]>([]);
  const [pendingAssignments, setPendingAssignments] = useState<
    TaskAssignment[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setAttributes({
        rely: task.attr_rely || 1.0,
        cplx: task.attr_cplx || 1.0,
        acap: task.attr_acap || 1.0,
        pcap: task.attr_pcap || 1.0,
        tool: task.attr_tool || 1.0,
        sced: task.attr_sced || 1.0,
      });
      fetchAssignments(task.id);
    } else {
      setTitle("");
      setDescription("");
      setSizeKLOC(1);
      setAttributes({
        rely: 1.0,
        cplx: 1.0,
        acap: 1.0,
        pcap: 1.0,
        tool: 1.0,
        sced: 1.0,
      });
      setAssignments([]);
      setPendingAssignments([]);
    }
  }, [task, open]);

  const fetchAssignments = async (taskId: string) => {
    const res = await fetch(
      `/api/projects/${projectId}/tasks/${taskId}/assignments`
    );
    if (res.ok) {
      const data = await res.json();
      setAssignments(data);
    }
  };

  const estimatedEffort = estimateEffort(sizeKLOC, attributes);

  const handleSave = async () => {
    if (!title.trim()) return;

    setIsLoading(true);
    const supabase = createClient();

    try {
      if (task) {
        // Update existing task
        const { data, error } = await supabase
          .from("tasks")
          .update({
            title,
            description,
            attr_rely: attributes.rely,
            attr_cplx: attributes.cplx,
            attr_acap: attributes.acap,
            attr_pcap: attributes.pcap,
            attr_tool: attributes.tool,
            attr_sced: attributes.sced,
            estimated_effort_pm: estimatedEffort,
            updated_at: new Date().toISOString(),
          })
          .eq("id", task.id)
          .select()
          .single();

        if (error) throw error;
        if (data) onTaskUpdate(data);
      } else {
        // Create new task
        const { data, error } = await supabase
          .from("tasks")
          .insert({
            project_id: projectId,
            swimlane_id: swimlaneId,
            title,
            description,
            attr_rely: attributes.rely,
            attr_cplx: attributes.cplx,
            attr_acap: attributes.acap,
            attr_pcap: attributes.pcap,
            attr_tool: attributes.tool,
            attr_sced: attributes.sced,
            estimated_effort_pm: estimatedEffort,
            position: 0,
          })
          .select()
          .single();

        if (error) throw error;

        // Assign pending users after task creation
        if (data && pendingAssignments.length > 0) {
          const assignPromises = pendingAssignments.map((a) =>
            fetch(`/api/projects/${projectId}/tasks/${data.id}/assignments`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ user_id: a.users?.id }),
            })
          );
          await Promise.all(assignPromises);
        }

        if (data) onTaskCreate(data);
      }

      onOpenChange(false);
    } catch (error) {
      console.error("Error saving task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!task) return;

    setIsLoading(true);
    const supabase = createClient();

    try {
      const { error } = await supabase.from("tasks").delete().eq("id", task.id);

      if (error) throw error;
      onTaskDelete(task.id);
      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{task ? "Edit Task" : "Create New Task"}</DialogTitle>
          <DialogDescription>
            Define task details and SEE attributes for accurate effort
            estimation
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the task..."
              rows={3}
            />
          </div>

          {task && (
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Users className="size-4" />
                Assignees
              </Label>
              <TaskAssigneePicker
                projectId={projectId}
                taskId={task.id}
                assignments={assignments}
                onAssignmentsChange={setAssignments}
              />
            </div>
          )}

          {!task && (
            <>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Users className="size-4" />
                  Assignees
                </Label>
                <TaskAssigneePicker
                  projectId={projectId}
                  assignments={pendingAssignments}
                  onAssignmentsChange={setPendingAssignments}
                  pendingMode
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="size">Size Estimate (KLOC)</Label>
                <Input
                  id="size"
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={sizeKLOC}
                  onChange={(e) =>
                    setSizeKLOC(Number.parseFloat(e.target.value) || 1)
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Estimated size in thousands of lines of code
                </p>
              </div>
            </>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm">SEE Attributes</h4>
              <Badge variant="secondary">
                Estimated: {estimatedEffort.toFixed(2)} PM
              </Badge>
            </div>

            {Object.entries(SEE_DESCRIPTORS).map(([key, descriptor]) => (
              <SEEAttributeSlider
                key={key}
                attribute={key as keyof typeof attributes}
                value={attributes[key as keyof typeof attributes]}
                onChange={(value) =>
                  setAttributes((prev) => ({ ...prev, [key]: value }))
                }
                descriptor={descriptor}
              />
            ))}
          </div>
        </div>

        <DialogFooter className="gap-2">
          {task && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={isLoading}>
              <Trash2 className="size-4" />
              Delete
            </Button>
          )}

          <Button onClick={handleSave} disabled={!title.trim() || isLoading}>
            <Save className="size-4" />
            {task ? "Update" : "Create"} Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
