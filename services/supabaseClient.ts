import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('forge_files').select('count').limit(1);
    if (error) throw error;
    return { success: true, message: 'Connected to Supabase' };
  } catch (error: any) {
    console.warn('Supabase connection test failed (table might not exist):', error.message);
    return { success: false, message: error.message };
  }
};
