"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AgentCard } from "@/components/agent/AgentCard";
import { useGetAgentsQuery } from "@/redux/api/agentApi";
import { Loader2, Search, Award, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { Pagination } from "@/components/ui/Pagination";
import { Agent } from "@/types/agent";

export default function AgentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [page, setPage] = useState(1);
  const [limit] = useState(12);

  const { data, isLoading } = useGetAgentsQuery({
    searchTerm: searchTerm || undefined,
    specialization:
      specializationFilter !== "all" ? specializationFilter : undefined,
    minRating: ratingFilter !== "all" ? parseFloat(ratingFilter) : undefined,
    sortBy,
    sortOrder: "asc",
    page,
    limit,
  });

  const agents = data?.data || [];
  const pagination = data?.meta ?? {
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 0,
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      {/* Header */}
      <div className="bg-luxury-emerald pt-32 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2000')] opacity-10 mix-blend-overlay bg-cover bg-center" />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-full mb-6 max-w-fit mx-auto backdrop-blur-md">
            <Award className="w-5 h-5 text-luxury-gold mr-2" />
            <span className="text-white font-bold tracking-wide uppercase text-sm">
              Award-Winning Team
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 font-heading">
            Meet Our <span className="text-luxury-gold">Expert Agents</span>
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto text-lg mb-10">
            Our premier real estate advisors bring decades of experience and
            exclusive market access to help you find your perfect luxury
            property.
          </p>

          <div className="max-w-xl mx-auto relative  group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 group-focus-within:text-luxury-gold transition-colors" />
            <Input
              placeholder="Search agents by name or specialization..."
              className="pl-12 bg-white/10 border-white/20 text-white placeholder-white/50 h-14 rounded-2xl focus:border-luxury-gold text-lg backdrop-blur-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white/5 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select
              value={specializationFilter}
              onValueChange={(value) => setSpecializationFilter(value || "all")}
            >
              <SelectTrigger className="h-12 bg-white/10 border-white/20 text-white placeholder-white/50 backdrop-blur-md">
                <SelectValue placeholder="Specialization" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border">
                <SelectItem value="all">All Specializations</SelectItem>
                <SelectItem value="luxury">Luxury Properties</SelectItem>
                <SelectItem value="residential">Residential</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="investment">Investment</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={ratingFilter}
              onValueChange={(value) => setRatingFilter(value || "all")}
            >
              <SelectTrigger className="h-12 bg-white/10 border-white/20 text-white placeholder-white/50 backdrop-blur-md">
                <SelectValue placeholder="Min Rating" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border">
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="4.5">4.5+ Stars</SelectItem>
                <SelectItem value="4.0">4.0+ Stars</SelectItem>
                <SelectItem value="3.5">3.5+ Stars</SelectItem>
                <SelectItem value="3.0">3.0+ Stars</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={sortBy}
              onValueChange={(value) => setSortBy(value || "name")}
            >
              <SelectTrigger className="h-12 bg-white/10 border-white/20 text-white placeholder-white/50 backdrop-blur-md">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border">
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="averageRating">Rating</SelectItem>
                <SelectItem value="experience">Experience</SelectItem>
                <SelectItem value="createdAt">Newest First</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center justify-between text-white/70 text-sm">
              <span>{pagination.total} agents found</span>
              <button className="hover:text-white transition-colors">
                <Filter className="w-4 h-4 mr-1" />
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 py-20 w-full">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-10 h-10 animate-spin text-luxury-emerald" />
          </div>
        ) : agents.length === 0 ? (
          // Senior Frontend Developer Approach - Professional No Data State
          <div className="text-center py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-md mx-auto"
            >
              {/* Icon with gradient background */}
              <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-linear-to-br from-luxury-emerald/20 to-luxury-emerald/10 border-2 border-luxury-emerald/30 mb-8">
                <Search className="w-8 h-8 text-luxury-emerald" />
              </div>

              {/* Main message */}
              <h2 className="text-2xl font-bold text-foreground mb-4">
                No Agents Found
              </h2>

              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                {searchTerm
                  ? `No agents match "${searchTerm}". Try different keywords or browse all agents.`
                  : "Our team of expert agents is currently being updated. Check back soon or contact us directly for assistance."}
              </p>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="px-6 py-3 bg-luxury-emerald hover:bg-luxury-emerald-light text-white rounded-xl font-medium transition-colors"
                  >
                    Clear Search
                  </button>
                )}

                <button
                  onClick={() => (window.location.href = "/contact")}
                  className="px-6 py-3 border-2 border-luxury-emerald text-luxury-emerald hover:bg-luxury-emerald hover:text-white rounded-xl font-medium transition-all"
                >
                  Contact Support
                </button>
              </div>

              {/* Additional help text */}
              <div className="mt-12 p-6 bg-muted/30 rounded-2xl border border-border/50">
                <h3 className="font-semibold text-foreground mb-3">
                  Need Assistance?
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Our real estate experts are here to help you find the perfect
                  property. Reach out to our support team for personalized
                  recommendations or to be notified when new agents join our
                  platform.
                </p>
              </div>
            </motion.div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {agents.map((agent: Agent, index: number) => (
                <AgentCard key={agent.id} agent={agent} index={index} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-12">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
