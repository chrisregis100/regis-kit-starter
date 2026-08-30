"use client";

import type { SessionUser } from "@rk-kit/auth";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from "@rk-kit/ui";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { authClient } from "../lib/auth-client";

interface SettingsFormProps {
  user: SessionUser;
}

export function SettingsForm({ user }: SettingsFormProps) {
  const router = useRouter();
  const [name, setName] = useState(user.name);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setIsLoading(true);
    try {
      const result = await authClient.updateUser({ name });
      if (result.error) throw new Error(result.error.message);
      setMessage("Profile updated.");
      router.refresh();
    } catch {
      setMessage("Could not update your profile.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
      <CardContent>
        {message && <p role="status" className="mb-3 text-sm text-muted-foreground">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="display-name">Display name</Label>
            <Input
              id="display-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="account-email">Email</Label>
            <Input id="account-email" value={user.email} disabled />
          </div>
          <Button type="submit" isLoading={isLoading}>Save changes</Button>
        </form>
      </CardContent>
    </Card>
  );
}
