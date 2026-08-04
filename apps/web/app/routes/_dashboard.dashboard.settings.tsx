"use client";

import { createFileRoute } from "@tanstack/react-router";
import { authClient } from "../lib/auth-client";
import { LoadingSpinner } from "../components/shared/LoadingSpinner";
import { ErrorCard } from "../components/shared/ErrorCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label, Button } from "@rk-kit/ui";

export const Route = createFileRoute("/_dashboard/dashboard/settings")({
  head: () => ({ meta: [{ title: "Settings — RegisKit" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const {
    data: session,
    isPending,
    error,
    refetch,
  } = authClient.useSession();

  if (isPending) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !session) {
    return (
      <ErrorCard
        message="Failed to load settings."
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Settings</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Manage your account and organization preferences.
        </p>
      </div>

      {/* Account */}
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Your personal account details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="account-name">Name</Label>
            <Input
              id="account-name"
              type="text"
              defaultValue={session.user.name ?? ""}
              readOnly
              className="bg-zinc-50"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="account-email">Email</Label>
            <Input
              id="account-email"
              type="email"
              defaultValue={session.user.email}
              readOnly
              className="bg-zinc-50"
            />
          </div>
        </CardContent>
      </Card>

      {/* Organization */}
      <OrgSettings />

      {/* Danger zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Danger zone</CardTitle>
          <CardDescription>
            Irreversible actions — proceed with caution.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" disabled>
            Delete account (coming soon)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function OrgSettings() {
  const { data: org, isPending } = authClient.useActiveOrganization();

  if (isPending) {
    return (
      <Card>
        <CardContent className="flex h-20 items-center justify-center">
          <LoadingSpinner />
        </CardContent>
      </Card>
    );
  }

  if (!org) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organization</CardTitle>
        <CardDescription>
          Settings for <span className="font-medium">{org.name}</span>.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="org-name">Organization name</Label>
          <Input
            id="org-name"
            type="text"
            defaultValue={org.name}
            readOnly
            className="bg-zinc-50"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="org-slug">Slug</Label>
          <Input
            id="org-slug"
            type="text"
            defaultValue={org.slug ?? ""}
            readOnly
            className="bg-zinc-50"
          />
        </div>
        <p className="text-xs text-zinc-400">
          Editing organization details will be available in a future release.
        </p>
      </CardContent>
    </Card>
  );
}
