import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "../styles/app.css";
import { Providers } from "../components/providers";

export const metadata: Metadata = {
  title: "RK Kit — SaaS Starter",
  description: "Modern SaaS starter built with Next.js App Router",
  icons: { icon: "/favicon.svg", apple: "/logo.svg" },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#0E4781",
  width: "device-width",
  initialScale: 1,
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="h-full antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
