import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Buildings, Handshake } from "@phosphor-icons/react";
import {
  Button,
  Input,
  Label,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ThemeToggle,
} from "@rk-kit/ui";
import { authClient } from "../../lib/auth-client";
import { Logo } from "../shared/Logo";
import { cn } from "@rk-kit/ui";

type Step = "choose" | "create" | "join";

export function OnboardingClient() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("choose");

  return (
    <div className="relative w-full max-w-md space-y-6">
      <div className="absolute -top-16 right-0">
        <ThemeToggle />
      </div>

      <div className="flex justify-center">
        <Logo />
      </div>

      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">Set up your workspace</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Create a new organization or join an existing one.
        </p>
      </div>

      {step === "choose" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setStep("create")}
            className={cn(
              "flex flex-col gap-2 rounded-xl border-2 border-border bg-card p-5 text-left transition-colors",
              "hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            )}
          >
            <Buildings weight="duotone" className="h-7 w-7 text-primary" aria-hidden="true" />
            <span className="font-semibold text-foreground">Create</span>
            <span className="text-xs text-muted-foreground">Start a new organization</span>
          </button>
          <button
            type="button"
            onClick={() => setStep("join")}
            className={cn(
              "flex flex-col gap-2 rounded-xl border-2 border-border bg-card p-5 text-left transition-colors",
              "hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            )}
          >
            <Handshake weight="duotone" className="h-7 w-7 text-primary" aria-hidden="true" />
            <span className="font-semibold text-foreground">Join</span>
            <span className="text-xs text-muted-foreground">Accept an invitation</span>
          </button>
        </div>
      )}

      {step === "create" && (
        <CreateOrgForm
          onBack={() => setStep("choose")}
          onSuccess={() => navigate({ to: "/dashboard" })}
        />
      )}

      {step === "join" && (
        <JoinOrgForm
          onBack={() => setStep("choose")}
          onSuccess={() => navigate({ to: "/dashboard" })}
        />
      )}
    </div>
  );
}

function CreateOrgForm({
  onBack,
  onSuccess,
}: {
  onBack: () => void;
  onSuccess: () => void;
}) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleNameChange = (value: string) => {
    setName(value);
    setSlug(value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await authClient.organization.create({ name, slug });
      if (result.error || !result.data) {
        setError(result.error?.message ?? "Failed to create organization.");
        return;
      }
      await authClient.organization.setActive({
        organizationId: result.data.id,
      });
      onSuccess();
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create organization</CardTitle>
        <CardDescription>
          Your organization is the shared workspace for your team.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="org-name">Organization name</Label>
            <Input
              id="org-name"
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Acme Corp"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="org-slug">URL slug</Label>
            <Input
              id="org-slug"
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="acme-corp"
            />
            <p className="text-xs text-muted-foreground">
              app.example.com/
              <span className="font-medium text-foreground">{slug || "your-slug"}</span>
            </p>
          </div>

          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onBack} className="flex-1">
              Back
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={!name || !slug}
              isLoading={isLoading}
              loadingText="Creating…"
            >
              Create
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function JoinOrgForm({
  onBack,
  onSuccess,
}: {
  onBack: () => void;
  onSuccess: () => void;
}) {
  const [token, setToken] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await authClient.organization.acceptInvitation({
        invitationId: token,
      });
      if (result.error) {
        setError(result.error.message ?? "Invalid or expired invitation.");
        return;
      }
      onSuccess();
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Join organization</CardTitle>
        <CardDescription>
          Enter the invitation code sent to your email.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="invite-token">Invitation code</Label>
            <Input
              id="invite-token"
              type="text"
              required
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Paste invitation ID here"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onBack} className="flex-1">
              Back
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={!token}
              isLoading={isLoading}
              loadingText="Joining…"
            >
              Join
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
