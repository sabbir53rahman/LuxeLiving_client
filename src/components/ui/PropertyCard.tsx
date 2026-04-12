"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { 
  Bed, 
  Bath, 
  Square, 
  MapPin, 
  Heart, 
  Share2, 
  Eye,
  Star,
  DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    description: string;
    price: number;
    location: string;
    bedrooms: number;
    bathrooms: number;
    area: number;
    image: string;
    featured?: boolean;
    rating?: number;
    views?: number;
    agent?: {
      name: string;
      avatar: string;
    };
  };
  className?: string;
}

export function PropertyCard({ property, className = "" }: PropertyCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `$${(price / 1000).toFixed(0)}K`;
    }
    return `$${price}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={className}
    >
      <Card className="glass-card group cursor-pointer overflow-hidden">
        {/* Image Container */}
        <div className="relative h-64 overflow-hidden">
          <Image
            src={property.image}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Featured Badge */}
          {property.featured && (
            <Badge className="absolute top-4 left-4 bg-luxury-gold text-luxury-slate z-10">
              Featured
            </Badge>
          )}
          
          {/* Action Buttons */}
          <div className={`absolute top-4 right-4 flex flex-col gap-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
            <Button
              size="sm"
              variant="secondary"
              className="glass-strong h-8 w-8 p-0 rounded-full"
              onClick={(e) => {
                e.preventDefault();
                setIsLiked(!isLiked);
              }}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="glass-strong h-8 w-8 p-0 rounded-full"
              onClick={(e) => e.preventDefault()}
            >
              <Share2 className="h-4 w-4 text-white" />
            </Button>
          </div>
          
          {/* Quick Stats Overlay */}
          <div className={`absolute bottom-4 left-4 flex items-center gap-4 text-white text-sm transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {property.rating && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-luxury-gold text-luxury-gold" />
                <span>{property.rating}</span>
              </div>
            )}
            {property.views && (
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{property.views}</span>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-6">
          {/* Price and Location */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 text-luxury-gold font-bold text-2xl mb-1">
                <DollarSign className="h-5 w-5" />
                {formatPrice(property.price)}
              </div>
              <div className="flex items-center gap-1 text-muted-foreground text-sm">
                <MapPin className="h-4 w-4" />
                <span>{property.location}</span>
              </div>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-lg mb-2 line-clamp-1 group-hover:text-luxury-gold transition-colors">
            {property.title}
          </h3>
          
          {/* Description */}
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {property.description}
          </p>

          {/* Property Features */}
          <div className="flex items-center gap-4 mb-4 text-sm">
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4 text-muted-foreground" />
              <span>{property.bedrooms} Beds</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4 text-muted-foreground" />
              <span>{property.bathrooms} Baths</span>
            </div>
            <div className="flex items-center gap-1">
              <Square className="h-4 w-4 text-muted-foreground" />
              <span>{property.area.toLocaleString()} sqft</span>
            </div>
          </div>

          {/* Agent Info */}
          {property.agent && (
            <div className="flex items-center justify-between pt-4 border-t border-border/50">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-luxury-gold/20 flex items-center justify-center">
                  <span className="text-xs font-semibold text-luxury-gold">
                    {property.agent.name.charAt(0)}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">{property.agent.name}</span>
              </div>
              
              <Link href={`/properties/${property.id}`}>
                <Button 
                  size="sm" 
                  className="bg-luxury-gold text-luxury-slate hover:bg-luxury-gold/90"
                >
                  View Details
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
