import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase client singleton.
 *
 * Las credenciales se leen de variables de entorno de Vite:
 *   - VITE_SUPABASE_URL
 *   - VITE_SUPABASE_ANON_KEY
 *
 * Si NO están configuradas, el cliente es `null` y la app cae automáticamente
 * a un modo local (localStorage) para que puedas probarla sin backend.
 * En producción (Vercel) define ambas variables y la app usará Supabase.
 */

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url!, anonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;
