"use client";

import { useState, useEffect } from "react";
import type { Tables } from "@/lib/supabase/database.types";
import { createClient } from "@/lib/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { TaskAssigneePicker } from "@/components/task-assignee-picker";
import { SEEAttributeSlider } from "@/components/see-attribute-slider";
import { estimateEffort, SEE_DESCRIPTORS, getAttributeLabel } from "@/lib/see-model";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskComments } from "@/components/task-comments";
import { Users, MessageSquare, Calendar, Clock, BarChart3, Save } from "lucide-react";
import { format } from "date-fns";

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
  onTaskUpdate?: (task: Tables<"tasks">) => void;
  onTaskCreate?: (task: Tables<"tasks">) => void;
  onTaskDelete?: (taskId: string) => void;
}

export function TaskDialog({
  projectId,
  swimlaneId,
  task,
  open,
  onOpenChange,
  onTaskCreate,
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
  const [pendingAssignments, setPendingAssignments] = useState<TaskAssignment[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch current user ID
    const fetchCurrentUser = async () => {
      const supabase = createClient();
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (authUser) {
        const { data: dbUser } = await supabase
          .from("users")
          .select("id")
          .eq("user_auth_id", authUser.id)
          .single();

        if (dbUser) {
          setCurrentUserId(dbUser.id);
        }
      }
    };

    fetchCurrentUser();

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

  const handleCreate = async () => {
    if (!title.trim() || !onTaskCreate) return;

    setIsLoading(true);
    const supabase = createClient();

    try {
      const estimatedEffort = estimateEffort(sizeKLOC, attributes);
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
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // For existing tasks - read-only view
  if (task) {
    const taskAttributes = {
      rely: task.attr_rely || 1.0,
      cplx: task.attr_cplx || 1.0,
      acap: task.attr_acap || 1.0,
      pcap: task.attr_pcap || 1.0,
      tool: task.attr_tool || 1.0,
      sced: task.attr_sced || 1.0,
    };

    const estimatedEffort = task.estimated_effort_pm || estimateEffort(1, taskAttributes);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[95vw] !w-[95vw] sm:!max-w-[95vw] md:!max-w-[95vw] lg:!max-w-[95vw] xl:!max-w-[95vw] max-h-[95vh] flex flex-col p-0 gap-0">
        {/* Jira-style Header */}
        <DialogHeader className="px-6 py-4 border-b bg-slate-50">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-2xl font-semibold text-slate-900 mb-1 break-words">
                {task.title}
              </DialogTitle>
              <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                <span className="font-medium">Task</span>
                <span>•</span>
                <span className="font-mono text-xs">{task.id.slice(0, 8)}</span>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Main Content - Two Column Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Column - Main Content */}
          <div className="flex-1 overflow-y-auto p-6 min-w-0">
            <Tabs defaultValue="details" className="flex flex-col h-full">
              <TabsList className="w-fit mb-6">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="comments">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Discussion
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="flex-1 space-y-6">
                {/* Description */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-2">Description</h3>
                  <div className="bg-white border border-slate-200 rounded-md p-4 min-h-[100px]">
                    {task.description ? (
                      <p className="text-slate-900 whitespace-pre-wrap">{task.description}</p>
                    ) : (
                      <p className="text-slate-400 italic">No description provided</p>
                    )}
                  </div>
                </div>

                {/* SEE Attributes */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    SEE Attributes
                  </h3>
                  <div className="bg-white border border-slate-200 rounded-md p-4 space-y-4">
                    {Object.entries(SEE_DESCRIPTORS).map(([key, descriptor]) => {
                      const value = attributes[key as keyof typeof attributes];
                      return (
                        <div key={key} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                          <div className="flex-1">
                            <div className="font-medium text-sm text-slate-900">{descriptor.label}</div>
                            <div className="text-xs text-slate-500 mt-0.5">{descriptor.description}</div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-32 bg-slate-100 rounded-full h-2">
                              <div
                                className="bg-indigo-600 h-2 rounded-full transition-all"
                                style={{
                                  width: `${((value - descriptor.min) / (descriptor.max - descriptor.min)) * 100}%`,
                                }}
                              />
                            </div>
                            <div className="w-20 text-right">
                              <span className="font-medium text-sm text-slate-900">{value.toFixed(2)}</span>
                              <span className="text-xs text-slate-500 ml-1">
                                ({getAttributeLabel(value)})
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="comments" className="flex-1 flex flex-col min-h-0">
                <div className="flex-1 min-h-0">
                  <TaskComments
                    projectId={projectId}
                    taskId={task.id}
                    currentUserId={currentUserId || undefined}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Metadata Sidebar (Jira-style) */}
          <div className="w-80 border-l border-slate-200 bg-slate-50 overflow-y-auto p-6 shrink-0">
            <div className="space-y-6">
              {/* Assignees */}
              <div>
                <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
                  Assignees
                </Label>
                <div className="bg-white border border-slate-200 rounded-md p-3">
                  {assignments.length > 0 ? (
                    <div className="space-y-2">
                      {assignments.map((assignment) => (
                        <div key={assignment.id} className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-medium text-indigo-700">
                            {assignment.users?.full_name?.[0] || assignment.users?.email?.[0] || "?"}
                          </div>
                          <span className="text-sm text-slate-900">
                            {assignment.users?.full_name || assignment.users?.email || "Unassigned"}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-sm text-slate-400">Unassigned</span>
                  )}
                </div>
              </div>

              {/* Estimated Effort */}
              <div>
                <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
                  Estimated Effort
                </Label>
                <div className="bg-white border border-slate-200 rounded-md p-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span className="text-lg font-semibold text-slate-900">
                      {estimatedEffort.toFixed(2)} PM
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Person Months</p>
                </div>
              </div>

              {/* Created Date */}
              {task.created_at && (
                <div>
                  <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
                    Created
                  </Label>
                  <div className="bg-white border border-slate-200 rounded-md p-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-900">
                        {format(new Date(task.created_at), "MMM d, yyyy 'at' h:mm a")}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Updated Date */}
              {task.updated_at && (
                <div>
                  <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
                    {task.updated_at !== task.created_at ? "Last Updated" : "Updated"}
                  </Label>
                  <div className="bg-white border border-slate-200 rounded-md p-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-900">
                        {format(new Date(task.updated_at), "MMM d, yyyy 'at' h:mm a")}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
  }

  // For new tasks - create form
  const estimatedEffort = estimateEffort(sizeKLOC, attributes);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[95vw] !w-[95vw] sm:!max-w-[95vw] md:!max-w-[95vw] lg:!max-w-[95vw] xl:!max-w-[95vw] max-h-[95vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b bg-slate-50 shrink-0">
          <DialogTitle className="text-2xl font-semibold text-slate-900 text-center">
            Create New Task
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6 max-w-2xl w-full mx-auto">
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
                rows={4}
              />
            </div>

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
        </div>

        <div className="px-6 py-4 border-t bg-slate-50 flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!title.trim() || isLoading}>
            <Save className="size-4 mr-2" />
            Create Task
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
