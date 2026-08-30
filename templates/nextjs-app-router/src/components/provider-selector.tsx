"use client";

import {
  PaymentProvider,
  type AvailableProvider,
  type SubscriptionStatus,
} from "@rk-kit/billing";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from "@rk-kit/ui";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  createFedaPayPaymentAction,
  createKkiapayPaymentAction,
  createStripeCheckoutAction,
  createStripePortalAction,
  verifyKkiapayTransactionAction,
} from "../app/actions";

interface ProviderSelectorProps {
  providers: AvailableProvider[];
  subscription: {
    status: SubscriptionStatus;
    provider: string | null;
  } | null;
}

interface KkiapayWindow extends Window {
  openKkiapayWidget?: (options: Record<string, unknown>) => void;
  addSuccessListener?: (callback: (response: Record<string, unknown>) => void) => void;
}

export function ProviderSelector({
  providers,
  subscription,
}: ProviderSelectorProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const activeProvider = subscription?.provider;

  async function handleStripe() {
    setIsLoading(PaymentProvider.STRIPE);
    try {
      if (activeProvider === PaymentProvider.STRIPE) {
        const result = await createStripePortalAction(`${window.location.origin}/billing`);
        window.location.assign(result.url);
        return;
      }
      const result = await createStripeCheckoutAction(
        "pro",
        `${window.location.origin}/billing?success=true`,
        `${window.location.origin}/billing?canceled=true`,
      );
      window.location.assign(result.url);
    } finally {
      setIsLoading(null);
    }
  }

  async function handleFedaPay() {
    setIsLoading(PaymentProvider.FEDAPAY);
    try {
      const result = await createFedaPayPaymentAction(
        `${window.location.origin}/billing?success=true`,
        `${window.location.origin}/billing?canceled=true`,
      );
      window.location.assign(result.url);
    } finally {
      setIsLoading(null);
    }
  }

  async function handleKkiapay() {
    setIsLoading(PaymentProvider.KKIAPAY);
    try {
      const provider = providers.find((item) => item.id === PaymentProvider.KKIAPAY);
      const publicKey = provider?.publicConfig?.publicKey;
      if (typeof publicKey !== "string") throw new Error("KKiapay is not configured.");

      const { amount } = await createKkiapayPaymentAction();
      await loadKkiapay();
      const kkiapay = window as KkiapayWindow;
      kkiapay.openKkiapayWidget?.({
        amount: String(amount),
        key: publicKey,
        sandbox: provider?.publicConfig?.sandbox,
        position: "center",
        data: JSON.stringify({ plan: "pro" }),
      });
      kkiapay.addSuccessListener?.(async (response) => {
        const requestData = response.requestData as Record<string, unknown> | undefined;
        const transactionId =
          (response.transactionId as string | undefined) ??
          (requestData?.transactionId as string | undefined);
        if (!transactionId) return;
        await verifyKkiapayTransactionAction(transactionId);
        router.refresh();
      });
    } finally {
      setIsLoading(null);
    }
  }

  if (providers.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-8 text-center text-sm text-muted-foreground">
          No payment provider is configured.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {providers.map((provider) => (
        <Card key={provider.id} className={activeProvider === provider.id ? "border-primary" : ""}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{provider.name}</CardTitle>
              {activeProvider === provider.id && <Badge>Active</Badge>}
            </div>
          </CardHeader>
          <CardContent>
            <Button
              type="button"
              className="w-full"
              disabled={isLoading !== null}
              onClick={
                provider.id === PaymentProvider.STRIPE
                  ? handleStripe
                  : provider.id === PaymentProvider.KKIAPAY
                    ? handleKkiapay
                    : handleFedaPay
              }
            >
              {isLoading === provider.id ? "Opening…" : `Continue with ${provider.name}`}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function loadKkiapay(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector('script[src="https://cdn.kkiapay.me/k.js"]')) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdn.kkiapay.me/k.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load KKiapay SDK"));
    document.body.appendChild(script);
  });
}
