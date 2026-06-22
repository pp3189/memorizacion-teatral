import React, { useState } from "react";
import { motion } from "motion/react";
import { Sparkles, Drama, ShieldAlert, UserCheck, Lock, Loader2 } from "lucide-react";
import { Character } from "../types";
import { getCharacterByExactName } from "../lib/db";
import { adminLogin } from "../lib/auth";
import { isSupabaseConfigured } from "../lib/supabase";

interface LoginScreenProps {
  onActorAuthenticated: (character: Character, actorName: string) => void;
  onAdminAuthenticated: () => void | Promise<void>;
}

export default function LoginScreen({
  onActorAuthenticated,
  onAdminAuthenticated,
}: LoginScreenProps) {
  const [actorName, setActorName] = useState<string>("");
  const [characterName, setCharacterName] = useState<string>("");
  const [actorLoading, setActorLoading] = useState<boolean>(false);

  const [adminEmail, setAdminEmail] = useState<string>("");
  const [adminPassword, setAdminPassword] = useState<string>("");
  const [adminLoading, setAdminLoading] = useState<boolean>(false);

  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleActorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!actorName.trim()) {
      setErrorMsg("Por favor, ingresa tu nombre de actor.");
      return;
    }
    if (!characterName.trim()) {
      setErrorMsg("Ingresa el nombre exacto del personaje proporcionado por tu director.");
      return;
    }
    setActorLoading(true);
    try {
      const character = await getCharacterByExactName(characterName);
      if (!character) {
        setErrorMsg(
          "No encontramos ningún personaje con ese nombre exacto. Verifícalo con tu director (mayúsculas y tildes cuentan)."
        );
        return;
      }
      onActorAuthenticated(character, actorName.trim());
    } catch (err) {
      console.error(err);
      setErrorMsg("Ocurrió un error al buscar el personaje. Intenta de nuevo.");
    } finally {
      setActorLoading(false);
    }
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setAdminLoading(true);
    try {
      const result = await adminLogin(adminEmail, adminPassword);
      if (!result.ok) {
        setErrorMsg(result.error || "No se pudo iniciar sesión.");
        return;
      }
      await onAdminAuthenticated();
    } catch (err) {
      console.error(err);
      setErrorMsg("Error al iniciar sesión como administrador.");
    } finally {
      setAdminLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden bg-[#fbfaf7] selection:bg-theatre-maroon/10">
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-theatre-maroon via-red-800 to-theatre-maroon opacity-90"></div>

      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch relative z-10">
        {/* Columna izquierda: marca */}
        <motion.div
          initial={{ opacity: 0, x: -25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col justify-between p-8 md:p-12 rounded-2xl bg-gradient-to-b from-[#1e1414] to-[#140b0b] text-stone-100 border border-stone-800 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-theatre-maroon/20 blur-3xl pointer-events-none"></div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-theatre-gold/30 bg-theatre-gold/10 text-theatre-gold text-xs font-mono uppercase tracking-wider mb-6">
              <Drama className="w-3.5 h-3.5" />
              Estudio & Memorización
            </div>

            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light tracking-tight mb-4 text-stone-100">
              Método<span className="text-theatre-gold font-normal">Actor</span>
            </h1>
            <p className="text-stone-400 font-light text-sm md:text-base leading-relaxed mb-8">
              La plataforma de ensayo cognitivo para actores teatrales. Memoriza biografías de personajes, interioriza antecedentes psicológicos y supera quizzes escritos con calificación automática.
            </p>
          </div>

          <div className="mt-8 border-t border-stone-800 pt-6 relative z-10">
            <h4 className="text-xs font-mono tracking-widest text-[#d97706] uppercase mb-3">
              ¿Cómo funciona?
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400 font-light">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-theatre-gold"></span>
                El Director precarga la biografía y preguntas clave.
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-theatre-gold"></span>
                El actor ingresa el nombre exacto de su personaje para estudiar.
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-theatre-gold"></span>
                Al entrar al examen no se puede volver a estudiar: se califica solo.
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Columna derecha: accesos */}
        <motion.div
          initial={{ opacity: 0, x: 25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col justify-center p-8 bg-white border border-stone-200/80 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300"
        >
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-theatre-maroon text-xs text-stone-800 rounded flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-theatre-maroon shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Acceso del actor */}
          <div className="mb-8">
            <h2 className="font-serif text-2xl font-semibold text-stone-900 border-b border-stone-100 pb-3 mb-4 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-theatre-maroon" />
              Ingreso Actor
            </h2>

            <form onSubmit={handleActorSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono tracking-wider uppercase text-stone-500 mb-1">
                  Tu Nombre de Actor / Actriz
                </label>
                <input
                  type="text"
                  required
                  value={actorName}
                  onChange={(e) => {
                    setActorName(e.target.value);
                    setErrorMsg("");
                  }}
                  placeholder="Ej. Sofía Martín"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-stone-200 text-sm bg-stone-50/50 focus:bg-white focus:ring-2 focus:ring-theatre-maroon/20 focus:border-theatre-maroon outline-none transition-all font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-mono tracking-wider uppercase text-stone-500 mb-1">
                  Nombre exacto del personaje
                </label>
                <input
                  type="text"
                  required
                  value={characterName}
                  onChange={(e) => {
                    setCharacterName(e.target.value);
                    setErrorMsg("");
                  }}
                  placeholder="Escribe el nombre tal como te lo dieron"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-stone-200 text-sm bg-stone-50/50 focus:bg-white focus:ring-2 focus:ring-theatre-maroon/20 focus:border-theatre-maroon outline-none transition-all font-sans"
                />
                <span className="text-[10px] text-stone-400 font-light block mt-1">
                  Tu director te proporciona el nombre exacto. Es la llave para acceder a tu personaje.
                </span>
              </div>

              <button
                type="submit"
                disabled={actorLoading}
                className="w-full py-3 px-4 bg-theatre-maroon hover:bg-[#8f1e1e] active:bg-[#661414] text-stone-100 font-serif text-base tracking-wide rounded-lg flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99] disabled:opacity-60 font-medium"
              >
                {actorLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Buscando personaje…
                  </>
                ) : (
                  <>
                    Comenzar Ensayos
                    <Sparkles className="w-4 h-4 text-theatre-gold" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Divisor */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-stone-200"></div>
            <span className="flex-shrink mx-4 text-stone-400 text-xs font-mono uppercase tracking-widest">o</span>
            <div className="flex-grow border-t border-stone-200"></div>
          </div>

          {/* Acceso del administrador */}
          <div className="mt-6">
            <h2 className="font-serif text-lg font-semibold text-stone-900 mb-3 flex items-center gap-2">
              <Lock className="w-4 h-4 text-stone-500" />
              Panel de Control (Dirección)
            </h2>
            <p className="text-xs text-stone-500 font-light mb-4">
              Accede con tu cuenta para cargar biografías, editar personajes, personalizar preguntas y monitorear el progreso del elenco.
            </p>

            <form onSubmit={handleAdminSubmit} className="space-y-3">
              <input
                type="email"
                required={isSupabaseConfigured}
                value={adminEmail}
                onChange={(e) => {
                  setAdminEmail(e.target.value);
                  setErrorMsg("");
                }}
                placeholder={isSupabaseConfigured ? "Correo de administrador" : "Correo (opcional en modo local)"}
                className="w-full px-3.5 py-2.5 rounded-lg border border-stone-200 text-sm bg-stone-50/50 focus:bg-white focus:ring-2 focus:ring-stone-300 outline-none transition-all font-sans"
              />
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => {
                  setAdminPassword(e.target.value);
                  setErrorMsg("");
                }}
                placeholder="Contraseña"
                className="w-full px-3.5 py-2.5 rounded-lg border border-stone-200 text-sm bg-stone-50/50 focus:bg-white focus:ring-2 focus:ring-stone-300 outline-none transition-all font-sans"
              />
              <button
                type="submit"
                disabled={adminLoading}
                className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 active:bg-stone-950 text-stone-100 font-sans text-xs font-semibold tracking-wider uppercase rounded-lg border border-stone-800 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-60"
              >
                {adminLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Ingresando…
                  </>
                ) : (
                  "Ingresar como Administrador"
                )}
              </button>
            </form>
            {!isSupabaseConfigured && (
              <p className="text-[10px] text-amber-600 font-mono mt-2 leading-snug">
                Modo local activo (sin Supabase). Contraseña por defecto: <strong>admin123</strong>. Configura Supabase para producción.
              </p>
            )}
          </div>
        </motion.div>
      </div>

      <div className="mt-16 text-center text-stone-400 text-xs font-mono max-w-lg">
        <p>© 2026 MétodoActor • Hecho para el Elenco Teatral</p>
        <p className="mt-1 text-[10px] text-stone-400">Permite memorizar de manera autónoma sin revelar la hoja del guión.</p>
      </div>
    </div>
  );
}
