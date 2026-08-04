import { Logo } from "../shared/Logo";

const footerLinks = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Testimonials", href: "#testimonials" },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <Logo size="sm" />

          <nav
            className="flex flex-wrap justify-center gap-x-6 gap-y-2"
            aria-label="Footer"
          >
            {footerLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <p className="text-sm text-muted-foreground">
            &copy; {year} RK Kit. Open source.
          </p>
        </div>
      </div>
    </footer>
  );
}
