import { Link } from "@tanstack/react-router";
import { Button } from "@rk-kit/ui";

export function LandingNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-100 bg-white/80 backdrop-blur-sm">
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-zinc-900">
          <div
            aria-hidden="true"
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-600 text-xs font-bold text-white"
          >
            R
          </div>
          RegisKit
        </Link>

        {/* Links */}
        <div className="hidden items-center gap-8 sm:flex">
          <a
            href="#features"
            className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            Features
          </a>
          <a
            href="#pricing"
            className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            Pricing
          </a>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            Sign in
          </Link>
          <Link to="/signup">
            <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white">
              Get started
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  );
}
