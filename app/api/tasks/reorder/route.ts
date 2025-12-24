import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { taskIds, swimlaneId, targetSwimlaneName, sourceSwimlaneName } = body;

    if (!taskIds || !Array.isArray(taskIds) || !swimlaneId) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    // Get the target swimlane to check its name
    const { data: targetSwimlane } = await supabase
      .from("swimlanes")
      .select("name")
      .eq("id", swimlaneId)
      .single();

    const targetName = targetSwimlaneName || targetSwimlane?.name?.toLowerCase() || "";
    const sourceName = sourceSwimlaneName?.toLowerCase() || "";

    const now = new Date().toISOString();

    // Update each task's position and swimlane_id, and set dates based on swimlane transitions
    const updatePromises = taskIds.map(async (taskId: string, index: number) => {
      // Get the current task to check its current state
      const { data: currentTask } = await supabase
        .from("tasks")
        .select("start_date, end_date, swimlane_id, created_at")
        .eq("id", taskId)
        .single();

      const updates: any = {
        position: index,
        swimlane_id: swimlaneId,
        updated_at: now,
      };

      // Set start_date when moving to "In Progress" (if not already set)
      if (targetName.includes("progress") && !currentTask?.start_date) {
        updates.start_date = now;
      }

      // Set end_date when moving to "Done" (if not already set)
      if (targetName === "done" && !currentTask?.end_date) {
        updates.end_date = now;
        
        // Calculate actual effort if we have start_date, otherwise use created_at
        const startDateValue = currentTask?.start_date || currentTask?.created_at;
        if (startDateValue) {
          const startDate = new Date(startDateValue);
          const endDate = new Date(now);
          const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
          const diffDays = diffTime / (1000 * 60 * 60 * 24);
          // Convert days to person-months (assuming 20 working days per month)
          const actualEffortPM = diffDays / 20;
          updates.actual_effort_pm = Math.round(actualEffortPM * 100) / 100; // Round to 2 decimal places
        }
      }

      // Clear end_date if moving away from "Done"
      if (sourceName === "done" && targetName !== "done" && currentTask?.end_date) {
        updates.end_date = null;
        updates.actual_effort_pm = null;
      }

      return supabase
        .from("tasks")
        .update(updates)
        .eq("id", taskId);
    });

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
