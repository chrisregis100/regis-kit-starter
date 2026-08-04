import { createFileRoute } from "@tanstack/react-router";
import { ForgotPasswordForm } from "../components/auth/ForgotPasswordForm";

export const Route = createFileRoute("/_auth/forgot-password")({
  head: () => ({ meta: [{ title: "Forgot password — RegisKit" }] }),
  component: ForgotPasswordForm,
});
