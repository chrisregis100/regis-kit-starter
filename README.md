# RK Kit — SaaS Boilerplate Monorepo

Modular open-source SaaS starter: authentication, premium landing page,
multi-tenant dashboard and senior-grade architecture out of the box.

**Stack**: TanStack Start · Better Auth · PostgreSQL/Supabase (Drizzle + RLS) ·
Tailwind v4 · pnpm workspaces + Turborepo · Docker

## What's included

- **Auth**: email/password, Google OAuth, password reset, sessions,
  organizations (multi-tenant) — via Better Auth
- **Tenant isolation**: PostgreSQL Row-Level Security enforced on every
  business table, on top of application-level checks (`withTenant`)
- **Landing page**: hero, features, pricing, testimonials, footer — lives in
  the app, edit it directly
- **Dashboard shell**: navigation, team management (invites/roles), settings,
  billing placeholder — behind a server-side auth + organization guard
- **Infrastructure packages**: validated env (`@rk-kit/config`), typed errors
  (`@rk-kit/errors`), database + migrations (`@rk-kit/db`), auth helpers
  (`@rk-kit/auth`), UI primitives (`@rk-kit/ui`)
- **Quality gates**: unit + RLS integration tests, smoke test, CI, Dockerfile
- **AI-agent docs**: [`docs/ai-skills/`](docs/ai-skills/README.md) — the
  handbook AI agents (and humans) read before contributing

## Quick start

```bash
cp .env.example .env            # set BETTER_AUTH_SECRET: openssl rand -base64 32
docker compose up -d            # PostgreSQL 17
pnpm install
pnpm --filter @rk-kit/db db:migrate
pnpm dev                        # http://localhost:3000
```

> ⚠️ RLS note: the runtime `DATABASE_URL` should connect as the restricted
> `app_user` role (created by the RLS migration), not as the postgres
> superuser — superusers bypass row-level security. See
> [docs/ai-skills/data-access.md](docs/ai-skills/data-access.md).

## Commands

| Command | Description |
|---|---|
| `pnpm dev` | dev servers (Turbo) |
| `pnpm turbo run lint typecheck build test` | full quality gate |
| `pnpm --filter @rk-kit/db db:generate` | generate a migration from schema |
| `pnpm --filter @rk-kit/db db:migrate` | apply migrations |
| `bash scripts/smoke.sh` | boot the built server and check core routes |
| `bash scripts/check-ai-docs.sh` | verify docs/ai-skills is in sync |
| `docker compose --profile app up --build` | run the production image locally |

## Repository layout

```
apps/web              product app (TanStack Start) — customize freely
apps/web/src/services business logic (Drizzle via withTenant)
apps/web/src/server   TanStack Start server functions (front RPC boundary)
apps/web/src/api      REST handlers + middleware for /api/v1/*
packages/config       Zod-validated environment
packages/db           Drizzle + migrations + RLS + withTenant
packages/auth         Better Auth + session helpers
packages/errors       typed error hierarchy + HTTP serialization
packages/ui           shadcn-style primitives (Radix + CVA + Tailwind)
docs/ai-skills        architecture, conventions, data access, api layer, add-module guide
```

Modules (Stripe, mobile money, Redis, monitoring, email, jobs, audit log) are
added **only on a real trigger** — see
[docs/ai-skills/add-module.md](docs/ai-skills/add-module.md).

## Deployment

The web app builds to a self-contained Nitro bundle
(`node .output/server/index.mjs`) binding `0.0.0.0:$PORT` — compatible with
Render, Railway, Fly.io or any Docker host. See
[`apps/web/Dockerfile`](apps/web/Dockerfile).
