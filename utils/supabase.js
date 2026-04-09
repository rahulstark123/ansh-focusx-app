import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoTrueClient } from '@supabase/auth-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Keep a clear startup error instead of silent auth failures.
  throw new Error(
    'Missing Supabase env vars. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.'
  );
}

const auth = new GoTrueClient({
  url: `${supabaseUrl}/auth/v1`,
  headers: { apikey: supabaseAnonKey },
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: false,
  storage: AsyncStorage,
});

export const supabase = { auth };
