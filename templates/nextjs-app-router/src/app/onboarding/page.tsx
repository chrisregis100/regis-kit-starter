import type { Metadata } from "next";
import { OrganizationClient } from "../../components/organization-client";
import { requireOnboardingContext } from "../../lib/server-context";

export const metadata: Metadata = { title: "Set up your workspace — RK Kit" };

export default async function OnboardingPage() {
  await requireOnboardingContext();

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <OrganizationClient mode="onboarding" />
    </main>
  );
}
