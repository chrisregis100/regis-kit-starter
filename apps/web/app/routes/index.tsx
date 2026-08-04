import { createFileRoute } from "@tanstack/react-router";
import { LandingNav } from "../components/landing/LandingNav";
import { Hero } from "../components/landing/Hero";
import { Features } from "../components/landing/Features";
import { Pricing } from "../components/landing/Pricing";
import { Testimonials } from "../components/landing/Testimonials";
import { Footer } from "../components/landing/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [{ title: "RegisKit — Ship your SaaS faster" }],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <LandingNav />
      <main className="flex-1">
        <Hero />
        <Features />
        <Pricing />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}
