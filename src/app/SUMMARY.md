# `src/app/` — Routes & Layouts

Next.js 16 App Router. Every folder here is a route segment. Pages are
thin: they fetch data via `src/actions/` and delegate rendering to a
`client-page.tsx` co-located in the same folder. Layouts own metadata and
page chrome; they do not fetch domain data unless the segment is
authenticated.

## Route Groups

- `(user)/` — authenticated app shell. Wrapped by a single layout that
  fetches `getUserPreferences()` + `getUserProfile()`, mounts
  `UnitProvider`, `Navigation`, and `main-padding`. Contains
  `dashboard`, `workout-log`, `metrics`, `plans`, `progress`, `account`.
- `(extra)/` — public legal pages (`privacy`, `terms`). Share a minimal
  layout; no auth check, no nav.
- `(_test)/` — scratch pages. Safe to delete. Not linked from anywhere.

## Per-Route Convention

Every user-facing route folder follows the same shape:

```
<route>/
  layout.tsx        ← metadata only (`export const metadata`)
  page.tsx          ← server component; fetches, then renders client-page
  client-page.tsx   ← "use client"; the actual UI
```

- `page.tsx` **never** renders JSX directly for `(user)` routes — it
  calls an action and passes the result as `initial*` props.
- `client-page.tsx` owns local UI state (selections, optimistic updates,
  modal open/close). It receives server data as props and never fetches
  on mount unless it needs a time-range refetch (e.g. `metrics`).
- `layout.tsx` is metadata-only for nested routes. The real chrome comes
  from the parent `(user)/layout.tsx`.

## Route Inventory

### `(user)/layout.tsx`

Server component. Fetches `getUserPreferences()` and `getUserProfile()`
in parallel, wraps children in `<UnitProvider>`, renders `<Navigation>`
and `<main className="main-padding">`. All unit conversion in the tree
below depends on this provider.

### `(user)/dashboard/`

- `page.tsx` → renders `<DashboardClientPage />` (no props).
- `client-page.tsx` → calls `useDashboardData()` hook, which calls
  `getDashboardData()`. Renders KPI cards, challenge card, strength
  chart, last-workout snapshot.

### `(user)/workout-log/`

- `page.tsx` → `getActiveWorkoutPlan()`, passes as `initialPlan`.
- `client-page.tsx` → owns draft state via `useWorkoutDraft`,
  `useExerciseInputs`, `useExercisePerformance`. Lifts the performance
  map so both `PlannedExercises` and `ActiveSessionSummary` share it.
  Empty state when `initialPlan` is `null`.
- `[id]/page.tsx` → dynamic route. `getWorkoutSessionDetails(id)`,
  `notFound()` on miss, renders `<WorkoutDetail>`.

### `(user)/metrics/`

- `page.tsx` → renders `<MetricsClientPage />`.
- `client-page.tsx` → fetches `getMetricsData("3M")` on mount via
  `useEffect` (not via props) because the time-range toggle refetches.
  Owns `initialData` + `loading`.

### `(user)/plans/`

- `page.tsx` → `getUserPlans()`, passes as `initialPlans`.
- `client-page.tsx` → owns `selectedPlanId`, `selectedDayId`,
  optimistic `setActivePlan`. Syncs local state back to server props on
  revalidation via `useEffect`. Empty state when no plans exist.

### `(user)/progress/`

- `page.tsx` → server-side auth guard: `getCurrentUser()`, redirect to
  `/` if unauthenticated. Renders `<ProgressClientPage />`.
- `client-page.tsx` → owns `timeRange` state (`"2M" | "3M" | "6M" | "1Y"`).
  Child cards fetch their own data.

### `(user)/account/`

- `page.tsx` → `Promise.all([getUserProfile(), getUserPreferences()])`,
  passes both as props.
- `client-page.tsx` → renders `ProfileSection`, `PreferencesSection`,
  `ThemeSection`, `FeedbackSection`, `AboutSection`. No local state —
  each section owns its own.

### `(extra)/privacy/` and `(extra)/terms/`

- Static legal content. `page.tsx` is `"use client"` (for the TOC anchor
  links and `BackButton`), but has no data fetching. `layout.tsx` sets
  the page title. Both share a local `BulletList` helper — if a third
  legal page is added, extract it.

### Root files

- `layout.tsx` — root HTML shell. Loads Oxanium via `next/font`, sets
  `<html className="h-full antialiased">`, wraps children in
  `<LayoutProvider>`. Owns the full metadata object (OG, Twitter,
  keywords, icons).
- `provider.tsx` — `"use client"`. Mounts `ThemeProvider` (next-themes,
  default `violateeye`, 8 themes), conditionally renders `Navigation` and
  `Footer` (hidden on `/`), mounts `<Toaster>`.
- `not-found.tsx` — 404 UI. Brand + "Back to dashboard" / "Home".
- `error.tsx` — route-level error boundary. Reset + Home buttons.
- `global-error.tsx` — root error boundary. Must render its own `<html>`
  and `<body>`; imports `globals.css` directly.

### API routes

- `auth/signin/route.ts` — GET; initiates Google OAuth via Supabase,
  redirects to provider URL.
- `auth/callback/route.ts` — GET; exchanges `code` for session, calls
  `syncUserWithDatabase()`, redirects to `next` (validated to start with
  `/`) or `/dashboard`.
- `auth/test/route.ts` (if present) — GET; returns the authenticated
  user or 401. Used for smoke-testing auth wiring.

## Conventions

- **Metadata lives in `layout.tsx`, not `page.tsx`.** Even for
  single-page routes, use a `layout.tsx` to export `metadata`.
- **`page.tsx` is a server component.** It may be `async` and may
  `redirect()` / `notFound()`. It should not import `useState` or any
  client hook.
- **`client-page.tsx` is a client component.** It receives `initial*`
  props from the server page and owns interaction state.
- **Auth guards:** `(user)/layout.tsx` does not enforce auth — it
  assumes it. Individual pages that need a hard guard (e.g. `progress`)
  call `getCurrentUser()` and `redirect("/")` themselves. If you add a
  new `(user)` route, decide explicitly whether it needs a guard.
- **Empty states** live in `client-page.tsx`, not `page.tsx`, because
  they need the client-side `CreatePlanDialog` / `Link` interactions.

## Do Not

- Don't fetch from `client-page.tsx` on mount unless the data depends on
  client state (time range, filters). Pass it down from `page.tsx`.
- Don't put `"use server"` in any file under `src/app/`. Server actions
  belong in `src/actions/`.
- Don't add a `<Navigation>` or `<Footer>` to individual route layouts —
  they're mounted once in `provider.tsx` and `(user)/layout.tsx`.
- Don't hardcode `--radius`. All 8 themes force `0`; use
  `rounded-none` or the `fcard-flat` utility.
- Don't delete `(_test)/` blindly — check for git-tracked experiments
  first, but the folder is intended as scratch space.
