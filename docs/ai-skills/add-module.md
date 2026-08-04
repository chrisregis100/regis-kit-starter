# Adding a module (new package)

## When to add a module

Only on a **real trigger** — never speculatively:

| Module | Trigger |
|---|---|
| Stripe payments | first customer actually billed |
| Mobile money payments | first African customer wanting to pay in mobile money |
| Redis cache / rate limiting | first real need (rate limiting, AI endpoint cost) |
| Monitoring (Sentry + PostHog) | before the first real external user |
| Transactional email | first required email (account confirmation, invoice) |
| Async jobs | first background task |
| Audit log & soft delete | explicit B2B customer request / enterprise deal |

If the trigger hasn't happened, do not build the module.

## Package skeleton

Create `packages/<name>/` with:

```
packages/<name>/
├── package.json        # name "@rk-kit/<name>", private, type module
├── tsconfig.json       # extends ../../tsconfig.base.json, rootDir src, outDir dist
└── src/
    └── index.ts        # public API — export only what apps need
```

`package.json` template (mirror an existing package, e.g. `packages/errors`):

```json
{
  "name": "@rk-kit/<name>",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "exports": { ".": { "types": "./dist/index.d.ts", "import": "./dist/index.js" } },
  "scripts": {
    "build": "tsc --noEmit false",
    "dev": "tsc --watch",
    "typecheck": "tsc --noEmit",
    "lint": "tsc --noEmit",
    "test": "vitest run"
  }
}
```

## Wiring checklist

1. Add the path mapping in `tsconfig.base.json` → `compilerOptions.paths`
   (`"@rk-kit/<name>": ["./packages/<name>/src/index.ts"]`).
2. Consumers add `"@rk-kit/<name>": "workspace:*"` to their dependencies, then
   `pnpm install`.
3. Environment variables the module needs go into `@rk-kit/config`'s server
   schema (`packages/config/src/env-schema.ts`) **and** `.env.example` —
   optional (`.optional()`) unless the module is part of the core, so apps
   that don't use the module still boot.
4. Errors thrown by the module use `@rk-kit/errors` types.
5. If the module stores business data: follow the business-table checklist in
   [data-access.md](./data-access.md) (organizationId + index + RLS +
   isolation test).
6. If the module needs secrets at runtime, document them in the module README
   and add them to the Render/CI environment — never commit them.
7. Tests: unit tests for the logic; integration tests must skip gracefully
   when their backing service is unreachable.
8. **Update `docs/ai-skills/`**: mention the new package in
   [architecture.md](./architecture.md) (layout + layering) and add module
   specifics where relevant. CI (`scripts/check-ai-docs.sh`) fails if the
   package is never mentioned in these docs.
9. Verify: `pnpm turbo run lint typecheck build test` from the repo root.

## Design constraints

- A module is **optional by construction**: `apps/web` must build and run
  without importing it. No side effects at import time beyond reading
  validated env.
- Server-only modules (secrets, DB, external APIs) must never be importable
  from client bundles — keep browser-safe entry points separate if needed
  (see `@rk-kit/config`'s `./server` and `./client` exports).
- Prefer a small, explicit public API from `src/index.ts` over deep imports.
