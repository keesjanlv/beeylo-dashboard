// Supabase client for Next.js
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('[Supabase] Missing environment variables:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
  });
}

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(
  supabaseUrl || '',
  supabaseAnonKey || '',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);

// For backward compatibility
export function getSupabaseClient() {
  return supabase;
}
