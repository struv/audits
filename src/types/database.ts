/**
 * Supabase Database Types
 * Auto-generated types that match the Supabase schema
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      audits: {
        Row: {
          id: string;
          location: string;
          audit_type: 'MRR' | 'FSR';
          scheduled_date: string;
          status: 'pending' | 'in_progress' | 'complete';
          checklist_items: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          location: string;
          audit_type: 'MRR' | 'FSR';
          scheduled_date: string;
          status?: 'pending' | 'in_progress' | 'complete';
          checklist_items: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          location?: string;
          audit_type?: 'MRR' | 'FSR';
          scheduled_date?: string;
          status?: 'pending' | 'in_progress' | 'complete';
          checklist_items?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
