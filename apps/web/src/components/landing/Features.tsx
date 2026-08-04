import {
  Buildings,
  LockKey,
  Package,
  Palette,
  ShieldCheck,
  Lightning,
} from "@phosphor-icons/react";
import { Card } from "@rk-kit/ui";

const stages = [
  {
    name: "Prepare",
    description: "Everything you need to start building",
    features: [
      {
        icon: LockKey,
        title: "Authentication built-in",
        description:
          "Email/password, Google, GitHub, Facebook, Apple, and more OAuth providers via Better Auth.",
      },
      {
        icon: Palette,
        title: "Radix UI + Tailwind",
        description:
          "Accessible primitives with a clean design system. Customize tokens in your app without touching shared packages.",
      },
    ],
  },
  {
    name: "Secure",
    description: "Tenant isolation by default",
    features: [
      {
        icon: Buildings,
        title: "Multi-tenant organizations",
        description:
          "Every user belongs to one or more organizations. Invite members, manage roles, and switch workspaces seamlessly.",
      },
      {
        icon: ShieldCheck,
        title: "Row-Level Security",
        description:
          "PostgreSQL RLS policies enforce tenant isolation at the database level. withTenant() propagates context to every query.",
      },
    ],
  },
  {
    name: "Ship",
    description: "Architecture that scales with you",
    features: [
      {
        icon: Lightning,
        title: "TanStack Start",
        description:
          "Full-stack React with file-based routing, server functions, streaming SSR, and type-safe data loading.",
      },
      {
        icon: Package,
        title: "pnpm Turborepo",
        description:
          "Monorepo with shared packages for config, errors, db, auth, and UI. Fast incremental builds with intelligent caching.",
      },
    ],
  },
] as const;

export function Features() {
  return (
    <section id="features" className="bg-muted/50 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-sm font-medium uppercase tracking-wider text-primary">
            From zero to launch
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            A complete path to production
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Battle-tested architecture so you can focus on your product, not the plumbing.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-3">
          {stages.map((stage) => (
            <div key={stage.name}>
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-mono text-sm font-bold text-primary-foreground">
                  {stage.name[0]}
                </div>
                <div>
                  <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-foreground">
                    {stage.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">{stage.description}</p>
                </div>
              </div>

              <div className="space-y-4">
                {stage.features.map(({ icon: Icon, title, description }) => (
                  <Card
                    key={title}
                    className="border-border/60 bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon weight="duotone" className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h4 className="text-base font-semibold text-foreground">{title}</h4>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {description}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
