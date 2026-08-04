import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { useState } from "react";
import {
  Button,
  Input,
  Label,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Avatar,
  AvatarFallback,
} from "@rk-kit/ui";
import { requireOrganization } from "@rk-kit/auth";
import {
  getTeam,
  inviteMember,
  removeMember,
  inviteMemberSchema,
  removeMemberSchema,
} from "../../services/team-service";

const getTeamData = createServerFn({ method: "GET" }).handler(async () => {
  const request = getRequest();
  const { organizationId } = await requireOrganization(request.headers);

  const team = await getTeam(organizationId, request.headers);

  return { organizationId, ...team };
});

const inviteMemberFn = createServerFn({ method: "POST" })
  .validator(inviteMemberSchema)
  .handler(async (ctx) => {
    const request = getRequest();
    const { organizationId } = await requireOrganization(request.headers);

    await inviteMember(organizationId, request.headers, ctx.data);

    return { success: true };
  });

const removeMemberFn = createServerFn({ method: "POST" })
  .validator(removeMemberSchema)
  .handler(async (ctx) => {
    const request = getRequest();
    const { organizationId } = await requireOrganization(request.headers);

    await removeMember(organizationId, request.headers, ctx.data);

    return { success: true };
  });

export const Route = createFileRoute("/_protected/team")({
  loader: () => getTeamData(),
  component: TeamPage,
  pendingComponent: TeamSkeleton,
});

function TeamPage() {
  const { members, invitations, organizationId } = Route.useLoaderData();
  const router = useRouter();
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"member" | "admin">("member");
  const [isInviting, setIsInviting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInvite = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsInviting(true);

    try {
      await inviteMemberFn({ data: { email: inviteEmail, role: inviteRole } });
      setSuccess(`Invitation sent to ${inviteEmail}.`);
      setInviteEmail("");
      await router.invalidate();
    } catch {
      setError("Failed to send invitation. Please try again.");
    } finally {
      setIsInviting(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      await removeMemberFn({ data: { memberId } });
      await router.invalidate();
    } catch {
      setError("Failed to remove member.");
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Team</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage members and invitations for this organization.
        </p>
      </div>

      {/* Invite */}
      <Card>
        <CardHeader>
          <CardTitle>Invite a member</CardTitle>
          <CardDescription>Send an invitation by email.</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div role="alert" className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}
          {success && (
            <div role="status" className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          )}

          <form onSubmit={handleInvite} className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="inviteEmail">Email address</Label>
              <Input
                id="inviteEmail"
                type="email"
                placeholder="colleague@company.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5 sm:w-36">
              <Label htmlFor="inviteRole">Role</Label>
              <select
                id="inviteRole"
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as "member" | "admin")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <Button type="submit" disabled={isInviting}>
              {isInviting ? "Sending…" : "Send invite"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Members list */}
      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>
          <CardDescription>{members.length} member{members.length !== 1 ? "s" : ""}</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {members.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <span className="text-3xl" aria-hidden="true">👥</span>
              <p className="mt-3 text-sm text-gray-500">No members yet.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100" role="list">
              {members.map((member) => {
                const displayName = member.user?.name ?? member.userId;
                const initials = displayName
                  .split(" ")
                  .slice(0, 2)
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase();

                return (
                  <li key={member.id} className="flex items-center gap-4 px-5 py-3">
                    <Avatar className="h-9 w-9 flex-shrink-0">
                      <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {displayName}
                      </p>
                      <p className="truncate text-xs text-gray-400">
                        {member.user?.email}
                      </p>
                    </div>
                    <Badge variant={member.role === "admin" ? "default" : "secondary"}>
                      {member.role}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMember(member.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      aria-label={`Remove ${displayName}`}
                    >
                      Remove
                    </Button>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Pending invitations */}
      {invitations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending invitations</CardTitle>
            <CardDescription>{invitations.length} pending</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y divide-gray-100" role="list">
              {invitations.map((inv) => (
                <li key={inv.id} className="flex items-center gap-4 px-5 py-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border-2 border-dashed border-gray-300">
                    <span className="text-xs text-gray-400" aria-hidden="true">?</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-700">{inv.email}</p>
                    <p className="text-xs text-gray-400">Invitation pending</p>
                  </div>
                  <Badge variant="secondary">{inv.role}</Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <p className="text-xs text-gray-300">org: {organizationId}</p>
    </div>
  );
}

function TeamSkeleton() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 animate-pulse">
      <div className="h-8 w-24 rounded-lg bg-gray-200" />
      <div className="h-40 rounded-xl bg-gray-200" />
      <div className="h-64 rounded-xl bg-gray-200" />
    </div>
  );
}
