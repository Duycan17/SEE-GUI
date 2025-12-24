import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { taskIds, swimlaneId } = body;

    if (!taskIds || !Array.isArray(taskIds) || !swimlaneId) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    // Update each task's position and swimlane_id
    const updatePromises = taskIds.map((taskId: string, index: number) =>
      supabase
        .from("tasks")
        .update({ position: index, swimlane_id: swimlaneId })
        .eq("id", taskId)
    );

    const results = await Promise.all(updatePromises);

    // Check for any errors
    const updateError = results.find((r) => r.error);
    if (updateError?.error) {
      console.error("[v0] Error reordering tasks:", updateError.error);
      return NextResponse.json(
        { error: updateError.error.message },
        { status: 500 }
      );
    }

    // Fetch updated tasks to return
    const { data: updatedTasks, error: fetchError } = await supabase
      .from("tasks")
      .select("*")
      .in("id", taskIds)
      .order("position");

    if (fetchError) {
      console.error("[v0] Error fetching updated tasks:", fetchError);
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    return NextResponse.json({ tasks: updatedTasks });
  } catch (error) {
    console.error("[v0] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
