# Armory App — Claude Code Context

Self-hosted firearms tracker and range log. Mobile-first, dark UI, Docker Compose deployment.

## Stack

| Layer | Choice |
|---|---|
| Framework | Astro v6, SSR mode (`output: 'server'`), Node adapter (standalone) |
| Styles | Tailwind CSS v4 via `@tailwindcss/vite` |
| Database | SQLite via `better-sqlite3` + Drizzle ORM |
| Auth | Cookie-based session, single env-var password |
| Runtime | Node 22, Docker Compose |

## Project Structure

```
src/
  db/
    schema.ts       — Drizzle table definitions
    index.ts        — DB connection singleton (WAL mode, foreign keys on)
    migrate.ts      — Plain SQL CREATE TABLE IF NOT EXISTS (run on dev start)
  lib/
    auth.ts         — Password check, session cookie helpers, isUsingDefaultPassword()
    uploads.ts      — File upload save + path validation
  layouts/
    Layout.astro    — Shell: top header, bottom nav, default-password banner
  middleware/
    index.ts        — Auth gate; PUBLIC_PATHS = ['/login', '/api/auth/login']
  pages/
    index.astro                  — Dashboard
    login.astro                  — Login form
    firearms/
      index.astro                — Firearms list
      new.astro                  — Add firearm form (GET+POST)
      [id].astro                 — Firearm detail (photo upload, log, accessories)
      [id]/edit.astro            — Edit firearm fields
    sessions/
      index.astro                — Session list
      new.astro                  — New session form
      [id].astro                 — Session detail (firearms used, drills)
      [id]/edit.astro            — Edit session fields
    ammo/
      index.astro                — Ammo inventory + quick +/-50 adjusters
    api/
      auth/login.ts              — POST → set session cookie
      auth/logout.ts             — GET → clear session cookie
      uploads/[...path].ts       — Serve files from data/uploads/ (path-traversal guarded)
  styles/
    global.css      — Tailwind import + custom components (.card, .btn-primary, .btn-secondary, .btn-danger)
```

## Database Schema

All tables use plain integer PKs with autoincrement. No Drizzle migrations — `migrate.ts` runs `CREATE TABLE IF NOT EXISTS` raw SQL.

- `firearms` — make, model, caliber, serial, type, purchase info, notes, photo_path
- `accessories` — linked to firearm; type (optic/light/suppressor/grip/stock/trigger/other)
- `maintenance_logs` — firearm log entries; type (note/cleaning/repair/inspection/modification)
- `ammo_inventory` — caliber, brand, grain, type, quantity, cost_per_round
- `range_sessions` — date, location, duration, weather, notes
- `session_firearms` — join: session ↔ firearm with rounds_fired + optional ammo link
- `drills` — per-session; freeform name, distance, score (text), notes

## Auth

- Default password: `armory` — a yellow banner is shown on all pages until `ARMORY_PASSWORD` is changed
- `checkPassword()` compares against `process.env.ARMORY_PASSWORD ?? 'armory'`
- Session stored as a plain cookie (`armory_session=authenticated`); 30-day expiry
- Astro v6 has built-in CSRF origin checking — POST routes require `Origin` header (browsers send this automatically; raw curl needs `-H "Origin: http://localhost:4321"`)

## File Uploads

Photos stored at `data/uploads/firearms/<timestamp>.<ext>`. Served via `/api/uploads/[...path]`. Allowed: jpg, jpeg, png, webp, heic. Path traversal prevented by checking `resolve(path).startsWith(uploadsDir)`.

## CSS Conventions

Tailwind v4 — custom classes live in `@layer components` in `global.css`. **Do not** use `@apply` with custom class names (e.g., `.btn-primary { @apply btn ... }` — this breaks Tailwind v4's build). Inline all shared utilities instead.

## Common Commands

```bash
# Local dev (initializes DB first)
ARMORY_PASSWORD=mypassword npm run dev

# Production build
npm run build

# Run built server
ARMORY_PASSWORD=mypassword DB_PATH=./data/armory.db node dist/server/entry.mjs

# Docker Compose (recommended)
cp .env.example .env    # set ARMORY_PASSWORD
docker compose up -d --build

# Init DB only (also runs automatically on dev start)
npm run db:init
```

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `ARMORY_PASSWORD` | `armory` | App password. Change before exposing to network. |
| `DB_PATH` | `./data/armory.db` | Absolute path to SQLite file |
| `HOST` | `0.0.0.0` | Listen address (set in Dockerfile) |
| `PORT` | `4321` | Listen port (set in Dockerfile) |

## Data Persistence

All persistent data lives in `data/`:
- `data/armory.db` — SQLite database
- `data/uploads/` — uploaded photos

In Docker, `./data` is bind-mounted to `/data` inside the container. Back up this directory to preserve everything.

## Adding New Features

- **New page**: add `.astro` file under `src/pages/`. GET+POST in the same file is idiomatic — check `Astro.request.method === 'POST'` at the top, handle form actions via `form.get('_action')`, then redirect after mutation.
- **New table**: add to `schema.ts` (Drizzle) and `migrate.ts` (raw SQL `CREATE TABLE IF NOT EXISTS`). Both must stay in sync.
- **New API route**: export named HTTP method handlers (`GET`, `POST`, etc.) from a `.ts` file under `src/pages/api/`.
- **Styling**: use `.card`, `.btn-primary`, `.btn-secondary`, `.btn-danger` for consistency. Add new components to `global.css` under `@layer components`.
