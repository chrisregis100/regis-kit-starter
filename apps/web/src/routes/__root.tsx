import { createRootRoute, Outlet, ScrollRestoration, HeadContent, Scripts } from "@tanstack/react-router";
import type { ReactNode } from "react";
import "../styles/app.css";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "RK Kit — SaaS Starter" },
      { name: "description", content: "Modern SaaS starter built with TanStack Start" },
    ],
  }),
  component: RootDocument,
});

function RootDocument() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

function Document({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <HeadContent />
      </head>
      <body className="h-full antialiased">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
