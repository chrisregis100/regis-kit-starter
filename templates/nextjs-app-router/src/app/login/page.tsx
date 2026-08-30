import { oauthProviderStatuses } from "@rk-kit/auth";
import { AuthForm } from "../../components/auth-form";

export default function LoginPage() {
  return <AuthForm mode="login" oauthProviders={oauthProviderStatuses} />;
}
