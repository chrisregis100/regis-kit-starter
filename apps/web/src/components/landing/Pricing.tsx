import { Link } from "@tanstack/react-router";
import { Check } from "@phosphor-icons/react";
import { Button, Card, cn } from "@rk-kit/ui";

const plans = [
  {
    name: "Starter",
    price: "$0",
    period: "forever",
    description: "Perfect for side projects and early-stage startups.",
    features: [
      "Up to 3 team members",
      "1 organization",
      "5 GB storage",
      "Community support",
    ],
    cta: "Get started",
    href: "/signup" as const,
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "per month",
    description: "For growing teams that need more power and flexibility.",
    features: [
      "Unlimited team members",
      "Unlimited organizations",
      "50 GB storage",
      "Priority email support",
      "Advanced analytics",
      "Custom domain",
    ],
    cta: "Start free trial",
    href: "/signup" as const,
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Dedicated infrastructure and SLAs for large organizations.",
    features: [
      "Everything in Pro",
      "SSO / SAML",
      "Audit logs",
      "Dedicated support",
      "Custom contracts",
      "SLA guarantee",
    ],
    cta: "Contact us",
    href: "/signup" as const,
    highlighted: false,
  },
] as const;

export function Pricing() {
  return (
    <section id="pricing" className="bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-sm font-medium uppercase tracking-wider text-primary">
            Pricing
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Start free. Scale as you grow.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            No hidden fees. Upgrade when you are ready.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={cn(
                "relative overflow-hidden p-8 ring-1 transition-shadow hover:shadow-lg",
                plan.highlighted
                  ? "border-primary bg-primary text-primary-foreground shadow-xl shadow-primary/15 ring-primary"
                  : "border-border/60 bg-card text-card-foreground ring-border",
              )}
            >
              {plan.highlighted && (
                <div className="absolute right-0 top-0 rounded-bl-lg bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
                  Popular
                </div>
              )}

              <h3
                className={cn(
                  "text-base font-semibold",
                  plan.highlighted ? "text-primary-foreground/80" : "text-muted-foreground",
                )}
              >
                {plan.name}
              </h3>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-mono text-4xl font-bold tracking-tight">
                  {plan.price}
                </span>
                {plan.period && (
                  <span
                    className={cn(
                      "text-sm",
                      plan.highlighted
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground",
                    )}
                  >
                    {plan.period}
                  </span>
                )}
              </div>

              <p
                className={cn(
                  "mt-4 text-sm",
                  plan.highlighted
                    ? "text-primary-foreground/80"
                    : "text-muted-foreground",
                )}
              >
                {plan.description}
              </p>

              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check
                      weight="bold"
                      className={cn(
                        "mt-0.5 h-4 w-4 flex-shrink-0",
                        plan.highlighted ? "text-primary-foreground/80" : "text-primary",
                      )}
                      aria-hidden="true"
                    />
                    <span className="text-sm leading-tight">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                variant={plan.highlighted ? "secondary" : "default"}
                className={cn(
                  "mt-8 w-full rounded-lg",
                  plan.highlighted &&
                    "bg-primary-foreground text-primary hover:bg-primary-foreground/90",
                )}
              >
                <Link to={plan.href}>{plan.cta}</Link>
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
