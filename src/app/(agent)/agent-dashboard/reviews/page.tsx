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
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pagination } from "@/components/ui/Pagination";
import { useGetAgentReviewsQuery } from "@/redux/api/reviewApi";
import { useGetMyAgentProfileQuery } from "@/redux/api/agentApi";
import { Review } from "@/types/agent";
import Link from "next/link";

export default function AgentReviewsPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Get agent profile to get the correct agent ID
  const { data: agentData } = useGetMyAgentProfileQuery(undefined);
  const agent = agentData?.data;
  
  // Debug: Log the actual data structure
  console.log("Agent Data Response:", agentData);
  console.log("Extracted Agent:", agent);
  
  const agentId = agent?._id || agent?._id || user?.id;
  console.log("Final Agent ID:", agentId);

  const { data: reviewsData, isLoading, error } = useGetAgentReviewsQuery({
    agentId,
    page,
    limit,
    searchTerm,
    rating: ratingFilter !== "all" ? ratingFilter : undefined,
    sortBy,
    sortOrder
  });

  const reviews = reviewsData?.data || [];
  const pagination = reviewsData?.meta ?? { total: 0, page: 1, limit, totalPages: 0 };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-600";
    if (rating >= 3.5) return "text-yellow-600";
    if (rating >= 2.5) return "text-orange-600";
    return "text-red-600";
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc: number, review: Review) => acc + review.rating, 0);
    return sum / reviews.length;
  };

  const calculateAverageScores = () => {
    if (reviews.length === 0) return { professionalism: 0, communication: 0, marketKnowledge: 0, helpfulness: 0 };
    
    const totals = reviews.reduce((acc: { professionalism: number; communication: number; marketKnowledge: number; helpfulness: number }, review: Review) => ({
      professionalism: acc.professionalism + review.professionalism,
      communication: acc.communication + review.communication,
      marketKnowledge: acc.marketKnowledge + review.marketKnowledge,
      helpfulness: acc.helpfulness + review.helpfulness,
    }), { professionalism: 0, communication: 0, marketKnowledge: 0, helpfulness: 0 });

    return {
      professionalism: totals.professionalism / reviews.length,
      communication: totals.communication / reviews.length,
      marketKnowledge: totals.marketKnowledge / reviews.length,
      helpfulness: totals.helpfulness / reviews.length,
    };
  };

  if (authLoading || isLoading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-96"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-3xl"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="p-6 rounded-3xl bg-red-50 border border-red-200">
        <h2 className="text-xl font-bold text-red-800 mb-2">Authentication Required</h2>
        <p className="text-red-600">Please log in to access your agent reviews.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-3xl bg-red-50 border border-red-200">
        <h2 className="text-xl font-bold text-red-800 mb-2">Error Loading Reviews</h2>
        <p className="text-red-600">Failed to load reviews. Please try again later.</p>
      </div>
    );
  }

  const averageRating = calculateAverageRating();
  const averageScores = calculateAverageScores();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl lg:text-4xl font-heading font-bold text-foreground"
          >
            Client Reviews
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground mt-2 text-lg"
          >
            Monitor your client feedback and professional performance.
          </motion.p>
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Link href="/agent-dashboard">
            <Button variant="outline" className="rounded-2xl h-12 px-6 font-semibold">
              Back to Dashboard
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <Card className="rounded-2xl border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reviews.length}</div>
            <p className="text-xs text-muted-foreground">All time reviews</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1">
              <span className="text-2xl font-bold">{averageRating.toFixed(1)}</span>
              <Star className={`h-5 w-5 ${getRatingColor(averageRating)}`} fill="currentColor" />
            </div>
            <p className="text-xs text-muted-foreground">Out of 5 stars</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">5-Star Reviews</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reviews.filter((r: Review) => r.rating === 5).length}</div>
            <p className="text-xs text-muted-foreground">Perfect ratings</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">95%</div>
            <p className="text-xs text-muted-foreground">Average response time</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Performance Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <Card className="rounded-3xl border-border shadow-sm">
          <CardHeader>
            <CardTitle>Performance Breakdown</CardTitle>
            <CardDescription>Average scores across all reviews</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Professionalism</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-muted rounded-full h-2">
                    <div 
                      className="h-2 bg-blue-500 rounded-full" 
                      style={{ width: `${(averageScores.professionalism / 5) * 100}%` }}
                    />
                  </div>
                  <span className="font-semibold">{averageScores.professionalism.toFixed(1)}/5</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Communication</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-muted rounded-full h-2">
                    <div 
                      className="h-2 bg-green-500 rounded-full" 
                      style={{ width: `${(averageScores.communication / 5) * 100}%` }}
                    />
                  </div>
                  <span className="font-semibold">{averageScores.communication.toFixed(1)}/5</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Market Knowledge</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-muted rounded-full h-2">
                    <div 
                      className="h-2 bg-purple-500 rounded-full" 
                      style={{ width: `${(averageScores.marketKnowledge / 5) * 100}%` }}
                    />
                  </div>
                  <span className="font-semibold">{averageScores.marketKnowledge.toFixed(1)}/5</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Helpfulness</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-muted rounded-full h-2">
                    <div 
                      className="h-2 bg-orange-500 rounded-full" 
                      style={{ width: `${(averageScores.helpfulness / 5) * 100}%` }}
                    />
                  </div>
                  <span className="font-semibold">{averageScores.helpfulness.toFixed(1)}/5</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-border shadow-sm">
          <CardHeader>
            <CardTitle>Rating Distribution</CardTitle>
            <CardDescription>Breakdown of review ratings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = reviews.filter((r: Review) => r.rating === rating).length;
                const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                return (
                  <div key={rating} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-16">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{rating} Star{rating !== 1 ? 's' : ''}</span>
                        <span className="text-sm text-muted-foreground">{count} reviews</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="h-2 bg-yellow-500 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card/40 backdrop-blur-md p-5 rounded-3xl border border-border/50 shadow-sm"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
            <Input
              placeholder="Search reviews by client name or comment..."
              className="pl-12 h-14 rounded-2xl bg-muted/30 border-none focus:ring-2 focus:ring-purple-500/20 transition-all text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={ratingFilter} onValueChange={(val) => setRatingFilter(val ?? "all")}>
            <SelectTrigger className="h-14 rounded-2xl bg-muted/30 border-none px-6 font-semibold">
              <SelectValue placeholder="All Ratings" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-none shadow-2xl">
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="4">4 Stars</SelectItem>
              <SelectItem value="3">3 Stars</SelectItem>
              <SelectItem value="2">2 Stars</SelectItem>
              <SelectItem value="1">1 Star</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={(val) => setSortBy(val ?? "createdAt")}>
            <SelectTrigger className="h-14 rounded-2xl bg-muted/30 border-none px-6 font-semibold">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-none shadow-2xl">
              <SelectItem value="createdAt">Date</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="buyer.name">Client Name</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortOrder} onValueChange={(val) => setSortOrder(val ?? "desc")}>
            <SelectTrigger className="h-14 rounded-2xl bg-muted/30 border-none px-6 font-semibold">
              <SelectValue placeholder="Order" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-none shadow-2xl">
              <SelectItem value="desc">Newest First</SelectItem>
              <SelectItem value="asc">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Reviews List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="rounded-3xl border-border shadow-sm">
          <CardHeader>
            <CardTitle>Client Reviews</CardTitle>
            <CardDescription>What your clients are saying about your services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {reviews.length === 0 ? (
                <div className="text-center py-24 bg-muted/10 rounded-[3rem] border border-dashed border-border">
                  <div className="w-28 h-28 bg-muted rounded-full flex items-center justify-center mx-auto mb-6 text-muted-foreground/20">
                    <Star className="w-12 h-12" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">
                    No Reviews Yet
                  </h3>
                  <p className="text-muted-foreground mb-10 max-w-sm mx-auto leading-relaxed">
                    Your client reviews will appear here once clients start sharing their feedback about your services.
                  </p>
                </div>
              ) : (
                reviews.map((review: Review, index: number) => (
                  <motion.div
                    key={review._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border rounded-2xl p-6 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={review.buyer.avatar} alt={review.buyer.name} />
                          <AvatarFallback className="text-lg font-bold">
                            {review.buyer.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-bold text-lg text-foreground">{review.buyer.name}</h4>
                          <p className="text-sm text-muted-foreground">{review.buyer.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-5 w-5 ${
                                i < review.rating
                                  ? 'text-yellow-500 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                          <span className="ml-2 text-xl font-bold">{review.rating}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    {review.comment && (
                      <div className="mb-6">
                        <p className="text-muted-foreground leading-relaxed">{review.comment}</p>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center p-3 bg-muted/50 rounded-xl">
                        <div className="font-bold text-lg">{review.professionalism}</div>
                        <div className="text-xs text-muted-foreground">Professionalism</div>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-xl">
                        <div className="font-bold text-lg">{review.communication}</div>
                        <div className="text-xs text-muted-foreground">Communication</div>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-xl">
                        <div className="font-bold text-lg">{review.marketKnowledge}</div>
                        <div className="text-xs text-muted-foreground">Market Knowledge</div>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-xl">
                        <div className="font-bold text-lg">{review.helpfulness}</div>
                        <div className="text-xs text-muted-foreground">Helpfulness</div>
                      </div>
                    </div>

                    {review.propertyId && (
                      <div className="pt-4 border-t">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>Property review</span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </motion.div>
      )}
    </div>
  );
}
