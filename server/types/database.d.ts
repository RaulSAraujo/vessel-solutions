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
      clients: {
        Row: {
          address: string | null
          city: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
          tax_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          tax_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          tax_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      drinks: {
        Row: {
          calculated_unit_cost: number | null
          created_at: string | null
          id: string
          name: string
          type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          calculated_unit_cost?: number | null
          created_at?: string | null
          id?: string
          name: string
          type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          calculated_unit_cost?: number | null
          created_at?: string | null
          id?: string
          name?: string
          type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      event_additional_costs: {
        Row: {
          created_at: string | null
          description: string
          event_id: string
          id: string
          quantity: number
          total_cost: number | null
          unit: string | null
          unit_cost: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          event_id: string
          id?: string
          quantity: number
          total_cost?: number | null
          unit?: string | null
          unit_cost: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          event_id?: string
          id?: string
          quantity?: number
          total_cost?: number | null
          unit?: string | null
          unit_cost?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_additional_costs_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_served_drinks: {
        Row: {
          created_at: string | null
          drink_id: string
          event_id: string
          id: string
          served_quantity: number
          total_cost_at_event: number | null
          unit_cost_at_event: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          drink_id: string
          event_id: string
          id?: string
          served_quantity: number
          total_cost_at_event?: number | null
          unit_cost_at_event?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          drink_id?: string
          event_id?: string
          id?: string
          served_quantity?: number
          total_cost_at_event?: number | null
          unit_cost_at_event?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_served_drinks_drink_id_fkey"
            columns: ["drink_id"]
            isOneToOne: false
            referencedRelation: "drinks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_served_drinks_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          client_id: string
          created_at: string | null
          distance_km: number | null
          duration_hours: number
          estimated_total_drinks: number | null
          event_date: string
          gross_profit: number | null
          id: string
          location: string
          num_guests: number
          profit_margin_percentage: number
          public_rating: number | null
          total_investment: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          client_id: string
          created_at?: string | null
          distance_km?: number | null
          duration_hours: number
          estimated_total_drinks?: number | null
          event_date: string
          gross_profit?: number | null
          id?: string
          location: string
          num_guests: number
          profit_margin_percentage?: number
          public_rating?: number | null
          total_investment?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string | null
          distance_km?: number | null
          duration_hours?: number
          estimated_total_drinks?: number | null
          event_date?: string
          gross_profit?: number | null
          id?: string
          location?: string
          num_guests?: number
          profit_margin_percentage?: number
          public_rating?: number | null
          total_investment?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      ingredients: {
        Row: {
          base_purchase_quantity: number
          base_purchase_unit: string
          cost_per_base_unit: number | null
          created_at: string | null
          id: string
          name: string
          purchase_price: number
          quotation_date: string | null
          real_cost_per_base_unit: number | null
          supplier: string | null
          updated_at: string | null
          user_id: string | null
          wastage_percentage: number
        }
        Insert: {
          base_purchase_quantity: number
          base_purchase_unit: string
          cost_per_base_unit?: number | null
          created_at?: string | null
          id?: string
          name: string
          purchase_price: number
          quotation_date?: string | null
          real_cost_per_base_unit?: number | null
          supplier?: string | null
          updated_at?: string | null
          user_id?: string | null
          wastage_percentage?: number
        }
        Update: {
          base_purchase_quantity?: number
          base_purchase_unit?: string
          cost_per_base_unit?: number | null
          created_at?: string | null
          id?: string
          name?: string
          purchase_price?: number
          quotation_date?: string | null
          real_cost_per_base_unit?: number | null
          supplier?: string | null
          updated_at?: string | null
          user_id?: string | null
          wastage_percentage?: number
        }
        Relationships: []
      }
      purchase_list_items: {
        Row: {
          batch_unit: string | null
          created_at: string | null
          id: string
          ingredient_id: string
          purchase_list_id: string
          required_quantity: number
          required_unit: string
          suggested_batch_size: number | null
          suggested_total_batches: number | null
          updated_at: string | null
        }
        Insert: {
          batch_unit?: string | null
          created_at?: string | null
          id?: string
          ingredient_id: string
          purchase_list_id: string
          required_quantity: number
          required_unit: string
          suggested_batch_size?: number | null
          suggested_total_batches?: number | null
          updated_at?: string | null
        }
        Update: {
          batch_unit?: string | null
          created_at?: string | null
          id?: string
          ingredient_id?: string
          purchase_list_id?: string
          required_quantity?: number
          required_unit?: string
          suggested_batch_size?: number | null
          suggested_total_batches?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchase_list_items_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_list_items_purchase_list_id_fkey"
            columns: ["purchase_list_id"]
            isOneToOne: false
            referencedRelation: "purchase_lists"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_lists: {
        Row: {
          created_at: string | null
          event_id: string | null
          generation_date: string | null
          id: string
          status: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_id?: string | null
          generation_date?: string | null
          id?: string
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_id?: string | null
          generation_date?: string | null
          id?: string
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchase_lists_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      recipe_ingredients: {
        Row: {
          created_at: string | null
          drink_id: string
          id: string
          ingredient_id: string
          recipe_unit: string
          required_quantity: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          drink_id: string
          id?: string
          ingredient_id: string
          recipe_unit: string
          required_quantity: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          drink_id?: string
          id?: string
          ingredient_id?: string
          recipe_unit?: string
          required_quantity?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recipe_ingredients_drink_id_fkey"
            columns: ["drink_id"]
            isOneToOne: false
            referencedRelation: "drinks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_ingredients_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
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
    Enums: {},
  },
} as const
