import { describe, it, expect, vi, beforeEach } from 'vitest'

const { sendTransacEmail, brevoConstructor, mockEnv } = vi.hoisted(() => ({
  sendTransacEmail: vi.fn(),
  brevoConstructor: vi.fn(),
  mockEnv: {
    BREVO_API_KEY: undefined as string | undefined,
    EMAIL_FROM: undefined as string | undefined,
    EMAIL_FROM_NAME: undefined as string | undefined,
  },
}))

vi.mock('@getbrevo/brevo', () => ({
  BrevoClient: class {
    transactionalEmails = { sendTransacEmail }
    constructor(config: unknown) {
      brevoConstructor(config)
    }
  },
}))

vi.mock('@rk-kit/config', () => ({ serverEnv: mockEnv }))

import {
  sendPasswordResetEmail,
  sendInvitationEmail,
  sendVerificationEmail,
} from '../index.js'

describe('email module', () => {
  beforeEach(() => {
    sendTransacEmail.mockReset()
    sendTransacEmail.mockResolvedValue({ messageId: 'msg_1' })
    brevoConstructor.mockReset()
    mockEnv.BREVO_API_KEY = undefined
    mockEnv.EMAIL_FROM = undefined
    mockEnv.EMAIL_FROM_NAME = undefined
  })

  it('does not send when BREVO_API_KEY is unset (boots without email)', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    await sendPasswordResetEmail({ to: 'user@example.com', url: 'https://x/reset' })

    expect(sendTransacEmail).not.toHaveBeenCalled()
    expect(logSpy).toHaveBeenCalled()
    logSpy.mockRestore()
  })

  it('sends a password reset email via Brevo when configured', async () => {
    mockEnv.BREVO_API_KEY = 'xkeysib-test'
    mockEnv.EMAIL_FROM = 'from@example.com'
    mockEnv.EMAIL_FROM_NAME = 'RK Kit Test'

    await sendPasswordResetEmail({
      to: 'user@example.com',
      url: 'https://x/reset?token=abc',
    })

    expect(sendTransacEmail).toHaveBeenCalledTimes(1)
    const payload = sendTransacEmail.mock.calls[0]![0] as {
      subject: string
      htmlContent: string
      sender: { name: string; email: string }
      to: { email: string }[]
    }
    expect(payload.subject).toBe('Reset your password')
    expect(payload.sender).toEqual({ name: 'RK Kit Test', email: 'from@example.com' })
    expect(payload.to).toEqual([{ email: 'user@example.com' }])
    expect(payload.htmlContent).toContain('https://x/reset?token=abc')
  })

  it('includes organization and inviter details in invitation emails', async () => {
    mockEnv.BREVO_API_KEY = 'xkeysib-test'

    await sendInvitationEmail({
      to: 'invitee@example.com',
      url: 'https://x/onboarding?invitation=inv_1',
      organizationName: 'Acme Inc',
      inviterName: 'Jane Doe',
    })

    const payload = sendTransacEmail.mock.calls[0]![0] as {
      subject: string
      htmlContent: string
    }
    expect(payload.subject).toContain('Acme Inc')
    expect(payload.htmlContent).toContain('Acme Inc')
    expect(payload.htmlContent).toContain('Jane Doe')
    expect(payload.htmlContent).toContain('https://x/onboarding?invitation=inv_1')
  })

  it('sends a verification email with the confirmation link', async () => {
    mockEnv.BREVO_API_KEY = 'xkeysib-test'

    await sendVerificationEmail({ to: 'user@example.com', url: 'https://x/verify?token=v' })

    const payload = sendTransacEmail.mock.calls[0]![0] as {
      subject: string
      htmlContent: string
    }
    expect(payload.subject).toBe('Verify your email')
    expect(payload.htmlContent).toContain('https://x/verify?token=v')
  })

  it('falls back to default sender when EMAIL_FROM is unset', async () => {
    mockEnv.BREVO_API_KEY = 'xkeysib-test'

    await sendVerificationEmail({ to: 'user@example.com', url: 'https://x/verify' })

    const payload = sendTransacEmail.mock.calls[0]![0] as {
      sender: { name: string; email: string }
    }
    expect(payload.sender.name).toBe('RK Kit')
    expect(payload.sender.email).toContain('@')
  })

  it('throws when the Brevo send fails', async () => {
    mockEnv.BREVO_API_KEY = 'xkeysib-test'
    sendTransacEmail.mockRejectedValueOnce(new Error('brevo down'))

    await expect(
      sendPasswordResetEmail({ to: 'user@example.com', url: 'https://x/reset' }),
    ).rejects.toThrow(/Failed to send email/)
  })
})
