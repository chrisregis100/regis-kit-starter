import { Button } from "@rk-kit/ui";
import { Badge } from "@rk-kit/ui";
import { Link } from "@tanstack/react-router";

const plans = [
  {
    name: "Starter",
    price: "Free",
    period: "forever",
    description: "Perfect for side projects and personal use.",
    features: [
      "Up to 3 team members",
      "1 organization",
      "5GB storage",
      "Community support",
    ],
    cta: "Get started",
    to: "/signup" as const,
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "per month",
    description: "For growing teams that need more power.",
    features: [
      "Unlimited team members",
      "Unlimited organizations",
      "50GB storage",
      "Priority email support",
      "Advanced analytics",
    ],
    cta: "Start free trial",
    to: "/signup" as const,
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "per year",
    description: "For large organizations with custom needs.",
    features: [
      "Everything in Pro",
      "SSO / SAML",
      "Dedicated infrastructure",
      "SLA guarantees",
      "24/7 phone support",
    ],
    cta: "Contact us",
    to: "/signup" as const,
    highlighted: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 text-sm font-semibold uppercase tracking-widest text-violet-600">
            Pricing
          </div>
          <h2 className="text-4xl font-bold text-zinc-900 sm:text-5xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-zinc-500">
            Start free. Scale as you grow. No hidden fees.
          </p>
        </div>

        {/* Pricing grid */}
        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl p-8 ${
                plan.highlighted
                  ? "bg-zinc-900 text-white ring-2 ring-violet-500"
                  : "border border-zinc-200 bg-white"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <Badge className="bg-violet-500 text-white text-xs px-3 py-1">
                    Most popular
                  </Badge>
                </div>
              )}

              <div>
                <h3
                  className={`text-lg font-semibold ${plan.highlighted ? "text-white" : "text-zinc-900"}`}
                >
                  {plan.name}
                </h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span
                    className={`text-4xl font-bold ${plan.highlighted ? "text-white" : "text-zinc-900"}`}
                  >
                    {plan.price}
                  </span>
                  {plan.price !== "Free" && plan.price !== "Custom" && (
                    <span
                      className={`text-sm ${plan.highlighted ? "text-zinc-300" : "text-zinc-500"}`}
                    >
                      /{plan.period}
                    </span>
                  )}
                </div>
                <p
                  className={`mt-2 text-sm ${plan.highlighted ? "text-zinc-300" : "text-zinc-500"}`}
                >
                  {plan.description}
                </p>
              </div>

              <ul className="mt-8 space-y-3 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <svg
                      aria-hidden="true"
                      className={`mt-0.5 h-4 w-4 flex-shrink-0 ${plan.highlighted ? "text-violet-400" : "text-violet-600"}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span
                      className={`text-sm ${plan.highlighted ? "text-zinc-200" : "text-zinc-600"}`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Link to={plan.to} className="block">
                  <Button
                    className={`w-full ${plan.highlighted ? "bg-violet-600 hover:bg-violet-700 text-white" : ""}`}
                    variant={plan.highlighted ? "default" : "outline"}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
