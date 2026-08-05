import { createRootRoute, Outlet, HeadContent, Scripts } from "@tanstack/react-router";
import type { ReactNode } from "react";
import appCss from "../styles/app.css?url";
import { ThemeProvider } from "../components/shared/ThemeProvider";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#0E4781" },
      { title: "RK Kit — SaaS Starter" },
      { name: "description", content: "Modern SaaS starter built with TanStack Start" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "apple-touch-icon", href: "/logo.svg" },
      { rel: "manifest", href: "/site.webmanifest" },
    ],
  }),
  component: RootDocument,
});

function RootDocument() {
  return (
    <Document>
      <ThemeProvider>
        <Outlet />
      </ThemeProvider>
    </Document>
  );
}

function Document({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="h-full antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  );
}
