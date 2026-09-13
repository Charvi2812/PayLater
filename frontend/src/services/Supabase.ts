import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim().replace(/\/+$/, '');
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

export const supabaseConfigError = !supabaseUrl.startsWith('https://')
  ? 'VITE_SUPABASE_URL must be your full Supabase project URL.'
  : !supabaseAnonKey
  ? 'VITE_SUPABASE_ANON_KEY must contain a valid Supabase publishable or anon key.'
  : null;

// Do not construct a client with empty configuration: Supabase throws during
// module import, which previously resulted in a blank page before React loaded.
export const supabase: SupabaseClient | null = supabaseConfigError
  ? null
  : createClient(supabaseUrl, supabaseAnonKey);
