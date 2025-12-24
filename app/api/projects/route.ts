import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const DEFAULT_SWIMLANES = [
  { name: "Backlog", position: 0 },
  { name: "To Do", position: 1 },
  { name: "In Progress", position: 2 },
  { name: "Done", position: 3 },
];

// GET: Lấy danh sách projects
export async function GET() {
  const supabase = await createClient();

  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(projects);
}

// POST: Tạo project mới + swimlanes mặc định + thêm creator làm owner
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const body = await request.json();

  const { name, description, creator_user_id } = body;

  if (!name) {
    return NextResponse.json(
      { error: "Project name is required" },
      { status: 400 }
    );
  }

  // Kiểm tra quyền admin
  if (!creator_user_id) {
    return NextResponse.json(
      { error: "User authentication required" },
      { status: 401 }
    );
  }

  const { data: user, error: userError } = await supabase
    .from("users")
    .select("is_admin")
    .eq("id", creator_user_id)
    .single();

  if (userError || !user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (!user.is_admin) {
    return NextResponse.json(
      { error: "Only admins can create projects" },
      { status: 403 }
    );
  }

  // 1. Tạo project
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .insert({ name, description })
    .select()
    .single();

  if (projectError) {
    return NextResponse.json({ error: projectError.message }, { status: 500 });
  }

  // 2. Tạo swimlanes mặc định
  const swimlanesData = DEFAULT_SWIMLANES.map((s) => ({
    ...s,
    project_id: project.id,
  }));

  await supabase.from("swimlanes").insert(swimlanesData);

  // 3. Thêm creator làm owner (nếu có)
  if (creator_user_id) {
    await supabase.from("project_members").insert({
      project_id: project.id,
      user_id: creator_user_id,
      role: "owner",
    });
  }

  return NextResponse.json(project, { status: 201 });
}
