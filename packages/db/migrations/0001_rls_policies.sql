-- ─────────────────────────────────────────────────────────────────────────────
-- 0001_rls_policies.sql
--
-- Row-Level Security for multi-tenant isolation.
--
-- ARCHITECTURE
-- ────────────
-- Two-layer defence:
--   1. Application layer: all business queries go through withTenant(orgId, fn)
--      which calls set_config('app.current_organization_id', orgId, true).
--   2. Database layer (this file): RLS policies read that setting and silently
--      reject rows belonging to a different organisation.
--
-- ROLE SETUP
-- ──────────
-- `app_user` is the restricted application role. It has:
--   - NOINHERIT     — does not inherit from other roles
--   - NOSUPERUSER   — never bypasses any security check
--   - NOBYPASSRLS   — RLS is ALWAYS enforced (critical)
--
-- The DATABASE_URL used at runtime should connect as `app_user`.
-- The DATABASE_URL used for migrations (drizzle-kit) should connect as the
-- owner/superuser so it can ALTER TABLE and CREATE POLICY.
--
-- POLICY BEHAVIOUR
-- ────────────────
-- When app.current_organization_id is NOT set (e.g. a bug skips withTenant),
--   current_setting('app.current_organization_id', true) returns NULL.
--   NULL = 'any-value' → FALSE → zero rows returned.
-- This is the desired fail-safe: forgotten withTenant = empty result, not leak.
--
-- Run via: pnpm --filter @rk-kit/db db:migrate
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── Application role (non-superuser, NOBYPASSRLS) ───────────────────────────

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_catalog.pg_roles WHERE rolname = 'app_user'
  ) THEN
    CREATE ROLE app_user WITH
      LOGIN
      NOINHERIT
      NOSUPERUSER
      NOCREATEDB
      NOCREATEROLE
      NOBYPASSRLS
      -- Change this password in production; use a secret manager (e.g. Render env vars).
      PASSWORD 'change-me-in-production';
  END IF;
END
$$;

-- Grant schema access
GRANT USAGE ON SCHEMA public TO app_user;

-- Grant DML on current tables
GRANT SELECT, INSERT, UPDATE, DELETE
  ON ALL TABLES IN SCHEMA public
  TO app_user;

-- Grant DML on future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_user;

-- ─── Enable RLS on business tables ───────────────────────────────────────────
-- Better Auth tables (user, session, account, …) are NOT RLS-protected here:
-- they are accessed via the superuser connection or via Better Auth itself.
-- Only business tables that carry organizationId are guarded.

ALTER TABLE "project" ENABLE ROW LEVEL SECURITY;

-- FORCE ROW LEVEL SECURITY ensures even the table owner is subject to policies.
-- Remove this only if you need a superuser to read all rows for admin tasks
-- (use a separate admin connection that BYPASSRLS instead).
ALTER TABLE "project" FORCE ROW LEVEL SECURITY;

-- ─── Tenant isolation policies ───────────────────────────────────────────────

-- SELECT / UPDATE / DELETE: can only see/touch rows in the current tenant.
CREATE POLICY "project_tenant_isolation"
  ON "project"
  USING (
    "organizationId" = current_setting('app.current_organization_id', true)
  )
  WITH CHECK (
    "organizationId" = current_setting('app.current_organization_id', true)
  );

-- ─── Repeat for each new business table ─────────────────────────────────────
-- When you add a new table with organizationId, copy the three statements:
--   ALTER TABLE "your_table" ENABLE ROW LEVEL SECURITY;
--   ALTER TABLE "your_table" FORCE ROW LEVEL SECURITY;
--   CREATE POLICY "your_table_tenant_isolation" ON "your_table"
--     USING ("organizationId" = current_setting('app.current_organization_id', true))
--     WITH CHECK ("organizationId" = current_setting('app.current_organization_id', true));
