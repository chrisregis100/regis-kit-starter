import type { Metadata } from "next";
import { OrganizationClient } from "../../components/organization-client";
import { requireOnboardingContext } from "../../lib/server-context";

export const metadata: Metadata = { title: "Set up your workspace — RK Kit" };

interface OnboardingPageProps {
  searchParams: Promise<{ invitation?: string | string[] }>;
}

export default async function OnboardingPage({
  searchParams,
}: OnboardingPageProps) {
  await requireOnboardingContext();
  const { invitation } = await searchParams;
  const invitationId = (Array.isArray(invitation) ? invitation[0] : invitation) ?? "";

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <OrganizationClient
        initialInvitationId={invitationId}
        mode="onboarding"
      />
    </main>
  );
}
