# `src/types/` — Shared TypeScript Types

Domain types and shared interfaces that don't belong to a single file or
feature. Types that are only used in one file should stay in that file.
Types that are used in two or more places graduate to here.

## Files

- `account.ts` — `UserProfile` and `UserPreferences` interfaces.
- `plans.ts` — `ExerciseWithMeta`, `DayWithExercises`, and
  `PlanWithStructure` types derived from Drizzle schema types.
- `progress.ts` — `BodyMetricPoint`, `LiftDetailPoint`,
  `SessionHistoryItem`, `TrainingFrequencyDay`,
  `StrengthOverviewPoint`, and `MeasurementPoint` for progress-page data.
- `workout-log.ts` — `LoggedSet`, `Exercise`, `Day`,
  `ExercisePerformanceSummary`, and `ExercisePerformanceWithPR` for the
  workout-log flow.
- `index.ts` — Barrel export. Import from `@/types` rather than deep
  paths.

## Conventions

- **Derive, don't duplicate.** If a type can be inferred from a Drizzle
  schema or a Zod schema, infer it. Hand-written types drift.
  `plans.ts` derives from `@/db/schema` types.
- **No runtime code.** This folder is types-only. If it has a `.js`
  output, it doesn't belong here.
- **Prefer specific names over generic ones.** `WorkoutSet` beats `Set`
  (which collides with the JS built-in).

## Do Not

- Don't put a type here "just in case." Types used once stay local.
- Don't re-export types from other packages (e.g. `z.infer<typeof X>`)
  unless the schema itself also lives in this folder.
- Don't declare ambient globals here — those go in a `global.d.ts` at
  the project root.
