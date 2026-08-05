/**
 * Transactional email provider — Brevo (@getbrevo/brevo v6), server-only.
 *
 * When BREVO_API_KEY is absent the provider logs the email instead of sending
 * it, so the starter boots and dev auth flows work without an email account.
 *
 * ⚠️  Never import this module in client bundles.
 */
import type { BrevoClient } from '@getbrevo/brevo'
import { serverEnv } from '@rk-kit/config'
import { InternalError } from '@rk-kit/errors'

export interface SendEmailInput {
  to: string
  subject: string
  html: string
  text?: string
}

const DEFAULT_FROM_NAME = 'RK Kit'
const DEFAULT_FROM_EMAIL = 'no-reply@rk-kit.dev'

let cachedClient: BrevoClient | undefined

/**
 * Lazily import and instantiate the Brevo client.
 *
 * Loading the SDK on demand keeps it out of module graphs that never send mail
 * (e.g. test suites, client bundles) so it cannot hold the process open.
 */
async function getClient(apiKey: string): Promise<BrevoClient> {
  if (!cachedClient) {
    const { BrevoClient } = await import('@getbrevo/brevo')
    cachedClient = new BrevoClient({ apiKey })
  }
  return cachedClient
}

/**
 * Send a single transactional email.
 *
 * No-ops (logs only) when BREVO_API_KEY is unset. Throws InternalError when a
 * configured send fails, so callers can surface a clear server-side failure.
 */
export async function sendEmail(input: SendEmailInput): Promise<void> {
  const apiKey = serverEnv.BREVO_API_KEY

  if (!apiKey) {
    console.log(
      `[email] BREVO_API_KEY not set — email not sent.\n` +
        `  to: ${input.to}\n  subject: ${input.subject}`,
    )
    return
  }

  const senderEmail = serverEnv.EMAIL_FROM ?? DEFAULT_FROM_EMAIL
  const senderName = serverEnv.EMAIL_FROM_NAME ?? DEFAULT_FROM_NAME

  try {
    const client = await getClient(apiKey)
    await client.transactionalEmails.sendTransacEmail({
      subject: input.subject,
      htmlContent: input.html,
      sender: { name: senderName, email: senderEmail },
      to: [{ email: input.to }],
      ...(input.text ? { textContent: input.text } : {}),
    })
  } catch (error) {
    throw new InternalError(`Failed to send email to ${input.to}`, {
      cause: error,
    })
  }
}
