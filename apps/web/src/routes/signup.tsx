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

export const Route = createFileRoute("/signup")({
  loader: () => getOAuthProvidersStatusFn(),
  component: SignupPage,
});

function SignupPage() {
  const oauthProviderStatuses = Route.useLoaderData();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mathChallenge = useMathChallenge();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (!mathChallenge.isCorrect) {
      setError("Please solve the quick math check to continue.");
      mathChallenge.regenerate();
      return;
    }

    setIsLoading(true);

    try {
      const result = await authClient.signUp.email({ name, email, password });
      if (result.error) {
        setError(result.error.message ?? "Could not create account. Please try again.");
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
          <CardTitle>Create your account</CardTitle>
          <CardDescription>Start building your SaaS today — free forever</CardDescription>
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
                <span className="bg-card px-3 text-muted-foreground">or create with email</span>
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
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Jane Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
                autoFocus={!hasOAuth}
              />
            </div>

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
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                minLength={8}
              />
            </div>

            <MathChallengeField challenge={mathChallenge} />

            <Button type="submit" className="w-full" isLoading={isLoading} loadingText="Creating account…">
              Create account
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary transition-colors hover:text-primary/80">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  );
}
