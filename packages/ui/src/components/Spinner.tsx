import { CircleNotch } from "@phosphor-icons/react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn.js";

const spinnerVariants = cva("animate-spin text-primary", {
  variants: {
    size: {
      sm: "h-4 w-4",
      default: "h-5 w-5",
      lg: "h-8 w-8",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string;
  label?: string;
}

function Spinner({ className, size, label = "Loading" }: SpinnerProps) {
  return (
    <CircleNotch
      role="status"
      aria-label={label}
      weight="bold"
      className={cn(spinnerVariants({ size }), className)}
    />
  );
}

export { Spinner, spinnerVariants };
