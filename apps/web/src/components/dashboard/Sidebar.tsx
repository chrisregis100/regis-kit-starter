import { Link } from "@tanstack/react-router";
import type { Icon } from "@phosphor-icons/react";
import {
  CreditCard,
  Gear,
  SquaresFour,
  UsersThree,
} from "@phosphor-icons/react";
import { Logo } from "../shared/Logo";
import { cn } from "@rk-kit/ui";

const navItems: { label: string; href: "/dashboard" | "/team" | "/settings" | "/billing"; icon: Icon }[] = [
  { label: "Dashboard", href: "/dashboard", icon: SquaresFour },
  { label: "Team", href: "/team", icon: UsersThree },
  { label: "Settings", href: "/settings", icon: Gear },
  { label: "Billing", href: "/billing", icon: CreditCard },
];

interface SidebarProps {
  organizationId: string;
  className?: string;
  onClose?: () => void;
}

export function Sidebar({ organizationId: _organizationId, className, onClose }: SidebarProps) {
  return (
    <aside className={cn("flex flex-col bg-card", className)}>
      <div className="flex h-16 items-center border-b border-border px-4">
        <Logo size="sm" />
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Main navigation">
        {navItems.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            to={href}
            onClick={onClose}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors",
              "hover:bg-accent hover:text-accent-foreground",
              "[&.active]:bg-accent [&.active]:font-medium [&.active]:text-primary",
            )}
            activeProps={{ className: "active" }}
          >
            <Icon weight="duotone" className="h-4 w-4" aria-hidden="true" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
