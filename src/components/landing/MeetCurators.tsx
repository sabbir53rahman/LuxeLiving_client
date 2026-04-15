"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import Image from "next/image";
import { useGetAgentsQuery } from "@/redux/api/agentApi";
import { Agent } from "@/types/agent";

export function MeetCurators() {
  const { data, isLoading, error } = useGetAgentsQuery({ limit: 3, isAvailable: true });
  
  // Get first 3 agents from API response
  const agents = data?.data?.slice(0, 3) || [];
  
  return (
    <section className="py-24 px-10">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255, 215, 0, 0.05) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl font-serif text-white mb-6"
          >
            Meet The Curators
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-white/60 max-w-3xl mx-auto leading-relaxed"
          >
            Our team of distinguished property experts brings unparalleled expertise and discretion to every client interaction.
          </motion.p>
        </div>

        {/* Curators Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            // Loading skeleton
            [1, 2, 3].map((i) => (
              <div key={i} className="group text-center animate-pulse">
                <div className="mb-6 mx-auto w-32 h-32 bg-white/10 rounded-full"></div>
                <div className="h-6 bg-white/10 rounded mb-2 mx-auto w-3/4"></div>
                <div className="h-4 bg-white/10 rounded mb-4 mx-auto w-1/2"></div>
                <div className="h-3 bg-white/10 rounded mb-4 mx-auto w-full"></div>
                <div className="h-3 bg-white/10 rounded mx-auto w-1/3"></div>
              </div>
            ))
          ) : error ? (
            <div className="col-span-3 text-center py-12">
              <p className="text-white/60">
                Failed to load agents. Please try again later.
              </p>
            </div>
          ) : (
            agents.map((agent: Agent, index: number) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group text-center"
              >
                {/* Profile Image */}
                <div className="relative mb-6 mx-auto w-32 h-32">
                  <Image
                    src={agent.user?.image || agent.profilePhoto || "/api/placeholder/128/128"}
                    alt={agent.name}
                    fill
                    className="object-cover rounded-full grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                  {/* Gold ring on hover */}
                  <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-luxury-gold transition-colors duration-500" />
                </div>

                {/* Agent Info */}
                <h3 className="text-xl font-serif text-white mb-2 group-hover:text-luxury-gold transition-colors duration-300">
                  {agent.name}
                </h3>
                <p className="text-luxury-gold text-sm font-medium mb-4">
                  {agent.specialization || "Real Estate Agent"}
                </p>
                <p className="text-white/60 text-sm leading-relaxed mb-4">
                  {agent.bio || "Experienced real estate professional dedicated to finding your perfect property."}
                </p>
                <div className="flex items-center justify-center gap-4 text-white/40 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{agent.address || "Available"}</span>
                  </div>
                  {(agent.experience ?? 0) > 0 && (
                    <span>{agent.experience} years exp.</span>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
