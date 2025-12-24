"use client";

import { useState, useEffect } from "react";
import type { Tables } from "@/lib/supabase/database.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { UserPlus, X, Search, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskAssignment {
  id: string;
  assigned_at: string | null;
  users: Tables<"users"> | null;
}

interface TaskAssigneePickerProps {
  projectId: string;
  taskId?: string; // Optional for create mode
  assignments: TaskAssignment[];
  onAssignmentsChange: (assignments: TaskAssignment[]) => void;
  pendingMode?: boolean; // When true, don't call API, just update local state
}

export function TaskAssigneePicker({
  projectId,
  taskId,
  assignments,
  onAssignmentsChange,
  pendingMode = false,
}: TaskAssigneePickerProps) {
  const [projectMembers, setProjectMembers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);

  useEffect(() => {
    if (isOpen && projectMembers.length === 0) {
      fetchProjectMembers();
    }
  }, [isOpen, projectId]);

  const fetchProjectMembers = async () => {
    setIsLoadingMembers(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/members`);
      if (res.ok) {
        const data = await res.json();
        setProjectMembers(data);
      }
    } finally {
      setIsLoadingMembers(false);
    }
  };

  const assignUser = async (userId: string) => {
    // Find the member to get user info
    const member = projectMembers.find((m) => m.users?.id === userId);
    if (!member) return;

    if (pendingMode) {
      // In pending mode, just add to local state with a temp ID
      const tempAssignment: TaskAssignment = {
        id: `pending-${userId}`,
        assigned_at: new Date().toISOString(),
        users: member.users,
      };
      onAssignmentsChange([...assignments, tempAssignment]);
      return;
    }

    if (!taskId) return;

    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/projects/${projectId}/tasks/${taskId}/assignments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId }),
        }
      );

      if (res.ok) {
        const newAssignment = await res.json();
        onAssignmentsChange([...assignments, newAssignment]);
      }
    } catch (error) {
      console.error("Error assigning user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const unassignUser = async (assignmentId: string) => {
    if (pendingMode || assignmentId.startsWith("pending-")) {
      // In pending mode, just remove from local state
      onAssignmentsChange(assignments.filter((a) => a.id !== assignmentId));
      return;
    }

    if (!taskId) return;

    try {
      await fetch(
        `/api/projects/${projectId}/tasks/${taskId}/assignments/${assignmentId}`,
        {
          method: "DELETE",
        }
      );
      onAssignmentsChange(assignments.filter((a) => a.id !== assignmentId));
    } catch (error) {
      console.error("Error unassigning user:", error);
    }
  };

  const getInitials = (name: string | null, email: string) => {
    if (name)
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
    return email[0].toUpperCase();
  };

  const assignedUserIds = assignments.map((a) => a.users?.id);
  const availableMembers = projectMembers.filter(
    (m) => !assignedUserIds.includes(m.users?.id)
  );

  const filteredMembers = availableMembers.filter((m) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      m.users?.full_name?.toLowerCase().includes(query) ||
      m.users?.email?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 flex-wrap">
        {assignments.map((assignment) => (
          <div
            key={assignment.id}
            className="flex items-center gap-1 bg-muted rounded-full pl-1 pr-2 py-1">
            <Avatar className="size-6">
              <AvatarImage src={assignment.users?.avatar_url || undefined} />
              <AvatarFallback className="text-xs">
                {getInitials(
                  assignment.users?.full_name || null,
                  assignment.users?.email || ""
                )}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs">
              {assignment.users?.full_name || assignment.users?.email}
            </span>
            <button
              onClick={() => unassignUser(assignment.id)}
              className="ml-1 text-muted-foreground hover:text-destructive">
              <X className="size-3" />
            </button>
          </div>
        ))}

        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button size="sm" variant="outline" className="h-8">
              <UserPlus className="size-4 mr-1" />
              Assign
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-2" align="start">
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-8"
                />
              </div>

              <div className="max-h-48 overflow-y-auto space-y-1">
                {isLoadingMembers ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                    <span className="ml-2 text-xs text-muted-foreground">
                      Loading...
                    </span>
                  </div>
                ) : filteredMembers.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-2">
                    {availableMembers.length === 0
                      ? "All members assigned"
                      : "No members found"}
                  </p>
                ) : (
                  filteredMembers.map((member) => (
                    <button
                      key={member.id}
                      onClick={() => {
                        assignUser(member.users?.id);
                        setSearchQuery("");
                      }}
                      disabled={isLoading}
                      className={cn(
                        "w-full flex items-center gap-2 p-2 rounded-md hover:bg-muted text-left",
                        isLoading && "opacity-50"
                      )}>
                      <Avatar className="size-7">
                        <AvatarImage
                          src={member.users?.avatar_url || undefined}
                        />
                        <AvatarFallback className="text-xs">
                          {getInitials(
                            member.users?.full_name,
                            member.users?.email
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {member.users?.full_name || member.users?.email}
                        </p>
                        {member.users?.full_name && (
                          <p className="text-xs text-muted-foreground truncate">
                            {member.users?.email}
                          </p>
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
