import {
  isAdmin,
  resolvePostAuthDestination,
  type AuthSession,
  type UserOrganization,
} from "@rk-kit/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export interface ProtectedContext {
  session: AuthSession["session"];
  user: AuthSession["user"];
  organizationId: string;
  isAdmin: boolean;
}

export async function getRequestHeaders(): Promise<Headers> {
  return new Headers(await headers());
}

export async function requireProtectedContext(): Promise<ProtectedContext> {
  const destination = await resolvePostAuthDestination(await getRequestHeaders());

  if (!destination) redirect("/login");
  if (destination.kind === "onboarding") redirect("/onboarding");
  if (destination.kind === "select") redirect("/select-organization");

  return {
    session: destination.session,
    user: destination.user,
    organizationId: destination.organizationId,
    isAdmin: isAdmin(destination.user.email),
  };
}

export async function requireOnboardingContext(): Promise<AuthSession["user"]> {
  const destination = await resolvePostAuthDestination(await getRequestHeaders());

  if (!destination) redirect("/login");
  if (destination.kind === "dashboard") redirect("/dashboard");
  if (destination.kind === "select") redirect("/select-organization");

  return destination.user;
}

export async function requireOrganizationSelection(): Promise<{
  user: AuthSession["user"];
  organizations: UserOrganization[];
}> {
  const destination = await resolvePostAuthDestination(await getRequestHeaders());

  if (!destination) redirect("/login");
  if (destination.kind === "onboarding") redirect("/onboarding");
  if (destination.kind === "dashboard") redirect("/dashboard");

  return {
    user: destination.user,
    organizations: destination.organizations,
  };
}
