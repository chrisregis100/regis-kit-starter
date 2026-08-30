import { AuthForm } from "../../components/auth-form";

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const { token = "" } = await searchParams;
  return <AuthForm mode="reset-password" resetToken={token} />;
}
