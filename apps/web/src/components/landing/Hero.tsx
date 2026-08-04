import { ArrowRight, Terminal } from "@phosphor-icons/react";
import { Button } from "@rk-kit/ui";
import { Link } from "@tanstack/react-router";

/*
 * RK Kit landing design plan — "Launch Control"
 *
 * Subject: RK Kit is a SaaS launch vehicle. Audience: indie hackers and technical founders.
 * Job of the page: convince them RK Kit is the fastest, most secure, and best-architected way to launch.
 *
 * Palette (named hexes):
 *   - Pad gray: #F4F6F8 (cool light background)
 *   - Panel white: #FFFFFF (card surfaces)
 *   - Mission ink: #0B1220 (deep text)
 *   - Control blue: #1A3A5C (primary actions)
 *   - Ignition amber: #F59E0B (signature accent)
 *   - Structural steel: #D1D5DB (borders)
 *
 * Type:
 *   - Display: system sans-serif (Tailwind font-sans), extrabold, tight tracking
 *   - Body: system sans-serif, relaxed leading
 *   - Utility: font-mono for stage labels, terminal code, and data
 *
 * Layout: centered hero thesis with a "Launch Terminal" signature card as the focal point,
 * followed by staged features (Prepare → Secure → Ship), pricing, and testimonials.
 *
 * Signature element: the Launch Terminal — a code-window card showing the actual scaffold command
 * and a live readiness check, with a blinking cursor. It embodies the subject (shipping code) and
 * the audience (developers who live in the terminal).
 *
 * Motion: subtle page-load fade-in on the terminal, hover lift on cards, and a reduced-motion-safe
 * tech-stack marquee. No scattered animations.
 */

const technologyStack = [
  { name: "TanStack Start", icon: "tanstack" },
  { name: "Better Auth", icon: "betterauth" },
  { name: "PostgreSQL", icon: "postgresql" },
  { name: "TypeScript", icon: "typescript" },
  { name: "Render", icon: "render" },
  { name: "Docker", icon: "docker" },
] as const;

const launchSteps = [
  "Authentication configured",
  "Organizations & RLS ready",
  "TanStack Start + Tailwind bootstrapped",
  "Docker + PostgreSQL provisioned",
] as const;

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background pt-32 pb-20 sm:pt-40 sm:pb-28">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute right-1/4 bottom-0 h-[400px] w-[500px] translate-y-1/3 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-muted-foreground shadow-sm ring-1 ring-border/50">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            <span className="font-mono text-xs uppercase tracking-wider">v1.0</span>
            <span className="hidden sm:inline">Launch-ready multi-tenant stack</span>
            <span className="sm:hidden">Launch-ready stack</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            Launch your SaaS in{" "}
            <span className="text-primary">days, not months</span>
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl">
            RK Kit is a production-ready starter with authentication, multi-tenant
            organizations, PostgreSQL RLS security, and a polished UI. Skip the
            boilerplate and ship your product.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="w-full rounded-lg sm:w-auto">
              <Link to="/signup">Start for free</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full rounded-lg sm:w-auto"
            >
              <a href="#features">
                Explore features
                <ArrowRight
                  weight="bold"
                  className="h-4 w-4"
                  aria-hidden="true"
                />
              </a>
            </Button>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-3xl motion-reduce:opacity-100">
          <LaunchTerminal />
        </div>

        <div
          className="mt-16 overflow-hidden mask-[linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
          aria-label="Technologies included"
        >
          <div className="flex w-max animate-[tech-marquee_26s_linear_infinite] motion-reduce:animate-none">
            {[...technologyStack, ...technologyStack].map(
              (technology, index) => (
                <div
                  key={`${technology.name}-${index}`}
                  className="mx-2 flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-2.5 shadow-sm sm:mx-3"
                  aria-hidden={index >= technologyStack.length}
                >
                  <img
                    src={`https://cdn.simpleicons.org/${technology.icon}`}
                    alt=""
                    width={24}
                    height={24}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="text-sm font-medium text-foreground">
                    {technology.name}
                  </span>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function LaunchTerminal() {
  return (
    <div className="rounded-xl border border-border bg-card shadow-2xl shadow-foreground/5 ring-1 ring-border/50">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <div className="h-3 w-3 rounded-full bg-red-400" aria-hidden="true" />
        <div className="h-3 w-3 rounded-full bg-amber-400" aria-hidden="true" />
        <div className="h-3 w-3 rounded-full bg-green-400" aria-hidden="true" />
        <div className="ml-3 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Terminal weight="bold" className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="font-mono">~/projects/my-saas</span>
        </div>
      </div>

      <div className="px-4 py-5 sm:px-6 sm:py-6">
        <pre className="font-mono text-sm leading-7 text-foreground">
          <code>
            <span className="text-muted-foreground">$</span>{" "}
            npx create-rk-kit@latest my-app
          </code>
        </pre>

        <ul className="mt-3 space-y-1 font-mono text-sm leading-7 text-muted-foreground">
          {launchSteps.map((step) => (
            <li key={step} className="flex items-center gap-2">
              <span className="text-success">✓</span>
              {step}
            </li>
          ))}
        </ul>

        <pre className="mt-4 font-mono text-sm leading-7 text-foreground">
          <code>
            <span className="text-muted-foreground">$</span> cd my-app && pnpm dev
          </code>
        </pre>

        <p className="mt-1 font-mono text-sm leading-7 text-muted-foreground">
          <span className="text-primary">→</span> Ready on{" "}
          <a
            href="http://localhost:3000"
            className="text-primary underline-offset-2 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            http://localhost:3000
          </a>
          <span
            className="ml-1 inline-block h-4 w-2 animate-cursor-blink bg-foreground motion-reduce:animate-none"
            aria-hidden="true"
          />
        </p>
      </div>
    </div>
  );
}
