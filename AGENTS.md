# Rep Deck — Agent Guide

## Project Overview

Strength-training tracker. Next.js 16 (App Router), React Compiler,
TypeScript, Tailwind v4, Drizzle ORM + Postgres (Supabase), Biome.

## Critical Conventions

- **Units:** All weights stored in **kg**, all measurements in **inches**.
  Conversion happens ONLY in `src/lib/units.ts` (via `UnitProvider`) at
  the view layer. Never store lb/cm. DB writes convert via
  `parseWeightToKg` / `parseMeasurementToIn`; DB reads convert via
  `formatWeight` / `formatMeasurement`.
- **1RM:** Epley formula (`weight * (1 + reps / 30)`), computed inline
  at read time in `dashboard.ts` and `progress.ts`. It is **not** stored
  on the set row — only `isPR` (a boolean) is persisted. The raw
  `weight` + `reps` are the source of truth.
- **PRs:** `isPR` is computed at save time by `checkIfPR()` in
  `workout.ts` — it compares the set's Epley 1RM against all prior sets
  for that exercise and flags `true` on a new max.
- **Programs are versioned, not yet immutable.** `duplicatePlan()` bumps
  `version` and creates a new `programTemplates` row, and
  `workoutSessions.programId` uses `onDelete: "set null"` so history
  survives program deletion. However, editing a plan currently mutates
  the existing row in place (`updatePlan`, `addPlanDay`,
  `addExerciseToDay`). Treat "editing forks a new version" as a
  v0.2.0 target, not current behavior.
- **Themes:** `html[data-theme]` + CSS custom properties. All 8 themes
  force `--radius: 0`. Never hardcode a radius.
- **Server actions** live in `src/actions/`, grouped by domain
  (`auth`, `account`, `workout`, `plans`, `metrics`, `dashboard`,
  `progress`). Pages import actions; actions never import from
  `src/components/`. `src/db/` is imported only by actions and the
  seed script — never by client components.
- **Capitalization:** Exercise names, program names, and day labels are
  normalized with `toCapitalized()` from `src/lib/to-capitalized.ts`
  before every DB write. Match this when adding new write paths.

## Folder Map

- `src/app/(user)/` — authenticated routes (dashboard, workout-log,
  metrics, plans, progress)
- `src/app/(extra)/` — public pages (privacy, terms)
- `src/actions/` — server actions (the app's API surface)
- `src/db/` — Drizzle client (`index.ts`), schema (`schema/`), seed
- `src/lib/` — shared helpers (`units.ts`, `storage.ts`, `utils.ts`,
  `to-capitalized.ts`) and context providers
- `src/components/ui/` — design system primitives
- `src/components/@<feature>/` — feature-scoped components
- `src/types/` — shared TypeScript types (`account`, `plans`,
  `progress`, `workout-log`)
- `src/utils/` — pure helper functions (e.g. `one-rep-max.ts`)

## Commands

- `bun dev` — dev server
- `bun run build` — production build
- `bun run lint` / `bun run format` / `bun run check:fix`
- `bunx drizzle-kit push` — push schema
- `bun src/db/seed.ts` — seed (generates ~100 sessions, 6 months
  of measurements, 3 programs)

## Gotchas

- `DATABASE_URL` uses the **pooler** (port 6543) for runtime.
- `DIRECT_URL` uses the **direct** connection (port 5432) for migrations.
  Drizzle config reads `DIRECT_URL`, not `DATABASE_URL`.
- React Compiler is on — don't manually `useMemo`/`useCallback`.
- Biome, not ESLint/Prettier. Don't add them.
- `src/db/index.ts` sets `prepare: false` on the postgres client.
  Don't re-enable it — it breaks against Supavisor.
- Server actions that return data used by `dashboard.ts` or
  `progress.ts` must be consistent about units: those readers return
  **raw DB units** (kg / inches) and let the view convert. `metrics.ts`
  is the exception — it converts on the way out so the metrics page can
  render directly.
- `getUserPreferences()` is the single source of truth for the user's
  chosen units. Any new write path that accepts weights or measurements
  must call it first.
- Auth is checked **inside** every action via `getCurrentUser()`. Never
  assume the caller is authenticated.
- Every mutating action ends with `revalidatePath(...)`. `plans.ts` uses
  `purgePlansCache()` to invalidate both `/plans` and `/plans/[id]`.

## What's Still TODO (v1 → v2)

The `CURRENT_VERSION` in `src/lib/roadmap.ts` is `v0.1.0`. The active
milestone is **v0.2.0 — Programming Core**.

- [ ] **Program assignment flow** — pick a program and auto-generate a
      weekly schedule (e.g. Mon/Wed/Fri) instead of manual day selection.
      Currently `v0.2.0` / "Program assignment" is `planned`.
- [ ] **Program library** — prebuilt templates (full body, upper/lower,
      PPL) with days, exercises, and target sets/reps. In progress.
- [ ] **True program immutability** — `updatePlan`, `addPlanDay`, and
      `addExerciseToDay` currently mutate in place. Move to
      fork-on-edit so `workoutSessions.programId` always points at the
      exact version performed.
- [ ] **Zod validation on every action.** Inputs are currently typed but
      not runtime-validated. See `src/actions/SUMMARY.md`.
- [ ] **Extract shared read helpers** — `dashboard.ts` and `progress.ts`
      both compute Epley 1RM inline. Move to `src/utils/one-rep-max.ts`
      and import from both.
- [ ] **Tests** — no test runner is configured yet. Decide on Vitest or
      `bun test` before v0.2.0 ships.
