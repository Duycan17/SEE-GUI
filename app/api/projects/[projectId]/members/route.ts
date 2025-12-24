import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET: Lấy danh sách members của project
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const supabase = await createClient();
  const { projectId } = await params;

  const { data: members, error } = await supabase
    .from("project_members")
    .select(
      `
      id,
      role,
      joined_at,
      users (id, email, full_name, avatar_url)
    `
    )
    .eq("project_id", projectId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(members);
}

// POST: Thêm member vào project
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const supabase = await createClient();
  const { projectId } = await params;
  const body = await request.json();

  const { user_id, role = "member" } = body;

  if (!user_id) {
    return NextResponse.json({ error: "user_id is required" }, { status: 400 });
  }

  // Kiểm tra member đã tồn tại chưa
  const { data: existing } = await supabase
    .from("project_members")
    .select("id")
    .eq("project_id", projectId)
    .eq("user_id", user_id)
    .single();

  if (existing) {
    return NextResponse.json(
      { error: "User is already a member" },
      { status: 400 }
    );
  }

  const { data: member, error } = await supabase
    .from("project_members")
    .insert({ project_id: projectId, user_id, role })
    .select(
      `
      id,
      role,
      joined_at,
      users (id, email, full_name, avatar_url)
    `
    )
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(member, { status: 201 });
}
