"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MessageSquare,
  Send,
  Edit2,
  Trash2,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";

interface CommentUser {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
}

interface Comment {
  id: string;
  task_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  users: CommentUser | null;
}

interface TaskCommentsProps {
  projectId: string;
  taskId: string;
  currentUserId?: string;
}

export function TaskComments({
  projectId,
  taskId,
  currentUserId,
}: TaskCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  // Fetch comments
  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/projects/${projectId}/tasks/${taskId}/comments`
      );
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Subscribe to real-time updates
  useEffect(() => {
    if (!taskId) return;

    fetchComments();

    const channel = supabase
      .channel(`task_comments:${taskId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "task_comments",
          filter: `task_id=eq.${taskId}`,
        },
        () => {
          fetchComments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [taskId, projectId, supabase]);

  // Scroll to bottom when new comments are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        '[data-radix-scroll-area-viewport]'
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [comments]);

  // Submit new comment
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `/api/projects/${projectId}/tasks/${taskId}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: newComment }),
        }
      );

      if (response.ok) {
        setNewComment("");
        await fetchComments();
      } else {
        const error = await response.json();
        console.error("Error creating comment:", error);
      }
    } catch (error) {
      console.error("Error creating comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Start editing
  const handleStartEdit = (comment: Comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditContent("");
  };

  // Update comment
  const handleUpdate = async (commentId: string) => {
    if (!editContent.trim()) return;

    try {
      const response = await fetch(
        `/api/projects/${projectId}/tasks/${taskId}/comments/${commentId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: editContent }),
        }
      );

      if (response.ok) {
        setEditingId(null);
        setEditContent("");
        await fetchComments();
      } else {
        const error = await response.json();
        console.error("Error updating comment:", error);
      }
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  // Delete comment
  const handleDelete = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      const response = await fetch(
        `/api/projects/${projectId}/tasks/${taskId}/comments/${commentId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        await fetchComments();
      } else {
        const error = await response.json();
        console.error("Error deleting comment:", error);
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  // Get user initials
  const getUserInitials = (user: CommentUser | null) => {
    if (!user) return "?";
    if (user.full_name) {
      return user.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return user.email[0].toUpperCase();
  };

  const canEdit = (comment: Comment) => {
    if (!currentUserId) return false;
    // Get current user's ID from comments to match
    return comment.user_id === currentUserId;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-1 pb-3 border-b">
        <MessageSquare className="w-4 h-4 text-muted-foreground" />
        <h3 className="font-semibold text-sm">Discussion</h3>
        <span className="text-xs text-muted-foreground">
          ({comments.length})
        </span>
      </div>

      <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
        <div className="space-y-4 py-4">
          {isLoading ? (
            <div className="text-center text-sm text-muted-foreground py-8">
              Loading comments...
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground py-8">
              No comments yet. Start the discussion!
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-3 group">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage
                    src={comment.users?.avatar_url || undefined}
                    alt={comment.users?.full_name || comment.users?.email}
                  />
                  <AvatarFallback className="text-xs">
                    {getUserInitials(comment.users)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">
                        {comment.users?.full_name || comment.users?.email}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.created_at), {
                          addSuffix: true,
                        })}
                        {comment.updated_at !== comment.created_at && (
                          <span className="ml-1">(edited)</span>
                        )}
                      </span>
                    </div>

                    {canEdit(comment) && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleStartEdit(comment)}
                          >
                            <Edit2 className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(comment.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>

                  {editingId === comment.id ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="min-h-[80px]"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleUpdate(comment.id)}
                          disabled={!editContent.trim()}
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-foreground whitespace-pre-wrap break-words">
                      {comment.content}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="pt-4 border-t space-y-2">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="min-h-[80px] resize-none"
          disabled={isSubmitting}
        />
        <div className="flex justify-end">
          <Button
            type="submit"
            size="sm"
            disabled={!newComment.trim() || isSubmitting}
          >
            <Send className="mr-2 h-4 w-4" />
            {isSubmitting ? "Posting..." : "Post Comment"}
          </Button>
        </div>
      </form>
    </div>
  );
}

