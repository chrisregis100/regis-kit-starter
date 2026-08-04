# Conventions

## Naming & files

- Directories: lowercase with dashes (`components/auth-wizard`).
- Components: named exports, function declarations (`export function Hero()`).
- Event handlers: `handle` prefix (`handleSubmit`, `handleSignOut`).
- Booleans: auxiliary verbs (`isLoading`, `hasError`).
- Workspace packages: `@rk-kit/<name>`; every package has `build`, `dev`,
  `lint`, `typecheck` scripts (+ `test` when it has tests) so Turbo pipelines
  stay uniform.
- TypeScript strict everywhere. **Never** `as any` or `@ts-ignore` — find the
  real type. Prefer interfaces for object shapes; maps over enums.

## Routes (apps/web/src/routes)

- File-based routing (TanStack Start). `routeTree.gen.ts` is **generated** —
  never edit it by hand.
- Public routes at the top level: `index.tsx` (landing), `login.tsx`,
  `signup.tsx`, `forgot-password.tsx`, `reset-password.tsx`, `onboarding.tsx`.
- Protected routes live under the pathless layout `_protected.tsx`
  (`_protected/dashboard.tsx` → URL `/dashboard`). The layout's `beforeLoad`
  calls `getProtectedContext()` — child routes get `{ user, session,
  organizationId }` from `Route.useRouteContext()` and must NOT re-implement
  auth checks for navigation; server functions still guard themselves.
- Raw HTTP endpoints use route `server.handlers`
  (see `routes/api/auth.$.ts` for the Better Auth catch-all).

## Server functions & services

Pattern for every data read/write:

```ts
const myMutation = createServerFn({ method: "POST" })
  .validator(myZodSchema)                        // 1. validate at the boundary
  .handler(async (ctx) => {
    const request = getRequest();
    const { organizationId } = await requireOrganization(request.headers); // 2. authorize
    return myService(organizationId, ctx.data);  // 3. delegate to a service
  });
```

- **Services** (`src/services/*-service.ts`) hold the business logic:
  Zod validation (`ValidationError` on failure), then `withTenant` for DB
  access. They accept an injectable tenant runner so unit tests run without a
  database (see `project-service.test.ts`).
- Server-only modules that are **not** server functions must not be imported
  from client-reachable code. Files named `*.server.ts` are build-enforced
  server-only (import-protection) — use that suffix for modules that must
  never leak, and plain names for server-function modules (e.g.
  `session-fns.ts`).
- Errors: throw types from `@rk-kit/errors`; convert unknowns with
  `handleUnknownError` when returning HTTP responses manually.

## UI

- Reusable primitives come from `@rk-kit/ui` (Button, Input, Card, Dialog, …).
  Product-specific composition stays in `apps/web/src/components/`.
- Tailwind v4 only — no CSS modules, no inline styles. Theme tokens are defined
  in `src/styles/app.css` (`@theme inline`, shadcn-style variables).
- Mobile-first responsive; interactive elements need accessible labels
  (`aria-label`, `role="alert"` for error boxes, `aria-hidden` on decorative
  icons).
- Every data view handles the three states: loading (`pendingComponent` or
  skeleton), empty, error.

## What is template vs. customizable

- **Customizable per product** (expected to diverge after cloning the
  boilerplate): landing content, dashboard pages, business services and tables.
- **Template/socle** (keep aligned with upstream, fix via packages):
  everything under `packages/*`, auth flows, the `_protected` guard pattern,
  `withTenant` data access, error handling, env validation.

## Tests

- Unit tests colocated (`*.test.ts` next to the source) or in `tests/` for
  packages; run with `pnpm turbo run test` (Vitest).
- Business logic must be testable without a database (inject the tenant
  runner). Integration tests that need PostgreSQL must skip gracefully when
  it is unreachable (see `packages/db/tests/rls.test.ts`).
- Any change touching tenant isolation MUST keep the RLS integration tests
  passing (per-tenant SELECT, zero rows without context, cross-tenant INSERT
  denied).

## Git & quality gates

- Commits: conventional style (`feat:`, `fix:`, `chore:`, scoped when useful).
- Before declaring work done: `pnpm turbo run lint typecheck build test` and,
  for changes affecting routing/auth, `bash scripts/smoke.sh`.
- `bash scripts/check-ai-docs.sh` must pass — update `docs/ai-skills/` when the
  structure changes.
