export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600">
              <span className="text-xs font-bold text-white">RK</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">RK Kit</span>
          </div>

          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2" aria-label="Footer">
            <a href="#features" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
              Pricing
            </a>
            <a href="#testimonials" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
              Testimonials
            </a>
          </nav>

          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} RK Kit. Open source.
          </p>
        </div>
      </div>
    </footer>
  );
}
