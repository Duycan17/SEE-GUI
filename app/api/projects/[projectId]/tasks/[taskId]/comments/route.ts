import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/projects/[projectId]/tasks/[taskId]/comments
 * Fetch all comments for a specific task
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; taskId: string }> }
) {
  try {
    const { taskId } = await params;
    const supabase = await createClient();

    // Verify user is authenticated
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch comments with user information
    // Using type assertion since task_comments table exists but types may not be updated yet
    const { data: comments, error } = await supabase
      .from("task_comments" as any)
      .select(
        `
        *,
        users (
          id,
          email,
          full_name,
          avatar_url
        )
      `
      )
      .eq("task_id", taskId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching comments:", error);
      return NextResponse.json(
        { error: "Failed to fetch comments" },
        { status: 500 }
      );
    }

    return NextResponse.json(comments || []);
  } catch (error) {
    console.error("Error in GET /api/comments:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/projects/[projectId]/tasks/[taskId]/comments
 * Create a new comment for a task
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; taskId: string }> }
) {
  try {
    const { taskId } = await params;
    const supabase = await createClient();

    // Verify user is authenticated
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user record
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("user_auth_id", authUser.id)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { content } = body;

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: "Comment content is required" },
        { status: 400 }
      );
    }

    // Verify task exists and user has access
    const { data: task, error: taskError } = await supabase
      .from("tasks")
      .select("id, project_id")
      .eq("id", taskId)
      .single();

    if (taskError || !task || !task.project_id) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    // Verify user is a project member
    const { data: member, error: memberError } = await supabase
      .from("project_members")
      .select("id")
      .eq("project_id", task.project_id)
      .eq("user_id", user.id)
      .single();

    if (memberError || !member) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    // Create comment
    // Using type assertion since task_comments table exists but types may not be updated yet
    const { data: comment, error: commentError } = await supabase
      .from("task_comments" as any)
      .insert({
        task_id: taskId,
        user_id: user.id,
        content: content.trim(),
      })
      .select(
        `
        *,
        users (
          id,
          email,
          full_name,
          avatar_url
        )
      `
      )
      .single();

    if (commentError) {
      console.error("Error creating comment:", commentError);
      return NextResponse.json(
        { error: "Failed to create comment" },
        { status: 500 }
      );
    }

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/comments:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

