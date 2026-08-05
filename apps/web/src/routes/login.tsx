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
  Separator,
} from "@rk-kit/ui";
import { authClient } from "../lib/auth-client";
import { AuthLayout } from "../components/shared/AuthLayout";
import { SocialAuthButtons } from "../components/auth/SocialAuthButtons";
import { MathChallengeField } from "../components/auth/MathChallengeField";
import { useMathChallenge } from "../components/auth/use-math-challenge";
import { getOAuthProvidersStatusFn } from "../services/auth-providers-service";

export const Route = createFileRoute("/login")({
  loader: () => getOAuthProvidersStatusFn(),
  component: LoginPage,
});

function LoginPage() {
  const oauthProviderStatuses = Route.useLoaderData();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mathChallenge = useMathChallenge();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!mathChallenge.isCorrect) {
      setError("Please solve the quick math check to continue.");
      mathChallenge.regenerate();
      return;
    }

    setIsLoading(true);

    try {
      const result = await authClient.signIn.email({ email, password });
      if (result.error) {
        setError(result.error.message ?? "Invalid email or password.");
        return;
      }
      await router.navigate({ to: "/select-organization" });
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const hasOAuth = oauthProviderStatuses.length > 0;

  return (
    <AuthLayout>
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {hasOAuth && (
            <SocialAuthButtons
              providers={oauthProviderStatuses}
              callbackURL="/select-organization"
              onError={setError}
            />
          )}

          {hasOAuth && (
            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card px-3 text-muted-foreground">or continue with email</span>
              </div>
            </div>
          )}

          {error && (
            <div role="alert" className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                autoFocus={!hasOAuth}
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-primary transition-colors hover:text-primary/80"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <MathChallengeField challenge={mathChallenge} />

            <Button type="submit" className="w-full" isLoading={isLoading} loadingText="Signing in…">
              Sign in
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="font-medium text-primary transition-colors hover:text-primary/80">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  );
}
