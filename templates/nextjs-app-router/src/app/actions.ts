"use server";

import {
  getSession,
  listUserOrganizations,
  requireOrganization,
  setSessionActiveOrganization,
  userExistsByEmail,
} from "@rk-kit/auth";
import { Plan } from "@rk-kit/billing";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createFedaPayPayment,
  createKkiapayPayment,
  createStripeCheckout,
  createStripePortal,
  handleKkiapayWebhook,
} from "../services/billing-service";
import {
  createProject,
  deleteProject,
  updateProject,
} from "../services/project-service";
import { inviteMember, removeMember } from "../services/team-service";
import { getRequestHeaders } from "../lib/server-context";

export async function checkEmailExists(email: string): Promise<boolean> {
  return userExistsByEmail(email);
}

export async function selectOrganization(organizationId: string): Promise<void> {
  const authSession = await getSession(await getRequestHeaders());
  if (!authSession) redirect("/login");

  const organizations = await listUserOrganizations(authSession.user.id);
  if (!organizations.some((organization) => organization.id === organizationId)) {
    throw new Error("You are not a member of this organisation.");
  }

  await setSessionActiveOrganization(authSession.session.token, organizationId);
  redirect("/dashboard");
}

export async function createProjectAction(input: {
  name: string;
  description?: string;
}): Promise<void> {
  const { organizationId } = await requireOrganization(await getRequestHeaders());
  await createProject(organizationId, input);
  revalidatePath("/dashboard");
}

export async function updateProjectAction(
  projectId: string,
  input: { name?: string; description?: string | null },
): Promise<void> {
  const { organizationId } = await requireOrganization(await getRequestHeaders());
  await updateProject(organizationId, projectId, input);
  revalidatePath("/dashboard");
}

export async function deleteProjectAction(projectId: string): Promise<void> {
  const { organizationId } = await requireOrganization(await getRequestHeaders());
  await deleteProject(organizationId, projectId);
  revalidatePath("/dashboard");
}

export async function inviteMemberAction(input: {
  email: string;
  role: "member" | "admin";
}): Promise<void> {
  const requestHeaders = await getRequestHeaders();
  const { organizationId } = await requireOrganization(requestHeaders);
  await inviteMember(organizationId, requestHeaders, input);
  revalidatePath("/team");
}

export async function removeMemberAction(memberId: string): Promise<void> {
  const requestHeaders = await getRequestHeaders();
  const { organizationId } = await requireOrganization(requestHeaders);
  await removeMember(organizationId, requestHeaders, { memberId });
  revalidatePath("/team");
}

export async function createStripeCheckoutAction(
  plan: "pro" | "enterprise",
  successUrl: string,
  cancelUrl: string,
): Promise<{ url: string }> {
  const { organizationId } = await requireOrganization(await getRequestHeaders());
  return createStripeCheckout(organizationId, { plan, successUrl, cancelUrl });
}

export async function createStripePortalAction(
  returnUrl: string,
): Promise<{ url: string }> {
  const { organizationId } = await requireOrganization(await getRequestHeaders());
  return createStripePortal(organizationId, returnUrl);
}

export async function createKkiapayPaymentAction(): Promise<{
  amount: number;
  currency: string;
}> {
  const { organizationId } = await requireOrganization(await getRequestHeaders());
  return createKkiapayPayment(organizationId, Plan.PRO);
}

export async function verifyKkiapayTransactionAction(
  transactionId: string,
): Promise<void> {
  const { organizationId } = await requireOrganization(await getRequestHeaders());
  await handleKkiapayWebhook({ transactionId, data: { organizationId } });
  revalidatePath("/billing");
}

export async function createFedaPayPaymentAction(
  successUrl: string,
  cancelUrl: string,
): Promise<{ url: string }> {
  const { organizationId } = await requireOrganization(await getRequestHeaders());
  return createFedaPayPayment(organizationId, {
    plan: Plan.PRO,
    successUrl,
    cancelUrl,
  });
}
