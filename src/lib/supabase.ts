// Supabase client for Next.js
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

let supabaseInstance: SupabaseClient<Database> | null = null;

export function getSupabaseClient() {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a dummy client for build time
    if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
      throw new Error('Supabase URL and Anon Key must be provided');
    }
    // During build, return a mock that won't be used
    return null as any;
  }

  supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  });

  return supabaseInstance;
}

// Export a getter for backwards compatibility
export const supabase = new Proxy({} as SupabaseClient<Database>, {
  get(target, prop) {
    const client = getSupabaseClient();
    return client[prop as keyof SupabaseClient<Database>];
  }
});
