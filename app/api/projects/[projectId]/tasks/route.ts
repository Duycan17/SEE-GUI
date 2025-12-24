import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET: Lấy danh sách tasks của project
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const supabase = await createClient();
  const { projectId } = await params;

  const { data: tasks, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("project_id", projectId)
    .order("position", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Lấy assignments riêng để tránh lỗi ambiguous relationship
  if (tasks && tasks.length > 0) {
    const taskIds = tasks.map((t) => t.id);

    const { data: allAssignments } = await supabase
      .from("task_assignments")
      .select("id, task_id, assigned_at, user_id")
      .in("task_id", taskIds);

    if (allAssignments && allAssignments.length > 0) {
      const userIds = [...new Set(allAssignments.map((a) => a.user_id))];
      const { data: users } = await supabase
        .from("users")
        .select("id, email, full_name, avatar_url")
        .in("id", userIds);

      const usersMap = new Map(users?.map((u) => [u.id, u]));

      // Map assignments vào tasks
      const tasksWithAssignments = tasks.map((task) => ({
        ...task,
        task_assignments: allAssignments
          .filter((a) => a.task_id === task.id)
          .map((a) => ({
            id: a.id,
            assigned_at: a.assigned_at,
            users: usersMap.get(a.user_id) || null,
          })),
      }));

      return NextResponse.json(tasksWithAssignments);
    }
  }

  // Trả về tasks với empty assignments nếu không có
  const tasksWithEmptyAssignments = tasks?.map((t) => ({
    ...t,
    task_assignments: [],
  }));

  return NextResponse.json(tasksWithEmptyAssignments);
}

// POST: Tạo task mới
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const supabase = await createClient();
  const { projectId } = await params;
  const body = await request.json();

  const {
    title,
    description,
    swimlane_id,
    position = 0,
    attr_rely = 1.0,
    attr_cplx = 1.0,
    attr_acap = 1.0,
    attr_pcap = 1.0,
    attr_tool = 1.0,
    attr_sced = 1.0,
    estimated_effort_pm,
  } = body;

  if (!title) {
    return NextResponse.json(
      { error: "Task title is required" },
      { status: 400 }
    );
  }

  const { data: task, error } = await supabase
    .from("tasks")
    .insert({
      project_id: projectId,
      title,
      description,
      swimlane_id,
      position,
      attr_rely,
      attr_cplx,
      attr_acap,
      attr_pcap,
      attr_tool,
      attr_sced,
      estimated_effort_pm,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(task, { status: 201 });
}
