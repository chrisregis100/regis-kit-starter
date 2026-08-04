/**
 * Minimal session types exported for use by app route handlers.
 *
 * Defined explicitly (not inferred from Better Auth internals) to:
 *   - Keep the shape stable regardless of Better Auth version bumps
 *   - Avoid importing the full Better Auth type tree in every consumer
 *
 * The `activeOrganizationId` field is added by the organization plugin.
 * It is null when the user hasn't selected an organisation yet.
 */

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionRecord {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  ipAddress: string | null;
  userAgent: string | null;
  /** Active organisation chosen by the user. Null if none selected. */
  activeOrganizationId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthSession {
  session: SessionRecord;
  user: SessionUser;
}
