"use client";

import { motion } from "framer-motion";
import { Search, Eye, Handshake, Home } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Search Properties",
    description: "Browse our curated collection of luxury properties with advanced filters and virtual tours.",
    icon: Search,
  },
  {
    number: "02", 
    title: "Schedule Viewing",
    description: "Book in-person or virtual tours with our expert agents at your convenience.",
    icon: Eye,
  },
  {
    number: "03",
    title: "Connect with Agents",
    description: "Work with experienced real estate professionals who understand your needs.",
    icon: Handshake,
  },
  {
    number: "04",
    title: "Find Your Dream Home",
    description: "Complete your purchase with our comprehensive support and guidance.",
    icon: Home,
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How <span className="text-luxury-gold">LuxeLiving</span> Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our streamlined process makes finding and purchasing your dream property 
            simple and stress-free.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              {/* Step Number */}
              <div className="relative mb-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-luxury-gold/10 flex items-center justify-center">
                  <step.icon className="h-8 w-8 text-luxury-gold" />
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-2xl font-bold text-luxury-gold">
                  {step.number}
                </div>
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-linear-to-r from-luxury-gold/30 to-transparent" />
              )}
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="glass-strong rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-muted-foreground mb-6">
              Join thousands of satisfied clients who found their perfect properties 
              through LuxeLiving&apos;s exceptional service.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
