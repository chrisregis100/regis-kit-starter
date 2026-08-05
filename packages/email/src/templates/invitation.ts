import { renderLayout, type EmailContent } from './layout.js'

export interface InvitationTemplateInput {
  url: string
  organizationName: string
  inviterName?: string
}

/** Organization invitation email with an accept link. */
export function invitationTemplate(
  input: InvitationTemplateInput,
): EmailContent {
  const { url, organizationName, inviterName } = input

  const invitedBy = inviterName ? `${inviterName} invited you` : 'You are invited'
  const body = `${invitedBy} to join <strong>${organizationName}</strong>. Click the button below to accept the invitation and get started.`

  const html = renderLayout({
    heading: `Join ${organizationName}`,
    body,
    ctaLabel: 'Accept invitation',
    ctaUrl: url,
    footnote: 'If you were not expecting this invitation, you can ignore this email.',
  })

  const text = [
    `Join ${organizationName}`,
    '',
    `${invitedBy} to join ${organizationName}. Open the link below to accept:`,
    url,
    '',
    'If you were not expecting this invitation, you can ignore this email.',
  ].join('\n')

  return { subject: `You have been invited to ${organizationName}`, html, text }
}
