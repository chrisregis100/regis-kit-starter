import { createFileRoute } from "@tanstack/react-router";
import { SignupForm } from "../components/auth/SignupForm";

export const Route = createFileRoute("/_auth/signup")({
  head: () => ({ meta: [{ title: "Create account — RegisKit" }] }),
  component: SignupForm,
});
