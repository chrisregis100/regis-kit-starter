import { renderLayout, type EmailContent } from './layout.js'

export interface ResetPasswordTemplateInput {
  url: string
}

/** Password reset email with a tokenized reset link. */
export function resetPasswordTemplate(
  input: ResetPasswordTemplateInput,
): EmailContent {
  const { url } = input

  const html = renderLayout({
    heading: 'Reset your password',
    body: 'We received a request to reset your password. Click the button below to choose a new one. This link expires shortly for your security.',
    ctaLabel: 'Reset password',
    ctaUrl: url,
    footnote: 'If you did not request this, you can safely ignore this email.',
  })

  const text = [
    'Reset your password',
    '',
    'We received a request to reset your password. Open the link below to choose a new one:',
    url,
    '',
    'If you did not request this, you can safely ignore this email.',
  ].join('\n')

  return { subject: 'Reset your password', html, text }
}
