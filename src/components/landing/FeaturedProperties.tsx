"use client";

import { motion } from "framer-motion";
import { useGetPropertiesQuery } from "@/redux/api/propertyApi";
import { IProperty } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { Home, ArrowRight, MapPin } from "lucide-react";

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
    <section className="py-24 px-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-16">
          <div className="text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl font-serif text-white"
            >
              FEATURED PORTFOLIOS
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-white/60 mt-2"
            >
              Curated Selection
            </motion.p>
          </div>
          <Link href="/properties">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ x: 5 }}
              className="text-luxury-gold hover:text-white transition-colors duration-300 text-sm font-black uppercase tracking-widest"
            >
              View All Reports
            </motion.div>
          </Link>
        </div>

        {/* Properties Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#1A1A1A] border border-white/5 rounded-sm p-6 animate-pulse">
                <div className="h-48 bg-white/10 rounded-sm mb-4"></div>
                <div className="h-4 bg-white/10 rounded-sm mb-2"></div>
                <div className="h-4 bg-white/10 rounded-sm"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-white/60">
              Failed to load properties. Please try again later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property: IProperty, index: number) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <div className="bg-[#1A1A1A] border border-white/5 rounded-sm overflow-hidden">
                  {/* Property Image */}
                  <div className="relative aspect-4/3 overflow-hidden">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={property.images?.[0] || "https://images.unsplash.com/photo-1600585154340-e6293ab0b8fd?w=600&q=80"}
                        alt={property.title}
                        width={600}
                        height={400}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    {/* Status Badge */}
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 text-xs font-black uppercase tracking-widest rounded-sm ${
                        property.featured ? 'bg-luxury-gold' : 'bg-red-500'
                      }`}>
                        {property.featured ? 'NEW LISTING' : 'SOLD'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Property Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-serif text-white mb-2 group-hover:text-luxury-gold transition-colors duration-300">
                      {property.title}
                    </h3>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-serif text-luxury-gold">
                        ${property.price?.toLocaleString() || '0'}
                      </span>
                      <div className="flex items-center gap-2 text-white/60 text-sm">
                        <Home className="w-4 h-4" />
                        <span>{property.bedrooms || 0} beds</span>
                        <Home className="w-4 h-4 ml-2" />
                        <span>{property.bathrooms || 0} baths</span>
                        <Home className="w-4 h-4 ml-2" />
                        <span>{property.area || 0} sqft</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-white/60 text-sm">
                      <MapPin className="w-4 h-4" />
                      <span>{property.location}</span>
                    </div>
                  </div>
                </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
