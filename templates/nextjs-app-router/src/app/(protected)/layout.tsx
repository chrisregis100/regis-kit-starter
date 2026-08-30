import type { ReactNode } from "react";
import { DashboardShell } from "../../components/dashboard-shell";
import { requireProtectedContext } from "../../lib/server-context";

interface ProtectedLayoutProps {
  children: ReactNode;
}

export default async function ProtectedLayout({
  children,
}: ProtectedLayoutProps) {
  const context = await requireProtectedContext();

  return (
    <DashboardShell user={context.user} isAdmin={context.isAdmin}>
      {children}
    </DashboardShell>
  );
}
