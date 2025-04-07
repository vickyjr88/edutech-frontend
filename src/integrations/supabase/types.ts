export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      teacher_academic_subjects: {
        Row: {
          created_at: string
          curriculum: string
          description: string | null
          grade: string
          id: string
          is_certified: boolean | null
          proficiency_level: string
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          curriculum: string
          description?: string | null
          grade: string
          id?: string
          is_certified?: boolean | null
          proficiency_level: string
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          curriculum?: string
          description?: string | null
          grade?: string
          id?: string
          is_certified?: boolean | null
          proficiency_level?: string
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      teacher_afterschool_subjects: {
        Row: {
          age_range: string
          created_at: string
          description: string | null
          gender: string | null
          id: string
          is_certified: boolean | null
          religion: string | null
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          age_range: string
          created_at?: string
          description?: string | null
          gender?: string | null
          id?: string
          is_certified?: boolean | null
          religion?: string | null
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          age_range?: string
          created_at?: string
          description?: string | null
          gender?: string | null
          id?: string
          is_certified?: boolean | null
          religion?: string | null
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      teacher_education: {
        Row: {
          created_at: string
          currently_studying: boolean
          degree: string | null
          details: string | null
          end_date: string | null
          id: string
          institution_name: string
          institution_type: string
          start_date: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          currently_studying?: boolean
          degree?: string | null
          details?: string | null
          end_date?: string | null
          id?: string
          institution_name: string
          institution_type: string
          start_date: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          currently_studying?: boolean
          degree?: string | null
          details?: string | null
          end_date?: string | null
          id?: string
          institution_name?: string
          institution_type?: string
          start_date?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      teacher_experience: {
        Row: {
          created_at: string
          currently_working: boolean
          curriculums: string[] | null
          details: string | null
          end_date: string | null
          grades: string[] | null
          id: string
          institution: string
          institution_type: string
          position: string
          reporting_manager_name: string | null
          reporting_manager_phone: string | null
          start_date: string
          subjects: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          currently_working?: boolean
          curriculums?: string[] | null
          details?: string | null
          end_date?: string | null
          grades?: string[] | null
          id?: string
          institution: string
          institution_type: string
          position: string
          reporting_manager_name?: string | null
          reporting_manager_phone?: string | null
          start_date: string
          subjects?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          currently_working?: boolean
          curriculums?: string[] | null
          details?: string | null
          end_date?: string | null
          grades?: string[] | null
          id?: string
          institution?: string
          institution_type?: string
          position?: string
          reporting_manager_name?: string | null
          reporting_manager_phone?: string | null
          start_date?: string
          subjects?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      teacher_languages: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_certified: boolean | null
          language: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_certified?: boolean | null
          language: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_certified?: boolean | null
          language?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      teacher_methodologies: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_certified: boolean | null
          methodology: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_certified?: boolean | null
          methodology: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_certified?: boolean | null
          methodology?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      teacher_profiles: {
        Row: {
          certification: Json | null
          contact: Json | null
          created_at: string
          id: string
          location: Json | null
          next_of_kin: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          certification?: Json | null
          contact?: Json | null
          created_at?: string
          id?: string
          location?: Json | null
          next_of_kin?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          certification?: Json | null
          contact?: Json | null
          created_at?: string
          id?: string
          location?: Json | null
          next_of_kin?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      teacher_strategies: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_certified: boolean | null
          strategy: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_certified?: boolean | null
          strategy: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_certified?: boolean | null
          strategy?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      teacher_technical_skills: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_certified: boolean | null
          skill: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_certified?: boolean | null
          skill: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_certified?: boolean | null
          skill?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
