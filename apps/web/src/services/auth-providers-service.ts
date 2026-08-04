import type { OAuthProviderId } from "@rk-kit/auth";
import { createServerFn } from "@tanstack/react-start";

export const getEnabledOAuthProvidersFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<OAuthProviderId[]> => {
    const { enabledOAuthProviders } = await import("@rk-kit/auth");
    return enabledOAuthProviders;
  },
);
