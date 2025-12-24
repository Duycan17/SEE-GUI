import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET: Lấy danh sách assignees của task
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; taskId: string }> }
) {
  const supabase = await createClient();
  const { taskId } = await params;

  // Lấy assignments trước
  const { data: assignments, error } = await supabase
    .from("task_assignments")
    .select("id, assigned_at, user_id")
    .eq("task_id", taskId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!assignments || assignments.length === 0) {
    return NextResponse.json([]);
  }

  // Lấy thông tin users riêng
  const userIds = assignments.map((a) => a.user_id);
  const { data: users, error: usersError } = await supabase
    .from("users")
    .select("id, email, full_name, avatar_url")
    .in("id", userIds);

  if (usersError) {
    return NextResponse.json({ error: usersError.message }, { status: 500 });
  }

  // Map users vào assignments
  const usersMap = new Map(users?.map((u) => [u.id, u]));
  const transformed = assignments.map((a) => ({
    id: a.id,
    assigned_at: a.assigned_at,
    users: usersMap.get(a.user_id) || null,
  }));

  return NextResponse.json(transformed);
}

// POST: Gán member vào task
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; taskId: string }> }
) {
  const supabase = await createClient();
  const { taskId } = await params;
  const body = await request.json();

  const { user_id, assigned_by } = body;

  if (!user_id) {
    return NextResponse.json({ error: "user_id is required" }, { status: 400 });
  }

  // Kiểm tra đã assign chưa
  const { data: existing } = await supabase
    .from("task_assignments")
    .select("id")
    .eq("task_id", taskId)
    .eq("user_id", user_id)
    .single();

  if (existing) {
    return NextResponse.json(
      { error: "User is already assigned" },
      { status: 400 }
    );
  }

  // Insert trước
  const { data: inserted, error: insertError } = await supabase
    .from("task_assignments")
    .insert({ task_id: taskId, user_id, assigned_by })
    .select("id, assigned_at, user_id")
    .single();

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  // Sau đó lấy thông tin user riêng
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("id, email, full_name, avatar_url")
    .eq("id", user_id)
    .single();

  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 500 });
  }

  const transformed = {
    id: inserted.id,
    assigned_at: inserted.assigned_at,
    users: user,
  };

  return NextResponse.json(transformed, { status: 201 });
}

// DELETE: Xóa tất cả assignments của task
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; taskId: string }> }
) {
  const supabase = await createClient();
  const { taskId } = await params;

  const { error } = await supabase
    .from("task_assignments")
    .delete()
    .eq("task_id", taskId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "All assignments removed" });
}
