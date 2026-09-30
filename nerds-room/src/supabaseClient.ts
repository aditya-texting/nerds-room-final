
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Global error logger for missing env vars
if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase configuration missing!');
}

// Ensure we don't pass undefined/empty string to createClient as it might throw
// We use a guard or a valid placeholder that wont crash on init
const validUrl = (supabaseUrl && supabaseUrl.startsWith('http')) ? supabaseUrl : 'https://placeholder.supabase.co';
const validKey = supabaseAnonKey || 'placeholder';

export const supabase = createClient(validUrl, validKey);
