"use client";

import { useState } from "react";
import { Link } from "@tanstack/react-router";
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

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await authClient.forgetPassword({
        email,
        redirectTo: "/reset-password",
      });
      if (result.error) {
        setError(result.error.message ?? "Failed to send reset email.");
        return;
      }
      setIsSent(true);
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSent) {
    return (
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle>Check your email</CardTitle>
          <CardDescription>
            If an account exists for{" "}
            <span className="font-medium text-zinc-900">{email}</span>, you will
            receive a reset link shortly.
          </CardDescription>
        </CardHeader>
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

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle>Forgot your password?</CardTitle>
        <CardDescription>
          Enter your email address and we&apos;ll send you a reset link.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
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
            {isLoading ? "Sending…" : "Send reset link"}
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
