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
      properties: {
        Row: {
          id: string
          owner_id: string | null
          name: string
          address: string
          city: string
          state: string
          pincode: string
          description: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          owner_id?: string | null
          name: string
          address: string
          city: string
          state: string
          pincode: string
          description?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          owner_id?: string | null
          name?: string
          address?: string
          city?: string
          state?: string
          pincode?: string
          description?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      rooms: {
        Row: {
          id: string
          property_id: string | null
          name: string
          type: string
          size: string
          rent: number
          maintenance_fee: number
          status: 'vacant' | 'occupied'
          water_included: boolean | null
          electricity_included: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          property_id?: string | null
          name: string
          type: string
          size: string
          rent: number
          maintenance_fee: number
          status: 'vacant' | 'occupied'
          water_included?: boolean | null
          electricity_included?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          property_id?: string | null
          name?: string
          type?: string
          size?: string
          rent?: number
          maintenance_fee?: number
          status?: 'vacant' | 'occupied'
          water_included?: boolean | null
          electricity_included?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      tenants: {
        Row: {
          id: string
          user_id: string | null
          room_id: string | null
          name: string
          email: string
          phone: string
          lease_start: string
          lease_end: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          room_id?: string | null
          name: string
          email: string
          phone: string
          lease_start: string
          lease_end: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          room_id?: string | null
          name?: string
          email?: string
          phone?: string
          lease_start?: string
          lease_end?: string
          created_at?: string | null
          updated_at?: string | null
        }
      }
      payments: {
        Row: {
          id: string
          tenant_id: string | null
          room_id: string | null
          amount: number
          payment_date: string
          due_date: string
          status: 'pending' | 'paid' | 'failed'
          payment_method: string | null
          transaction_id: string | null
          receipt_no: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          tenant_id?: string | null
          room_id?: string | null
          amount: number
          payment_date: string
          due_date: string
          status: 'pending' | 'paid' | 'failed'
          payment_method?: string | null
          transaction_id?: string | null
          receipt_no?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          tenant_id?: string | null
          room_id?: string | null
          amount?: number
          payment_date?: string
          due_date?: string
          status?: 'pending' | 'paid' | 'failed'
          payment_method?: string | null
          transaction_id?: string | null
          receipt_no?: string | null
          created_at?: string | null
        }
      }
      maintenance_requests: {
        Row: {
          id: string
          tenant_id: string | null
          room_id: string | null
          title: string
          description: string
          status: 'pending' | 'in_progress' | 'completed'
          priority: 'low' | 'medium' | 'high' | 'emergency'
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          tenant_id?: string | null
          room_id?: string | null
          title: string
          description: string
          status: 'pending' | 'in_progress' | 'completed'
          priority: 'low' | 'medium' | 'high' | 'emergency'
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          tenant_id?: string | null
          room_id?: string | null
          title?: string
          description?: string
          status?: 'pending' | 'in_progress' | 'completed'
          priority?: 'low' | 'medium' | 'high' | 'emergency'
          created_at?: string | null
          updated_at?: string | null
        }
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
  }
}