import { createFileRoute, Link } from "@tanstack/react-router";
import { List } from "@phosphor-icons/react";
import {
  Button,
  ThemeToggle,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@rk-kit/ui";
import { authClient } from "../lib/auth-client";
import { Hero } from "../components/landing/Hero";
import { Features } from "../components/landing/Features";
import { Pricing } from "../components/landing/Pricing";
import { Testimonials } from "../components/landing/Testimonials";
import { Footer } from "../components/landing/Footer";
import { Logo } from "../components/shared/Logo";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Testimonials", href: "#testimonials" },
] as const;

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  const { data: sessionData } = authClient.useSession();
  const user = sessionData?.user;

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo />

          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {user ? (
              <Button asChild size="sm" className="hidden rounded-lg sm:flex">
                <Link to="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:block"
                >
                  Sign in
                </Link>
                <Button asChild size="sm" className="hidden rounded-lg sm:flex">
                  <Link to="/signup">Get started</Link>
                </Button>
              </>
            )}

            {/* Mobile Menu */}
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg">
                    <List className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {navLinks.map((link) => (
                    <DropdownMenuItem key={link.href} asChild>
                      <a href={link.href} className="w-full cursor-pointer">
                        {link.label}
                      </a>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  {user ? (
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="w-full cursor-pointer font-medium text-primary">
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                  ) : (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/login" className="w-full cursor-pointer">
                          Sign in
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/signup" className="w-full cursor-pointer font-medium text-primary">
                          Get started
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <Hero />
        <Features />
        <Pricing />
        <Testimonials />
      </main>

      <Footer />
    </div>
  );
}
