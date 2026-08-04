# docs/ai-skills — AI agent handbook

This directory is the entry point for AI coding agents (Cursor, Claude Code, …)
working on this codebase. Read the relevant file **before** writing code:

| File | Read it when… |
|---|---|
| [architecture.md](./architecture.md) | you need the big picture: workspace layout, layers, request flow |
| [conventions.md](./conventions.md) | you add a route, component, service, or touch any file |
| [data-access.md](./data-access.md) | you read/write business data (tenant isolation is mandatory) |
| [add-module.md](./add-module.md) | you add a new package/module to the monorepo |

## Ground rules (never violate)

1. **Every business query goes through `withTenant(organizationId, fn)`** from
   `@rk-kit/db`. No exceptions. RLS is the safety net, not the primary check —
   both layers must exist.
2. **Every mutation validates input with Zod** before touching data, and throws
   typed errors from `@rk-kit/errors` (never raw `Error` in request paths).
3. **Environment access only via `@rk-kit/config`** (`serverEnv` / `clientEnv`),
   never `process.env` directly in app code.
4. **`apps/web` owns product code** (routes, pages, business services);
   **`packages/*` owns shared infrastructure**. Never import app code from a
   package.
5. **Modules are only added on a real trigger** (first paying customer → Stripe,
   first background task → jobs, …). Do not build speculative infrastructure.
6. **Keep these docs in sync**: any new package/app must be documented here
   (CI enforces it via `scripts/check-ai-docs.sh`).

## Quick start for a dev environment

```bash
cp .env.example .env       # fill BETTER_AUTH_SECRET (openssl rand -base64 32)
docker compose up -d       # PostgreSQL 17 on :5432
pnpm install
pnpm --filter @rk-kit/db db:migrate   # uses DATABASE_URL from .env
pnpm dev                   # TanStack Start dev server on :3000
```

Verification commands (all must pass before a change is done):

```bash
pnpm turbo run lint typecheck build test
bash scripts/smoke.sh      # requires a prior build + migrated database
bash scripts/check-ai-docs.sh
```
