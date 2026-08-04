"use client";

import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { authClient } from "../lib/auth-client";
import { inviteMember, removeMember } from "../services/team.server";
import { LoadingSpinner } from "../components/shared/LoadingSpinner";
import { ErrorCard } from "../components/shared/ErrorCard";
import { TeamMemberRow } from "../components/dashboard/TeamMemberRow";
import {
  Button,
  Input,
  Label,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@rk-kit/ui";

export const Route = createFileRoute("/_dashboard/dashboard/team")({
  head: () => ({ meta: [{ title: "Team — RegisKit" }] }),
  component: TeamPage,
});

function TeamPage() {
  const { data: org, isPending, error, refetch } = authClient.useActiveOrganization();
  const { data: session } = authClient.useSession();

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"member" | "admin">("member");
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [isInviting, setIsInviting] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteError(null);
    setIsInviting(true);
    try {
      await inviteMember({ data: { email: inviteEmail, role: inviteRole } });
      setInviteEmail("");
      refetch();
    } catch (err) {
      setInviteError(
        err instanceof Error ? err.message : "Failed to send invitation."
      );
    } finally {
      setIsInviting(false);
    }
  };

  const handleRemove = async (memberId: string) => {
    setRemovingId(memberId);
    try {
      await removeMember({ data: { memberId } });
      refetch();
    } catch {
      // Silently refetch to get current state
      refetch();
    } finally {
      setRemovingId(null);
    }
  };

  if (isPending) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !org) {
    return (
      <ErrorCard message="Failed to load team." onRetry={() => refetch()} />
    );
  }

  const members = org.members ?? [];
  const currentUserMember = members.find((m) => m.userId === session?.user.id);
  const canManage = currentUserMember?.role === "admin" || currentUserMember?.role === "owner";

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Team</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Manage members and invitations for{" "}
          <span className="font-medium">{org.name}</span>.
        </p>
      </div>

      {/* Members */}
      <Card>
        <CardHeader>
          <CardTitle>Members ({members.length})</CardTitle>
        </CardHeader>
        {members.length === 0 ? (
          <CardContent>
            <p className="text-sm text-zinc-500">No members yet.</p>
          </CardContent>
        ) : (
          <ul className="divide-y divide-zinc-100">
            {members.map((member) => (
              <TeamMemberRow
                key={member.id}
                member={{
                  id: member.id,
                  role: member.role,
                  user: {
                    name: (member as { user?: { name?: string } }).user?.name,
                    email:
                      (member as { user?: { email?: string } }).user?.email ?? "",
                  },
                }}
                onRemove={handleRemove}
                isRemoving={removingId === member.id}
                canRemove={canManage && member.userId !== session?.user.id}
              />
            ))}
          </ul>
        )}
      </Card>

      {/* Invite */}
      {canManage && (
        <Card>
          <CardHeader>
            <CardTitle>Invite member</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleInvite} noValidate className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="invite-email">Email address</Label>
                <Input
                  id="invite-email"
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@example.com"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="invite-role">Role</Label>
                <select
                  id="invite-role"
                  value={inviteRole}
                  onChange={(e) =>
                    setInviteRole(e.target.value as "member" | "admin")
                  }
                  className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              {inviteError && (
                <p role="alert" className="text-sm text-red-600">
                  {inviteError}
                </p>
              )}
              <Button
                type="submit"
                className="bg-violet-600 hover:bg-violet-700 text-white"
                disabled={isInviting || !inviteEmail}
              >
                {isInviting ? "Sending…" : "Send invitation"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
