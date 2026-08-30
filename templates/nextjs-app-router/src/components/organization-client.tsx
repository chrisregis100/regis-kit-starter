"use client";

import type { UserOrganization } from "@rk-kit/auth";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  ThemeToggle,
} from "@rk-kit/ui";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { selectOrganization } from "../app/actions";
import { authClient } from "../lib/auth-client";
import { Logo } from "./logo";

interface OrganizationClientProps {
  initialInvitationId?: string;
  mode: "onboarding" | "select";
  organizations?: UserOrganization[];
  userName?: string;
}

export function OrganizationClient({
  initialInvitationId = "",
  mode,
  organizations = [],
  userName = "",
}: OrganizationClientProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [invitationId, setInvitationId] = useState(initialInvitationId);
  const [isJoining, setIsJoining] = useState(Boolean(initialInvitationId));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleNameChange(value: string) {
    setName(value);
    setSlug(value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const result = await authClient.organization.create({ name, slug });
      if (result.error || !result.data) throw new Error(result.error?.message);
      await authClient.organization.setActive({ organizationId: result.data.id });
      router.push("/dashboard");
      router.refresh();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Could not create workspace.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleJoin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const result = await authClient.organization.acceptInvitation({ invitationId });
      if (result.error) throw new Error(result.error.message);
      router.push("/select-organization");
      router.refresh();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Could not join workspace.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSelect(organizationId: string) {
    setError(null);
    setIsLoading(true);
    try {
      await selectOrganization(organizationId);
      router.push("/dashboard");
      router.refresh();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Could not open workspace.");
      setIsLoading(false);
    }
  }

  return (
    <div className="relative w-full max-w-md space-y-6">
      <div className="absolute -top-16 right-0"><ThemeToggle /></div>
      <div className="flex justify-center"><Logo /></div>
      <div className="text-center">
        <h1 className="text-2xl font-bold">
          {mode === "select" ? "Choose a workspace" : "Set up your workspace"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {mode === "select"
            ? `Welcome back${userName ? `, ${userName}` : ""}.`
            : "Create a new organization or accept an invitation."}
        </p>
      </div>

      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}

      {mode === "select" ? (
        <Card>
          <CardHeader>
            <CardTitle>Your organizations</CardTitle>
            <CardDescription>Select the workspace to open.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {organizations.map((organization) => (
              <Button
                key={organization.id}
                type="button"
                variant="outline"
                className="w-full justify-start"
                disabled={isLoading}
                onClick={() => handleSelect(organization.id)}
              >
                {organization.name}
              </Button>
            ))}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{isJoining ? "Join organization" : "Create organization"}</CardTitle>
            <CardDescription>
              {isJoining ? "Use the invitation ID from your email." : "Create your team workspace."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isJoining ? (
              <form onSubmit={handleJoin} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="invitation-id">Invitation ID</Label>
                  <Input
                    id="invitation-id"
                    value={invitationId}
                    onChange={(event) => setInvitationId(event.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" isLoading={isLoading}>Join</Button>
              </form>
            ) : (
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="organization-name">Organization name</Label>
                  <Input
                    id="organization-name"
                    value={name}
                    onChange={(event) => handleNameChange(event.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="organization-slug">Slug</Label>
                  <Input
                    id="organization-slug"
                    value={slug}
                    onChange={(event) => setSlug(event.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" isLoading={isLoading}>Create</Button>
              </form>
            )}
            <Button
              type="button"
              variant="ghost"
              className="mt-3 w-full"
              onClick={() => setIsJoining((current) => !current)}
            >
              {isJoining ? "Create a workspace instead" : "Join with an invitation"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
