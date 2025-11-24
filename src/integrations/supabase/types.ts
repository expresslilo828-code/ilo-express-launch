export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      admin_time_slots: {
        Row: {
          id: string
          day_of_week: Database["public"]["Enums"]["day_of_week"]
          start_time: string
          end_time: string
          slot_duration_minutes: number | null
          is_available: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          day_of_week: Database["public"]["Enums"]["day_of_week"]
          start_time: string
          end_time: string
          slot_duration_minutes?: number | null
          is_available?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          day_of_week?: Database["public"]["Enums"]["day_of_week"]
          start_time?: string
          end_time?: string
          slot_duration_minutes?: number | null
          is_available?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      blocked_dates: {
        Row: {
          id: string
          blocked_date: string
          reason: string | null
          created_by: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          blocked_date: string
          reason?: string | null
          created_by?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          blocked_date?: string
          reason?: string | null
          created_by?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blocked_dates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      bookings: {
        Row: {
          id: string
          service_id: string | null
          full_name: string
          business_name: string | null
          email: string
          phone: string
          contact_method: string | null
          state: string | null
          city: string | null
          preferred_date: string
          preferred_time: string
          duration_minutes: number | null
          services_requested: Json | null
          notes: string | null
          how_heard: string | null
          file_urls: Json | null
          status: Database["public"]["Enums"]["booking_status"] | null
          admin_notes: string | null
          confirmed_at: string | null
          completed_at: string | null
          cancelled_at: string | null
          cancellation_reason: string | null
          reminder_sent: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          service_id?: string | null
          full_name: string
          business_name?: string | null
          email: string
          phone: string
          contact_method?: string | null
          state?: string | null
          city?: string | null
          preferred_date: string
          preferred_time: string
          duration_minutes?: number | null
          services_requested?: Json | null
          notes?: string | null
          how_heard?: string | null
          file_urls?: Json | null
          status?: Database["public"]["Enums"]["booking_status"] | null
          admin_notes?: string | null
          confirmed_at?: string | null
          completed_at?: string | null
          cancelled_at?: string | null
          cancellation_reason?: string | null
          reminder_sent?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          service_id?: string | null
          full_name?: string
          business_name?: string | null
          email?: string
          phone?: string
          contact_method?: string | null
          state?: string | null
          city?: string | null
          preferred_date?: string
          preferred_time?: string
          duration_minutes?: number | null
          services_requested?: Json | null
          notes?: string | null
          how_heard?: string | null
          file_urls?: Json | null
          status?: Database["public"]["Enums"]["booking_status"] | null
          admin_notes?: string | null
          confirmed_at?: string | null
          completed_at?: string | null
          cancelled_at?: string | null
          cancellation_reason?: string | null
          reminder_sent?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          }
        ]
      }
      email_logs: {
        Row: {
          id: string
          booking_id: string | null
          email_type: string
          recipient_email: string
          subject: string | null
          sent_at: string | null
          status: string | null
          error_message: string | null
          resend_message_id: string | null
        }
        Insert: {
          id?: string
          booking_id?: string | null
          email_type: string
          recipient_email: string
          subject?: string | null
          sent_at?: string | null
          status?: string | null
          error_message?: string | null
          resend_message_id?: string | null
        }
        Update: {
          id?: string
          booking_id?: string | null
          email_type?: string
          recipient_email?: string
          subject?: string | null
          sent_at?: string | null
          status?: string | null
          error_message?: string | null
          resend_message_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_logs_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          }
        ]
      }
      email_templates: {
        Row: {
          id: string
          template_type: string
          subject: string
          html_content: string
          text_content: string | null
          is_active: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          template_type: string
          subject: string
          html_content: string
          text_content?: string | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          template_type?: string
          subject?: string
          html_content?: string
          text_content?: string | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      services: {
        Row: {
          id: string
          title: string
          slug: string
          category: string | null
          description: string | null
          short_description: string | null
          price: number | null
          duration_hours: number | null
          features: Json | null
          is_active: boolean | null
          icon: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          slug: string
          category?: string | null
          description?: string | null
          short_description?: string | null
          price?: number | null
          duration_hours?: number | null
          features?: Json | null
          is_active?: boolean | null
          icon?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          category?: string | null
          description?: string | null
          short_description?: string | null
          price?: number | null
          duration_hours?: number | null
          features?: Json | null
          is_active?: boolean | null
          icon?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          id: string
          auth_user_id: string | null
          email: string
          full_name: string
          role: string | null
          is_active: boolean | null
          last_login_at: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          auth_user_id?: string | null
          email: string
          full_name: string
          role?: string | null
          is_active?: boolean | null
          last_login_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          auth_user_id?: string | null
          email?: string
          full_name?: string
          role?: string | null
          is_active?: boolean | null
          last_login_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_users_auth_user_id_fkey"
            columns: ["auth_user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_admin_user: {
        Args: {
          p_auth_user_id: string
          p_email: string
          p_full_name: string
        }
        Returns: string
      }
      create_booking_with_notifications: {
        Args: {
          p_service_id: string
          p_full_name: string
          p_business_name: string
          p_email: string
          p_phone: string
          p_contact_method: string
          p_state: string
          p_city: string
          p_preferred_date: string
          p_preferred_time: string
          p_services_requested: Json
          p_notes: string
          p_how_heard: string
          p_file_urls: Json
        }
        Returns: string
      }
      get_available_time_slots: {
        Args: {
          target_date: string
        }
        Returns: {
          time_slot: string
          is_available: boolean
        }[]
      }
      is_admin: {
        Args: {
          user_id?: string
        }
        Returns: boolean
      }
      update_booking_status: {
        Args: {
          p_booking_id: string
          p_status: Database["public"]["Enums"]["booking_status"]
          p_admin_notes?: string
          p_cancellation_reason?: string
        }
        Returns: boolean
      }
    }
    Enums: {
      booking_status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled"
      day_of_week: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
