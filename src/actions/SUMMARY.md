# `src/actions/` — Server Actions

Every data mutation in Rep Deck goes through a Server Action here. This
folder is the app's API surface. Pages and components **import** from
this folder; they never talk to `src/db/` directly.

## Files, by Domain

- `auth.ts` — sign in / sign out / session helpers. `getCurrentUser()`
  is the canonical auth check used by every other action. Also owns
  `syncUserWithDatabase()` and avatar-seed backfill.
- `account.ts` — user profile (name) and unit preferences
  (`weightUnit`, `measurementUnit`). Reads preferences via
  `getUserPreferences()`.
- `workout.ts` — create, edit, delete `workoutSessions` and their sets.
  Handles the `isPR` computation on save via `checkIfPR()`. Also
  provides batched exercise performance lookups.
- `plans.ts` — create, edit, duplicate, activate `programTemplates` and
  their nested days/exercises. Responsible for the versioning logic and
  cache purging via `purgePlansCache()`.
- `metrics.ts` — create, read, update, and delete `bodyMeasurements`.
  Converts incoming values to DB-standard units (kg / inches) before
  writing.
- `dashboard.ts` — read-only aggregations for the dashboard view (KPIs,
  last workout, strength trend).
- `progress.ts` — read-only aggregations for the progress charts
  (strength overview, lift details, recent sessions, training frequency,
  body metrics).

## Conventions

- **Every action validates its input.** Use Zod (or your chosen schema
  lib) at the top of the action before touching the DB.
- **Every action calls `revalidatePath(...)`** after a successful write
  so the affected route re-renders with fresh data. `plans.ts` uses
  `purgePlansCache()` to revalidate both `/plans` and `/plans/[id]`.
- **Errors return structured results**, not throws, so the UI can render
  them. Throw only for programmer errors (invariant violations).
- **Authentication is checked inside the action**, not assumed from the
  caller. Server Actions are reachable from anywhere.
- **Unit conversion happens in `metrics.ts` and `workout.ts`** before
  writing to the DB. Reads in `dashboard.ts` and `progress.ts` return
  raw DB units and let the view layer convert.
- **`getUserPreferences()`** from `account.ts` is the single source of
  truth for the user's preferred units. Actions that write measurements
  or weights call it first.

## Do Not

- Don't call another Server Action from inside a Server Action. Extract
  shared logic into a helper in `src/lib/` or `src/db/`. (Note:
  `account.ts` and `metrics.ts` currently call `getCurrentUser()` and
  `getUserPreferences()` from `auth.ts` and `account.ts` respectively —
  these are read-only helpers, not mutations, so the rule is about
  avoiding nested write actions.)
- Don't import these from a Client Component without the `"use server"`
  boundary — the directive belongs at the top of the file, and these
  files already have it.
- Don't do multi-step mutations without a transaction. `workout.ts` wraps
  session + sets creation in `db.transaction(...)`; follow that pattern.
