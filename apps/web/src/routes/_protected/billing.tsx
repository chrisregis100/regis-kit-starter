import { createFileRoute } from "@tanstack/react-router";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge } from "@rk-kit/ui";

export const Route = createFileRoute("/_protected/billing")({
  component: BillingPage,
});

function BillingPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your subscription and payment details.
        </p>
      </div>

      {/* Current plan */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Current plan</CardTitle>
              <CardDescription>Your active subscription</CardDescription>
            </div>
            <Badge variant="secondary">Starter</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-4">
            <p className="text-sm font-medium text-blue-800">
              You are on the free Starter plan.
            </p>
            <p className="mt-1 text-sm text-blue-700">
              Payment integration is not yet enabled in this version of the boilerplate.
              Upgrade functionality will be added once a payment provider is configured.
            </p>
          </div>

          <div className="mt-4 space-y-3">
            <h3 className="text-sm font-medium text-gray-900">Included in your plan</h3>
            <ul className="space-y-2">
              {[
                "Up to 3 team members",
                "1 organization",
                "5 GB storage",
                "Community support",
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                  <svg
                    className="h-4 w-4 flex-shrink-0 text-green-500"
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
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade placeholder */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle>Upgrade to Pro</CardTitle>
          <CardDescription>Unlock unlimited team members and advanced features.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-1 mb-4">
            <span className="text-3xl font-bold text-gray-900">$29</span>
            <span className="text-gray-400">/month</span>
          </div>
          <button
            type="button"
            disabled
            className="w-full cursor-not-allowed rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-400"
            aria-label="Upgrade unavailable — payment not yet integrated"
          >
            Upgrade (coming soon)
          </button>
          <p className="mt-2 text-center text-xs text-gray-400">
            Payment integration coming in a future release.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
