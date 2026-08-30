import {
  getPlanDefinition,
  isSubscriptionActive,
  Plan,
  type SubscriptionStatus,
} from "@rk-kit/billing";
import { Card, CardContent, CardHeader, CardTitle } from "@rk-kit/ui";
import { ProviderSelector } from "../../../components/provider-selector";
import { requireProtectedContext } from "../../../lib/server-context";
import { getBillingStatus } from "../../../services/billing-service";

export default async function BillingPage() {
  const { organizationId } = await requireProtectedContext();
  const status = await getBillingStatus(organizationId);
  const plan = status.subscription?.plan ?? Plan.STARTER;
  const definition = getPlanDefinition(plan);
  const isActive = status.subscription
    ? isSubscriptionActive(status.subscription)
    : false;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Billing</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your subscription and payment provider.
        </p>
      </div>
      <Card>
        <CardHeader><CardTitle>Current plan</CardTitle></CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{definition?.name ?? plan}</p>
          <p className="text-sm text-muted-foreground">
            {isActive ? "Your subscription is active." : "You are on the free Starter plan."}
          </p>
        </CardContent>
      </Card>
      <ProviderSelector
        providers={status.providers}
        subscription={
          status.subscription
            ? {
                status: status.subscription.status as SubscriptionStatus,
                provider: status.subscription.provider,
              }
            : null
        }
      />
    </div>
  );
}
