import { renderLayout, type EmailContent } from './layout.js'

export interface VerificationTemplateInput {
  url: string
}

/** Email address verification message with a confirmation link. */
export function verificationTemplate(
  input: VerificationTemplateInput,
): EmailContent {
  const { url } = input

  const html = renderLayout({
    heading: 'Verify your email',
    body: 'Thanks for signing up. Please confirm your email address by clicking the button below.',
    ctaLabel: 'Verify email',
    ctaUrl: url,
    footnote: 'If you did not create an account, you can safely ignore this email.',
  })

  const text = [
    'Verify your email',
    '',
    'Thanks for signing up. Confirm your email address by opening the link below:',
    url,
    '',
    'If you did not create an account, you can safely ignore this email.',
  ].join('\n')

  return { subject: 'Verify your email', html, text }
}
