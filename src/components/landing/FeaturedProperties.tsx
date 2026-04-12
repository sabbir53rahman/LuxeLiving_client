"use client";

import { motion } from "framer-motion";
import { PropertyCard } from "@/components/ui/PropertyCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Home } from "lucide-react";
import Link from "next/link";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import { useGetPropertiesQuery } from "@/redux/api/propertyApi";
import { IProperty } from "@/types";

// Mock data for demonstration
const mockProperties = [
  {
    id: "1",
    title: "Luxury Penthouse with Ocean View",
    description:
      "Stunning penthouse with panoramic ocean views, modern amenities, and private terrace.",
    price: 2500000,
    location: "Miami Beach, FL",
    bedrooms: 4,
    bathrooms: 3,
    area: 3500,
    image:
      "https://images.unsplash.com/photo-1600566753376-12c8ac7fecb9?q=80&w=2070&auto=format&fit=crop",
    featured: true,
    rating: 4.9,
    views: 1250,
    agent: {
      name: "Sarah Johnson",
      avatar: "/avatars/sarah.jpg",
    },
  },
  {
    id: "2",
    title: "Modern Villa in Beverly Hills",
    description:
      "Contemporary villa with infinity pool, home theater, and smart home technology.",
    price: 4800000,
    location: "Beverly Hills, CA",
    bedrooms: 6,
    bathrooms: 5,
    area: 5200,
    image:
      "https://images.unsplash.com/photo-1600607687936-ce8816a6a7a3?q=80&w=2070&auto=format&fit=crop",
    featured: true,
    rating: 4.8,
    views: 980,
    agent: {
      name: "Michael Chen",
      avatar: "/avatars/michael.jpg",
    },
  },
  {
    id: "3",
    title: "Historic Manhattan Townhouse",
    description:
      "Elegant 5-story townhouse with original details, garden, and rooftop terrace.",
    price: 7200000,
    location: "Upper East Side, NY",
    bedrooms: 5,
    bathrooms: 4,
    area: 4500,
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
    featured: true,
    rating: 5.0,
    views: 2100,
    agent: {
      name: "Emily Rodriguez",
      avatar: "/avatars/emily.jpg",
    },
  },
];

export function FeaturedProperties() {
  const { data, isLoading, error } = useGetPropertiesQuery({ featured: true });

  // For now, using mock data as an elegant fallback if backend has no properties
  const properties =
    data?.data && data.data.length > 0 ? data.data.slice(0, 3) : mockProperties;

  return (
    <section className="py-20 bg-linear-to-b from-background to-muted/20">
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
            <Home className="h-6 w-6 text-luxury-gold" />
            <h2 className="text-3xl md:text-4xl font-bold">
              Featured <span className="text-luxury-gold">Properties</span>
            </h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our handpicked selection of luxury properties, each
            offering exceptional quality and unique features.
          </p>
        </motion.div>

        {/* Properties Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Failed to load properties. Please try again later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {properties.map((property: IProperty, index: number) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <PropertyCard property={property} />
              </motion.div>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="glass-strong rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold mb-4">
              Find Your Perfect Property
            </h3>
            <p className="text-muted-foreground mb-6">
              Browse our complete collection of luxury properties and discover
              your dream home with personalized assistance from our expert
              agents.
            </p>
            <Link href="/properties">
              <Button
                size="lg"
                className="bg-luxury-gold text-luxury-slate hover:bg-luxury-gold/90 group"
              >
                View All Properties
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
