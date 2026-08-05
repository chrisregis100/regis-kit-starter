import { useRouter } from "@tanstack/react-router";
import { CaretDown, List } from "@phosphor-icons/react";
import {
  Avatar,
  AvatarFallback,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  ThemeToggle,
} from "@rk-kit/ui";
import type { SessionUser } from "@rk-kit/auth";
import { authClient } from "../../lib/auth-client";

interface TopBarProps {
  user: SessionUser;
  onOpenMobileMenu?: () => void;
}

export function TopBar({ user, onOpenMobileMenu }: TopBarProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    await router.navigate({ to: "/login" });
  };

  const initials = user.name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-border bg-card px-4 md:px-6">
      <button
        type="button"
        className="rounded-md p-1.5 text-muted-foreground hover:bg-accent lg:hidden"
        aria-label="Open sidebar"
        onClick={onOpenMobileMenu}
      >
        <List weight="bold" className="h-5 w-5" aria-hidden="true" />
      </button>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-accent"
              aria-label="User menu"
            >
              <Avatar className="h-7 w-7">
                {user.image && (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="h-full w-full rounded-full object-cover"
                  />
                )}
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
              <span className="hidden font-medium text-foreground sm:block">{user.name}</span>
              <CaretDown
                weight="bold"
                className="h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel className="flex flex-col gap-0.5">
              <span className="text-sm font-medium">{user.name}</span>
              <span className="text-xs font-normal text-muted-foreground">{user.email}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a href="/settings" className="cursor-pointer">Settings</a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="cursor-pointer text-destructive focus:text-destructive"
            >
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
