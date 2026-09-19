# `src/db/`

Drizzle ORM setup + Postgres client. Owns the data layer.

## Files

- `index.ts` — exports the singleton `db` client (postgres-js driver)
  and re-exports everything from `./schema`.
- `schema/` — table definitions, see `schema/SUMMARY.md`.
- `seed.ts` — dev-only sample data seeder. Generates 6 months of
  realistic workout history, programs (v1–v3), and body measurements.

## Connection Strategy

The client is configured with:

- `ssl: { rejectUnauthorized: false }`
- `max: 10` connections
- `idle_timeout: 20s`
- `connect_timeout: 10s`
- `prepare: false` (disables prepared statements for compatibility)

Runtime uses `DATABASE_URL` (Supavisor pooler, port 6543) to avoid
connection exhaustion in serverless. Migrations use `DIRECT_URL` (direct
Postgres, port 5432) because DDL doesn't survive pooling.

## Do Not

- Don't import `db` inside a Client Component.
- Don't run migrations against `DATABASE_URL`.
