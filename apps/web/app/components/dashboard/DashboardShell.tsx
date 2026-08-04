"use client";

import { useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { authClient } from "../../lib/auth-client";

const navItems = [
  { label: "Overview", to: "/dashboard" as const },
  { label: "Settings", to: "/dashboard/settings" as const },
  { label: "Team", to: "/dashboard/team" as const },
  { label: "Billing", to: "/dashboard/billing" as const },
];

export function DashboardShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useRouterState({ select: (s) => s.location });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await authClient.signOut();
    await navigate({ to: "/login" });
  };

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      {/* Top nav */}
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* Logo + Org Selector */}
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="flex items-center gap-2 font-bold text-zinc-900">
              <div
                aria-hidden="true"
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-600 text-xs font-bold text-white"
              >
                R
              </div>
              RegisKit
            </Link>
            <OrgSelector />
          </div>

          {/* Desktop nav */}
          <nav
            className="hidden items-center gap-1 sm:flex"
            aria-label="Dashboard navigation"
          >
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                label={item.label}
                currentPath={location.pathname}
              />
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSignOut}
              className="hidden text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors sm:block"
            >
              Sign out
            </button>

            {/* Mobile menu button */}
            <button
              type="button"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen((o) => !o)}
              className="rounded p-1 text-zinc-500 hover:bg-zinc-100 sm:hidden"
            >
              {isMobileMenuOpen ? (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {isMobileMenuOpen && (
          <div className="border-t border-zinc-100 px-4 pb-3 sm:hidden">
            <nav className="mt-2 flex flex-col gap-1" aria-label="Mobile navigation">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  label={item.label}
                  currentPath={location.pathname}
                  onClick={() => setIsMobileMenuOpen(false)}
                />
              ))}
            </nav>
            <button
              type="button"
              onClick={handleSignOut}
              className="mt-2 w-full text-left px-3 py-2 text-sm font-medium text-zinc-500 hover:text-zinc-900"
            >
              Sign out
            </button>
          </div>
        )}
      </header>

      {/* Page content */}
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}

function NavLink({
  to,
  label,
  currentPath,
  onClick,
}: {
  to: string;
  label: string;
  currentPath: string;
  onClick?: () => void;
}) {
  const isActive = currentPath === to;
  return (
    <Link
      to={to as "/dashboard"}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
        isActive
          ? "bg-violet-50 text-violet-700"
          : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
      }`}
    >
      {label}
    </Link>
  );
}

function OrgSelector() {
  const { data: orgs } = authClient.useListOrganizations();
  const { data: activeOrg } = authClient.useActiveOrganization();

  if (!orgs || orgs.length <= 1) return null;

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    await authClient.organization.setActive({ organizationId: e.target.value });
    window.location.reload();
  };

  return (
    <select
      aria-label="Switch organization"
      value={activeOrg?.id ?? ""}
      onChange={handleChange}
      className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
    >
      {orgs.map((org) => (
        <option key={org.id} value={org.id}>
          {org.name}
        </option>
      ))}
    </select>
  );
}
