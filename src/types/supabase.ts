// TypeScript types for Supabase database schema
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          role: 'customer' | 'agent' | 'company_owner' | 'admin'
          company_id: string | null
          name: string
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role: 'customer' | 'agent' | 'company_owner' | 'admin'
          company_id?: string | null
          name: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          role?: 'customer' | 'agent' | 'company_owner' | 'admin'
          company_id?: string | null
          name?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      companies: {
        Row: {
          id: string
          name: string
          image_url: string | null
          bio: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          image_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          image_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      chats: {
        Row: {
          id: string
          customer_id: string
          company_id: string
          agent_id: string | null
          status: 'open' | 'pending' | 'closed'
          subject: string | null
          last_message: string | null
          last_message_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          company_id: string
          agent_id?: string | null
          status?: 'open' | 'pending' | 'closed'
          subject?: string | null
          last_message?: string | null
          last_message_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          company_id?: string
          agent_id?: string | null
          status?: 'open' | 'pending' | 'closed'
          subject?: string | null
          last_message?: string | null
          last_message_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          chat_id: string
          sender_id: string
          content: string
          type: 'text' | 'order_update' | 'system'
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          chat_id: string
          sender_id: string
          content: string
          type?: 'text' | 'order_update' | 'system'
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          chat_id?: string
          sender_id?: string
          content?: string
          type?: 'text' | 'order_update' | 'system'
          metadata?: Json
          created_at?: string
        }
      }
      agent_load: {
        Row: {
          agent_id: string
          company_id: string
          active_chats: number
          last_assigned_at: string | null
          is_available: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          agent_id: string
          company_id: string
          active_chats?: number
          last_assigned_at?: string | null
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          agent_id?: string
          company_id?: string
          active_chats?: number
          last_assigned_at?: string | null
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      auto_assign_agent: {
        Args: {
          p_chat_id: string
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
