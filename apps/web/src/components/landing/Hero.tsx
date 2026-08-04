import { Link } from "@tanstack/react-router";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-32 pb-20 sm:pt-40 sm:pb-28">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/4 w-[800px] h-[600px] rounded-full bg-blue-50 blur-3xl opacity-60" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700 ring-1 ring-blue-200 mb-8">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-600" />
          </span>
          Multi-tenant SaaS boilerplate — open source
        </div>

        <h1 className="mx-auto max-w-4xl text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
          Build your SaaS{" "}
          <span className="text-blue-600">10× faster</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-500 leading-relaxed">
          Production-ready multi-tenant starter with authentication, organizations, RLS
          security, and a polished UI. Skip the boilerplate, ship your product.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            to="/signup"
            className="w-full sm:w-auto rounded-xl bg-blue-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg hover:bg-blue-700 transition-all hover:shadow-blue-200 hover:shadow-xl"
          >
            Start for free
          </Link>
          <a
            href="#features"
            className="w-full sm:w-auto rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-gray-700 ring-1 ring-gray-200 hover:ring-gray-300 hover:bg-gray-50 transition-all"
          >
            Learn more →
          </a>
        </div>

        <div className="mt-16 flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
            </svg>
            TanStack Start
          </div>
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
            </svg>
            Better Auth + Organizations
          </div>
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
            </svg>
            PostgreSQL RLS
          </div>
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
            </svg>
            TypeScript strict
          </div>
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
            </svg>
            Render / Docker ready
          </div>
        </div>
      </div>
    </section>
  );
}
