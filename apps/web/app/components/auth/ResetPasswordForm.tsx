"use client";

import { useState } from "react";
import { useNavigate, useSearch, Link } from "@tanstack/react-router";
import {
  Button,
  Input,
  Label,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@rk-kit/ui";
import { authClient } from "../../lib/auth-client";

interface ResetPasswordSearch {
  token?: string;
}

export function ResetPasswordForm() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as ResetPasswordSearch;
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (!search.token) {
      setError("Invalid or expired reset link. Please request a new one.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await authClient.resetPassword({
        newPassword: password,
        token: search.token,
      });
      if (result.error) {
        setError(result.error.message ?? "Failed to reset password.");
        return;
      }
      await navigate({ to: "/login" });
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle>Set new password</CardTitle>
        <CardDescription>Choose a strong password for your account.</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="password">New password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirm">Confirm password</Label>
            <Input
              id="confirm"
              type="password"
              autoComplete="new-password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repeat your password"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}

          <Button
            type="submit"
            className="w-full bg-violet-600 hover:bg-violet-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Saving…" : "Reset password"}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="justify-center">
        <Link
          to="/login"
          className="text-sm font-medium text-violet-600 hover:text-violet-800 transition-colors"
        >
          Back to sign in
        </Link>
      </CardFooter>
    </Card>
  );
}
