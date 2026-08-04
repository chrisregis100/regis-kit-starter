# Architecture

## Workspace layout

```
rk-kit-monorepo/
├── apps/
│   └── web/                 # @rk-kit/web — TanStack Start product app
│       ├── src/routes/      # file-based routes (public, _protected layout, api/)
│       ├── src/components/  # product UI (landing, dashboard, auth, onboarding)
│       ├── src/services/    # business logic (Zod validation + withTenant)
│       └── src/lib/         # auth client, server-function guards
├── packages/
│   ├── config/              # @rk-kit/config — Zod-validated env (server/client)
│   ├── db/                  # @rk-kit/db — Drizzle + pg, migrations, RLS, withTenant
│   ├── auth/                # @rk-kit/auth — Better Auth config + session helpers
│   ├── errors/              # @rk-kit/errors — typed errors + HTTP serialization
│   └── ui/                  # @rk-kit/ui — shadcn-style primitives (Radix + CVA)
├── docs/ai-skills/          # this handbook
├── scripts/                 # smoke.sh, check-ai-docs.sh
├── docker-compose.yml       # postgres (default) + web (profile "app")
└── turbo.json               # build/dev/lint/typecheck/test pipeline
```

## Stack

- **Frontend/server**: TanStack Start (`@tanstack/react-start`, Vite plugin) +
  Nitro (Node server output, `node .output/server/index.mjs`)
- **Auth**: Better Auth (email/password, Google OAuth, organization plugin)
- **Database**: PostgreSQL (Supabase-compatible), Drizzle ORM, drizzle-kit
  migrations, Row-Level Security for tenant isolation
- **Styling**: Tailwind CSS v4 (`@theme inline` tokens) + `@rk-kit/ui` primitives
- **Monorepo**: pnpm workspaces + Turborepo (tasks cache, `^build` dependencies)

## Layering rules

```
apps/web (routes → server functions → services)
    │  imports
    ▼
packages/auth ─→ packages/db ─→ (PostgreSQL)
packages/config, packages/errors, packages/ui   (leaf utilities)
```

- `apps/web` **is the only place** with product/business code. It is expected
  to be customized per project (landing, dashboard, services).
- `packages/*` are shared infrastructure: generic, product-agnostic, stable.
  A fix in a package benefits every app that imports it.
- Packages never import from `apps/*`. `packages/ui` never contains business
  logic. `packages/auth` and `packages/db` are server-only.

## Request flow (protected page)

```
Browser ──GET /dashboard──▶ Nitro/TanStack Start
  routes/_protected.tsx  beforeLoad
    └─▶ getProtectedContext()          (server fn, src/lib/session-fns.ts)
          └─▶ getSession(headers)      (@rk-kit/auth → Better Auth)
                ├─ no session          → redirect /login
                ├─ no active org       → redirect /onboarding
                └─ ok → { user, organizationId } into router context
  routes/_protected/dashboard.tsx  loader
    └─▶ getDashboardData()             (server fn)
          └─▶ requireOrganization(headers)
          └─▶ listProjects(orgId)      (src/services/project-service.ts)
                └─▶ withTenant(orgId, tx => tx.select().from(project))
                      └─ SET LOCAL app.current_organization_id = orgId
                      └─ RLS policy filters rows to that tenant
```

## Multi-tenancy model

- A **tenant = a Better Auth organization**. Users can belong to several
  organizations; the active one is stored on the session
  (`session.activeOrganizationId`).
- Every business table carries `organizationId NOT NULL` + an index, plus an
  RLS policy (`ENABLE` + `FORCE ROW LEVEL SECURITY`).
- Runtime connects as the restricted `app_user` role (`NOBYPASSRLS`);
  migrations connect as the owner role. Two different `DATABASE_URL`s.
- Fail-safe: without a tenant context, RLS returns **zero rows** — a forgotten
  `withTenant` produces empty results, never a cross-tenant leak.

## Deployment contract

- The server binds `0.0.0.0:$PORT` (Nitro reads `HOST`/`PORT`) — required by
  Render and most container platforms.
- The Docker image (`apps/web/Dockerfile`, build context = repo root) contains
  only the self-contained `.output` bundle and runs as a non-root user.
- The filesystem is treated as ephemeral: no local writes beyond `/tmp`.
