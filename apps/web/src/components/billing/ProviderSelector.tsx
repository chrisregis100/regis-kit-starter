"use client";

import { useState } from "react";
import { useRouter } from "@tanstack/react-router";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@rk-kit/ui";
import {
  PaymentProvider,
  type AvailableProvider,
  type SubscriptionStatus,
} from "@rk-kit/billing";
import {
  createFedaPayPaymentFn,
  createKkiapayPaymentFn,
  createStripeCheckoutFn,
  createStripePortalFn,
  verifyKkiapayTransactionFn,
} from "../../server/billing-fns";

interface ProviderSelectorProps {
  providers: AvailableProvider[];
  subscription: {
    status: SubscriptionStatus;
    provider: string | null;
    currentPeriodEnd: string | null;
  } | null;
}

interface KkiapayWindow extends Window {
  openKkiapayWidget?: (options: Record<string, unknown>) => void;
  addSuccessListener?: (callback: (response: Record<string, unknown>) => void) => void;
  removeKkiapayListener?: (event: "success" | "failed") => void;
}

export function ProviderSelector({ providers, subscription }: ProviderSelectorProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<PaymentProvider | "portal" | null>(null);

  const activeProvider =
    subscription?.status === "active"
      ? (subscription.provider as PaymentProvider | null)
      : null;
  const isStripeActive = activeProvider === PaymentProvider.STRIPE;

  async function handleStripeCheckout(plan: "pro" | "enterprise") {
    setIsLoading(PaymentProvider.STRIPE);
    try {
      const successUrl = `${window.location.origin}/billing?success=true`;
      const cancelUrl = `${window.location.origin}/billing?canceled=true`;
      const result = await createStripeCheckoutFn({
        data: { plan, successUrl, cancelUrl },
      });
      if (result.url) {
        window.location.href = result.url;
      }
    } finally {
      setIsLoading(null);
    }
  }

  async function handleStripePortal() {
    setIsLoading("portal");
    try {
      const returnUrl = `${window.location.origin}/billing`;
      const result = await createStripePortalFn({ data: { returnUrl } });
      if (result.url) {
        window.location.href = result.url;
      }
    } finally {
      setIsLoading(null);
    }
  }

  async function handleKkiapay(plan: "pro" | "enterprise") {
    setIsLoading(PaymentProvider.KKIAPAY);
    try {
      const config = providers.find((p) => p.id === PaymentProvider.KKIAPAY);
      if (!config?.publicConfig?.publicKey) {
        throw new Error("KKiapay is not configured");
      }

      const { amount, organizationId, paymentId } = await createKkiapayPaymentFn({
        data: { plan },
      });

      await ensureKkiapayScriptLoaded();
      const kkiapay = window as KkiapayWindow;
      if (!kkiapay.openKkiapayWidget || !kkiapay.addSuccessListener) {
        throw new Error("KKiapay SDK is unavailable");
      }

      kkiapay.removeKkiapayListener?.("success");
      kkiapay.addSuccessListener(async (response: Record<string, unknown>) => {
        kkiapay.removeKkiapayListener?.("success");
        const requestData = response.requestData as Record<string, unknown> | undefined;
        const transactionId =
          (response.transactionId as string) || (requestData?.transactionId as string);
        if (transactionId) {
          await verifyKkiapayTransactionFn({
            data: { paymentId, transactionId },
          });
          router.invalidate();
        }
      });

      kkiapay.openKkiapayWidget({
        amount: String(amount),
        key: config.publicConfig.publicKey,
        sandbox: config.publicConfig.sandbox,
        position: "center",
        partnerId: paymentId,
        data: JSON.stringify({ organizationId, paymentId }),
      });
    } finally {
      setIsLoading(null);
    }
  }

  async function handleFedaPay(plan: "pro" | "enterprise") {
    setIsLoading(PaymentProvider.FEDAPAY);
    try {
      const successUrl = `${window.location.origin}/billing?success=true`;
      const cancelUrl = `${window.location.origin}/billing?canceled=true`;
      const result = await createFedaPayPaymentFn({
        data: { plan, successUrl, cancelUrl },
      });
      if (result.url) {
        window.location.href = result.url;
      }
    } finally {
      setIsLoading(null);
    }
  }

  if (providers.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-6 text-center text-sm text-muted-foreground">
          No payment provider is configured. Add environment variables to enable payments.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {providers.map((provider) => {
        const isActive = activeProvider === provider.id;
        const commonButtonProps = {
          className: "w-full",
          "aria-label": `Pay with ${provider.name}`,
        };

        return (
          <Card
            key={provider.id}
            className={isActive ? "border-primary ring-1 ring-primary" : ""}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{provider.name}</CardTitle>
                {isActive && (
                  <Badge variant="secondary" aria-label="Active provider">
                    Active
                  </Badge>
                )}
              </div>
              <CardDescription>{provider.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {provider.id === PaymentProvider.STRIPE && (
                <div className="space-y-2">
                  {isStripeActive ? (
                    <Button
                      type="button"
                      onClick={handleStripePortal}
                      disabled={isLoading === "portal"}
                      {...commonButtonProps}
                    >
                      {isLoading === "portal" ? "Opening portal…" : "Manage subscription"}
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <Button
                        type="button"
                        onClick={() => handleStripeCheckout("pro")}
                        disabled={isLoading === PaymentProvider.STRIPE}
                        {...commonButtonProps}
                      >
                        {isLoading === PaymentProvider.STRIPE
                          ? "Redirecting…"
                          : "Subscribe Pro $29/mo"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleStripeCheckout("enterprise")}
                        disabled={isLoading === PaymentProvider.STRIPE}
                        {...commonButtonProps}
                      >
                        Contact Enterprise
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {provider.id === PaymentProvider.KKIAPAY && (
                <div className="space-y-2">
                  <Button
                    type="button"
                    onClick={() => handleKkiapay("pro")}
                    disabled={isLoading === PaymentProvider.KKIAPAY}
                    {...commonButtonProps}
                  >
                    {isLoading === PaymentProvider.KKIAPAY
                      ? "Opening widget…"
                      : "Pay Pro 17,500 XOF"}
                  </Button>
                </div>
              )}

              {provider.id === PaymentProvider.FEDAPAY && (
                <div className="space-y-2">
                  <Button
                    type="button"
                    onClick={() => handleFedaPay("pro")}
                    disabled={isLoading === PaymentProvider.FEDAPAY}
                    {...commonButtonProps}
                  >
                    {isLoading === PaymentProvider.FEDAPAY
                      ? "Redirecting…"
                      : "Pay Pro 17,500 XOF"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function ensureKkiapayScriptLoaded(): Promise<void> {
  return new Promise((resolve, reject) => {
    const handleLoad = () => {
      if ((window as KkiapayWindow).openKkiapayWidget) {
        resolve();
        return;
      }
      reject(new Error("KKiapay SDK failed to initialize"));
    };

    if ((window as KkiapayWindow).openKkiapayWidget) {
      resolve();
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://cdn.kkiapay.me/k.js"]',
    );
    if (existing) {
      if (existing.dataset["kkiapayLoadState"] === "failed") {
        reject(new Error("Failed to load KKiapay SDK"));
        return;
      }
      if (existing.dataset["kkiapayLoadState"] === "loaded") {
        reject(new Error("KKiapay SDK failed to initialize"));
        return;
      }
      existing.addEventListener("load", handleLoad, { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("Failed to load KKiapay SDK")),
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.kkiapay.me/k.js";
    script.async = true;
    script.dataset["kkiapayLoadState"] = "loading";
    script.onload = () => {
      script.dataset["kkiapayLoadState"] = "loaded";
      handleLoad();
    };
    script.onerror = () => {
      script.dataset["kkiapayLoadState"] = "failed";
      reject(new Error("Failed to load KKiapay SDK"));
    };
    document.body.appendChild(script);
  });
}
