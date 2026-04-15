"use client";

import { motion } from "framer-motion";
import { Shield, Camera, Users, FileText, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Shield,
    title: "Verified Properties",
    description: "All properties undergo rigorous verification process to ensure authenticity and quality."
  },
  {
    icon: Camera,
    title: "Virtual Tours",
    description: "Experience properties from anywhere with our immersive 360° virtual tours."
  },
  {
    icon: Users,
    title: "Expert Agents",
    description: "Work with industry-leading real estate professionals specializing in luxury properties."
  },
  {
    icon: FileText,
    title: "Legal Support",
    description: "Comprehensive legal assistance throughout your property transaction journey."
  },
  {
    icon: Crown,
    title: "The Platinum Club",
    description: "Exclusive access to off-market properties and premium member benefits."
  }
];

export function UnrivaledExcellence() {
  return (
    <section className="relative py-24 px-10 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255, 215, 0, 0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl font-serif text-white mb-6"
          >
            Unrivaled Excellence
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-white/60 max-w-3xl mx-auto leading-relaxed"
          >
            Experience the pinnacle of luxury real estate services, where every detail is meticulously crafted to exceed your expectations.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-[#1A1A1A] border border-white/5 rounded-sm p-8 relative overflow-hidden group"
            >
              {/* Background gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-br from-luxury-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-luxury-gold/10 rounded-sm flex items-center justify-center mb-6 group-hover:bg-luxury-gold/20 transition-colors duration-300">
                  <feature.icon className="w-8 h-8 text-luxury-gold" />
                </div>
                <h3 className="text-xl font-serif text-white mb-4 group-hover:text-luxury-gold transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-white/60 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button className="bg-luxury-gold hover:bg-white text-black font-serif text-lg px-12 py-4 rounded-none shadow-2xl transition-all duration-300 hover:shadow-luxury-gold/25">
              APPLY FOR MEMBERSHIP
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
