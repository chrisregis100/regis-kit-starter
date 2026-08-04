/**
 * REST auth boundary — resolves the tenant from the Better Auth session cookie.
 *
 * This reuses the same session mechanism as the front (server functions), so
 * same-origin clients are authenticated automatically. Throws UnauthorizedError
 * (401) / ForbiddenError (403) which the caller serializes via jsonError.
 * Token / API-key auth for external clients is a later addition (see
 * docs/ai-skills/api-layer.md).
 */
import { requireOrganization } from "@rk-kit/auth";

export interface ApiSession {
  organizationId: string;
  userId: string;
}

export async function requireApiSession(request: Request): Promise<ApiSession> {
  const { organizationId, user } = await requireOrganization(request.headers);
  return { organizationId, userId: user.id };
}
