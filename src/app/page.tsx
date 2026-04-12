import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Hero } from "@/components/landing/Hero";

import { Features } from "@/components/landing/Features";

import { Testimonials } from "@/components/landing/Testimonials";

import { FAQ } from "@/components/landing/FAQ";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { FeaturedProperties } from "@/components/landing/FeaturedProperties";
import { PropertyCategories } from "@/components/landing/PropertyCategories";
import { Statistics } from "@/components/landing/Statistics";
import { MeetAgents } from "@/components/landing/MeetAgents";
import { HowItWorks } from "@/components/landing/HowItWorks";

export const metadata: Metadata = {
  title: "LuxeLiving — Premium Real Estate",
  description:
    "Discover luxury properties and premium real estate with LuxeLiving. Find your dream home with expert agents, virtual tours, and exclusive listings.",
};

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background transition-colors duration-300">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <FeaturedProperties />
        <Features />
        <Statistics />
        <PropertyCategories />
        <HowItWorks />
        <MeetAgents />
        <Testimonials />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
