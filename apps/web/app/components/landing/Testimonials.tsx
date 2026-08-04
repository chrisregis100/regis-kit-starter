const testimonials = [
  {
    body: "RegisKit saved me weeks of setup time. The multi-tenant auth just works, and the RLS integration is exactly what I needed for my B2B SaaS.",
    author: { name: "Sarah Chen", title: "Founder, DataFlow", avatar: "SC" },
  },
  {
    body: "I've tried other boilerplates but none had the depth of RegisKit. Better Auth + Drizzle + TanStack Start is an amazing combo.",
    author: { name: "Marcus Johnson", title: "CTO, Buildstack", avatar: "MJ" },
  },
  {
    body: "Went from idea to paying customers in 3 weeks. The onboarding flow and team management were already done for me.",
    author: { name: "Ana García", title: "Solo founder, Notarly", avatar: "AG" },
  },
];

export function Testimonials() {
  return (
    <section className="bg-zinc-50 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 text-sm font-semibold uppercase tracking-widest text-violet-600">
            Testimonials
          </div>
          <h2 className="text-4xl font-bold text-zinc-900 sm:text-5xl">
            Loved by developers
          </h2>
        </div>

        {/* Testimonial grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.author.name}
              className="flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-6"
            >
              {/* Stars */}
              <div className="mb-4 flex gap-1" aria-label="5 stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    aria-hidden="true"
                    className="h-4 w-4 text-amber-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <blockquote className="flex-1">
                <p className="text-sm leading-relaxed text-zinc-600">
                  &ldquo;{t.body}&rdquo;
                </p>
              </blockquote>

              <figcaption className="mt-6 flex items-center gap-3">
                <div
                  aria-hidden="true"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-sm font-semibold text-violet-700"
                >
                  {t.author.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold text-zinc-900">
                    {t.author.name}
                  </div>
                  <div className="text-xs text-zinc-500">{t.author.title}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
