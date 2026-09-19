# Rep Deck 🏋️

Rep Deck is a strength-training tracker built for lifters who care about raw progression — load, volume, intensity, and consistency. Log every set, maintain versioned training plans, monitor body composition, and track estimated 1RM trends across time. Every write goes through a Server Action; every read is a typed Drizzle query. No spreadsheets.

---

![Rep Deck preview](public/preview.png)

**Live Demo:** [![Live Demo](https://img.shields.io/badge/Live%20Demo-%23000000.svg?logo=vercel&logoColor=white)](https://rep-deck.vercel.app)

---

## Key Features ✨

- **Workout Logging** — Sets are logged with weight, reps, and RPE. Your active program pre-fills targets, and last session's numbers render inline beside each input via a batched performance lookup (`getExercisePerformanceBatch`) so there's no N+1 on the log screen.
- **Versioned Programs** — Duplicate a program template to fork it into a new version (v1 → v2) with the full day/exercise hierarchy preserved. Deleting a program uses `ON DELETE SET NULL` on `workoutSessions.programId`, so completed logs survive even if their source template is removed.
- **Progress Analytics** — Recharts-powered views for estimated 1RM across the Big 4 (Squat, Bench, Deadlift, OHP), per-lift working weight vs. estimated 1RM, upper/lower body measurement trends, session volume, and weekly training distribution.
- **Body Metrics** — Bodyweight, body fat %, and six tape measurements. All values normalized to kg/inches at rest, converted to the user's preference on read.
- **Data Quality Scoring** — Logging frequency is tracked per user; stale intervals and inconsistent spacing surface as warnings on the metrics page instead of silently skewing trendlines.
- **Live PR Detection** — Per-set estimated 1RM is computed client-side (`wouldBePR`) for live feedback during entry, and again server-side (`checkIfPR`) on save. PRs are persisted as an `isPR` boolean on the set row and surfaced inline.
- **8 Hand-Crafted Dark Themes** — Green, Violate Eye, Rose Pine, Retro, Cosmic, Orchid, Booking, and Lime. Switching is instant and persisted via `next-themes`.

---

## Tech Stack 🛠️

### Core Framework & Runtime

- ![Next.js](https://img.shields.io/badge/Next.js-black?logo=next.js&logoColor=white) — App Router, Server Actions, route groups (`(user)`, `(extra)`).
- ![React](https://img.shields.io/badge/React-%2320232a.svg?logo=react&logoColor=%2361DAFB) — React Compiler enabled. No manual `useMemo` / `useCallback`.
- ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff) — End-to-end types, with DB row types inferred from Drizzle schemas.

### Database & Auth

- ![Drizzle](https://img.shields.io/badge/Drizzle-C5F74F?logo=drizzle&logoColor=000) — Schema-as-code with `mode: number` decimals, cascade rules, and an index on every hot foreign key.
- ![Postgres](https://img.shields.io/badge/Postgres-%23316192.svg?logo=postgresql&logoColor=white) — Direct driver via `postgres`. Runtime uses the Supavisor pooler (port 6543); migrations use the direct connection (port 5432).
- ![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase&logoColor=fff) — Managed Postgres + Google OAuth via `@supabase/ssr`. Session sync into Drizzle happens in `/auth/callback`.

### UI & Styling

- ![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-%2338B2AC.svg?logo=tailwind-css&logoColor=white) — CSS-first config (`@theme` inline) plus a custom `utilities.css` layer of flex shorthand and preset utilities (`fcard-flat`, `ficon-box`, `main-padding`).
- ![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000?logo=shadcnui&logoColor=fff) — Headless primitives under `src/components/ui/`, styled with CVA + Tailwind.
- ![Recharts](https://img.shields.io/badge/Recharts-22B5BF?style=flat&logo=recharts&logoColor=white) — Composable line, bar, composed, and radar charts.
- ![Phosphor Icons](https://img.shields.io/badge/Phosphor%20Icons-3C402B?logo=phosphoricons&logoColor=fff) — `@phosphor-icons/react`, weight-controlled (`bold` / `fill` / `duotone`).

### Tooling

- ![Biome](https://img.shields.io/badge/Biome-60A5FA?logo=biome&logoColor=white) — Lint + format in one tool. No ESLint, no Prettier.
- ![Bun](https://img.shields.io/badge/Bun-000?logo=bun&logoColor=fff) — Package manager and script runner. `npm` also works.

---

## Architecture & Design Patterns 🏗️

```plaintext
rep-deck/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (extra)/              # Public pages (privacy, terms)
│   │   ├── (user)/               # Authenticated shell: dashboard, workout-log, metrics, plans, progress, account
│   │   └── auth/                 # OAuth callback + session routes
│   ├── actions/                  # Server Actions (auth, account, workout, plans, metrics, dashboard, progress)
│   ├── assets/                   # Static images and media
│   ├── components/
│   │   ├── @account/             # Feature components, one folder per surface
│   │   ├── @auth/
│   │   ├── @common/              # Layout chrome, providers, skeletons, chart cards
│   │   ├── @dashboard/
│   │   ├── @landing/
│   │   ├── @metrics/
│   │   ├── @plan-dialogs/
│   │   ├── @plans/
│   │   ├── @progress/
│   │   ├── @workout-log/
│   │   └── ui/                   # Design-system primitives
│   ├── constants/                # Preset exercises, rep ranges, copy, navigation
│   ├── db/
│   │   ├── index.ts              # Singleton Drizzle client
│   │   ├── schema/               # Table definitions, one file per table
│   │   └── seed.ts               # Dev data generator
│   ├── hooks/                    # Custom hooks, grouped by feature (-hook/)
│   ├── lib/                      # Pure utilities + shared context providers
│   ├── mock/                     # Static mock data for local UI work
│   ├── types/                    # Shared TS types
│   └── utils/
│       ├── dicebear/             # Avatar generation per theme
│       └── supabase/             # Browser, server, and middleware Supabase clients
├── drizzle.config.ts             # Drizzle Kit config (reads DIRECT_URL)
├── biome.json                    # Lint + format rules
├── next.config.ts                # Next config (React Compiler on)
└── package.json
```

### Key Engineering Decisions

1. **Versioned Program Templates**
   Duplicating a program creates a new `programTemplates` row with an incremented version and deep-copies the full day/exercise tree. Deleting a program uses `ON DELETE SET NULL` on `workoutSessions.programId`, so completed logs survive even if their source template is removed. In-place editing of a running template is currently supported and is a known gap on the v0.2.0 roadmap toward true fork-on-edit immutability.

2. **Estimated 1RM Engine**
   Per-set estimated 1RM is computed using the Epley formula:

    $$
    	\text{1RM} = \text{Weight} \times \left( 1 + \frac{\text{Reps}}{30} \right)
    	$$

    At save time, `checkIfPR()` compares the new set's estimated 1RM against every prior set for the same exercise and persists an `isPR` boolean on the row. The 1RM number itself is **never stored** — it's recomputed on read, so raw `weight` and `reps` remain the source of truth and a formula change never requires a migration.

3. **Global Unit Normalization**
   All weights are stored in **kilograms** and all body measurements in **inches**. Conversion happens exclusively at the view layer via `UnitProvider` (`src/components/@common/unit-provider.tsx`), which reads the user's preferences and exposes `fmtWeight` / `toKg` / `fmtMeasurement` / `toIn` helpers. The database never sees `lb` or `cm`.

4. **Zero-Radius Flat UI**
   A single `--radius: 0` declaration on `:root` in `themes.css` applies across all 8 themes, preserving the flat brutalist identity. Themes attach via `html[data-theme]` and CSS custom properties, managed by `next-themes` with no hydration flash.

5. **Server Actions as the API Surface**
   Every mutation lives in `src/actions/`, grouped by domain. Pages import actions; actions never import from `src/components/`. Auth is checked inside each action via `getCurrentUser()` — Server Actions are reachable from anywhere and never assume the caller is authenticated.

---

## Getting Started 🏁

### Prerequisites

- ![Node.js](https://img.shields.io/badge/Node.js-6DA55F?logo=node.js&logoColor=white) — `v20.0.0` or higher
- ![Bun](https://img.shields.io/badge/Bun-000?logo=bun&logoColor=fff) or ![npm](https://img.shields.io/badge/npm-CB3837?logo=npm&logoColor=fff) — Package manager
- ![Postgres](https://img.shields.io/badge/Postgres-%23316192.svg?logo=postgresql&logoColor=white) — Instance via ![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase&logoColor=fff) or a local install

### Installation

1. **Clone the repository**

    ```bash
    git clone https://github.com/rudra-xi/rep-deck.git
    cd rep-deck
    ```

2. **Install dependencies**

    ```bash
    bun install
    # or
    npm install
    ```

3. **Configure environment variables**

    Create `.env.local` (or `.env`) at the project root:

    ```env
    # Runtime connection — Supavisor pooler, port 6543
    DATABASE_URL="postgresql://postgres.<project-ref>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres?sslmode=require"

    # Migration connection — direct, port 5432. Drizzle Kit reads this one.
    DIRECT_URL="postgresql://postgres.<project-ref>:<password>@aws-0-<region>.pooler.supabase.com:5432/postgres?sslmode=require"

    # Supabase auth
    NEXT_PUBLIC_SUPABASE_URL="https://<project-ref>.supabase.co"
    NEXT_PUBLIC_SUPABASE_ANON_KEY="<your-anon-key>"

    # OAuth callback origin
    NEXT_PUBLIC_APP_URL="http://localhost:3000"
    ```

    > `DATABASE_URL` (pooler) is used at runtime to avoid connection exhaustion in serverless. `DIRECT_URL` (direct) is used by Drizzle Kit for migrations — DDL does not survive connection pooling.

4. **Initialize the database**

    ```bash
    # Push schema definitions to DIRECT_URL
    bunx drizzle-kit push

    # (Optional) Seed ~6 months of sample data:
    #   ~100 workout sessions with realistic progression
    #   26 weekly body measurements
    #   3 versioned programs (v1 + v2 archived, v3 active)
    bun src/db/seed.ts
    ```

5. **Run the development server**

    ```bash
    bun dev
    ```

    Navigate to [http://localhost:3000](http://localhost:3000).

---

## Scripts & Commands 📜

| Script      | Command                   | Description                                |
| :---------- | :------------------------ | :----------------------------------------- |
| **Dev**     | `bun dev`                 | Next.js dev server with hot reload         |
| **Build**   | `bun run build`           | Production bundle (React Compiler enabled) |
| **Start**   | `bun run start`           | Serve the production build                 |
| **Lint**    | `bun run lint`            | Biome code checks                          |
| **Format**  | `bun run format`          | Auto-format via Biome                      |
| **Fix**     | `bun run check:fix`       | Automated lint fixes + formatting          |
| **DB Push** | `bunx drizzle-kit push`   | Apply schema to `DIRECT_URL`               |
| **DB Seed** | `bun src/db/seed.ts`      | Seed ~6 months of sample data              |

---

## Author & License 🪪

Developed by **rudra-xi**.

- [![GitHub](https://img.shields.io/badge/GitHub-%23121011.svg?logo=github&logoColor=white)](https://github.com/rudra-xi)
- [![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?logo=linkedin&logoColor=fff)](https://www.linkedin.com/in/goutam-rudraxi)

Distributed under the [![MIT License](https://img.shields.io/badge/MIT%20License-FFFFFF)](#). Read [`LICENSE.md`](./LICENSE.md) for details.

---