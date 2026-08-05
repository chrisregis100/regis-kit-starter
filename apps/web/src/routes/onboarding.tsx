import { createFileRoute } from "@tanstack/react-router";
import { getOnboardingContext } from "../server/session-fns";
import { OnboardingClient } from "../components/onboarding/OnboardingClient";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Set up your workspace — RK Kit" }] }),
  beforeLoad: async () => getOnboardingContext(),
  component: OnboardingPage,
});

function OnboardingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 px-4">
      <OnboardingClient />
    </div>
  );
}
