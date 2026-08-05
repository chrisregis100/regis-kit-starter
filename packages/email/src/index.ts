/**
 * @rk-kit/email — transactional email module (server-only).
 *
 * Public API:
 *  - sendEmail                 low-level single-email send
 *  - sendPasswordResetEmail    password reset link
 *  - sendInvitationEmail       organization invitation link
 *  - sendVerificationEmail     email address verification link
 *
 * All senders no-op (log only) when BREVO_API_KEY is unset, so the app boots
 * and dev flows work without an email provider configured.
 */
import { sendEmail } from './provider.js'
import { resetPasswordTemplate } from './templates/reset-password.js'
import { invitationTemplate } from './templates/invitation.js'
import { verificationTemplate } from './templates/verification.js'

export { sendEmail } from './provider.js'
export type { SendEmailInput } from './provider.js'
export type { EmailContent } from './templates/layout.js'

export interface SendPasswordResetEmailInput {
  to: string
  url: string
}

export async function sendPasswordResetEmail(
  input: SendPasswordResetEmailInput,
): Promise<void> {
  const { subject, html, text } = resetPasswordTemplate({ url: input.url })
  await sendEmail({ to: input.to, subject, html, text })
}

export interface SendInvitationEmailInput {
  to: string
  url: string
  organizationName: string
  inviterName?: string
}

export async function sendInvitationEmail(
  input: SendInvitationEmailInput,
): Promise<void> {
  const { subject, html, text } = invitationTemplate({
    url: input.url,
    organizationName: input.organizationName,
    ...(input.inviterName ? { inviterName: input.inviterName } : {}),
  })
  await sendEmail({ to: input.to, subject, html, text })
}

export interface SendVerificationEmailInput {
  to: string
  url: string
}

export async function sendVerificationEmail(
  input: SendVerificationEmailInput,
): Promise<void> {
  const { subject, html, text } = verificationTemplate({ url: input.url })
  await sendEmail({ to: input.to, subject, html, text })
}
