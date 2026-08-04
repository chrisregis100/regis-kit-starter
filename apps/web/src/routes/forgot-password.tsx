import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button, Input, Label, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@rk-kit/ui";
import { authClient } from "../lib/auth-client";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await authClient.requestPasswordReset({ email, redirectTo: "/reset-password" });
      setIsSuccess(true);
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600">
              <span className="text-sm font-bold text-white">RK</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">RK Kit</span>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>Reset your password</CardTitle>
            <CardDescription>
              {isSuccess
                ? "Check your inbox for the reset link."
                : "Enter your email and we'll send a reset link."}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {isSuccess ? (
              <div className="rounded-lg bg-green-50 px-4 py-4 text-center">
                <p className="text-sm font-medium text-green-700">
                  Password reset email sent!
                </p>
                <p className="mt-1 text-xs text-green-600">
                  Check your spam folder if you don&apos;t see it within a minute.
                </p>
              </div>
            ) : (
              <>
                {error && (
                  <div role="alert" className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      autoFocus
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Sending…" : "Send reset link"}
                  </Button>
                </form>
              </>
            )}
          </CardContent>

          <CardFooter className="justify-center">
            <p className="text-sm text-gray-500">
              Remembered it?{" "}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-700 transition-colors">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
