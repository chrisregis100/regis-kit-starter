import { createFileRoute, redirect } from "@tanstack/react-router";
import { getServerSession } from "../server/session-fns";
import { OnboardingClient } from "../components/onboarding/OnboardingClient";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Set up your workspace — RK Kit" }] }),
  beforeLoad: async () => {
    const session = await getServerSession();
    if (!session) throw redirect({ to: "/login" });
    if (session.session.activeOrganizationId) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: OnboardingPage,
});

function OnboardingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 px-4">
      <OnboardingClient />
    </div>
  );
}
