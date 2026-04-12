"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    question: "How do I get started with LuxeLiving?",
    answer: "Getting started is easy! Simply create an account, browse our property listings, and contact one of our expert agents. We'll guide you through every step of finding your perfect property.",
  },
  {
    question: "What types of properties do you offer?",
    answer: "We specialize in luxury properties including penthouses, villas, mansions, apartments, and condos in prime locations worldwide. All properties are thoroughly vetted for quality and authenticity.",
  },
  {
    question: "How does the virtual tour feature work?",
    answer: "Our virtual tours use advanced 3D technology to give you an immersive property viewing experience from anywhere in the world. You can navigate through properties, zoom in on details, and get a realistic feel for the space.",
  },
  {
    question: "Are your agents certified and experienced?",
    answer: "Yes, all our agents are licensed professionals with extensive experience in the luxury real estate market. They undergo rigorous training and have proven track records of successful transactions.",
  },
  {
    question: "What makes LuxeLiving different from other real estate platforms?",
    answer: "We combine cutting-edge technology with personalized service, offering exclusive access to premium properties, AI-powered matching, virtual tours, and white-glove service throughout your entire property journey.",
  },
  {
    question: "How do you ensure property quality and authenticity?",
    answer: "Every property on our platform undergoes a thorough verification process including physical inspections, documentation review, and quality assurance checks to ensure what you see is what you get.",
  },
  {
    question: "Can I schedule in-person property viewings?",
    answer: "Absolutely! While virtual tours are convenient, we encourage and facilitate in-person viewings. Your dedicated agent will coordinate all viewing appointments based on your schedule.",
  },
  {
    question: "What support do you provide during the buying process?",
    answer: "We provide comprehensive support including market analysis, price negotiations, legal guidance, paperwork assistance, and coordination with inspectors, appraisers, and other professionals.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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
          <div className="flex items-center justify-center gap-2 mb-4">
            <HelpCircle className="h-6 w-6 text-luxury-gold" />
            <h2 className="text-3xl md:text-4xl font-bold">
              Frequently Asked <span className="text-luxury-gold">Questions</span>
            </h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about LuxeLiving and our services.
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="glass-card overflow-hidden">
                <Button
                  variant="ghost"
                  className="w-full p-6 justify-between text-left hover:bg-white/10 transition-colors"
                  onClick={() => toggleFAQ(index)}
                >
                  <span className="font-semibold text-lg">{faq.question}</span>
                  <ChevronDown 
                    className={`h-5 w-5 text-luxury-gold transition-transform ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </Button>
                
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-6"
                  >
                    <p className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="glass-strong rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold mb-4">
              Still have questions?
            </h3>
            <p className="text-muted-foreground mb-6">
              Our team is here to help. Contact us for personalized assistance 
              and expert guidance on your real estate journey.
            </p>
            <Button 
              size="lg" 
              className="bg-luxury-gold text-luxury-slate hover:bg-luxury-gold/90"
            >
              Contact Support
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
