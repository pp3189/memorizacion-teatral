-- =====================================================================
--  MétodoActor — Esquema de base de datos para Supabase
-- =====================================================================
--  Cómo usarlo:
--    1. Crea un proyecto en https://supabase.com
--    2. Abre el panel SQL (SQL Editor) y pega TODO este archivo.
--    3. Ejecútalo (Run). Crea tablas, políticas de seguridad (RLS),
--       la función de acceso por nombre exacto y datos de ejemplo.
--    4. Crea tu usuario administrador en Authentication > Users
--       (Add user > Create new user, con email y contraseña).
-- =====================================================================

-- ---------- Tabla: personajes ----------
create table if not exists public.characters (
  id              text primary key,
  nombre_completo text not null,
  data            jsonb not null,
  created_at      timestamptz not null default now()
);

create index if not exists characters_nombre_lower_idx
  on public.characters (lower(trim(nombre_completo)));

-- ---------- Tabla: intentos de quiz ----------
create table if not exists public.quiz_attempts (
  id               text primary key,
  character_id     text,
  actor_name       text,
  percentage_score int,
  data             jsonb not null,
  created_at       timestamptz not null default now()
);

create index if not exists quiz_attempts_created_idx
  on public.quiz_attempts (created_at);

-- =====================================================================
--  Seguridad a nivel de fila (RLS)
-- =====================================================================
alter table public.characters    enable row level security;
alter table public.quiz_attempts enable row level security;

-- Personajes: solo administradores autenticados pueden leer/crear/editar/borrar.
drop policy if exists "admin_all_characters" on public.characters;
create policy "admin_all_characters"
  on public.characters
  for all
  to authenticated
  using (true)
  with check (true);

-- Intentos de quiz: el administrador autenticado puede ver todo el historial.
drop policy if exists "admin_select_attempts" on public.quiz_attempts;
create policy "admin_select_attempts"
  on public.quiz_attempts
  for select
  to authenticated
  using (true);

-- Intentos de quiz: cualquier actor (anónimo) puede registrar su evaluación.
drop policy if exists "anon_insert_attempts" on public.quiz_attempts;
create policy "anon_insert_attempts"
  on public.quiz_attempts
  for insert
  to anon, authenticated
  with check (true);

-- =====================================================================
--  Función: obtener personaje por nombre EXACTO (puerta del actor)
--  El actor NO puede listar todos los personajes; solo obtiene aquel
--  cuyo nombre exacto le proporcionó el director.
-- =====================================================================
create or replace function public.get_character_by_name(p_name text)
returns setof jsonb
language sql
security definer
set search_path = public
as $$
  select data
  from public.characters
  where lower(trim(nombre_completo)) = lower(trim(p_name))
  limit 1;
$$;

grant execute on function public.get_character_by_name(text) to anon, authenticated;

-- =====================================================================
--  Datos de ejemplo (opcional). Borra este bloque si no los quieres.
-- =====================================================================
insert into public.characters (id, nombre_completo, data, created_at) values
(
  'char-hamlet',
  'Hamlet de Dinamarca',
  '{
    "id":"char-hamlet",
    "nombreCompleto":"Hamlet de Dinamarca",
    "fechaNacimiento":"15 de Mayo de 1599",
    "lugarNacimiento":"Castillo de Elsinor, Dinamarca",
    "nombrePadre":"Rey Hamlet (Espectro)",
    "fechaNacimientoPadre":"04 de Agosto de 1560",
    "nombreMadre":"Reina Gertrudis",
    "fechaNacimientoMadre":"12 de Diciembre de 1568",
    "estudios":"Filosofía del Humanismo y Teología",
    "lugarEstudios":"Universidad de Wittenberg, Alemania",
    "fechaGraduacionSecundaria":"18 de Junio de 1614",
    "fechaGraduacionPreparatoria":"22 de Junio de 1617",
    "fechaGraduacionUniversidad":"Inconclusa (regresó por duelo real)",
    "direccionCasa":"Ala Norte, Torre de los Tapices, Real Castillo de Elsinor",
    "datosAdicionales":"Sufre de profunda melancolía y sospechas constantes. Viste estrictamente de luto negro. Su filósofo de cabecera es Horacio.",
    "playName":"Hamlet (Tragedia de Shakespeare)",
    "assignedActorName":"Sofía Martín",
    "createdAt":"2026-06-15T10:00:00Z",
    "customFields":[
      {"id":"cf-1","label":"Mayor Confidente","value":"Horacio"},
      {"id":"cf-2","label":"Interés Amoroso","value":"Ofelia (Hija de Polonio)"},
      {"id":"cf-3","label":"Objeto Emblemático","value":"El cráneo de Yorick, el bufón"},
      {"id":"cf-4","label":"Secreto Mayor","value":"Sospecha que su tío Claudio envenenó a su padre"}
    ],
    "customQuestions":[
      {"id":"cq-hamlet-1","questionText":"¿De quién es el cráneo que sostiene Hamlet en el cementerio?","expectedAnswer":"Yorick","associatedField":"datosAdicionales"},
      {"id":"cq-hamlet-2","questionText":"¿Quién es el actual rey usurpador y tío de Hamlet?","expectedAnswer":"Claudio","associatedField":"datosAdicionales"},
      {"id":"cq-hamlet-3","questionText":"¿Cuál es el famoso dilema que expresa en su monólogo?","expectedAnswer":"Ser o no ser","associatedField":"datosAdicionales"}
    ]
  }'::jsonb,
  '2026-06-15T10:00:00Z'
),
(
  'char-bernarda',
  'Bernarda Alba',
  '{
    "id":"char-bernarda",
    "nombreCompleto":"Bernarda Alba",
    "fechaNacimiento":"10 de Abril de 1876",
    "lugarNacimiento":"Valderrubio, Granada, España",
    "nombrePadre":"Manuel Alba",
    "fechaNacimientoPadre":"15 de Febrero de 1845",
    "nombreMadre":"Josefa de la Santísima Trinidad",
    "fechaNacimientoMadre":"30 de Octubre de 1851",
    "estudios":"Estudios domésticos y costura tradicional",
    "lugarEstudios":"Hogar familiar, Andalucía",
    "fechaGraduacionSecundaria":"No cursó secundaria oficial",
    "fechaGraduacionPreparatoria":"No cursó preparatoria",
    "fechaGraduacionUniversidad":"Sin estudios universitarios",
    "direccionCasa":"Calle Real Nº 12, Casa de Blancas Paredes Grises",
    "datosAdicionales":"Impone un riguroso luto de ocho años. Controladora extrema, obsesionada con la decencia. Su bastón de mando es el símbolo de su autoridad absoluta.",
    "playName":"La Casa de Bernarda Alba",
    "assignedActorName":"Alejandra Ruiz",
    "createdAt":"2026-06-18T14:30:00Z",
    "customFields":[
      {"id":"cf-b1","label":"Segundo Esposo (Fallecido)","value":"Antonio María Benavides"},
      {"id":"cf-b2","label":"Criada Principal","value":"La Poncia"},
      {"id":"cf-b3","label":"Número de hijas del personaje","value":"Cinco hijas"},
      {"id":"cf-b4","label":"Mayor fobia social","value":"El chisme local y el qué dirán"}
    ],
    "customQuestions":[
      {"id":"cq-bernarda-1","questionText":"¿Cuántos años de riguroso luto impone Bernarda a sus hijas?","expectedAnswer":"Ocho","associatedField":"datosAdicionales"},
      {"id":"cq-bernarda-2","questionText":"¿Qué objeto representa la autoridad absoluta de Bernarda en escena?","expectedAnswer":"Su bastón","associatedField":"datosAdicionales"}
    ]
  }'::jsonb,
  '2026-06-18T14:30:00Z'
)
on conflict (id) do nothing;
