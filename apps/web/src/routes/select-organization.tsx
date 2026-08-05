import { createFileRoute } from "@tanstack/react-router";
import { getSelectOrganizationContext } from "../server/session-fns";
import { SelectOrganizationClient } from "../components/onboarding/SelectOrganizationClient";

export const Route = createFileRoute("/select-organization")({
  head: () => ({ meta: [{ title: "Choose a workspace — RK Kit" }] }),
  beforeLoad: async () => getSelectOrganizationContext(),
  component: SelectOrganizationPage,
});

function SelectOrganizationPage() {
  const { organizations, user } = Route.useRouteContext();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 px-4">
      <SelectOrganizationClient
        organizations={organizations}
        userName={user.name}
      />
    </div>
  );
}
