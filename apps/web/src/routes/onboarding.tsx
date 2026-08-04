import { createFileRoute, redirect } from "@tanstack/react-router";
import { getServerSession } from "../lib/session-fns";
import { OnboardingClient } from "../components/onboarding/OnboardingClient";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Set up your workspace — RK Kit" }] }),
  beforeLoad: async () => {
    const session = await getServerSession();
    if (!session) throw redirect({ to: "/login" });
    // Already has an active org — skip to dashboard
    if (session.session.activeOrganizationId) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: OnboardingPage,
});

function OnboardingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="mb-8 flex items-center gap-2 font-bold text-gray-900">
        <div
          aria-hidden="true"
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white"
        >
          RK
        </div>
        RK Kit
      </div>
      <OnboardingClient />
    </div>
  );
}
