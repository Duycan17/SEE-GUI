import { type NextRequest, NextResponse } from "next"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { taskIds, swimlaneId } = body

    if (!taskIds || !Array.isArray(taskIds) || !swimlaneId) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    // Call the PostgreSQL function to reorder tasks
    const { error } = await supabase.rpc("reorder_tasks", {
      p_task_ids: taskIds,
      p_swimlane_id: swimlaneId,
    })

    if (error) {
      console.error("[v0] Error reordering tasks:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Fetch updated tasks to return
    const { data: updatedTasks, error: fetchError } = await supabase
      .from("tasks")
      .select("*")
      .in("id", taskIds)
      .order("position")

    if (fetchError) {
      console.error("[v0] Error fetching updated tasks:", fetchError)
      return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }

    return NextResponse.json({ tasks: updatedTasks })
  } catch (error) {
    console.error("[v0] Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
