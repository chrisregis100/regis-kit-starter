import { createFileRoute, useRouter } from "@tanstack/react-router";
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
  Separator,
} from "@rk-kit/ui";
import { authClient } from "../../lib/auth-client";

export const Route = createFileRoute("/_protected/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const ctx = Route.useRouteContext();
  const router = useRouter();
  const [name, setName] = useState(ctx.user.name);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    setIsSaving(true);

    try {
      const result = await authClient.updateUser({ name });
      if (result.error) {
        setMessage({ type: "error", text: result.error.message ?? "Update failed." });
      } else {
        setMessage({ type: "success", text: "Profile updated." });
        await router.invalidate();
      }
    } catch {
      setMessage({ type: "error", text: "An unexpected error occurred." });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your account preferences.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your display name and account details.</CardDescription>
        </CardHeader>
        <CardContent>
          {message && (
            <div
              role="alert"
              className={
                message.type === "success"
                  ? "mb-4 rounded-lg bg-success/10 px-4 py-3 text-sm text-success"
                  : "mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive"
              }
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Display name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={100}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={ctx.user.email}
                disabled
                className="bg-muted text-muted-foreground"
              />
              <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
            </div>

            <Button type="submit" isLoading={isSaving} loadingText="Saving…">
              Save changes
            </Button>
          </form>
        </CardContent>
      </Card>

      <Separator />

      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-destructive">Danger zone</CardTitle>
          <CardDescription>Irreversible actions for your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Account deletion is not yet implemented in this version.
            Contact support if you need to delete your account.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
