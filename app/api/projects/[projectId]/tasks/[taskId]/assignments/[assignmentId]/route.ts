import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// DELETE: Xóa một assignment cụ thể
export async function DELETE(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      projectId: string;
      taskId: string;
      assignmentId: string;
    }>;
  }
) {
  const supabase = await createClient();
  const { assignmentId } = await params;

  const { error } = await supabase
    .from("task_assignments")
    .delete()
    .eq("id", assignmentId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Assignment removed" });
}
