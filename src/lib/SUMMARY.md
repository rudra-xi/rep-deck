# `src/lib/` — Shared Logic & Providers

The "glue" of Rep Deck: context providers, pure utilities, and any
cross-cutting concern that doesn't belong to a single feature folder.
If a piece of logic is used by more than one feature, it lives here.

## Files

- `units.ts` — pure conversion helpers (kg ↔ lb, in ↔ cm) plus
  `formatWeight`, `parseWeightToKg`, `formatMeasurement`,
  `parseMeasurementToIn`, and unit label maps. **All unit conversion
  happens here**, at the view layer. The database never sees lb or cm.
- `storage.ts` — typed `localStorage` wrappers for workout drafts.
  Exports `STORAGE_KEYS`, `clearAllWorkoutData()`,
  `clearWorkoutSession()`, `hasWorkoutData()`, and
  `getAllWorkoutData()`.
- `utils.ts` — small generic helpers. Currently exports `cn()` for
  class merging (clsx + tailwind-merge).
- `to-capitalized.ts` — `toCapitalized(str)` — capitalizes the first
  letter of each word. Used across actions to normalize exercise names,
  program names, and labels.

## Conventions

- **Pure functions only in named modules.** Anything with React state
  lives in a `*Provider.tsx` or a hook under `src/hooks/`.
- **No DB imports.** If a helper needs data, it takes it as an argument.
  Data fetching belongs in `src/actions/`.
- **Types are exported alongside the function** they describe.

## Do Not

- Don't put feature-specific logic here. If only the workout-log flow
  uses it, it belongs in `src/components/@workout-log/`.
- Don't import from `src/components/` here. This layer is a dependency
  of the UI, not a consumer of it.
