import { Link } from "@tanstack/react-router";

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
];

export function Pricing() {
  return (
    <section id="pricing" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-xl mx-auto">
            Start free. Upgrade when you need to.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={[
                "rounded-2xl p-8 ring-1",
                plan.highlighted
                  ? "bg-blue-600 ring-blue-600 shadow-2xl shadow-blue-200"
                  : "bg-white ring-gray-200",
              ].join(" ")}
            >
              <h3
                className={[
                  "text-base font-semibold",
                  plan.highlighted ? "text-blue-100" : "text-gray-500",
                ].join(" ")}
              >
                {plan.name}
              </h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span
                  className={[
                    "text-4xl font-bold tracking-tight",
                    plan.highlighted ? "text-white" : "text-gray-900",
                  ].join(" ")}
                >
                  {plan.price}
                </span>
                {plan.period && (
                  <span
                    className={[
                      "text-sm",
                      plan.highlighted ? "text-blue-200" : "text-gray-400",
                    ].join(" ")}
                  >
                    {plan.period}
                  </span>
                )}
              </div>
              <p
                className={[
                  "mt-4 text-sm",
                  plan.highlighted ? "text-blue-100" : "text-gray-500",
                ].join(" ")}
              >
                {plan.description}
              </p>

              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <svg
                      className={[
                        "h-4 w-4 flex-shrink-0",
                        plan.highlighted ? "text-blue-200" : "text-blue-600",
                      ].join(" ")}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span
                      className={[
                        "text-sm",
                        plan.highlighted ? "text-white" : "text-gray-600",
                      ].join(" ")}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                to={plan.href}
                className={[
                  "mt-8 block w-full rounded-xl px-4 py-3 text-center text-sm font-semibold transition-all",
                  plan.highlighted
                    ? "bg-white text-blue-600 hover:bg-blue-50"
                    : "bg-blue-600 text-white hover:bg-blue-700",
                ].join(" ")}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
