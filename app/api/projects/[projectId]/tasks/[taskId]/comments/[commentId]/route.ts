import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * PUT /api/projects/[projectId]/tasks/[taskId]/comments/[commentId]
 * Update a comment
 */
export async function PUT(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ projectId: string; taskId: string; commentId: string }>;
  }
) {
  try {
    const { commentId } = await params;
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

    // Verify comment exists and belongs to user
    // Using type assertion since task_comments table exists but types may not be updated yet
    const { data: existingComment, error: commentError } = await supabase
      .from("task_comments" as any)
      .select("id, user_id")
      .eq("id", commentId)
      .single();

    if (commentError || !existingComment) {
      return NextResponse.json(
        { error: "Comment not found" },
        { status: 404 }
      );
    }

    if (existingComment.user_id !== user.id) {
      return NextResponse.json(
        { error: "Unauthorized to update this comment" },
        { status: 403 }
      );
    }

    // Update comment
    // Using type assertion since task_comments table exists but types may not be updated yet
    const { data: comment, error: updateError } = await supabase
      .from("task_comments" as any)
      .update({
        content: content.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", commentId)
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

    if (updateError) {
      console.error("Error updating comment:", updateError);
      return NextResponse.json(
        { error: "Failed to update comment" },
        { status: 500 }
      );
    }

    return NextResponse.json(comment);
  } catch (error) {
    console.error("Error in PUT /api/comments/[commentId]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/projects/[projectId]/tasks/[taskId]/comments/[commentId]
 * Delete a comment
 */
export async function DELETE(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ projectId: string; taskId: string; commentId: string }>;
  }
) {
  try {
    const { commentId } = await params;
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

    // Verify comment exists and belongs to user
    // Using type assertion since task_comments table exists but types may not be updated yet
    const { data: existingComment, error: commentError } = await supabase
      .from("task_comments" as any)
      .select("id, user_id")
      .eq("id", commentId)
      .single();

    if (commentError || !existingComment) {
      return NextResponse.json(
        { error: "Comment not found" },
        { status: 404 }
      );
    }

    if (existingComment.user_id !== user.id) {
      return NextResponse.json(
        { error: "Unauthorized to delete this comment" },
        { status: 403 }
      );
    }

    // Delete comment
    // Using type assertion since task_comments table exists but types may not be updated yet
    const { error: deleteError } = await supabase
      .from("task_comments" as any)
      .delete()
      .eq("id", commentId);

    if (deleteError) {
      console.error("Error deleting comment:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete comment" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/comments/[commentId]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

