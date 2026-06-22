# MétodoActor — Memorizador de Personajes para Actores

Aplicación web para que un **director** cargue biografías de personajes y los
**actores** las memoricen y se autoevalúen con un examen escrito que se
**califica automáticamente**.

## Características

- **Login de administrador (Director)** con Supabase Auth (email + contraseña).
- **Dashboard de administración**: crear/editar/eliminar personajes, banco de
  preguntas personalizadas y panel de progreso del elenco.
- **Acceso del actor por nombre exacto**: para estudiar su personaje, el actor
  debe ingresar el **nombre exacto** que le proporcionó el director (no hay lista
  desplegable que revele los personajes).
- **Examen autocalificado**: al entrar al área de preguntas **ya no se puede
  volver a estudiar**; las respuestas se califican solas (con tolerancia a
  acentos, mayúsculas y aproximaciones razonables).
- Persistencia en **Supabase** (Postgres + RLS). Sin Supabase, funciona en modo
  local con `localStorage` para pruebas.

## Stack

React 19 + Vite + TypeScript + Tailwind CSS v4 + Supabase. Listo para **Vercel**.

---

## 1. Configurar Supabase

1. Crea un proyecto en https://supabase.com
2. Abre **SQL Editor**, pega el contenido de [`supabase/schema.sql`](supabase/schema.sql)
   y ejecútalo. Esto crea las tablas, las políticas de seguridad (RLS), la
   función de acceso por nombre exacto y dos personajes de ejemplo.
3. Crea tu usuario administrador en **Authentication → Users → Add user →
   Create new user** (email y contraseña). Con ese correo y contraseña entrarás
   al panel de dirección.
4. Copia desde **Settings → API**:
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon public` key → `VITE_SUPABASE_ANON_KEY`

## 2. Ejecutar localmente

```bash
npm install
cp .env.example .env.local   # y rellena tus claves de Supabase
npm run dev
```

Abre http://localhost:3000

> **Modo local sin Supabase:** si no configuras las variables, la app usa
> `localStorage` y la contraseña de administrador por defecto es `admin123`
> (configurable con `VITE_ADMIN_PASSWORD`). Útil para probar la interfaz.

## 3. Desplegar en Vercel

1. Sube el proyecto a un repositorio de GitHub.
2. En https://vercel.com → **New Project** → importa el repositorio.
   Vercel detecta Vite automáticamente (build: `npm run build`, output: `dist`).
3. En **Settings → Environment Variables** agrega:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. **Deploy**.

`vercel.json` ya incluye las reglas de *rewrite* para que la SPA funcione en
cualquier ruta.

---

## Flujo de uso

- **Director:** inicia sesión → carga personajes y define el nombre exacto de
  cada uno → entrega a cada actor el nombre exacto de su personaje.
- **Actor:** escribe su nombre y el nombre exacto del personaje → estudia la
  ficha y las tarjetas → entra al examen (queda bloqueado el regreso a estudio)
  → recibe su calificación automática. El intento queda registrado para que el
  director lo vea en el panel de progreso.
