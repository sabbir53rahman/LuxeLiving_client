"use client";

import { useParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useGetAgentDetailsQuery } from "@/redux/api/agentApi";
import { Loader2, Star, Phone, Mail, MapPin, Award, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AgentDetailsPage() {
  const { id } = useParams();
  const { data, isLoading } = useGetAgentDetailsQuery(id as string, {
    skip: !id,
  });

  // fallback data for preview aesthetics if db lacks info
  const agent = data?.data || {
    id: id,
    name: "James Sterling",
    email: "james@luxeliving.com",
    phone: "+1 234 567 891",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800",
    title: "Luxury Estate Specialist",
    experience: 8,
    rating: 4.8,
    bio: "James Sterling is one of LuxeLiving's most distinguished agents, offering unparalleled service and market expertise. With over 8 years in the ultra-luxury sector, James brings an extensive network and an eye for exceptional properties to every client relationship.",
    languages: ["English", "French"],
    salesThisYear: 24,
    activeListings: 12
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <Loader2 className="w-12 h-12 animate-spin text-luxury-emerald" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-20">
        <div className="max-w-5xl mx-auto px-4">
          
          <div className="bg-card rounded-3xl overflow-hidden border border-border shadow-premium mt-8">
            <div className="flex flex-col md:flex-row">
              {/* Image Section */}
              <div className="w-full md:w-2/5 aspect-square md:aspect-auto relative">
                <img 
                  src={agent.avatar} 
                  alt={agent.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1.5 bg-black/50 backdrop-blur-md text-white font-bold rounded-full text-xs uppercase tracking-wide flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-luxury-gold" /> Verified Agent
                  </span>
                </div>
              </div>
              
              {/* Content Section */}
              <div className="w-full md:w-3/5 p-8 md:p-12 flex flex-col justify-center">
                <div className="mb-2">
                  <span className="text-luxury-emerald font-bold tracking-widest text-sm uppercase">
                    {agent.title}
                  </span>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-black font-heading text-foreground mb-4">
                  {agent.name}
                </h1>
                
                <div className="flex py-4 gap-6 mb-6 border-y border-border">
                  <div className="flex flex-col">
                    <span className="text-muted-foreground text-sm uppercase font-bold tracking-wider mb-1">Experience</span>
                    <span className="text-2xl font-black text-foreground">{agent.experience} Yrs</span>
                  </div>
                  <div className="w-px h-auto bg-border"></div>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground text-sm uppercase font-bold tracking-wider mb-1">Rating</span>
                    <span className="text-2xl font-black text-foreground flex items-center gap-1">
                      {agent.rating} <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                    </span>
                  </div>
                  <div className="w-px h-auto bg-border"></div>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground text-sm uppercase font-bold tracking-wider mb-1">Active</span>
                    <span className="text-2xl font-black text-foreground">{agent.activeListings} Items</span>
                  </div>
                </div>

                <div className="prose text-muted-foreground mb-8">
                  <p>{agent.bio}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="flex-1 h-14 bg-luxury-emerald hover:bg-luxury-emerald-light text-white rounded-xl font-bold text-lg">
                    <Phone className="w-5 h-5 mr-2" />
                    Contact Agent
                  </Button>
                  <Button variant="outline" className="h-14 border-border hover:border-luxury-gold hover:text-luxury-gold hover:bg-luxury-gold/5 rounded-xl px-6">
                    <Mail className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </main>

      <Footer />
    </div>
  );
}
