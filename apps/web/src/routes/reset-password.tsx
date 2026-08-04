import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
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
  CardFooter,
} from "@rk-kit/ui";
import { authClient } from "../lib/auth-client";
import { AuthLayout } from "../components/shared/AuthLayout";

export const Route = createFileRoute("/reset-password")({
  validateSearch: (search: Record<string, unknown>) => ({
    token: typeof search["token"] === "string" ? search["token"] : "",
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const { token } = Route.useSearch();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!token) {
      setError("Invalid or expired reset link. Please request a new one.");
      return;
    }

    setIsLoading(true);

    try {
      await authClient.resetPassword({ newPassword: password, token });
      await router.navigate({ to: "/login" });
    } catch {
      setError("Could not reset password. The link may have expired.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Set new password</CardTitle>
          <CardDescription>Choose a strong password for your account.</CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <div role="alert" className="mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="password">New password</Label>
              <Input
                id="password"
                type="password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                autoFocus
                minLength={8}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Repeat your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                minLength={8}
              />
            </div>

            <Button type="submit" className="w-full" isLoading={isLoading} loadingText="Updating…">
              Update password
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center">
          <Link to="/login" className="text-sm text-primary transition-colors hover:text-primary/80">
            Back to sign in
          </Link>
        </CardFooter>
      </Card>
    </AuthLayout>
  );
}
