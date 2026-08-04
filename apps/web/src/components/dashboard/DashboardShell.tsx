import type { ReactNode } from "react";
import type { SessionUser } from "@rk-kit/auth";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

interface DashboardShellProps {
  children: ReactNode;
  user: SessionUser;
  organizationId: string;
}

export function DashboardShell({ children, user, organizationId }: DashboardShellProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-muted/40">
      <Sidebar organizationId={organizationId} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar user={user} />
        <main className="flex-1 overflow-y-auto px-6 py-6">{children}</main>
      </div>
    </div>
  );
}
