/**
 * @rk-kit/ui
 *
 * Shared UI primitives: shadcn/ui-style components built on Radix UI + Tailwind CSS.
 * NO business logic — purely presentational.
 *
 * Import styles in your app's root layout:
 *   import "@rk-kit/ui/styles";
 *
 * Then add a @source directive in your app's tailwind.css so Tailwind v4
 * scans these components for class names:
 *   @source "../../packages/ui/src";
 */

// Utilities
export { cn } from "./utils/cn.js";

// Primitives
export { Button, buttonVariants } from "./components/Button.js";
export type { ButtonProps } from "./components/Button.js";

export { Input } from "./components/Input.js";
export type { InputProps } from "./components/Input.js";

export { Label } from "./components/Label.js";

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./components/Card.js";

export { Badge, badgeVariants } from "./components/Badge.js";
export type { BadgeProps } from "./components/Badge.js";

export { Separator } from "./components/Separator.js";

export { Avatar, AvatarImage, AvatarFallback } from "./components/Avatar.js";

export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogClose,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "./components/Dialog.js";

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
} from "./components/DropdownMenu.js";

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
} from "./components/Select.js";

export { Skeleton } from "./components/Skeleton.js";
export { Spinner, spinnerVariants } from "./components/Spinner.js";
export { ThemeToggle } from "./components/ThemeToggle.js";
