import { supabase, isSupabaseConfigured } from "./supabase";

/**
 * Autenticación del administrador (Director).
 *
 * - Con Supabase configurado: login real con email + contraseña (Supabase Auth).
 * - Sin Supabase: contraseña local definida en `VITE_ADMIN_PASSWORD`
 *   (por defecto "admin123") para poder probar en desarrollo.
 */

const LOCAL_ADMIN_PASSWORD =
  (import.meta.env.VITE_ADMIN_PASSWORD as string | undefined) || "admin123";

const LS_LOCAL_ADMIN = "metodo_actor_local_admin";

export interface AdminLoginResult {
  ok: boolean;
  error?: string;
}

export async function adminLogin(
  email: string,
  password: string
): Promise<AdminLoginResult> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) {
      return { ok: false, error: "Credenciales inválidas. Verifica tu correo y contraseña." };
    }
    return { ok: true };
  }

  // Modo local (sin Supabase)
  if (password === LOCAL_ADMIN_PASSWORD) {
    localStorage.setItem(LS_LOCAL_ADMIN, "1");
    return { ok: true };
  }
  return { ok: false, error: "Contraseña incorrecta." };
}

export async function adminLogout(): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    await supabase.auth.signOut();
    return;
  }
  localStorage.removeItem(LS_LOCAL_ADMIN);
}

/** Devuelve true si hay una sesión de administrador activa. */
export async function isAdminLoggedIn(): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase.auth.getSession();
    return Boolean(data.session);
  }
  return localStorage.getItem(LS_LOCAL_ADMIN) === "1";
}
