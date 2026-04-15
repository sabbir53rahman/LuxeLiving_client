"use client";

import { motion } from "framer-motion";
import { Home, Building, Waves, Mountain } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const collections = [
  {
    title: "Luxury Villas",
    description: "Exclusive private estates with unparalleled amenities",
    icon: Home,
    image: "https://images.unsplash.com/photo-1600585154340-e6293ab0b8fd?w=600&q=80",
    href: "/properties?type=villa"
  },
  {
    title: "Penthouses",
    description: "Sky-high residences with panoramic city views",
    icon: Building,
    image: "https://images.unsplash.com/photo-1600607687938-ce2ae0e6a2c5?w=600&q=80",
    href: "/properties?type=penthouse"
  },
  {
    title: "Beachfront",
    description: "Coastal properties with pristine ocean access",
    icon: Waves,
    image: "https://images.unsplash.com/photo-1600566753376-12c8ab7c91e7?w=600&q=80",
    href: "/properties?type=beachfront"
  },
  {
    title: "Mountain Retreats",
    description: "Secluded mountain homes with breathtaking views",
    icon: Mountain,
    image: "https://images.unsplash.com/photo-1600607687938-ce2ae0e6a2c5?w=600&q=80",
    href: "/properties?type=mountain"
  }
];

export function Collections() {
  return (
    <section className="py-24 px-10">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl font-serif text-white mb-6"
          >
            COLLECTIONS
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-white/60 max-w-3xl mx-auto leading-relaxed"
          >
            Explore our curated property collections, each representing the pinnacle of luxury living.
          </motion.p>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {collections.map((collection, index) => (
            <Link key={collection.title} href={collection.href}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="aspect-4/5 overflow-hidden rounded-sm cursor-pointer"
              >
                {/* Background Image */}
                <div className="relative aspect-4/5 overflow-hidden">
                  <Image
                    src={collection.image}
                    alt={collection.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Dark Overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
                  
                  {/* Content Overlay */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-between">
                    <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-sm flex items-center justify-center">
                      <collection.icon className="w-6 h-6 text-luxury-gold" />
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-serif text-white mb-2 group-hover:text-luxury-gold transition-colors duration-300">
                        {collection.title}
                      </h3>
                      <p className="text-white/80 text-sm leading-relaxed">
                        {collection.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
