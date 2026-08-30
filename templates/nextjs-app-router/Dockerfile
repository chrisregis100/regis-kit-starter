# ─────────────────────────────────────────────────────────────────────────────
# @rk-kit/web — Next.js production image
#
# Build from the MONOREPO ROOT (build context = repo root):
#   docker build -f apps/web/Dockerfile -t rk-kit-web .
# ─────────────────────────────────────────────────────────────────────────────

FROM node:22-alpine AS builder

RUN corepack enable

WORKDIR /repo

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/web/package.json apps/web/
COPY packages/auth/package.json packages/auth/
COPY packages/billing/package.json packages/billing/
COPY packages/config/package.json packages/config/
COPY packages/db/package.json packages/db/
COPY packages/email/package.json packages/email/
COPY packages/errors/package.json packages/errors/
COPY packages/payments-fedapay/package.json packages/payments-fedapay/
COPY packages/payments-kkiapay/package.json packages/payments-kkiapay/
COPY packages/payments-stripe/package.json packages/payments-stripe/
COPY packages/ui/package.json packages/ui/
RUN pnpm install --frozen-lockfile

COPY tsconfig.base.json turbo.json ./
COPY packages/ packages/
COPY apps/web/ apps/web/
RUN DATABASE_URL="postgresql://build:build@localhost:5432/build" \
    BETTER_AUTH_SECRET="build-time-placeholder-secret-32-chars!" \
    BETTER_AUTH_URL="http://localhost:3000" \
    pnpm turbo run build --filter=@rk-kit/web

FROM node:22-alpine AS runner

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

RUN addgroup -S app && adduser -S app -G app
USER app
WORKDIR /app

COPY --from=builder --chown=app:app /repo/apps/web/public ./apps/web/public
COPY --from=builder --chown=app:app /repo/apps/web/.next/standalone ./
COPY --from=builder --chown=app:app /repo/apps/web/.next/static ./apps/web/.next/static

WORKDIR /app/apps/web

EXPOSE 3000

CMD ["node", "server.js"]
