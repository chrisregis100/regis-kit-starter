"use client";

import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from "@rk-kit/ui";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { inviteMemberAction, removeMemberAction } from "../app/actions";
import type { TeamData } from "../services/team-service";

export function TeamClient({ members, invitations }: TeamData) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"member" | "admin">("member");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await inviteMemberAction({ email, role });
      setEmail("");
      router.refresh();
    } catch {
      setError("Could not send the invitation.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRemove(memberId: string) {
    setError(null);
    try {
      await removeMemberAction(memberId);
      router.refresh();
    } catch {
      setError("Could not remove the member.");
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle>Invite a member</CardTitle></CardHeader>
        <CardContent>
          {error && <p role="alert" className="mb-3 text-sm text-destructive">{error}</p>}
          <form onSubmit={handleInvite} className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="invite-email">Email</Label>
              <Input
                id="invite-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            <select
              value={role}
              onChange={(event) => setRole(event.target.value as "member" | "admin")}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              aria-label="Invitation role"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
            <Button type="submit" isLoading={isLoading}>Invite</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Members ({members.length})</CardTitle></CardHeader>
        <CardContent>
          <ul className="divide-y divide-border">
            {members.map((member) => (
              <li key={member.id} className="flex items-center gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{member.user?.name ?? member.userId}</p>
                  <p className="truncate text-sm text-muted-foreground">{member.user?.email}</p>
                </div>
                <Badge>{member.role}</Badge>
                <Button type="button" size="sm" variant="ghost" onClick={() => handleRemove(member.id)}>
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {invitations.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Pending invitations</CardTitle></CardHeader>
          <CardContent>
            {invitations.map((invitation) => (
              <p key={invitation.id} className="text-sm text-muted-foreground">
                {invitation.email} · {invitation.role}
              </p>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
