import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET: Lấy chi tiết task
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; taskId: string }> }
) {
  const supabase = await createClient();
  const { taskId } = await params;

  const { data: task, error } = await supabase
    .from("tasks")
    .select(
      `
      *,
      swimlanes (id, name),
      task_assignments (
        id,
        assigned_at,
        users (id, email, full_name, avatar_url)
      )
    `
    )
    .eq("id", taskId)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  return NextResponse.json(task);
}

// PUT: Cập nhật task
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; taskId: string }> }
) {
  const supabase = await createClient();
  const { taskId } = await params;
  const body = await request.json();

  const { data: task, error } = await supabase
    .from("tasks")
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq("id", taskId)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(task);
}

// DELETE: Xóa task
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; taskId: string }> }
) {
  const supabase = await createClient();
  const { taskId } = await params;

  const { error } = await supabase.from("tasks").delete().eq("id", taskId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Task deleted" });
}
