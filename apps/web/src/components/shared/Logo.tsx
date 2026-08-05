import { Link } from "@tanstack/react-router";
import { cn } from "@rk-kit/ui";

interface LogoMarkProps {
  className?: string;
}

export function LogoMark({ className }: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="6"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="16" cy="8" r="2.5" fill="currentColor" />
    </svg>
  );
}

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md";
}

export function Logo({ className, showText = true, size = "md" }: LogoProps) {
  const boxSize = size === "sm" ? "h-7 w-7" : "h-8 w-8";
  const iconSize = size === "sm" ? "h-5 w-5" : "h-6 w-6";
  const textSize = size === "sm" ? "text-sm" : "text-lg";

  return (
    <Link
      to="/"
      className={cn("inline-flex items-center gap-2.5", className)}
      aria-label="RK Kit home"
    >
      <div
        className={cn(
          "flex items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm",
          boxSize,
        )}
      >
        <LogoMark className={iconSize} />
      </div>
      {showText && (
        <span className={cn("font-semibold text-foreground", textSize)}>
          RK Kit
        </span>
      )}
    </Link>
  );
}
