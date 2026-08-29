# Data access & tenant isolation

## The two-layer defence

Layer 1 — application: every business query runs through
`withTenant(organizationId, fn)` from `@rk-kit/db`:

```ts
import { withTenant, project } from "@rk-kit/db";

const projects = await withTenant(organizationId, (tx) =>
  tx.select().from(project),
);
```

`withTenant` opens a transaction and executes
`SELECT set_config('app.current_organization_id', $orgId, true)` — the setting
lives only for that transaction.

Layer 2 — database: every business table has an RLS policy comparing
`organizationId` to `current_setting('app.current_organization_id', true)`,
with `ENABLE` **and** `FORCE ROW LEVEL SECURITY` (the owner is subject to
policies too).

Fail-safe behaviour: no context → `current_setting` returns NULL → the policy
evaluates false → **zero rows**. A forgotten `withTenant` yields empty results,
never another tenant's data.

## Database roles

| Role | Attributes | Used for | Connection string |
|---|---|---|---|
| `rk_kit` (owner) | CREATEROLE, owns tables | migrations (drizzle-kit) | `DATABASE_URL_MIGRATIONS` |
| `app_user` | LOGIN, NOSUPERUSER, **NOBYPASSRLS** | application runtime | runtime `DATABASE_URL` |

For local Docker, `app_user` is created during initial database bootstrap with
`APP_DB_PASSWORD`; migration `0001_rls_policies.sql` also creates it as a
fallback for non-Docker databases. Use a secret manager in production.

⚠️ If the runtime connects as a superuser (e.g. the raw docker-compose
`postgres` superuser), RLS is silently bypassed. The runtime `DATABASE_URL`
must point at `app_user`.

## Schema rules (packages/db)

- Better Auth tables (`user`, `session`, `account`, `verification`,
  `organization`, `member`, `invitation`) live in `src/schema/auth.ts` and are
  managed by Better Auth — no business columns there, no RLS (they are guarded
  by Better Auth's own logic).
- Business tables live in `src/schema/business.ts` and MUST have:
  1. `organizationId: text NOT NULL` with FK to `organization.id`
     (`onDelete: "cascade"`)
  2. an index on `organizationId`
  3. an RLS policy (three statements, see below)

## Adding a business table (checklist)

1. Define the table in `packages/db/src/schema/business.ts` (follow `project`).
2. Export it from `src/schema/index.ts` and `src/index.ts`.
3. Generate the migration:
   `cd packages/db && DATABASE_URL_MIGRATIONS=<owner-url> pnpm db:generate --name <name>`
4. Create a custom migration for RLS
   (`pnpm db:generate -- --custom --name <name>_rls`) containing:

```sql
ALTER TABLE "your_table" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "your_table" FORCE ROW LEVEL SECURITY;
CREATE POLICY "your_table_tenant_isolation" ON "your_table"
  USING ("organizationId" = current_setting('app.current_organization_id', true))
  WITH CHECK ("organizationId" = current_setting('app.current_organization_id', true));
```

5. Apply: `DATABASE_URL_MIGRATIONS=<owner-url> pnpm db:migrate`
6. Extend `packages/db/tests/rls.test.ts` (or add a sibling test) to cover the
   new table's isolation.

## Sessions & the tenant id

Never trust a client-provided organization id. The only source of truth is the
session:

```ts
import { requireOrganization } from "@rk-kit/auth";

const { user, organizationId } = await requireOrganization(request.headers);
// organizationId comes from session.activeOrganizationId (Better Auth org plugin)
```

- `getSession(headers)` → session or null (public pages)
- `requireSession(headers)` → throws `UnauthorizedError` (401)
- `requireOrganization(headers)` → throws `UnauthorizedError`/`ForbiddenError`

## Migrations

- Versioned SQL lives in `packages/db/migrations/` with drizzle-kit metadata in
  `migrations/meta/` — **never hand-edit snapshots**; regenerate them through
  `pnpm db:generate`.
- Local dev: `docker compose up -d` then
  `pnpm --filter @rk-kit/db db:migrate`.
- Production (Supabase): run migrations with the owner connection string
  before deploying the new app version. Test migrations against a staging
  Supabase instance before the first external user.
