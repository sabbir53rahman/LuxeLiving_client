"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/40" />
        <Image
          width={2000}
          height={2000}
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop"
          alt="Modern luxury house with pool at dusk"
          className="w-full h-full object-cover"
          priority
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight"
          >
            <span className="block">Discover Your</span>
            <span className="block text-luxury-gold">Dream Home</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-white/90 max-w-4xl mx-auto mb-12 leading-relaxed"
          >
            A curated selection of the world&apos;s most exceptional properties, designed for those who seek the extraordinary.
          </motion.p>
        </motion.div>


        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-6 justify-center"
        >
          <Link href="/properties">
            <Button
              size="lg"
              className="bg-luxury-gold text-luxury-slate hover:bg-luxury-gold/90 px-12 py-6 text-lg font-bold tracking-wider uppercase group"
            >
              BROWSE PROPERTIES
              <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Button>
          </Link>
          <Link href="/portfolio">
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 px-12 py-6 text-lg font-bold tracking-wider uppercase transition-all duration-300"
            >
              VIEW PORTFOLIO
            </Button>
          </Link>
        </motion.div>
      </div>

    </section>
  );
}
