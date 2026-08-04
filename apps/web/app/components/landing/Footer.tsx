export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2 font-bold text-zinc-900">
            <div
              aria-hidden="true"
              className="flex h-6 w-6 items-center justify-center rounded bg-violet-600 text-xs font-bold text-white"
            >
              R
            </div>
            RegisKit
          </div>

          <nav
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
            aria-label="Footer navigation"
          >
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
          </nav>

          <p className="text-sm text-zinc-400">
            © {new Date().getFullYear()} RegisKit. MIT License.
          </p>
        </div>
      </div>
    </footer>
  );
}
