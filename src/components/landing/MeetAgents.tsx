"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Award, ArrowRight } from "lucide-react";
import Link from "next/link";

const agents = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Senior Real Estate Advisor",
    location: "New York, NY",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b332c1ca?q=80&w=200&auto=format&fit=crop",
    rating: 4.9,
    properties: 45,
    experience: "10+ years",
    specialties: ["Luxury Homes", "Investment Properties"],
    verified: true,
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Property Specialist",
    location: "Los Angeles, CA",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    rating: 4.8,
    properties: 38,
    experience: "8+ years",
    specialties: ["Penthouses", "Beachfront Properties"],
    verified: true,
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Real Estate Consultant",
    location: "Miami, FL",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
    rating: 5.0,
    properties: 52,
    experience: "12+ years",
    specialties: ["Waterfront Homes", "Condos"],
    verified: true,
  },
  {
    id: 4,
    name: "David Thompson",
    role: "Luxury Property Expert",
    location: "San Francisco, CA",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
    rating: 4.9,
    properties: 41,
    experience: "9+ years",
    specialties: ["Historic Properties", "Estate Sales"],
    verified: true,
  },
];

export function MeetAgents() {
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Meet Our <span className="text-luxury-gold">Expert Agents</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our team of experienced real estate professionals is dedicated to helping 
            you find your perfect property with personalized service.
          </p>
        </motion.div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {agents.map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="glass-card text-center p-6">
                {/* Avatar */}
                <div className="relative mb-4">
                  <Avatar className="w-20 h-20 mx-auto">
                    <AvatarImage src={agent.avatar} alt={agent.name} />
                    <AvatarFallback className="bg-luxury-gold text-luxury-slate text-xl">
                      {agent.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  {/* Verified Badge */}
                  {agent.verified && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-luxury-gold rounded-full flex items-center justify-center">
                      <Award className="h-3 w-3 text-luxury-slate" />
                    </div>
                  )}
                </div>

                {/* Name & Role */}
                <h3 className="font-semibold text-lg mb-1">{agent.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{agent.role}</p>
                
                {/* Location */}
                <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-3">
                  <MapPin className="h-3 w-3" />
                  <span>{agent.location}</span>
                </div>

                {/* Rating */}
                <div className="flex items-center justify-center gap-1 mb-3">
                  <Star className="h-4 w-4 fill-luxury-gold text-luxury-gold" />
                  <span className="text-sm font-medium">{agent.rating}</span>
                </div>

                {/* Stats */}
                <div className="flex justify-center gap-4 text-xs text-muted-foreground mb-4">
                  <div>
                    <span className="font-semibold text-foreground">{agent.properties}</span>
                    <span className="block">Properties</span>
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">{agent.experience}</span>
                    <span className="block">Experience</span>
                  </div>
                </div>

                {/* Specialties */}
                <div className="flex flex-wrap justify-center gap-1 mb-4">
                  {agent.specialties.map((specialty) => (
                    <Badge key={specialty} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>

                {/* Contact Button */}
                <Button size="sm" className="w-full bg-luxury-gold text-luxury-slate hover:bg-luxury-gold/90">
                  Contact Agent
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="glass-strong rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold mb-4">
              Connect with Our Expert Agents
            </h3>
            <p className="text-muted-foreground mb-6">
              Get personalized guidance and access to exclusive properties with our 
              team of dedicated real estate professionals.
            </p>
            <Link href="/agents">
              <Button 
                size="lg" 
                className="bg-luxury-gold text-luxury-slate hover:bg-luxury-gold/90 group"
              >
                View All Agents
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
