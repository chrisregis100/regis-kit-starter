import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import globalStyles from "../../tailwind.css?url";
import type { ReactNode } from "react";

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href={globalStyles} />
        <HeadContent />
      </head>
      <body className="h-full">
        {children}
        {import.meta.env.DEV && <TanStackRouterDevtools />}
        <Scripts />
      </body>
    </html>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "RegisKit — SaaS Starter" },
      {
        name: "description",
        content:
          "The production-ready SaaS boilerplate with multi-tenant auth, billing, and team management.",
      },
    ],
  }),
  component: () => (
    <RootDocument>
      <Outlet />
    </RootDocument>
  ),
  notFoundComponent: () => (
    <RootDocument>
      <div className="flex min-h-screen flex-col items-center justify-center text-center">
        <h1 className="text-6xl font-bold text-zinc-900">404</h1>
        <p className="mt-4 text-xl text-zinc-500">Page not found</p>
        <a
          href="/"
          className="mt-8 rounded-lg bg-zinc-900 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-700 transition-colors"
        >
          Go home
        </a>
      </div>
    </RootDocument>
  ),
});
