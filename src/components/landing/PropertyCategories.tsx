"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Building, Home, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const categories = [
  {
    title: "Luxury Villas",
    description: "Exclusive private estates with premium amenities and breathtaking views",
    icon: Building,
    count: "150+ Properties",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=400&auto=format&fit=crop",
    href: "/properties/villas",
  },
  {
    title: "Penthouses",
    description: "Sophisticated urban living with panoramic city skyline views",
    icon: Home,
    count: "80+ Properties", 
    image: "https://images.unsplash.com/photo-1600607687936-ce8816a6a7a3?q=80&w=400&auto=format&fit=crop",
    href: "/properties/penthouses",
  },
  {
    title: "Beachfront Properties",
    description: "Stunning oceanfront homes with private beach access",
    icon: MapPin,
    count: "120+ Properties",
    image: "https://images.unsplash.com/photo-1600566753376-12c8ac7fecb9?q=80&w=400&auto=format&fit=crop",
    href: "/properties/beachfront",
  },
  {
    title: "Mountain Retreats",
    description: "Serene mountain homes surrounded by nature and luxury",
    icon: Building,
    count: "60+ Properties",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=400&auto=format&fit=crop",
    href: "/properties/mountain",
  },
];

export function PropertyCategories() {
  return (
    <section className="py-20 bg-linear-to-b from-muted/20 to-background">
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
            Property <span className="text-luxury-gold">Categories</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our diverse collection of luxury properties across different categories 
            and find the perfect match for your lifestyle.
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <div className="glass-card overflow-hidden h-full">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                  
                  {/* Category Count */}
                  <div className="absolute top-4 right-4 bg-luxury-gold text-luxury-slate px-3 py-1 rounded-full text-sm font-semibold">
                    {category.count}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-full bg-luxury-gold/10 flex items-center justify-center mb-4">
                    <category.icon className="h-6 w-6 text-luxury-gold" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-luxury-gold transition-colors">
                    {category.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm mb-4">
                    {category.description}
                  </p>

                  {/* Link */}
                  <Link href={category.href}>
                    <Button 
                      variant="ghost" 
                      className="p-0 h-auto text-luxury-gold hover:text-luxury-gold/80 group"
                    >
                      Explore Category
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
