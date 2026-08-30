import { getSession } from "@rk-kit/auth";
import { Button, Card, CardContent, CardHeader, CardTitle, ThemeToggle } from "@rk-kit/ui";
import Link from "next/link";
import { Logo } from "../components/logo";
import { getRequestHeaders } from "../lib/server-context";

const features = [
  "PostgreSQL with tenant RLS",
  "Better Auth and organizations",
  "Stripe, KKiapay, and FedaPay",
  "Brevo transactional email",
  "Shared Radix UI components",
  "Turborepo and pnpm",
];

export default async function HomePage() {
  const session = await getSession(await getRequestHeaders());

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Logo />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button asChild size="sm">
              <Link href={session ? "/dashboard" : "/signup"}>
                {session ? "Dashboard" : "Get started"}
              </Link>
            </Button>
          </div>
        </nav>
      </header>

      <main>
        <section className="mx-auto max-w-4xl px-4 py-24 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Production-ready SaaS foundation
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl">
            Ship your product, not your plumbing.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            RK Kit combines authentication, tenant isolation, billing, email,
            and a responsive dashboard in one maintainable monorepo.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Button asChild size="lg"><Link href="/signup">Create an account</Link></Button>
            <Button asChild size="lg" variant="outline"><Link href="/login">Sign in</Link></Button>
          </div>
        </section>

        <section id="features" className="border-y border-border bg-muted/40 py-20">
          <div className="mx-auto grid max-w-6xl gap-4 px-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature}>
                <CardHeader><CardTitle className="text-base">{feature}</CardTitle></CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Configured to work across the shared RK Kit packages.
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="pricing" className="mx-auto max-w-4xl px-4 py-20 text-center">
          <h2 className="text-3xl font-bold">Start free, upgrade when you grow</h2>
          <p className="mt-3 text-muted-foreground">
            Starter, Pro, and Enterprise plans are wired to the billing service.
          </p>
        </section>
      </main>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        RK Kit — built for teams shipping SaaS.
      </footer>
    </div>
  );
}
