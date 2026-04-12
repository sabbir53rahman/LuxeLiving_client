"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { 
  Building,
  Users,
  DollarSign,
  Star,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Plus,
  X,
  Trash2,
  Search,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pagination } from "@/components/ui/Pagination";
import { useGetMySellerPropertiesQuery } from "@/redux/api/sellerApi";
import { useGetAgentsQuery } from "@/redux/api/agentApi";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useRequestAgentMutation } from "@/redux/api/sellerApi";
import { useRemoveAgentFromPropertyMutation } from "@/redux/api/sellerApi";
import Link from "next/link";
import type { Agent } from "@/types/agent";

interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  status: string;
  assignedAgent?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    rating: number;
    experience: number;
    commissionRate: number;
    assignedAt: string;
  };
}

export default function PropertyAgentsPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [commissionRate, setCommissionRate] = useState("3");
  const [message, setMessage] = useState("");
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  const { data: propertiesData, isLoading: propertiesLoading, refetch: refetchProperties } = useGetMySellerPropertiesQuery({
    page,
    limit,
    searchTerm,
    status: statusFilter !== "all" ? statusFilter : undefined
  });

  const { data: agentsData } = useGetAgentsQuery({ limit: 100 });
  const [requestAgent, { isLoading: requestLoading }] = useRequestAgentMutation();
  const [removeAgentFromProperty, { isLoading: removeLoading }] = useRemoveAgentFromPropertyMutation();

  const properties = propertiesData?.data || [];
  const agents: Agent[] = agentsData?.data || [];
  const pagination = propertiesData?.meta ?? { total: 0, page: 1, limit, totalPages: 0 };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleAssignAgent = async () => {
    if (!selectedProperty || !selectedAgent || !message.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await requestAgent({
        agentId: selectedAgent._id,
        propertyId: selectedProperty.id,
        commissionRate: parseFloat(commissionRate),
        message: message.trim()
      }).unwrap();
      
      toast.success("Agent assigned successfully!");
      setIsAssignDialogOpen(false);
      setSelectedProperty(null);
      setSelectedAgent(null);
      setCommissionRate("3");
      setMessage("");
      refetchProperties(); // Refresh properties to show new assignment
    } catch (error) {
      const fetchError = error as FetchBaseQueryError;
      const errorMessage = fetchError?.data as { message?: string };
      toast.error(errorMessage?.message || "Failed to assign agent");
    }
  };

  const handleRemoveAgent = async (propertyId: string) => {
    try {
      await removeAgentFromProperty(propertyId).unwrap();
      toast.success("Agent removed from property successfully!");
      refetchProperties(); // Refresh properties to show removal
    } catch (error) {
      const fetchError = error as FetchBaseQueryError;
      const errorMessage = fetchError?.data as { message?: string };
      toast.error(errorMessage?.message || "Failed to remove agent");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "sold": return "bg-blue-100 text-blue-800";
      case "inactive": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (authLoading || propertiesLoading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-96"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-96 bg-gray-200 rounded-3xl"></div>
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
        <p className="text-red-600">Please log in to manage property agents.</p>
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
            Property Agents
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground mt-2 text-lg"
          >
            Manage agent assignments for your properties.
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
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <Card className="rounded-2xl border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{properties.length}</div>
            <p className="text-xs text-muted-foreground">Your listings</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned Agents</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {properties.filter((p: Property) => p.assignedAgent).length}
            </div>
            <p className="text-xs text-muted-foreground">Active collaborations</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unassigned</CardTitle>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {properties.filter((p: Property) => !p.assignedAgent).length}
            </div>
            <p className="text-xs text-muted-foreground">Need agents</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Agents</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agents.length}</div>
            <p className="text-xs text-muted-foreground">Ready to work</p>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
            <Input
              placeholder="Search properties..."
              className="pl-12 h-14 rounded-2xl bg-muted/30 border-none focus:ring-2 focus:ring-purple-500/20 transition-all text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value || "all")}>
            <SelectTrigger className="h-14 rounded-2xl bg-muted/30 border-none px-6 font-semibold">
              <SelectValue placeholder="Property Status" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-none shadow-2xl">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="sold">Sold</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{pagination.total} properties found</span>
            <button className="hover:text-foreground transition-colors">
              <Filter className="w-4 h-4 mr-1" />
              Clear Filters
            </button>
          </div>
        </div>
      </motion.div>

      {/* Properties Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {properties.length === 0 ? (
          <Card className="rounded-3xl border-border shadow-sm">
            <CardContent className="text-center py-24">
              <div className="w-28 h-28 bg-muted rounded-full flex items-center justify-center mx-auto mb-6 text-muted-foreground/20">
                <Building className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">No Properties Found</h3>
              <p className="text-muted-foreground mb-10 max-w-sm mx-auto leading-relaxed">
                {searchTerm 
                  ? `No properties match "${searchTerm}". Try different keywords or browse all properties.`
                  : "You haven't listed any properties yet."
                }
              </p>
              <Link href="/seller-dashboard/properties/new">
                <Button className="rounded-2xl h-12 px-6 font-semibold">
                  <Plus className="w-4 h-4 mr-2" />
                  List Your First Property
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {properties.map((property: Property, index: number) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="rounded-3xl border-border shadow-sm hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{property.title}</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <MapPin className="w-4 h-4" />
                          <span>{property.location}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-bold text-foreground">
                            {formatCurrency(property.price)}
                          </span>
                          <Badge className={getStatusColor(property.status)}>
                            {property.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {property.assignedAgent ? (
                      // Assigned Agent Section
                      <div className="p-4 bg-muted/30 rounded-2xl border border-border/50">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-foreground">Assigned Agent</h4>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveAgent(property.id)}
                            disabled={removeLoading}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl"
                          >
                            {removeLoading ? (
                              <Trash2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <X className="w-3 h-3" />
                            )}
                          </Button>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={property.assignedAgent.avatar} alt={property.assignedAgent.name} />
                            <AvatarFallback>
                              {property.assignedAgent.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h5 className="font-medium text-foreground">{property.assignedAgent.name}</h5>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Star className="w-3 h-3 text-yellow-500" fill="currentColor" />
                              <span>{property.assignedAgent.rating.toFixed(1)}</span>
                              <span>·</span>
                              <span>{property.assignedAgent.experience} years</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Mail className="w-3 h-3" />
                              <span className="truncate">{property.assignedAgent.email}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 mt-4">
                          <div className="text-center p-2 bg-background rounded-xl">
                            <div className="font-bold text-sm">{property.assignedAgent.commissionRate}%</div>
                            <div className="text-xs text-muted-foreground">Commission</div>
                          </div>
                          <div className="text-center p-2 bg-background rounded-xl">
                            <div className="font-bold text-sm">
                              {formatCurrency(property.price * (property.assignedAgent.commissionRate / 100))}
                            </div>
                            <div className="text-xs text-muted-foreground">Potential</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-3">
                          <Calendar className="w-3 h-3" />
                          <span>Assigned on {new Date(property.assignedAgent.assignedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ) : (
                      // No Agent Assigned Section
                      <div className="p-4 bg-muted/30 rounded-2xl border border-dashed border-border/50">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground/30">
                            <Users className="w-6 h-6" />
                          </div>
                          <h4 className="font-semibold text-foreground mb-2">No Agent Assigned</h4>
                          <p className="text-sm text-muted-foreground mb-4">
                            Assign an agent to help manage viewings and sell this property faster.
                          </p>
                          
                          <Dialog open={isAssignDialogOpen && selectedProperty?.id === property.id} onOpenChange={setIsAssignDialogOpen}>
                            <DialogTrigger >
                              <Button 
                                className="w-full rounded-2xl h-12 font-semibold"
                                onClick={() => setSelectedProperty(property)}
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Assign Agent
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="rounded-3xl max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Assign Agent to Property</DialogTitle>
                                <DialogDescription>
                                  Choose an agent to manage {selectedProperty?.title || property.title}
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="space-y-6">
                                <div className="p-4 bg-muted/30 rounded-2xl">
                                  <h4 className="font-medium mb-2">Property Details</h4>
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="font-semibold">{selectedProperty?.title || property.title}</p>
                                      <p className="text-sm text-muted-foreground">{selectedProperty?.location || property.location}</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-bold text-lg">{formatCurrency(selectedProperty?.price || property.price)}</p>
                                      <Badge className={getStatusColor(selectedProperty?.status || property.status)}>
                                        {selectedProperty?.status || property.status}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <label className="text-sm font-medium mb-2 block">Select Agent</label>
                                  <Select value={selectedAgent?._id || ""} onValueChange={(agentId) => {
                                    const agent = agents.find(a => a._id === agentId);
                                    setSelectedAgent(agent || null);
                                  }}>
                                    <SelectTrigger className="h-12 rounded-2xl">
                                      <SelectValue placeholder="Choose an agent" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {agents.map((agent: Agent) => (
                                        <SelectItem key={agent._id} value={agent._id}>
                                          <div className="flex items-center gap-2">
                                            <Avatar className="h-6 w-6">
                                              <AvatarImage src={agent.avatar} alt={agent.name} />
                                              <AvatarFallback className="text-xs">
                                                {agent.name.charAt(0).toUpperCase()}
                                              </AvatarFallback>
                                            </Avatar>
                                            <div className="text-left">
                                              <div className="font-medium">{agent.name}</div>
                                              <div className="text-xs text-muted-foreground">
                                                {agent.averageRating?.toFixed(1)} rating · {agent.experience} years
                                              </div>
                                            </div>
                                          </div>
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium mb-2 block">Commission Rate (%)</label>
                                    <Select value={commissionRate} onValueChange={(value) => setCommissionRate(value || "3")}>
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
                                  <div>
                                    <label className="text-sm font-medium mb-2 block">Potential Commission</label>
                                    <div className="h-12 px-4 bg-muted/30 rounded-2xl flex items-center font-bold">
                                      {selectedAgent && commissionRate 
                                        ? formatCurrency((selectedProperty?.price || property.price) * (parseFloat(commissionRate) / 100))
                                        : "$0"
                                      }
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <label className="text-sm font-medium mb-2 block">Message (Optional)</label>
                                  <textarea
                                    placeholder="Tell the agent about your property and what you're looking for..."
                                    className="w-full min-h-24 p-3 bg-muted/30 rounded-2xl resize-none border-none focus:ring-2 focus:ring-purple-500/20"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                  />
                                </div>

                                <div className="flex gap-3 pt-4">
                                  <Button
                                    variant="outline"
                                    onClick={() => setIsAssignDialogOpen(false)}
                                    className="flex-1 rounded-2xl h-12"
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    onClick={handleAssignAgent}
                                    disabled={requestLoading || !selectedAgent}
                                    className="flex-1 rounded-2xl h-12"
                                  >
                                    {requestLoading ? (
                                      <>Assigning...</>
                                    ) : (
                                      <>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Assign Agent
                                      </>
                                    )}
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    )}
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
