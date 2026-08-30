"use client";

import type { OAuthProviderStatus } from "@rk-kit/auth";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Separator,
  ThemeToggle,
} from "@rk-kit/ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { checkEmailExists } from "../app/actions";
import { MathChallengeField } from "./auth/MathChallengeField";
import { SocialAuthButtons } from "./auth/SocialAuthButtons";
import { useMathChallenge } from "./auth/use-math-challenge";
import { Logo } from "./logo";
import { authClient } from "../lib/auth-client";

type AuthMode = "login" | "signup" | "forgot-password" | "reset-password";

interface AuthFormProps {
  mode: AuthMode;
  oauthProviders?: OAuthProviderStatus[];
  resetToken?: string;
}

const authCopy: Record<AuthMode, { title: string; description: string }> = {
  login: { title: "Welcome back", description: "Sign in to your account to continue" },
  signup: { title: "Create your account", description: "Start building your SaaS today" },
  "forgot-password": {
    title: "Reset your password",
    description: "Enter your email and we'll send a reset link.",
  },
  "reset-password": {
    title: "Set new password",
    description: "Choose a strong password for your account.",
  },
};

export function AuthForm({
  mode,
  oauthProviders = [],
  resetToken = "",
}: AuthFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mathChallenge = useMathChallenge();
  const hasOAuth = oauthProviders.length > 0 && (mode === "login" || mode === "signup");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if ((mode === "login" || mode === "signup") && !mathChallenge.isCorrect) {
      setError("Please solve the quick math check to continue.");
      mathChallenge.regenerate();
      return;
    }
    if ((mode === "signup" || mode === "reset-password") && password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (mode === "reset-password" && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      if (mode === "login") {
        const result = await authClient.signIn.email({ email, password });
        if (result.error) throw new Error(result.error.message);
        router.push("/select-organization");
      }
      if (mode === "signup") {
        const result = await authClient.signUp.email({ name, email, password });
        if (result.error) throw new Error(result.error.message);
        router.push("/select-organization");
      }
      if (mode === "forgot-password") {
        if (!(await checkEmailExists(email))) {
          setError("No account found with this email address.");
          return;
        }
        await authClient.requestPasswordReset({ email, redirectTo: "/reset-password" });
        setIsSuccess(true);
      }
      if (mode === "reset-password") {
        if (!resetToken) throw new Error("Invalid or expired reset link.");
        const result = await authClient.resetPassword({
          newPassword: password,
          token: resetToken,
        });
        if (result.error) throw new Error(result.error.message);
        router.push("/login");
      }
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const copy = authCopy[mode];

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <div className="absolute right-4 top-4"><ThemeToggle /></div>
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center"><Logo /></div>
        <Card>
          <CardHeader className="text-center">
            <CardTitle>{copy.title}</CardTitle>
            <CardDescription>
              {isSuccess ? "Check your inbox for the reset link." : copy.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isSuccess ? (
              <p role="status" className="rounded-lg bg-success/10 px-4 py-3 text-sm text-success">
                Password reset email sent.
              </p>
            ) : (
              <>
                {hasOAuth && (
                  <SocialAuthButtons
                    providers={oauthProviders}
                    callbackURL="/select-organization"
                    onError={setError}
                  />
                )}
                {hasOAuth && <Separator />}
                {error && (
                  <p role="alert" className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {error}
                  </p>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {mode === "signup" && (
                    <Field id="name" label="Full name" value={name} onChange={setName} />
                  )}
                  {mode !== "reset-password" && (
                    <Field id="email" label="Email" type="email" value={email} onChange={setEmail} />
                  )}
                  {(mode === "login" || mode === "signup" || mode === "reset-password") && (
                    <Field id="password" label="Password" type="password" value={password} onChange={setPassword} />
                  )}
                  {mode === "reset-password" && (
                    <Field
                      id="confirm-password"
                      label="Confirm password"
                      type="password"
                      value={confirmPassword}
                      onChange={setConfirmPassword}
                    />
                  )}
                  {(mode === "login" || mode === "signup") && (
                    <MathChallengeField challenge={mathChallenge} />
                  )}
                  <Button type="submit" className="w-full" isLoading={isLoading}>
                    {mode === "login" && "Sign in"}
                    {mode === "signup" && "Create account"}
                    {mode === "forgot-password" && "Send reset link"}
                    {mode === "reset-password" && "Update password"}
                  </Button>
                </form>
              </>
            )}
          </CardContent>
          <CardFooter className="justify-center text-sm text-muted-foreground">
            {mode === "login" && <Link href="/signup">Need an account? Sign up</Link>}
            {mode === "signup" && <Link href="/login">Already registered? Sign in</Link>}
            {(mode === "forgot-password" || mode === "reset-password") && (
              <Link href="/login">Back to sign in</Link>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

interface FieldProps {
  id: string;
  label: string;
  value: string;
  type?: "text" | "email" | "password";
  onChange: (value: string) => void;
}

function Field({ id, label, value, type = "text", onChange }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
        minLength={type === "password" ? 8 : undefined}
      />
    </div>
  );
}
