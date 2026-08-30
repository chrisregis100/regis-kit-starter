"use client";

import type { SessionUser } from "@rk-kit/auth";
import {
  Avatar,
  AvatarFallback,
  Button,
  ThemeToggle,
  cn,
} from "@rk-kit/ui";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { authClient } from "../lib/auth-client";
import { Logo } from "./logo";

interface DashboardShellProps {
  children: ReactNode;
  user: SessionUser;
  isAdmin: boolean;
}

const navigationItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/team", label: "Team" },
  { href: "/settings", label: "Settings" },
  { href: "/billing", label: "Billing" },
] as const;

export function DashboardShell({
  children,
  user,
  isAdmin,
}: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const initials = user.name.split(" ").slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  const items = isAdmin
    ? [...navigationItems, { href: "/admin", label: "Admin" } as const]
    : navigationItems;

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-muted/40 lg:grid lg:grid-cols-[14rem_1fr]">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-56 border-r border-border bg-card p-4 lg:static lg:block",
          isMenuOpen ? "block" : "hidden",
        )}
      >
        <Logo />
        <nav className="mt-8 space-y-1" aria-label="Main navigation">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
              className={cn(
                "block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent",
                pathname === item.href && "bg-accent font-medium text-primary",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="min-w-0">
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 md:px-6">
          <Button
            type="button"
            variant="ghost"
            className="lg:hidden"
            onClick={() => setIsMenuOpen((current) => !current)}
            aria-label="Toggle navigation"
          >
            Menu
          </Button>
          <div className="ml-auto flex items-center gap-3">
            <ThemeToggle />
            <Avatar className="h-8 w-8">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <span className="hidden text-sm font-medium sm:block">{user.name}</span>
            <Button type="button" size="sm" variant="ghost" onClick={handleSignOut}>
              Sign out
            </Button>
          </div>
        </header>
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
