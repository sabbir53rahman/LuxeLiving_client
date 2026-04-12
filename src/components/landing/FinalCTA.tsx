"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Home, Star, Shield } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-luxury-slate via-luxury-emerald/20 to-luxury-slate relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-luxury-gold/20 rounded-full blur-xl" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-luxury-emerald/20 rounded-full blur-xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-luxury-gold/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          {/* Main Content */}
          <div className="glass-strong rounded-3xl p-12 text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Home className="h-8 w-8 text-luxury-gold" />
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Ready to Find Your <span className="text-luxury-gold">Dream Home?</span>
              </h2>
            </div>
            
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied clients who discovered their perfect properties 
              through LuxeLiving&apos;s exceptional service and exclusive listings.
            </p>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-8 mb-8">
              <div className="flex items-center gap-2 text-white/80">
                <Star className="h-5 w-5 text-luxury-gold" />
                <span>4.9/5 Rating</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Shield className="h-5 w-5 text-luxury-gold" />
                <span>Verified Properties</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Home className="h-5 w-5 text-luxury-gold" />
                <span>500+ Luxury Homes</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-luxury-gold text-luxury-slate hover:bg-luxury-gold/90 px-8 py-6 text-lg font-semibold group"
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold"
              >
                Schedule Consultation
              </Button>
            </div>
          </div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-12 text-white/60 text-sm"
          >
            <p>
              No commitment required • Free consultation • Access to exclusive properties
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
