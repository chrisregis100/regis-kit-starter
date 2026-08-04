const testimonials = [
  {
    quote:
      "RK Kit saved us weeks of setup. The multi-tenant architecture and RLS policies were exactly what we needed for our B2B product.",
    author: "Alex Chen",
    role: "CTO at Growthly",
    avatar: "AC",
  },
  {
    quote:
      "The TanStack Start integration is superb. Type-safe routing, server functions, and streaming SSR out of the box — no compromises.",
    author: "Sarah Miller",
    role: "Lead Engineer at Buildfast",
    avatar: "SM",
  },
  {
    quote:
      "As a solo founder, I could focus entirely on my product logic. Auth, organizations, and billing UI were already handled.",
    author: "Marco Rossi",
    role: "Founder at DataPulse",
    avatar: "MR",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="bg-gray-50 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Loved by builders
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Real feedback from teams shipping with RK Kit.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <figure
              key={testimonial.author}
              className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100"
            >
              <blockquote>
                <p className="text-sm text-gray-600 leading-relaxed">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
              </blockquote>
              <figcaption className="mt-4 flex items-center gap-3">
                <div
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white"
                  aria-hidden="true"
                >
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{testimonial.author}</p>
                  <p className="text-xs text-gray-400">{testimonial.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
