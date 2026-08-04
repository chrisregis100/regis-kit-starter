const features = [
  {
    icon: "🔐",
    title: "Multi-tenant Auth",
    description:
      "Better Auth with organizations, email/password, Google OAuth, and role-based access control out of the box.",
  },
  {
    icon: "🗄️",
    title: "PostgreSQL + RLS",
    description:
      "Drizzle ORM with row-level security policies. Every query is tenant-scoped — no data leaks between organizations.",
  },
  {
    icon: "👥",
    title: "Team Management",
    description:
      "Invite members, manage roles, and handle organization-level settings with a fully-built team dashboard.",
  },
  {
    icon: "⚡",
    title: "TanStack Start",
    description:
      "Full-stack React with server functions, SSR streaming, and type-safe routing powered by TanStack Router.",
  },
  {
    icon: "🎨",
    title: "shadcn/ui Components",
    description:
      "Beautiful, accessible UI primitives built on Radix UI and Tailwind CSS. Customize to match your brand.",
  },
  {
    icon: "🐳",
    title: "Docker + Render Ready",
    description:
      "Local development with Docker Compose. Production deployment to Render with a single push.",
  },
];

export function Features() {
  return (
    <section id="features" className="bg-zinc-50 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 text-sm font-semibold uppercase tracking-widest text-violet-600">
            Everything you need
          </div>
          <h2 className="text-4xl font-bold text-zinc-900 sm:text-5xl">
            Skip the boilerplate. Ship the product.
          </h2>
          <p className="mt-4 text-lg text-zinc-500">
            RegisKit handles the infrastructure so you can focus on building
            what makes your product unique.
          </p>
        </div>

        {/* Feature grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-zinc-200 bg-white p-6 transition-shadow hover:shadow-md"
            >
              <div className="mb-4 text-3xl">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-zinc-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
