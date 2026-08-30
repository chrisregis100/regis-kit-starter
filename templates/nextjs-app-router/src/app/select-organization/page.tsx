import type { Metadata } from "next";
import { OrganizationClient } from "../../components/organization-client";
import { requireOrganizationSelection } from "../../lib/server-context";

export const metadata: Metadata = { title: "Choose a workspace — RK Kit" };

export default async function SelectOrganizationPage() {
  const { organizations, user } = await requireOrganizationSelection();

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <OrganizationClient
        mode="select"
        organizations={organizations}
        userName={user.name}
      />
    </main>
  );
}
