"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import Image from "next/image";

// Static testimonial data as requested
const testimonial = {
  name: "Alexander Vanderbilt",
  title: "CEO, Vanderbilt Enterprises",
  content: "LuxeLiving has transformed how we approach luxury real estate. Their attention to detail, exclusive portfolio, and exceptional service made finding our dream property an extraordinary experience. The team's expertise in the luxury market is unmatched.",
  image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80"
};

export function ClientTestimonials() {
  return (
    <section className="py-24 px-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Testimonial Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <Quote className="w-12 h-12 text-luxury-gold mb-6" />
            
            <motion.blockquote 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-3xl font-serif text-white leading-relaxed mb-8"
            >
              &ldquo;{testimonial.content}&rdquo;
            </motion.blockquote>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex items-center gap-4"
            >
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-luxury-gold">
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  width={64}
                  height={64}
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="text-xl font-serif text-white font-bold">
                  {testimonial.name}
                </h4>
                <p className="text-white/60">
                  {testimonial.title}
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* City View Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="aspect-4/3 rounded-sm overflow-hidden"
          >
            <Image
              src="https://images.unsplash.com/photo-1514565131-fce0801c5f5?w=800&q=80"
              alt="Luxury city skyline view"
              fill
              className="object-cover"
            />
            {/* Subtle overlay for depth */}
            <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
