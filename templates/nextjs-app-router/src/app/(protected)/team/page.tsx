import { TeamClient } from "../../../components/team-client";
import { getRequestHeaders, requireProtectedContext } from "../../../lib/server-context";
import { getTeam } from "../../../services/team-service";

export default async function TeamPage() {
  const { organizationId } = await requireProtectedContext();
  const team = await getTeam(organizationId, await getRequestHeaders());

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Team</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage organization members and invitations.
        </p>
      </div>
      <TeamClient {...team} />
    </div>
  );
}
