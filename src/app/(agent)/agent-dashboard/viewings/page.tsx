"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { 
  Calendar, 
  Users, 
  CheckCircle,
  AlertCircle,
  Eye,
  Search,
  MapPin,
  Phone,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Pagination } from "@/components/ui/Pagination";
import { useGetAgentViewingsQuery, useUpdateAgentViewingStatusMutation } from "@/redux/api/agentApi";
import { Viewing } from "@/types/agent";
import Link from "next/link";

export default function AgentViewingsPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("scheduledDate");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [selectedViewing, setSelectedViewing] = useState<Viewing | null>(null);
  const [feedbackText, setFeedbackText] = useState("");

  const { data: viewingsData, isLoading, error } = useGetAgentViewingsQuery({ 
    page, 
    limit,
    searchTerm,
    status: statusFilter !== "all" ? statusFilter : undefined,
    sortBy,
    sortOrder
  });
  
  const [updateAgentViewingStatus] = useUpdateAgentViewingStatusMutation();

  const viewings = viewingsData?.data || [];
  const pagination = viewingsData?.meta ?? { total: 0, page: 1, limit, totalPages: 0 };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleStatusUpdate = async (viewingId: string, status: string) => {
    try {
      await updateAgentViewingStatus({ viewingId, status }).unwrap();
      toast.success(`Viewing ${status} successfully!`);
    } catch (error: unknown) {
      console.error("Failed to update viewing status:", error);
      const errorMessage = (error as { data?: { message?: string } })?.data?.message || "Failed to update viewing status.";
      toast.error(errorMessage);
    }
  };

  const handleFeedbackSubmit = async (viewingId: string) => {
    if (!feedbackText.trim()) {
      toast.error("Please provide feedback before submitting.");
      return;
    }

    try {
      await updateAgentViewingStatus({ 
        viewingId, 
        status: "completed", 
        data: { feedback: feedbackText } 
      }).unwrap();
      toast.success("Feedback submitted successfully!");
      setSelectedViewing(null);
      setFeedbackText("");
    } catch (error: unknown) {
      console.error("Failed to submit feedback:", error);
      const errorMessage = (error as { data?: { message?: string } })?.data?.message || "Failed to submit feedback.";
      toast.error(errorMessage);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "confirmed": return "bg-blue-100 text-blue-700 border-blue-200";
      case "completed": return "bg-green-100 text-green-700 border-green-200";
      case "cancelled": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-96"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
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
        <p className="text-red-600">Please log in to access your agent viewings.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-3xl bg-red-50 border border-red-200">
        <h2 className="text-xl font-bold text-red-800 mb-2">Error Loading Viewings</h2>
        <p className="text-red-600">Failed to load viewings. Please try again later.</p>
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
            My Viewings
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground mt-2 text-lg"
          >
            Manage your property viewing appointments and client interactions.
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

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card/40 backdrop-blur-md p-5 rounded-3xl border border-border/50 shadow-sm"
      >
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
            <Input
              placeholder="Search by property title, buyer name..."
              className="pl-12 h-14 rounded-2xl bg-muted/30 border-none focus:ring-2 focus:ring-purple-500/20 transition-all text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value || "all")}>
            <SelectTrigger className="h-14 rounded-2xl bg-muted/30 border-none px-6 font-semibold">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-none shadow-2xl">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select> 
          <Select value={sortBy} onValueChange={(value) => setSortBy(value || "scheduledDate")}>
            <SelectTrigger className="h-14 rounded-2xl bg-muted/30 border-none px-6 font-semibold">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-none shadow-2xl">
              <SelectItem value="scheduledDate">Date</SelectItem>
              <SelectItem value="property.title">Property</SelectItem>
              <SelectItem value="buyer.name">Buyer</SelectItem>
              <SelectItem value="status">Status</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortOrder} onValueChange={(value) => setSortOrder(value || "desc")}>
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

      {/* Viewings List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="rounded-3xl border-border shadow-sm">
          <CardHeader>
            <CardTitle>Scheduled Viewings</CardTitle>
            <CardDescription>Manage your property viewing appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {viewings.length === 0 ? (
                <div className="text-center py-24 bg-muted/10 rounded-[3rem] border border-dashed border-border">
                  <div className="w-28 h-28 bg-muted rounded-full flex items-center justify-center mx-auto mb-6 text-muted-foreground/20">
                    <Calendar className="w-12 h-12" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">
                    No Viewings Scheduled
                  </h3>
                  <p className="text-muted-foreground mb-10 max-w-sm mx-auto leading-relaxed">
                    Your viewing calendar is empty. Viewings will appear here once clients schedule appointments.
                  </p>
                </div>
              ) : (
                <>
                  {viewings.map((viewing: Viewing, index: number) => (
                    <motion.div
                      key={viewing._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border rounded-2xl p-6 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="font-bold text-lg text-foreground mb-2">{viewing.property.title}</h4>
                          <div className="flex items-center gap-2 text-muted-foreground mb-2">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm">{viewing.property.address}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">
                              {new Date(viewing.scheduledDate).toLocaleDateString()} at {new Date(viewing.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                        <Badge className={getStatusColor(viewing.status)}>
                          {viewing.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <Users className="w-4 h-4" />
                        <span>Buyer: {viewing.buyer.name}</span>
                        <span>•</span>
                        <span>{viewing.buyer.email}</span>
                        {viewing.buyer.phone && (
                          <>
                            <span>•</span>
                            <span>{viewing.buyer.phone}</span>
                          </>
                        )}
                      </div>

                      {viewing.notes && (
                        <div className="bg-muted/50 rounded-2xl p-4 text-sm text-muted-foreground mb-4">
                          <div className="flex items-start gap-2">
                            <MessageSquare className="w-4 h-4 mt-0.5 shrink-0" />
                            <div>
                              <strong>Client Notes:</strong> {viewing.notes}
                            </div>
                          </div>
                        </div>
                      )}

                      {viewing.status === 'confirmed' && (
                        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-4">
                          <p className="text-sm text-blue-700 font-medium">
                            This viewing is confirmed. Please arrive on time and provide excellent service to the client.
                          </p>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-3">
                        {viewing.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleStatusUpdate(viewing._id, 'confirmed')}
                              className="bg-green-600 hover:bg-green-700 text-white rounded-xl"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Confirm
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusUpdate(viewing._id, 'cancelled')}
                              className="text-red-600 hover:bg-red-50 border-red-200 rounded-xl"
                            >
                              <AlertCircle className="w-4 h-4 mr-2" />
                              Cancel
                            </Button>
                          </>
                        )}
                        
                        {viewing.status === 'confirmed' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => setSelectedViewing(viewing)}
                              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Mark Complete
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(`/properties/${viewing.property._id}`, '_blank')}
                              className="rounded-xl"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Property
                            </Button>
                          </>
                        )}
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`tel:${viewing.buyer.phone}`, '_self')}
                          className="rounded-xl"
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          Call
                        </Button>
                      </div>

                      {selectedViewing?._id === viewing._id && (
                        <div className="mt-4 pt-4 border-t">
                          <h5 className="font-semibold text-foreground mb-2">Add Feedback</h5>
                          <Textarea
                            placeholder="Share your experience with this viewing..."
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                            className="rounded-xl min-h-24"
                          />
                          <div className="flex gap-3 mt-3">
                            <Button
                              onClick={() => handleFeedbackSubmit(viewing._id)}
                              className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl"
                            >
                              Submit Feedback
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => setSelectedViewing(null)}
                              className="rounded-xl"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </>
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
          transition={{ delay: 0.3 }}
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
