const features = [
  {
    icon: "🔐",
    title: "Authentication built-in",
    description:
      "Email/password, Google OAuth, password reset, and session management via Better Auth. No third-party auth services required.",
  },
  {
    icon: "🏢",
    title: "Multi-tenant organizations",
    description:
      "Every user belongs to one or more organizations. Invite members, manage roles, and switch workspaces seamlessly.",
  },
  {
    icon: "🛡️",
    title: "Row-Level Security",
    description:
      "PostgreSQL RLS policies enforce tenant isolation at the database level. withTenant() propagates context to every query.",
  },
  {
    icon: "⚡",
    title: "TanStack Start",
    description:
      "Full-stack React with file-based routing, server functions, streaming SSR, and type-safe data loading.",
  },
  {
    icon: "🎨",
    title: "Radix UI + Tailwind",
    description:
      "Accessible primitives with a clean design system. Customize tokens in your app without touching shared packages.",
  },
  {
    icon: "📦",
    title: "pnpm Turborepo",
    description:
      "Monorepo with shared packages for config, errors, db, auth, and UI. Fast incremental builds with intelligent caching.",
  },
];

export function Features() {
  return (
    <section id="features" className="bg-gray-50 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to ship
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
            Battle-tested architecture so you can focus on building your unique product, not the plumbing.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl">
                {feature.icon}
              </div>
              <h3 className="text-base font-semibold text-gray-900">{feature.title}</h3>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
