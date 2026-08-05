import { Link } from "@tanstack/react-router";
import type { Icon } from "@phosphor-icons/react";
import {
  CreditCard,
  Gear,
  ShieldCheck,
  SquaresFour,
  UsersThree,
} from "@phosphor-icons/react";
import { Logo } from "../shared/Logo";
import { cn } from "@rk-kit/ui";

type NavHref = "/dashboard" | "/team" | "/settings" | "/billing" | "/admin";

const navItems: { label: string; href: NavHref; icon: Icon }[] = [
  { label: "Dashboard", href: "/dashboard", icon: SquaresFour },
  { label: "Team", href: "/team", icon: UsersThree },
  { label: "Settings", href: "/settings", icon: Gear },
  { label: "Billing", href: "/billing", icon: CreditCard },
];

const adminNavItem: { label: string; href: NavHref; icon: Icon } = {
  label: "Admin",
  href: "/admin",
  icon: ShieldCheck,
};

interface SidebarProps {
  organizationId: string;
  className?: string;
  onClose?: () => void;
  isAdmin?: boolean;
}

export function Sidebar({
  organizationId: _organizationId,
  className,
  onClose,
  isAdmin = false,
}: SidebarProps) {
  const items = isAdmin ? [...navItems, adminNavItem] : navItems;

  return (
    <aside className={cn("flex flex-col bg-card", className)}>
      <div className="flex h-16 items-center border-b border-border px-4">
        <Logo size="sm" />
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Main navigation">
        {items.map(({ label, href, icon: Icon }) => (
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
