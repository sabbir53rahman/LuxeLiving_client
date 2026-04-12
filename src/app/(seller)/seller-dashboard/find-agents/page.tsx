"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { 
  Search,
  Star,
  Phone,
  Mail,
  Building,
  Users,
  DollarSign,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent,  CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pagination } from "@/components/ui/Pagination";
import { useGetAgentsQuery } from "@/redux/api/agentApi";
import { useRequestAgentMutation } from "@/redux/api/sellerApi";
import { useGetMySellerPropertiesQuery } from "@/redux/api/sellerApi";
import { Agent, Property } from "@/types/agent";
import Link from "next/link";

export default function FindAgentsPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [sortBy, setSortBy] = useState("averageRating");
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [selectedProperty, setSelectedProperty] = useState("");
  const [commissionRate, setCommissionRate] = useState("3");
  const [message, setMessage] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: agentsData, isLoading: agentsLoading } = useGetAgentsQuery({
    searchTerm: searchTerm || undefined,
    specialization: specializationFilter !== "all" ? specializationFilter : undefined,
    minRating: ratingFilter !== "all" ? parseFloat(ratingFilter) : undefined,
    sortBy,
    sortOrder: "desc",
    page,
    limit,
  });

  const { data: propertiesData } = useGetMySellerPropertiesQuery({ limit: 100 });
  const [requestAgent, { isLoading: requestLoading }] = useRequestAgentMutation();

  const agents = agentsData?.data || [];
  const properties = propertiesData?.data || [];
  const pagination = agentsData?.meta ?? { total: 0, page: 1, limit: 12, totalPages: 0 };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRequestAgent = async () => {
    if (!selectedAgent || !selectedProperty || !message.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await requestAgent({
        agentId: selectedAgent._id,
        propertyId: selectedProperty,
        commissionRate: parseFloat(commissionRate),
        message: message.trim()
      }).unwrap();
      
      toast.success("Agent request sent successfully!");
      setIsDialogOpen(false);
      setSelectedAgent(null);
      setSelectedProperty("");
      setCommissionRate("3");
      setMessage("");
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'data' in error 
        ? (error as { data?: { message?: string } }).data?.message 
        : "Failed to send agent request";
      toast.error(errorMessage);
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-600";
    if (rating >= 3.5) return "text-yellow-600";
    if (rating >= 2.5) return "text-orange-600";
    return "text-red-600";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (authLoading || agentsLoading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-96"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-64 bg-gray-200 rounded-3xl"></div>
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
        <p className="text-red-600">Please log in to access agent discovery.</p>
      </div>
    );
  }

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
            Find Agents
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground mt-2 text-lg"
          >
            Discover and collaborate with expert real estate agents.
          </motion.p>
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Link href="/seller-dashboard">
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
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Card className="rounded-2xl border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Agents</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agents.length}</div>
            <p className="text-xs text-muted-foreground">Ready to collaborate</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Properties</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{properties.length}</div>
            <p className="text-xs text-muted-foreground">Available for assignment</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Commission</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3%</div>
            <p className="text-xs text-muted-foreground">Standard rate</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card/40 backdrop-blur-md p-5 rounded-3xl border border-border/50 shadow-sm"
      >
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
            <Input
              placeholder="Search agents by name or specialization..."
              className="pl-12 h-14 rounded-2xl bg-muted/30 border-none focus:ring-2 focus:ring-purple-500/20 transition-all text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={specializationFilter} onValueChange={(value) => setSpecializationFilter(value || "all")}>
            <SelectTrigger className="h-14 rounded-2xl bg-muted/30 border-none px-6 font-semibold">
              <SelectValue placeholder="Specialization" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-none shadow-2xl">
              <SelectItem value="all">All Specializations</SelectItem>
              <SelectItem value="luxury">Luxury Properties</SelectItem>
              <SelectItem value="residential">Residential</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
              <SelectItem value="investment">Investment</SelectItem>
            </SelectContent>
          </Select>
          <Select value={ratingFilter} onValueChange={(value) => setRatingFilter(value || "all")}>
            <SelectTrigger className="h-14 rounded-2xl bg-muted/30 border-none px-6 font-semibold">
              <SelectValue placeholder="Min Rating" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-none shadow-2xl">
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="4.5">4.5+ Stars</SelectItem>
              <SelectItem value="4.0">4.0+ Stars</SelectItem>
              <SelectItem value="3.5">3.5+ Stars</SelectItem>
              <SelectItem value="3.0">3.0+ Stars</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={(value) => value && setSortBy(value)}>
            <SelectTrigger className="h-14 rounded-2xl bg-muted/30 border-none px-6 font-semibold">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-none shadow-2xl">
              <SelectItem value="averageRating">Rating</SelectItem>
              <SelectItem value="experience">Experience</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="createdAt">Newest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Agents Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {agents.length === 0 ? (
          <Card className="rounded-3xl border-border shadow-sm">
            <CardContent className="text-center py-24">
              <div className="w-28 h-28 bg-muted rounded-full flex items-center justify-center mx-auto mb-6 text-muted-foreground/20">
                <Users className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">No Agents Found</h3>
              <p className="text-muted-foreground mb-10 max-w-sm mx-auto leading-relaxed">
                {searchTerm 
                  ? `No agents match "${searchTerm}". Try different keywords or browse all agents.`
                  : "No agents are currently available for collaboration."
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent: Agent, index: number) => (
              <motion.div
                key={agent._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="rounded-3xl border-border shadow-sm hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={agent.avatar || agent.user?.image} alt={agent.name} />
                          <AvatarFallback className="text-xl font-bold">
                            {agent.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{agent.name}</CardTitle>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Mail className="w-3 h-3" />
                            <span>{agent.email}</span>
                          </div>
                          {agent.contactNumber && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Phone className="w-3 h-3" />
                              <span>{agent.contactNumber}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      {agent.isAvailable && (
                        <Badge className="bg-green-100 text-green-700">
                          Available
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className={`h-4 w-4 ${getRatingColor(agent.averageRating || 0)}`} fill="currentColor" />
                        <span className="font-semibold">{(agent.averageRating || 0).toFixed(1)}</span>
                        <span className="text-sm text-muted-foreground">({agent.totalReviews || 0} reviews)</span>
                      </div>
                      <Badge variant="outline">
                        {agent.experience} years
                      </Badge>
                    </div>

                    {agent.specialization && (
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(agent.specialization) 
                          ? agent.specialization.map((spec: string, i: number) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {spec}
                              </Badge>
                            ))
                          : (
                              <Badge variant="secondary" className="text-xs">
                                {agent.specialization}
                              </Badge>
                            )
                        }
                      </div>
                    )}

                    {agent.bio && (
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {agent.bio}
                      </p>
                    )}

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center p-3 bg-muted/50 rounded-xl">
                        <div className="font-bold text-lg">0</div>
                        <div className="text-xs text-muted-foreground">Properties</div>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-xl">
                        <div className="font-bold text-lg">{agent.commissionRate}%</div>
                        <div className="text-xs text-muted-foreground">Commission</div>
                      </div>
                    </div>

                    <Dialog open={isDialogOpen && selectedAgent?._id === agent._id} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger >
                        <Button 
                          className="w-full rounded-2xl h-12 font-semibold"
                          onClick={() => setSelectedAgent(agent)}
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Request Collaboration
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="rounded-3xl max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Request Agent Collaboration</DialogTitle>
                          <DialogDescription>
                            Send a collaboration request to {selectedAgent?.name || agent.name}
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-6">
                          <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-2xl">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={selectedAgent?.avatar || selectedAgent?.user?.image} alt={selectedAgent?.name || agent.name} />
                              <AvatarFallback>
                                {(selectedAgent?.name || agent.name).charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-semibold">{selectedAgent?.name || agent.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {(selectedAgent?.averageRating || agent.averageRating || 0).toFixed(1)} rating · {selectedAgent?.experience || agent.experience || 0} years experience
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium mb-2 block">Select Property</label>
                              <Select value={selectedProperty} onValueChange={(value) => value && setSelectedProperty(value)}>
                                <SelectTrigger className="h-12 rounded-2xl">
                                  <SelectValue placeholder="Choose property" />
                                </SelectTrigger>
                                <SelectContent>
                                  {properties.map((property: Property) => (
                                    <SelectItem key={property._id} value={property._id}>
                                      {property.title} - {formatCurrency(property.price)}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <label className="text-sm font-medium mb-2 block">Commission Rate (%)</label>
                              <Select value={commissionRate} onValueChange={(value) => value && setCommissionRate(value)}>
                                <SelectTrigger className="h-12 rounded-2xl">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="2">2%</SelectItem>
                                  <SelectItem value="2.5">2.5%</SelectItem>
                                  <SelectItem value="3">3%</SelectItem>
                                  <SelectItem value="3.5">3.5%</SelectItem>
                                  <SelectItem value="4">4%</SelectItem>
                                  <SelectItem value="5">5%</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div>
                            <label className="text-sm font-medium mb-2 block">Message (Optional)</label>
                            <Textarea
                              placeholder="Tell the agent about your property and why you'd like to work with them..."
                              className="min-h-32 rounded-2xl resize-none"
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                            />
                          </div>

                          <div className="flex gap-3 pt-4">
                            <Button
                              variant="outline"
                              onClick={() => setIsDialogOpen(false)}
                              className="flex-1 rounded-2xl h-12"
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={handleRequestAgent}
                              disabled={requestLoading || !selectedProperty}
                              className="flex-1 rounded-2xl h-12"
                            >
                              {requestLoading ? (
                                <>Sending Request...</>
                              ) : (
                                <>
                                  <Send className="w-4 h-4 mr-2" />
                                  Send Request
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
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
