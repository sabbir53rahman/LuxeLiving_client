import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Hero } from "@/components/landing/Hero";
import { FeaturedProperties } from "@/components/landing/FeaturedProperties";
import { Statistics } from "@/components/landing/Statistics";
import { Collections } from "@/components/landing/Collections";
import { FAQ } from "@/components/landing/FAQ";
import { UnrivaledExcellence } from "@/components/landing/UnrivaledExcellence";
import { MeetCurators } from "@/components/landing/MeetCurators";
import { ClientTestimonials } from "@/components/landing/ClientTestimonials";

export const metadata: Metadata = {
  title: "LuxeLiving — Premium Real Estate",
  description:
    "Discover luxury properties and premium real estate with LuxeLiving. Find your dream home with expert agents, virtual tours, and exclusive listings.",
};

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#0A0A0A] text-white font-sans selection:bg-luxury-gold selection:text-black">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <FeaturedProperties />
        <Statistics />
        <UnrivaledExcellence />
        <Collections />
        <MeetCurators />
        <ClientTestimonials />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
