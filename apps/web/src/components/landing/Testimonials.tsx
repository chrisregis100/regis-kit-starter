import { Card } from "@rk-kit/ui";

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
] as const;

export function Testimonials() {
  return (
    <section id="testimonials" className="bg-muted/50 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-sm font-medium uppercase tracking-wider text-primary">
            Testimonials
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Trusted by builders
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Real feedback from teams shipping with RK Kit.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.author}
              className="relative border-border/60 bg-card p-6 shadow-sm"
            >
              <div
                className="absolute left-0 top-0 h-full w-1 rounded-l-lg bg-accent"
                aria-hidden="true"
              />
              <blockquote>
                <p className="relative text-base leading-relaxed text-foreground">
                  <span
                    className="absolute -left-1 -top-2 font-serif text-4xl leading-none text-accent/40"
                    aria-hidden="true"
                  >
                    &ldquo;
                  </span>
                  {testimonial.quote}
                </p>
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <div
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary font-mono text-sm font-bold text-primary-foreground"
                  aria-hidden="true"
                >
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {testimonial.author}
                  </p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </figcaption>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
