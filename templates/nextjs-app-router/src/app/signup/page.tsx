import { oauthProviderStatuses } from "@rk-kit/auth";
import { AuthForm } from "../../components/auth-form";

export default function SignupPage() {
  return <AuthForm mode="signup" oauthProviders={oauthProviderStatuses} />;
}
