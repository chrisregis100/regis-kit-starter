import { useState } from "react";
import type { ReactNode } from "react";
import type { SessionUser } from "@rk-kit/auth";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { X } from "@phosphor-icons/react";

interface DashboardShellProps {
  children: ReactNode;
  user: SessionUser;
  organizationId: string;
  isAdmin?: boolean;
}

export function DashboardShell({ children, user, organizationId, isAdmin = false }: DashboardShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-muted/40">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Mobile Sidebar */}
          <div className="fixed inset-y-0 left-0 w-64 flex flex-col bg-card shadow-xl transform transition-transform duration-300">
            <div className="flex h-16 items-center justify-between border-b border-border px-4">
              <span className="font-semibold text-foreground">Menu</span>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-md p-1.5 text-muted-foreground hover:bg-accent"
              >
                <X weight="bold" className="h-5 w-5" />
              </button>
            </div>
            <Sidebar 
              organizationId={organizationId} 
              className="flex-1" 
              onClose={() => setIsMobileMenuOpen(false)} 
              isAdmin={isAdmin}
            />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <Sidebar 
        organizationId={organizationId} 
        className="hidden w-56 flex-shrink-0 border-r border-border lg:flex" 
        isAdmin={isAdmin}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar user={user} onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-6">{children}</main>
      </div>
    </div>
  );
}
