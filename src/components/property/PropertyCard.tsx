"use client";

import { motion } from "framer-motion";
import { MapPin, BedDouble, Bath, Square, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  type: string;
  image?: string;
}

interface PropertyCardProps {
  property: Property;
  index: number;
}

export function PropertyCard({ property, index }: PropertyCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group bg-card rounded-2xl overflow-hidden border border-border shadow-premium hover:shadow-hover transition-all duration-300 relative flex flex-col"
    >
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <span className="px-3 py-1 bg-luxury-slate/90 backdrop-blur-md text-luxury-gold text-xs font-bold rounded-full uppercase tracking-wider">
          {property.type}
        </span>
      </div>

      <button className="absolute top-4 left-4 z-10 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full transition-colors">
        <Heart className="w-5 h-5 text-white" />
      </button>

      <div className="relative aspect-video overflow-hidden">
        <Image
          width={800}
          height={600}
          src={
            property.images?.[0] ||
            property.image ||
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"
          }
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-linear-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-white font-bold text-2xl">
            ${property.price.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="p-5 flex flex-col grow">
        <h3 className="text-xl font-bold text-foreground font-heading mb-2 line-clamp-1 group-hover:text-luxury-gold transition-colors">
          {property.title}
        </h3>

        <div className="flex items-center text-muted-foreground mb-4">
          <MapPin className="w-4 h-4 mr-1 text-luxury-emerald" />
          <span className="text-sm line-clamp-1">{property.location}</span>
        </div>

        <div className="grid grid-cols-3 gap-2 py-4 border-t border-b border-border/50 mb-4 mt-auto">
          <div className="flex flex-col items-center justify-center">
            <BedDouble className="w-5 h-5 text-luxury-gold mb-1" />
            <span className="text-xs font-medium text-muted-foreground">
              {property.bedrooms} Beds
            </span>
          </div>
          <div className="flex flex-col items-center justify-center border-l border-r border-border/50">
            <Bath className="w-5 h-5 text-luxury-gold mb-1" />
            <span className="text-xs font-medium text-muted-foreground">
              {property.bathrooms} Baths
            </span>
          </div>
          <div className="flex flex-col items-center justify-center">
            <Square className="w-5 h-5 text-luxury-gold mb-1" />
            <span className="text-xs font-medium text-muted-foreground">
              {property.area} sqft
            </span>
          </div>
        </div>

        <Button
          onClick={() => (window.location.href = `/properties/${property.id}`)}
          className="w-full bg-luxury-slate hover:bg-luxury-slate-light text-white rounded-xl"
        >
          View Details
        </Button>
      </div>
    </motion.div>
  );
}
