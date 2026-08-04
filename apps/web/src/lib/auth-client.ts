/**
 * Better Auth client-side instance.
 * Used in React components for sign-in, sign-up, sign-out, org selection.
 * Safe to import in client components (does NOT import server secrets).
 */
import { createAuthClient } from "better-auth/react";
import { organizationClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: typeof window !== "undefined" ? window.location.origin : "http://localhost:3000",
  plugins: [organizationClient()],
});

export type AuthClient = typeof authClient;
