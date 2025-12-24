import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// PUT: Cập nhật role của member
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; memberId: string }> }
) {
  const supabase = await createClient();
  const { memberId } = await params;
  const body = await request.json();

  // Check authentication
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check admin status
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("is_admin")
    .eq("user_auth_id", authUser.id)
    .single();

  if (userError || !user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (!user.is_admin) {
    return NextResponse.json(
      { error: "Only admins can update member roles" },
      { status: 403 }
    );
  }

  const { role } = body;

  const { data: member, error } = await supabase
    .from("project_members")
    .update({ role })
    .eq("id", memberId)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(member);
}

// DELETE: Xóa member khỏi project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; memberId: string }> }
) {
  const supabase = await createClient();
  const { memberId } = await params;

  // Check authentication
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check admin status
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("is_admin")
    .eq("user_auth_id", authUser.id)
    .single();

  if (userError || !user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (!user.is_admin) {
    return NextResponse.json(
      { error: "Only admins can remove members" },
      { status: 403 }
    );
  }

  const { error } = await supabase
    .from("project_members")
    .delete()
    .eq("id", memberId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Member removed" });
}
