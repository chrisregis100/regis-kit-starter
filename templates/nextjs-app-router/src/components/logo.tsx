import Link from "next/link";
import { cn } from "@rk-kit/ui";

interface LogoProps {
  className?: string;
  compact?: boolean;
}

export function Logo({ className, compact = false }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn("inline-flex items-center gap-2.5", className)}
      aria-label="RK Kit home"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        RK
      </span>
      {!compact && <span className="text-lg font-semibold">RK Kit</span>}
    </Link>
  );
}
