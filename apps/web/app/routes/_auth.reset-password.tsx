import { createFileRoute } from "@tanstack/react-router";
import { ResetPasswordForm } from "../components/auth/ResetPasswordForm";

export const Route = createFileRoute("/_auth/reset-password")({
  validateSearch: (search: Record<string, unknown>) => ({
    token: typeof search.token === "string" ? search.token : undefined,
  }),
  head: () => ({ meta: [{ title: "Reset password — RegisKit" }] }),
  component: ResetPasswordForm,
});
