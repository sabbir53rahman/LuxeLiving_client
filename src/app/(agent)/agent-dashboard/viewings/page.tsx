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
  MapPin,
  Phone,
  MessageSquare,
  Bell,
  User,
  Target,
  Activity,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useGetAgentViewingsQuery, useUpdateAgentViewingStatusMutation } from "@/redux/api/agentApi";
import { Viewing } from "@/types/agent";
import Link from "next/link";

// Section Header Component to match agent dashboard design
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

function ViewingCard({
  viewing,
  index,
  handleStatusUpdate,
  setSelectedViewing,
}: {
  viewing: Viewing;
  index: number;
  handleStatusUpdate: (viewingId: string, status: string) => Promise<void>;
  setSelectedViewing: (viewing: Viewing | null) => void;
}) {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "confirmed": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "completed": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "cancelled": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-white/10 text-white/60 border-white/20";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ 
        scale: 1.02, 
        boxShadow: "0 20px 40px rgba(255, 215, 0, 0.1)",
        borderColor: "rgba(255, 215, 0, 0.2)"
      }}
      className="bg-[#1A1A1A] border border-white/5 rounded-sm p-6 overflow-hidden group"
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-luxury-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="flex-1">
          <h4 className="font-bold text-lg text-white mb-2">{viewing.property.title}</h4>
          <div className="flex items-center gap-2 text-white/40 mb-2">
            <MapPin className="h-4 w-4 text-luxury-gold" />
            <span className="text-sm">{viewing.property.address}</span>
          </div>
          <div className="flex items-center gap-2 text-white/40">
            <Calendar className="h-4 w-4 text-luxury-gold" />
            <span className="text-sm">
              {new Date(viewing.scheduledDate).toLocaleDateString()} at {new Date(viewing.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
        <Badge className={`text-xs ${getStatusColor(viewing.status)}`}>
          {viewing.status}
        </Badge>
      </div>
                      
      <div className="flex items-center gap-2 text-sm text-white/40 mb-4">
        <Users className="h-4 w-4 text-luxury-gold" />
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
        <div className="bg-white/10 rounded-sm p-4 text-sm text-white/80 mb-4">
          <div className="flex items-start gap-2">
            <MessageSquare className="h-4 w-4 mt-0.5 shrink-0 text-luxury-gold" />
            <div>
              <strong>Client Notes:</strong> {viewing.notes}
            </div>
          </div>
        </div>
      )}

      {viewing.status === 'confirmed' && (
        <div className="bg-blue-500/20 border border-blue-500/30 rounded-sm p-4 mb-4">
          <p className="text-sm text-blue-400 font-medium">
            This viewing is confirmed. Please arrive on time and provide excellent service to client.
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        {viewing.status === 'pending' && (
          <>
            <Button
              size="sm"
              onClick={() => handleStatusUpdate(viewing._id, 'confirmed')}
              className="bg-green-600 hover:bg-green-700 text-white rounded-sm"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Confirm
            </Button>
            <Button
              size="sm"
              onClick={() => handleStatusUpdate(viewing._id, 'cancelled')}
              className="bg-red-600 hover:bg-red-700 text-white rounded-sm"
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
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-sm"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark Complete
            </Button>
            <Button
              size="sm"
              onClick={() => window.open(`/properties/${viewing.property._id}`, '_blank')}
              className="bg-white/10 hover:bg-white/20 text-white rounded-sm border border-white/10"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Property
            </Button>
          </>
        )}
        
        <Button
          size="sm"
          onClick={() => window.open(`tel:${viewing.buyer.phone}`, '_self')}
          className="bg-white/10 hover:bg-white/20 text-white rounded-sm border border-white/10"
        >
          <Phone className="w-4 h-4 mr-2" />
          Call
        </Button>
      </div>
    </motion.div>
  );
}

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



  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center space-y-6">
        <div className="w-12 h-12 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin" />
        <p className="text-white/40 font-black uppercase tracking-[0.3em] text-[10px]">
          Loading Viewings
        </p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-10">
        <Card className="max-w-md w-full rounded-[2rem] border-white/5 bg-white/5 backdrop-blur-xl overflow-hidden">
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
        <Card className="max-w-md w-full rounded-[2rem] border-white/5 bg-white/5 backdrop-blur-xl overflow-hidden">
          <CardContent className="p-12 text-center space-y-6">
            <div className="w-12 h-12 bg-red-500/20 rounded-2xl mx-auto flex items-center justify-center">
              <Calendar className="w-6 h-6 text-red-500" />
            </div>
            <h2 className="text-2xl font-serif text-white">Error Loading Viewings</h2>
            <p className="text-white/40">
              Failed to load viewings. Please try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-white font-sans selection:bg-luxury-gold selection:text-black pb-20">
      {/* Top Navigation / Header */}
      <header className="px-10 py-12 flex justify-between items-start">
        <div className="space-y-2">
          <h1 className="text-5xl font-serif text-white tracking-tight leading-none">
            Scheduled Viewings
          </h1>
          <p className="text-white/40 text-sm font-medium italic">
            Manage your property viewing appointments and client interactions.
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

      {/* Main Content - Full Width */}
      <div className="px-10 space-y-8">
        {/* I. VIEWING MANAGEMENT */}
        <SectionHeader numeral="I" title="VIEWING MANAGEMENT" />

        <div className="bg-[#1A1A1A] border border-white/5 rounded-sm p-8 relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="grid grid-cols-8 gap-px">
              {[...Array(32)].map((_, i) => (
                <div key={i} className="h-px bg-white/5" />
              ))}
            </div>
          </div>

          <div className="relative z-10">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-luxury-gold rounded-full animate-pulse" />
                <h3 className="text-xl font-serif text-white ml-3">
                  Viewing Schedule
                </h3>
              </div>
              <select className="bg-transparent text-sm text-white/40 border-none outline-none cursor-pointer">
                <option>Last 12 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-luxury-gold" />
              <Activity className="w-4 h-4 text-white/40 ml-2" />
              <Sparkles className="w-4 h-4 text-luxury-gold" />
            </div>
          </div>

          <div className="space-y-4">
            {viewings.length === 0 ? (
              <div className="text-center py-24">
                <div className="w-28 h-28 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-12 h-12 text-luxury-gold" />
                </div>
                <h3 className="text-2xl font-serif text-white mb-3">
                  No Viewings Scheduled
                </h3>
                <p className="text-white/40 mb-8 max-w-sm mx-auto leading-relaxed">
                  Your viewing calendar is empty. Viewings will appear here once clients schedule appointments.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {viewings.map((viewing: Viewing, index: number) => (
                    <ViewingCard key={viewing._id} viewing={viewing} index={index} handleStatusUpdate={handleStatusUpdate} setSelectedViewing={setSelectedViewing} />
                  ))}
                </div>

                {/* Stats Overview */}
                <div className="mt-12 bg-[#1A1A1A] border border-white/5 rounded-sm p-8">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-white/10 rounded-xl mx-auto flex items-center justify-center mb-4">
                        <Calendar className="w-6 h-6 text-luxury-gold" />
                      </div>
                      <div className="text-3xl font-serif text-white font-bold">
                        {viewings.length}
                      </div>
                      <div className="text-xs text-white/40 uppercase tracking-wider">
                        Total Viewings
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-500/20 rounded-xl mx-auto flex items-center justify-center mb-4">
                        <CheckCircle className="w-6 h-6 text-green-400" />
                      </div>
                      <div className="text-3xl font-serif text-white font-bold">
                        {viewings.filter((v: Viewing) => v.status === 'completed').length}
                      </div>
                      <div className="text-xs text-white/40 uppercase tracking-wider">
                        Completed
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-xl mx-auto flex items-center justify-center mb-4">
                        <Target className="w-6 h-6 text-blue-400" />
                      </div>
                      <div className="text-3xl font-serif text-white font-bold">
                        {viewings.filter((v: Viewing) => v.status === 'confirmed').length}
                      </div>
                      <div className="text-xs text-white/40 uppercase tracking-wider">
                        Confirmed
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-purple-500/20 rounded-xl mx-auto flex items-center justify-center mb-4">
                        <Sparkles className="w-6 h-6 text-purple-400" />
                      </div>
                      <div className="text-3xl font-serif text-white font-bold">
                        {viewings.filter((v: Viewing) => v.status === 'pending').length}
                      </div>
                      <div className="text-xs text-white/40 uppercase tracking-wider">
                        Pending
                      </div>
                    </div>
                  </div>
                </div>

                {/* Feedback Section */}
                {selectedViewing && (
                  <div className="mt-8 pt-8 border-t border-white/10">
                    <h5 className="font-semibold text-white mb-4">Add Feedback</h5>
                    <Textarea
                      placeholder="Share your experience with this viewing..."
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      className="bg-[#0A0A0A] border-white/10 text-white placeholder:text-white/40 rounded-sm min-h-24"
                    />
                    <div className="flex gap-3 mt-3">
                      <Button
                        onClick={() => handleFeedbackSubmit(selectedViewing._id)}
                        className="bg-purple-600 hover:bg-purple-700 text-white rounded-sm"
                      >
                        Submit Feedback
                      </Button>
                      <Button
                        onClick={() => setSelectedViewing(null)}
                        className="bg-white/10 hover:bg-white/20 text-white rounded-sm border border-white/10"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <div className="flex justify-center gap-4">
              <Button
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
                className="bg-white/10 hover:bg-white/20 text-white font-black uppercase tracking-wider h-12 px-8 rounded-sm transition-all border border-white/10"
              >
                Previous
              </Button>
              <span className="px-4 py-3 text-sm text-white/40">
                Page {page} of {pagination.totalPages}
              </span>
              <Button
                onClick={() => setPage(page + 1)}
                disabled={page >= pagination.totalPages}
                className="bg-white/10 hover:bg-white/20 text-white font-black uppercase tracking-wider h-12 px-8 rounded-sm transition-all border border-white/10"
              >
                Next
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
