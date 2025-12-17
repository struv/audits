import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase credentials not found. Using localStorage mode. ' +
    'To use Supabase, set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local'
  );
}

// Create Supabase client
export const supabase = createClient<Database>(
  supabaseUrl || 'http://localhost:54321',
  supabaseAnonKey || 'dummy-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = (): boolean => {
  return Boolean(supabaseUrl && supabaseAnonKey);
};

// Helper function to check if we should use localStorage
export const useLocalStorage = (): boolean => {
  const useLocal = import.meta.env.VITE_USE_LOCAL_STORAGE === 'true';
  return useLocal || !isSupabaseConfigured();
};
