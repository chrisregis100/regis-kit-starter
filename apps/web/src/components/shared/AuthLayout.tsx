import type { ReactNode } from "react";
import { ThemeToggle } from "@rk-kit/ui";
import { Logo } from "./Logo";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        {children}
      </div>
    </div>
  );
}
