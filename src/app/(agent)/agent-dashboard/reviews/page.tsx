"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import {
  Star,
  MessageSquare,
  TrendingUp,
  Award,
  Search,
  Calendar,
  ArrowLeft,
  Bell,
  User,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pagination } from "@/components/ui/Pagination";
import { useGetAgentReviewsQuery } from "@/redux/api/reviewApi";
import { useGetMyAgentProfileQuery } from "@/redux/api/agentApi";
import { Review } from "@/types/agent";
import Link from "next/link";

// Section Header Component to match the dashboard design
const SectionHeader = ({
  numeral,
  title,
}: {
  numeral: string;
  title: string;
}) => (
  <div className="flex items-center gap-4 my-8">
    <div className="h-px w-8 bg-white/10" />
    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 whitespace-nowrap">
      {numeral}. <span className="text-white/80">{title}</span>
    </span>
    <div className="h-px flex-1 bg-white/10" />
  </div>
);

function StatCard({
  title,
  value,
  icon: Icon,
  trend,
}: {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  trend: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 20px 40px rgba(255, 215, 0, 0.1)",
        borderColor: "rgba(255, 215, 0, 0.2)",
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-[#1A1A1A] border border-white/5 rounded-sm p-6 space-y-4 relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-linear-to-br from-luxury-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <motion.div
        className="absolute top-0 right-0 w-20 h-20 bg-luxury-gold/10 rounded-bl-full"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="flex items-start justify-between relative z-10">
        <motion.div
          className="p-3 bg-white/5 rounded-sm group-hover:bg-luxury-gold/10 transition-colors duration-300"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
        >
          <Icon className="w-5 h-5 text-luxury-gold" />
        </motion.div>
        <motion.span
          className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40"
          whileHover={{ color: "#FFD700", scale: 1.1 }}
          transition={{ duration: 0.2 }}
        >
          {trend}
        </motion.span>
      </div>

      <div className="space-y-2 relative z-10">
        <motion.h3
          className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-1"
          whileHover={{ color: "#FFD700" }}
          transition={{ duration: 0.2 }}
        >
          {title}
        </motion.h3>
        <motion.p
          className="text-3xl font-serif text-white tracking-tight"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {value}
        </motion.p>
      </div>
    </motion.div>
  );
}

export default function AgentReviewsPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Get agent profile to get the correct agent ID
  const { data: agentData, isLoading: agentLoading } =
    useGetMyAgentProfileQuery(undefined);
  const agent = agentData?.data;

  // Fix agentId logic - use _id or id from agent profile
  const agentId = agent?.id || agent?.id;

  const {
    data: reviewsData,
    isLoading: reviewsLoading,
    error,
  } = useGetAgentReviewsQuery(
    {
      agentId: agentId as string,
      page,
      limit,
      searchTerm,
      rating: ratingFilter !== "all" ? ratingFilter : undefined,
      sortBy,
      sortOrder,
    },
    {
      skip: !agentId, // Skip the query if agentId is not yet available
    },
  );

  const reviews = reviewsData?.data || [];
  const pagination = reviewsData?.meta ?? {
    total: 0,
    page: 1,
    limit,
    totalPages: 0,
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return agent?.averageRating || 0;
    const sum = reviews.reduce(
      (acc: number, review: Review) => acc + review.rating,
      0,
    );
    return sum / reviews.length;
  };

  const calculateAverageScores = () => {
    if (reviews.length === 0)
      return {
        professionalism: 0,
        communication: 0,
        marketKnowledge: 0,
        helpfulness: 0,
      };

    const totals = reviews.reduce(
      (
        acc: {
          professionalism: number;
          communication: number;
          marketKnowledge: number;
          helpfulness: number;
        },
        review: Review,
      ) => ({
        professionalism: acc.professionalism + (review.professionalism || 0),
        communication: acc.communication + (review.communication || 0),
        marketKnowledge: acc.marketKnowledge + (review.marketKnowledge || 0),
        helpfulness: acc.helpfulness + (review.helpfulness || 0),
      }),
      {
        professionalism: 0,
        communication: 0,
        marketKnowledge: 0,
        helpfulness: 0,
      },
    );

    return {
      professionalism: totals.professionalism / reviews.length,
      communication: totals.communication / reviews.length,
      marketKnowledge: totals.marketKnowledge / reviews.length,
      helpfulness: totals.helpfulness / reviews.length,
    };
  };

  if (authLoading || agentLoading || (reviewsLoading && !reviewsData)) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center space-y-6">
        <div className="w-12 h-12 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin" />
        <p className="text-white/40 font-black uppercase tracking-[0.3em] text-[10px]">
          Retrieving Professional Reviews
        </p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-10">
        <Card className="max-w-md w-full rounded-sm border-white/5 bg-white/5 backdrop-blur-xl overflow-hidden">
          <CardContent className="p-12 text-center space-y-6">
            <div className="w-12 h-12 bg-white/5 rounded-2xl mx-auto flex items-center justify-center">
              <User className="w-6 h-6 text-luxury-gold" />
            </div>
            <h2 className="text-2xl font-serif text-white">
              Access Restricted
            </h2>
            <Link href="/login" className="block">
              <Button className="w-full h-12 bg-luxury-gold hover:bg-white text-black font-black uppercase tracking-widest transition-all">
                Identify Yourself
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-10">
        <Card className="max-w-md w-full rounded-sm border-white/5 bg-white/5 backdrop-blur-xl overflow-hidden">
          <CardContent className="p-12 text-center space-y-6 text-white">
            <div className="w-12 h-12 bg-red-500/20 rounded-2xl mx-auto flex items-center justify-center">
              <Calendar className="w-6 h-6 text-red-500" />
            </div>
            <h2 className="text-2xl font-serif">Error Loading Reviews</h2>
            <p className="text-white/40">
              Failed to load professional feedback. Please try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const averageRating = calculateAverageRating();
  const averageScores = calculateAverageScores();

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-white font-sans selection:bg-luxury-gold selection:text-black pb-20">
      {/* Header */}
      <header className="px-10 py-12 flex justify-between items-start">
        <div className="space-y-2">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/agent-dashboard">
              <Button
                variant="outline"
                className="rounded-full w-10 h-10 p-0 border-white/10 hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 text-white/60" />
              </Button>
            </Link>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-luxury-gold">
              Professional Portfolio
            </span>
          </div>
          <h1 className="text-5xl font-serif text-white tracking-tight leading-none">
            Client Feedback
          </h1>
          <p className="text-white/40 text-sm font-medium italic">
            Monitoring your professional reputation and performance metrics.
          </p>
        </div>
        <div className="flex items-center gap-6">
          <button className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors relative">
            <Bell className="w-5 h-5 text-white/60" />
            <div className="absolute top-3 right-3 w-2 h-2 bg-luxury-gold rounded-full border-2 border-[#0E0E0E]" />
          </button>
          <div className="w-12 h-12 rounded-xl bg-linear-to-br from-white/10 to-transparent p-px">
            <div className="w-full h-full rounded-xl bg-[#1A1A1A] flex items-center justify-center overflow-hidden border border-white/5">
              <User className="text-luxury-gold w-6 h-6" />
            </div>
          </div>
        </div>
      </header>

      <div className="px-10 space-y-12">
        {/* I. PERFORMANCE OVERVIEW */}
        <SectionHeader numeral="I" title="PERFORMANCE OVERVIEW" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatCard
            title="Total Reviews"
            value={pagination.total.toString()}
            icon={MessageSquare}
            trend="all time"
          />
          <StatCard
            title="Average Rating"
            value={averageRating.toFixed(1)}
            icon={Star}
            trend="out of 5.0"
          />
          <StatCard
            title="Professionalism"
            value={averageScores.professionalism.toFixed(1)}
            icon={Award}
            trend="core metric"
          />
          <StatCard
            title="Communication"
            value={averageScores.communication.toFixed(1)}
            icon={TrendingUp}
            trend="core metric"
          />
        </div>

        {/* II. CURATED REVIEWS */}
        <SectionHeader numeral="II" title="CURATED REVIEWS" />

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1A1A1A] border border-white/5 p-6 rounded-sm shadow-2xl mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative md:col-span-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <Input
                placeholder="Search feedback..."
                className="pl-12 h-12 rounded-sm bg-white/5 border-white/10 focus:border-luxury-gold transition-all text-sm placeholder:text-white/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              value={ratingFilter}
              onValueChange={(val) => setRatingFilter(val ?? "all")}
            >
              <SelectTrigger className="h-12 rounded-sm bg-white/5 border-white/10 px-6 font-medium text-white/60">
                <SelectValue placeholder="All Ratings" />
              </SelectTrigger>
              <SelectContent className="bg-[#1A1A1A] border-white/10 text-white rounded-sm">
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={sortBy}
              onValueChange={(val) => setSortBy(val ?? "createdAt")}
            >
              <SelectTrigger className="h-12 rounded-sm bg-white/5 border-white/10 px-6 font-medium text-white/60">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent className="bg-[#1A1A1A] border-white/10 text-white rounded-sm">
                <SelectItem value="createdAt">Date Received</SelectItem>
                <SelectItem value="rating">Numeric Rating</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={sortOrder}
              onValueChange={(val) => setSortOrder(val ?? "desc")}
            >
              <SelectTrigger className="h-12 rounded-sm bg-white/5 border-white/10 px-6 font-medium text-white/60">
                <SelectValue placeholder="Order" />
              </SelectTrigger>
              <SelectContent className="bg-[#1A1A1A] border-white/10 text-white rounded-sm">
                <SelectItem value="desc">Newest First</SelectItem>
                <SelectItem value="asc">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Reviews List */}
        <div className="space-y-6">
          {reviews.length === 0 ? (
            <div className="text-center py-24 bg-white/5 rounded-sm border border-dashed border-white/10">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-white/10">
                <Star className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-serif text-white mb-2">
                No Reviews Found
              </h3>
              <p className="text-white/40 max-w-xs mx-auto text-sm leading-relaxed">
                Your professional reputation will grow as you complete more
                property viewings.
              </p>
            </div>
          ) : (
            reviews.map((review: Review, index: number) => (
              <motion.div
                key={review._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#1A1A1A] border border-white/5 rounded-sm p-8 hover:border-luxury-gold/30 transition-all group relative overflow-hidden"
              >
                {/* Background Accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-luxury-gold/5 blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex flex-col md:flex-row justify-between gap-6 relative z-10">
                  <div className="flex gap-6">
                    <Avatar className="h-16 w-16 rounded-sm border border-white/10">
                      <AvatarImage src={review.buyer.avatar} />
                      <AvatarFallback className="bg-white/5 text-luxury-gold font-serif">
                        {review.buyer.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-serif text-xl text-white">
                          {review.buyer.name}
                        </h4>
                        {review.isVerified && (
                          <div className="px-2 py-0.5 bg-luxury-gold/10 text-luxury-gold text-[8px] font-black uppercase tracking-widest rounded-full">
                            Verified Client
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-white/40 flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        {new Date(review.createdAt).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </p>

                      <div className="flex items-center gap-1 mt-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < review.rating
                                ? "text-luxury-gold fill-luxury-gold"
                                : "text-white/10"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-start">
                    <div className="text-3xl font-serif text-white/80">
                      {review.rating.toFixed(1)}
                    </div>
                    <div className="text-[9px] font-black uppercase tracking-widest text-white/20">
                      Rating Score
                    </div>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start relative z-10">
                  <div className="lg:col-span-2 space-y-4">
                    <div className="relative">
                      <Quote className="absolute -left-6 -top-4 w-10 h-10 text-white/3 rotate-180" />
                      <p className="text-white/70 italic leading-relaxed font-light">
                        &quot;{review.comment}&quot;
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-px bg-white/5 border border-white/5 rounded-sm overflow-hidden text-center">
                    <div className="bg-[#1A1A1A] p-3 space-y-1">
                      <div className="text-xs font-black text-luxury-gold">
                        {review.professionalism}
                      </div>
                      <div className="text-[8px] uppercase tracking-widest text-white/40">
                        Prof.
                      </div>
                    </div>
                    <div className="bg-[#1A1A1A] p-3 space-y-1">
                      <div className="text-xs font-black text-luxury-gold">
                        {review.communication}
                      </div>
                      <div className="text-[8px] uppercase tracking-widest text-white/40">
                        Comm.
                      </div>
                    </div>
                    <div className="bg-[#1A1A1A] p-3 space-y-1">
                      <div className="text-xs font-black text-luxury-gold">
                        {review.marketKnowledge}
                      </div>
                      <div className="text-[8px] uppercase tracking-widest text-white/40">
                        Market
                      </div>
                    </div>
                    <div className="bg-[#1A1A1A] p-3 space-y-1">
                      <div className="text-xs font-black text-luxury-gold">
                        {review.helpfulness}
                      </div>
                      <div className="text-[8px] uppercase tracking-widest text-white/40">
                        Help.
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}
