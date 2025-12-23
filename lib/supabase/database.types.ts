export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      projects: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      swimlanes: {
        Row: {
          created_at: string | null
          id: string
          name: string
          position: number
          project_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          position: number
          project_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          position?: number
          project_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "swimlanes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      task_dependencies: {
        Row: {
          depends_on_task_id: string | null
          id: string
          task_id: string | null
        }
        Insert: {
          depends_on_task_id?: string | null
          id?: string
          task_id?: string | null
        }
        Update: {
          depends_on_task_id?: string | null
          id?: string
          task_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "task_dependencies_depends_on_task_id_fkey"
            columns: ["depends_on_task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_dependencies_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          actual_effort_pm: number | null
          attr_acap: number | null
          attr_cplx: number | null
          attr_pcap: number | null
          attr_rely: number | null
          attr_sced: number | null
          attr_tool: number | null
          created_at: string | null
          description: string | null
          estimated_effort_pm: number | null
          id: string
          position: number
          project_id: string | null
          swimlane_id: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          actual_effort_pm?: number | null
          attr_acap?: number | null
          attr_cplx?: number | null
          attr_pcap?: number | null
          attr_rely?: number | null
          attr_sced?: number | null
          attr_tool?: number | null
          created_at?: string | null
          description?: string | null
          estimated_effort_pm?: number | null
          id?: string
          position?: number
          project_id?: string | null
          swimlane_id?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          actual_effort_pm?: number | null
          attr_acap?: number | null
          attr_cplx?: number | null
          attr_pcap?: number | null
          attr_rely?: number | null
          attr_sced?: number | null
          attr_tool?: number | null
          created_at?: string | null
          description?: string | null
          estimated_effort_pm?: number | null
          id?: string
          position?: number
          project_id?: string | null
          swimlane_id?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_swimlane_id_fkey"
            columns: ["swimlane_id"]
            isOneToOne: false
            referencedRelation: "swimlanes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"]
export type Inserts<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Insert"]
export type Updates<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Update"]
