import { createFileRoute } from "@tanstack/react-router";
import { Check } from "@phosphor-icons/react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge, Button } from "@rk-kit/ui";

export const Route = createFileRoute("/_protected/billing")({
  component: BillingPage,
});

function BillingPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Billing</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your subscription and payment details.
        </p>
      </div>

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
          <div className="rounded-lg border border-primary/20 bg-accent px-4 py-4">
            <p className="text-sm font-medium text-accent-foreground">
              You are on the free Starter plan.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Payment integration is not yet enabled in this version of the boilerplate.
              Upgrade functionality will be added once a payment provider is configured.
            </p>
          </div>

          <div className="mt-4 space-y-3">
            <h3 className="text-sm font-medium text-foreground">Included in your plan</h3>
            <ul className="space-y-2">
              {[
                "Up to 3 team members",
                "1 organization",
                "5 GB storage",
                "Community support",
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check weight="bold" className="h-4 w-4 flex-shrink-0 text-success" aria-hidden="true" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upgrade to Pro</CardTitle>
          <CardDescription>Unlock unlimited team members and advanced features.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-baseline gap-1">
            <span className="text-3xl font-bold text-foreground">$29</span>
            <span className="text-muted-foreground">/month</span>
          </div>
          <Button
            type="button"
            disabled
            variant="secondary"
            className="w-full cursor-not-allowed"
            aria-label="Upgrade unavailable — payment not yet integrated"
          >
            Upgrade (coming soon)
          </Button>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Payment integration coming in a future release.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
