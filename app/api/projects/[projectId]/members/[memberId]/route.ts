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

  const { error } = await supabase
    .from("project_members")
    .delete()
    .eq("id", memberId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Member removed" });
}
