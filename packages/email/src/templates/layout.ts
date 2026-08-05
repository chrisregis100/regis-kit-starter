/**
 * Shared HTML layout for transactional emails.
 *
 * Inline styles only — most email clients strip <style> and external CSS.
 */

export interface EmailContent {
  subject: string
  html: string
  text: string
}

interface LayoutInput {
  heading: string
  body: string
  ctaLabel: string
  ctaUrl: string
  footnote?: string
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** Wrap body content in a responsive, client-safe HTML shell. */
export function renderLayout(input: LayoutInput): string {
  const { heading, body, ctaLabel, ctaUrl, footnote } = input
  const safeHeading = escapeHtml(heading)
  const safeCtaLabel = escapeHtml(ctaLabel)

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${safeHeading}</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:32px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;padding:40px;max-width:480px;width:100%;">
            <tr>
              <td>
                <h1 style="margin:0 0 16px;font-size:20px;line-height:1.3;color:#18181b;">${safeHeading}</h1>
                <div style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#3f3f46;">${body}</div>
                <a href="${ctaUrl}" style="display:inline-block;background-color:#18181b;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:12px 24px;border-radius:8px;">${safeCtaLabel}</a>
                <p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:#71717a;">
                  If the button does not work, copy and paste this link into your browser:<br />
                  <a href="${ctaUrl}" style="color:#3f3f46;word-break:break-all;">${ctaUrl}</a>
                </p>
                ${footnote ? `<p style="margin:24px 0 0;font-size:12px;line-height:1.6;color:#a1a1aa;">${escapeHtml(footnote)}</p>` : ''}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}
