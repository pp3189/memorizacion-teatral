import { Character, QuizAttempt } from "../types";
import { supabase, isSupabaseConfigured } from "./supabase";
import { INITIAL_CHARACTERS, INITIAL_HISTORY } from "../data/initialData";

/**
 * Capa de acceso a datos.
 *
 * Si Supabase está configurado, todo persiste en la base de datos.
 * Si no, se usa localStorage como respaldo (modo demo / desarrollo local).
 *
 * Las filas de Supabase guardan el objeto completo en una columna JSONB `data`,
 * lo que evita mapear campo por campo y mantiene la flexibilidad de los
 * campos y preguntas personalizadas.
 */

const LS_CHARACTERS = "metodo_actor_characters";
const LS_HISTORY = "metodo_actor_history";

// ---------- Respaldo localStorage ----------

function lsRead<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch (e) {
    console.error("Error leyendo localStorage", key, e);
  }
  return fallback;
}

function lsWrite<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Error escribiendo localStorage", key, e);
  }
}

// ---------- Personajes ----------

export async function listCharacters(): Promise<Character[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("characters")
      .select("data")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []).map((row) => row.data as Character);
  }
  return lsRead<Character[]>(LS_CHARACTERS, INITIAL_CHARACTERS);
}

/**
 * Búsqueda de personaje por nombre EXACTO (puerta de entrada del actor).
 * En Supabase usa una función RPC (`get_character_by_name`) para que el actor
 * solo pueda obtener el personaje cuyo nombre conoce, sin listar el resto.
 */
export async function getCharacterByExactName(
  name: string
): Promise<Character | null> {
  const target = name.trim().toLowerCase();
  if (!target) return null;

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.rpc("get_character_by_name", {
      p_name: name.trim(),
    });
    if (error) throw error;
    if (!data || (Array.isArray(data) && data.length === 0)) return null;
    const row = Array.isArray(data) ? data[0] : data;
    return (row.data ?? row) as Character;
  }

  const chars = lsRead<Character[]>(LS_CHARACTERS, INITIAL_CHARACTERS);
  return (
    chars.find((c) => c.nombreCompleto.trim().toLowerCase() === target) || null
  );
}

export async function addCharacter(character: Character): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from("characters").insert({
      id: character.id,
      nombre_completo: character.nombreCompleto,
      data: character,
      created_at: character.createdAt,
    });
    if (error) throw error;
    return;
  }
  const chars = lsRead<Character[]>(LS_CHARACTERS, INITIAL_CHARACTERS);
  lsWrite(LS_CHARACTERS, [character, ...chars]);
}

export async function updateCharacter(character: Character): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase
      .from("characters")
      .update({
        nombre_completo: character.nombreCompleto,
        data: character,
      })
      .eq("id", character.id);
    if (error) throw error;
    return;
  }
  const chars = lsRead<Character[]>(LS_CHARACTERS, INITIAL_CHARACTERS);
  lsWrite(
    LS_CHARACTERS,
    chars.map((c) => (c.id === character.id ? character : c))
  );
}

export async function deleteCharacter(id: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from("characters").delete().eq("id", id);
    if (error) throw error;
    return;
  }
  const chars = lsRead<Character[]>(LS_CHARACTERS, INITIAL_CHARACTERS);
  lsWrite(
    LS_CHARACTERS,
    chars.filter((c) => c.id !== id)
  );
}

// ---------- Intentos de quiz ----------

export async function listAttempts(): Promise<QuizAttempt[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("quiz_attempts")
      .select("data")
      .order("created_at", { ascending: true });
    if (error) throw error;
    return (data || []).map((row) => row.data as QuizAttempt);
  }
  return lsRead<QuizAttempt[]>(LS_HISTORY, INITIAL_HISTORY);
}

export async function addAttempt(attempt: QuizAttempt): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from("quiz_attempts").insert({
      id: attempt.id,
      character_id: attempt.characterId,
      actor_name: attempt.actorName,
      percentage_score: attempt.percentageScore,
      data: attempt,
      created_at: attempt.timestamp,
    });
    if (error) throw error;
    return;
  }
  const history = lsRead<QuizAttempt[]>(LS_HISTORY, INITIAL_HISTORY);
  lsWrite(LS_HISTORY, [...history, attempt]);
}
