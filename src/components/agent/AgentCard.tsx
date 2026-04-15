"use client";

import { motion } from "framer-motion";
import { Star, Phone, Mail, Award } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useRequestAgentMutation } from "@/redux/api/agentApi";

import { Agent } from "@/types/agent";

interface AgentCardProps {
  agent: Agent;
  index: number;
}

export function AgentCard({ agent, index }: AgentCardProps) {
  const { user, isAuthenticated } = useAuth();
  const [requestAgent, { isLoading: requestLoading }] = useRequestAgentMutation();

  const handleRequestAgent = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to request an agent");
      return;
    }

    if (user?.role?.toLowerCase() !== 'seller') {
      toast.info("Only sellers can request agent collaboration.");
      return;
    }

    try {
      await requestAgent(agent.id).unwrap();
      toast.success("Agent request sent successfully!");
    } catch (error: unknown) {
      console.error("Failed to request agent:", error);
      const errorMessage = (error as { data?: { message?: string } })?.data?.message || "Failed to request agent. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group bg-card rounded-2xl p-6 border border-border shadow-premium hover:shadow-hover transition-all duration-300 text-center relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-luxury-emerald/5 rounded-bl-full -z-10 group-hover:bg-luxury-gold/5 transition-colors" />
      
      <div className="relative inline-block mb-4">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-background shadow-md">
          <Image
            src={agent.avatar || "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80"}
            alt={agent.name}
            width={96}
            height={96}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute -bottom-2 -right-2 bg-luxury-gold text-luxury-slate rounded-full p-1.5 shadow-md border-2 border-background">
          <Award className="w-4 h-4" />
        </div>
      </div>

      <h3 className="text-xl font-bold font-heading text-foreground mb-1 group-hover:text-luxury-emerald transition-colors">
        {agent.name}
      </h3>
      <p className="text-luxury-gold font-medium mb-4 text-sm uppercase tracking-wide">
        {agent.specialization?.[0] || "Real Estate Agent"}
      </p>

      <div className="flex justify-center items-center gap-4 text-muted-foreground mb-6">
        {agent.averageRating && (
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="font-semibold text-foreground">{agent.averageRating.toFixed(1)}</span>
            {agent.totalReviews && (
              <span className="text-xs text-muted-foreground">({agent.totalReviews})</span>
            )}
          </div>
        )}
        {agent.experience && (
          <>
            <div className="w-1 h-1 rounded-full bg-border" />
            <div className="text-sm">
              <span className="font-semibold text-foreground">{agent.experience}</span> Years Exp.
            </div>
          </>
        )}
      </div>

      <div className="flex gap-2 justify-center mb-6">
        <Button variant="outline" size="icon" className="rounded-full border-border hover:bg-luxury-gold/10 hover:text-luxury-gold hover:border-luxury-gold transition-colors">
          <Phone className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="icon" className="rounded-full border-border hover:bg-luxury-emerald/10 hover:text-luxury-emerald hover:border-luxury-emerald transition-colors">
          <Mail className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-2">
        <Button 
          onClick={handleRequestAgent}
          disabled={requestLoading}
          className="w-full bg-luxury-emerald hover:bg-luxury-emerald-light text-white rounded-xl"
        >
          {requestLoading ? "Requesting..." : "Request Agent"}
        </Button>
        
        <Button 
          onClick={() => window.location.href = `/agents/${agent.id}`} 
          variant="outline"
          className="w-full rounded-xl"
        >
          View Profile
        </Button>
      </div>
    </motion.div>
  );
}
