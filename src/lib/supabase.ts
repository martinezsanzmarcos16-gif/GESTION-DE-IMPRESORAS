import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Faltan las variables de entorno VITE_SUPABASE_URL y/o VITE_SUPABASE_ANON_KEY. Configura el archivo .env.local para poder conectar a Supabase.');
}

export const supabase = createClient(
  supabaseUrl || 'http://localhost:54321', // Fallback value just to avoid breaking during setup
  supabaseAnonKey || 'public-anon-key'
);
