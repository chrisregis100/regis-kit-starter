import { Link } from "@tanstack/react-router";
import { cn } from "@rk-kit/ui";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md";
}

export function Logo({ className, showText = true, size = "md" }: LogoProps) {
  const boxSize = size === "sm" ? "h-7 w-7" : "h-8 w-8";
  const textSize = size === "sm" ? "text-sm" : "text-lg";

  return (
    <Link
      to="/"
      className={cn("inline-flex items-center gap-2.5", className)}
      aria-label="RK Kit home"
    >
      <div
        className={cn(
          "flex items-center justify-center rounded-lg bg-primary shadow-sm",
          boxSize,
        )}
      >
        <span className="text-xs font-bold text-primary-foreground">RK</span>
      </div>
      {showText && (
        <span className={cn("font-semibold text-foreground", textSize)}>
          RK Kit
        </span>
      )}
    </Link>
  );
}
