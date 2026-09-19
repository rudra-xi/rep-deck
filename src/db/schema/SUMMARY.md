# `src/db/schema/` — Data Model

Every Drizzle table definition lives here. This is the single source of
truth for the shape of Rep Deck's data.

## Design Principles

- **Units are normalized at rest.** Weights in **kg**, measurements in
  **inches**. Conversion happens only in the UI via `UnitProvider`.
- **History is immutable.** A workout log references the exact program
  version it was performed under. Editing a program never rewrites past
  logs.
- **Derived values are computed once and stored** (e.g., `isPR`) so
  historical reads are cheap and stable.

## Tables & Relationships

### `users`

Core identity. `id` is a UUID and matches the Supabase Auth user ID.

- `email`, `name`, `avatarSeed` — profile data.
- `weightUnit`, `measurementUnit` — user preferences (stored here, not
  in a separate table). Defaults: `"kg"` and `"in"`.

**Relations:** has many `programTemplates`, `workoutSessions`,
`bodyMeasurements`.

### `programTemplates`

A versioned training program (e.g., "Power & Peak v3").

- `active` (boolean) — only **one** program per user should be active.
- `version` (integer) — incremented when a program is duplicated/edited.
- `startDate` (timestamp, nullable) — when the program block began.
- `endDate` (timestamp, nullable) — when the program block ended.

**Relations:** belongs to `users`; has many `programDayTemplates`.

### `programDayTemplates`

A single training day within a program (e.g., "Day 1 – Heavy Push").

- `dayIndex` (integer) — order in the cycle (1, 2, 3…).
- `label` (text) — display name for the day.

**Relations:** belongs to `programTemplates`; has many `exerciseTemplates`.

### `exerciseTemplates`

A planned exercise within a day (e.g., "Bench Press, 4×4–6").

- `order` (integer) — display order within the day.
- `type` (text) — e.g., "Chest", "Back", "Legs".
- `targetSets` (integer, nullable).
- `targetRepRange` (text, nullable) — e.g., "4-6".

**Relations:** belongs to `programDayTemplates`; referenced by
`workoutSets.templateId`.

### `workoutSessions`

A completed workout on a specific date.

- `date` (timestamp) — when the session was performed.
- `dayIndex` (integer, nullable) — which day of the program was performed.
- `notes` (text, nullable) — session-level note.

**Relations:** belongs to `users` and optionally `programTemplates`
(`onDelete: "set null"`); has many `workoutSets`.

### `workoutSets`

A single set logged during a session. This is the heart of the model.

- `weight` (decimal, mode: number) — **kg**.
- `reps` (integer).
- `rpe` (decimal, mode: number, nullable) — optional Rate of Perceived
  Exertion.
- `isPR` (boolean, default false) — flagged at save time by
  `checkIfPR()`.
- `setNumber` (integer) — order within the exercise.
- `templateId` (uuid, nullable) — optionally references
  `exerciseTemplates` (`onDelete: "set null"`).
- `notes` (text, nullable) — per-set note.

**Relations:** belongs to `workoutSessions`; optionally references
`exerciseTemplates`.

### `bodyMeasurements`

A single point-in-time measurement entry.

- `weightKg` (decimal, mode: number, nullable).
- `bodyFatPercent` (decimal, mode: number, nullable).
- `armsIn`, `forearmsIn`, `thighsIn`, `chestIn`, `waistIn`, `hipsIn` —
  **inches** (decimal, mode: number, nullable).
- `notes` (text, nullable).

**Relations:** belongs to `users`.

## Indexes

- `users` — primary key only.
- `program_templates` — `userId`, `active`.
- `program_day_templates` — `programId`.
- `exercise_templates` — `programDayId`.
- `workout_sessions` — `userId`, `programId`, `date`.
- `workout_sets` — `sessionId`, `exerciseName`.
- `body_measurements` — `userId`, `date`.

## Key Design Decisions

- **Versioning:** Editing a `programTemplate` never mutates history.
  Completed `workoutSessions` reference the exact version they ran under.
- **PR logic:** `isPR` is computed at save time by comparing the Epley
  1RM of the set against all prior sets for that exercise.
- **Unit normalization:** the DB is the source of truth for units
  (kg / inches). All conversion happens in the view layer.
- **Cascade behavior:** `workoutSets` cascade-delete with their session.
  `programDayTemplates` and `exerciseTemplates` cascade-delete with
  their parent. `workoutSessions.programId` uses `SET NULL` so deleting
  a program does **not** erase history.

## Do Not

- Don't add a `weight_lb` column "for convenience." Convert in the UI.
- Don't add cascade deletes from `programTemplates` to
  `workoutSessions` — that would erase history.
- Don't store derived 1RM unless you also keep the raw `weight` and
  `reps`; the raw values are the source of truth.
