import { Button } from "@rk-kit/ui";
import { Link } from "@tanstack/react-router";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Background gradient */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-br from-violet-100 to-indigo-100 opacity-50 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-violet-50 px-4 py-1.5 text-sm font-medium text-violet-700 ring-1 ring-violet-200">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
            Open-source SaaS boilerplate
          </div>

          {/* Headline */}
          <h1 className="text-5xl font-bold tracking-tight text-zinc-900 sm:text-6xl lg:text-7xl">
            Ship your SaaS{" "}
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              in days
            </span>
            , not months
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-lg leading-relaxed text-zinc-500 sm:text-xl">
            RegisKit is a production-ready SaaS starter with multi-tenant
            authentication, team management, and billing — built with TanStack
            Start, Better Auth, and PostgreSQL.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link to="/signup">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-violet-600 hover:bg-violet-700 text-white px-8"
              >
                Get started free
              </Button>
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
            >
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              View on GitHub
            </a>
          </div>

          {/* Social proof */}
          <p className="mt-8 text-sm text-zinc-400">
            Trusted by{" "}
            <span className="font-semibold text-zinc-600">500+</span> developers
            worldwide
          </p>
        </div>

        {/* Dashboard preview mockup */}
        <div className="mt-16 rounded-2xl border border-zinc-200 bg-zinc-50 p-2 shadow-2xl shadow-zinc-200 sm:mt-20">
          <div className="rounded-xl bg-white p-4">
            {/* Fake browser chrome */}
            <div className="flex items-center gap-2 border-b border-zinc-100 pb-3 mb-4">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 rounded-md bg-zinc-100 px-3 py-1 text-xs text-zinc-400 text-center">
                app.yourproduct.com/dashboard
              </div>
            </div>
            {/* Fake dashboard content */}
            <div className="grid grid-cols-3 gap-3">
              {["Total Users", "Monthly Revenue", "Active Orgs"].map(
                (label, i) => (
                  <div
                    key={label}
                    className="rounded-lg border border-zinc-100 p-3"
                  >
                    <div className="text-xs text-zinc-400">{label}</div>
                    <div className="mt-1 text-lg font-bold text-zinc-900">
                      {["2,847", "$12,430", "143"][i]}
                    </div>
                    <div className="mt-0.5 text-xs text-green-600">
                      ↑ {["+12%", "+8.5%", "+23%"][i]}
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
