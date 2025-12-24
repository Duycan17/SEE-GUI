import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET: Lấy danh sách users (để chọn khi gán member)
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");
  const excludeProject = searchParams.get("excludeProject");

  let query = supabase
    .from("users")
    .select("id, email, full_name, avatar_url")
    .order("full_name", { ascending: true });

  if (search) {
    query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`);
  }

  const { data: users, error } = await query.limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Nếu có excludeProject, loại bỏ users đã là member của project đó
  if (excludeProject && users) {
    const { data: existingMembers } = await supabase
      .from("project_members")
      .select("user_id")
      .eq("project_id", excludeProject);

    const memberIds = existingMembers?.map((m) => m.user_id) || [];
    const filteredUsers = users.filter((u) => !memberIds.includes(u.id));
    return NextResponse.json(filteredUsers);
  }

  return NextResponse.json(users);
}
