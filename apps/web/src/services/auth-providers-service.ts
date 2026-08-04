import type { OAuthProviderStatus } from "@rk-kit/auth";
import { createServerFn } from "@tanstack/react-start";

export const getOAuthProvidersStatusFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<OAuthProviderStatus[]> => {
    const { oauthProviderStatuses } = await import("@rk-kit/auth");
    return oauthProviderStatuses;
  },
);
