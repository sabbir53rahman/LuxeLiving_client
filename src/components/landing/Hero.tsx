"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Home, DollarSign, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";

export function Hero() {
  const [searchQuery, setSearchQuery] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [location, setLocation] = useState("");

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image/Video */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-linear-to-br from-luxury-slate/90 via-luxury-slate/70 to-luxury-emerald/80" />
        <Image
          width={2000}
          height={2000}
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop"
          alt="Luxury Property"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
          >
            Discover Your
            <span className="block text-luxury-gold">Dream Home</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8"
          >
            Experience luxury living with our exclusive collection of premium
            properties. Find your perfect home among handpicked estates,
            penthouses, and villas.
          </motion.p>
        </motion.div>

        {/* Search Bar with Glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="glass-strong rounded-2xl p-6 md:p-8 max-w-5xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Location */}
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-luxury-gold w-5 h-5" />
              <Input
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder-white/60 focus:border-luxury-gold"
              />
            </div>

            {/* Property Type */}
            <div className="relative">
              <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-luxury-gold w-5 h-5 z-10" />
              <Select
                value={propertyType}
                onValueChange={(v) => setPropertyType(v || "")}
              >
                <SelectTrigger className="pl-10 bg-white/10 border-white/20 text-white focus:border-luxury-gold">
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent className="bg-luxury-slate border-white/20">
                  <SelectItem value="villa">Villa</SelectItem>
                  <SelectItem value="penthouse">Penthouse</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="mansion">Mansion</SelectItem>
                  <SelectItem value="condo">Condo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Price Range */}
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-luxury-gold w-5 h-5 z-10" />
              <Select
                value={priceRange}
                onValueChange={(v) => setPriceRange(v || "")}
              >
                <SelectTrigger className="pl-10 bg-white/10 border-white/20 text-white focus:border-luxury-gold">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent className="bg-luxury-slate border-white/20">
                  <SelectItem value="500k-1m">$500K - $1M</SelectItem>
                  <SelectItem value="1m-2m">$1M - $2M</SelectItem>
                  <SelectItem value="2m-5m">$2M - $5M</SelectItem>
                  <SelectItem value="5m+">$5M+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Search Button */}
            <Button className="bg-luxury-gold text-luxury-slate hover:bg-luxury-gold/90 font-semibold">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-6 text-white/80 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-luxury-gold rounded-full" />
              <span>500+ Premium Properties</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-luxury-gold rounded-full" />
              <span>50+ Expert Agents</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-luxury-gold rounded-full" />
              <span>25+ Cities</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-luxury-gold rounded-full" />
              <span>98% Client Satisfaction</span>
            </div>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mt-12"
        >
          <Button
            size="lg"
            className="bg-luxury-gold text-luxury-slate hover:bg-luxury-gold/90 px-8 py-6 text-lg font-semibold group"
          >
            Browse Properties
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold"
          >
            Schedule a Tour
          </Button>
        </motion.div>
      </div>

      {/* Floating Elements Animation */}
      <motion.div
        animate={{
          y: [0, -20, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-20 left-10 w-20 h-20 bg-luxury-gold/20 rounded-full blur-xl"
      />
      <motion.div
        animate={{
          y: [0, -30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute bottom-20 right-10 w-32 h-32 bg-luxury-emerald/20 rounded-full blur-xl"
      />
    </section>
  );
}
