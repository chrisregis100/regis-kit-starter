import { createFileRoute } from "@tanstack/react-router";
import { Check } from "@phosphor-icons/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Skeleton } from "@rk-kit/ui";
import { getPlanDefinition, Plan, isSubscriptionActive, type SubscriptionStatus } from "@rk-kit/billing";
import { getBillingStatusFn } from "../../server/billing-fns";
import { ProviderSelector } from "../../components/billing/ProviderSelector";

export const Route = createFileRoute("/_protected/billing")({
  component: BillingPage,
  pendingComponent: BillingSkeleton,
  loader: async () => {
    return { status: await getBillingStatusFn() };
  },
});

function BillingPage() {
  const { status } = Route.useLoaderData();
  const subscription = status.subscription;

  const plan = subscription?.plan ?? Plan.STARTER;
  const planDef = getPlanDefinition(plan);
  const isActive = subscription ? isSubscriptionActive(subscription) : false;
  const periodEnd = subscription?.currentPeriodEnd
    ? new Date(subscription.currentPeriodEnd).toLocaleDateString()
    : null;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Billing</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your subscription and payment method.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Current plan</CardTitle>
              <CardDescription>Your active subscription</CardDescription>
            </div>
            <span className="text-sm font-medium text-foreground">
              {planDef?.name ?? plan}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div
            className={`rounded-lg border px-4 py-4 ${
              isActive
                ? "border-primary/20 bg-accent"
                : "border-border bg-muted/50"
            }`}
          >
            <p className="text-sm font-medium text-foreground">
              {isActive
                ? `Active until ${periodEnd ?? "the end of the current period"}`
                : "You are on the free Starter plan."}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {isActive
                ? "Your subscription is being renewed automatically or via your chosen provider."
                : "Upgrade to unlock more features and team members."}
            </p>
          </div>

          <div className="mt-4 space-y-3">
            <h3 className="text-sm font-medium text-foreground">Included in your plan</h3>
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {getPlanFeatures(plan).map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <Check
                    weight="bold"
                    className="h-4 w-4 flex-shrink-0 text-success"
                    aria-hidden="true"
                  />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-lg font-semibold text-foreground">Choose a payment method</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Select the provider that works best for you. Only configured providers are shown.
        </p>
      </div>

      <ProviderSelector
        providers={status.providers}
        subscription={
          subscription
            ? {
                status: subscription.status as SubscriptionStatus,
                provider: subscription.provider,
                currentPeriodEnd: subscription.currentPeriodEnd
                  ? new Date(subscription.currentPeriodEnd).toISOString()
                  : null,
              }
            : null
        }
      />
    </div>
  );
}

function getPlanFeatures(plan: string): string[] {
  const features: Record<string, string[]> = {
    starter: [
      "Up to 3 team members",
      "1 organization",
      "5 GB storage",
      "Community support",
    ],
    pro: [
      "Unlimited team members",
      "Unlimited organizations",
      "50 GB storage",
      "Priority email support",
      "Advanced analytics",
      "Custom domain",
    ],
    enterprise: [
      "Everything in Pro",
      "SSO / SAML",
      "Audit logs",
      "Dedicated support",
      "Custom contracts",
      "SLA guarantee",
    ],
  };
  return features[plan] ?? features.starter ?? [];
}

function BillingSkeleton() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-4 w-72" />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-5 w-16" />
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20 w-full rounded-lg" />
          <div className="mt-4 space-y-3">
            <Skeleton className="h-5 w-36" />
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-80" />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
