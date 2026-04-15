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
  ShieldCheck,
  TrendingUp,
  Award,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Pagination } from "@/components/ui/Pagination";
import { useGetAgentsQuery } from "@/redux/api/agentApi";
import { useRequestAgentCollaborationMutation } from "@/redux/api/sellerApi";
import { useGetMySellerPropertiesQuery } from "@/redux/api/sellerApi";
import { Agent, Property } from "@/types/agent";
import Link from "next/link";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

// Section Header Component to match the luxury aesthetic
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

export default function FindAgentsPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [sortBy] = useState("averageRating");
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<string | null>("");
  const [commissionRate, setCommissionRate] = useState("3");
  const [message, setMessage] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: agentsData, isLoading: agentsLoading } = useGetAgentsQuery({
    searchTerm: searchTerm || undefined,
    specialization:
      specializationFilter !== "all" ? specializationFilter : undefined,
    minRating: ratingFilter !== "all" ? parseFloat(ratingFilter) : undefined,
    sortBy,
    sortOrder: "desc",
    page,
    limit,
  });

  const { data: propertiesData } = useGetMySellerPropertiesQuery({
    limit: 100,
  });
  const [requestAgent, { isLoading: requestLoading }] =
    useRequestAgentCollaborationMutation();

  const agents = agentsData?.data || [];
  const properties = propertiesData?.data || [];
  const pagination = agentsData?.meta ?? {
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 0,
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRequestAgent = async () => {
    if (!selectedAgent || !selectedProperty || !message.trim()) {
      toast.error("Please provide the terms of collaboration");
      return;
    }

    const agentId = selectedAgent.id;
    if (!agentId || typeof agentId !== "string") {
      toast.error("Invalid agent selected. Please try again.");
      return;
    }

    try {
      const loadingToast = toast.loading("Establishing partnership...");
      await requestAgent({
        agentId: agentId,
        propertyId: selectedProperty,
        commissionRate: parseFloat(commissionRate),
        message: message.trim(),
      }).unwrap();

      toast.dismiss(loadingToast);
      toast.success("Partnership proposal dispatched.");
      setIsDialogOpen(false);
      setSelectedAgent(null);
      setSelectedProperty("");
      setCommissionRate("3");
      setMessage("");
    } catch (error) {
      toast.dismiss();
      const fetchError = error as FetchBaseQueryError;
      const errorMessage = fetchError?.data as { message?: string };
      toast.error(errorMessage?.message || "Failed to finalize proposal");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (authLoading || agentsLoading) {
    return (
      <div className="min-h-screen bg-[#0E0E0E] flex flex-col items-center justify-center space-y-6">
        <Loader2 className="w-12 h-12 text-luxury-gold animate-spin" />
        <p className="text-white/40 font-black uppercase tracking-[0.3em] text-[10px]">
          Accessing Agent Network
        </p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-[#0E0E0E] flex items-center justify-center p-10">
        <Card className="max-w-md w-full border-white/5 bg-white/5 backdrop-blur-xl overflow-hidden rounded-sm">
          <CardContent className="p-12 text-center space-y-6">
            <ShieldCheck className="w-12 h-12 text-luxury-gold mx-auto" />
            <h2 className="text-2xl font-serif text-white">
              Access Restricted
            </h2>
            <Link href="/login" className="block">
              <Button className="w-full h-12 bg-luxury-gold hover:bg-white text-black font-black uppercase tracking-widest transition-all rounded-sm">
                Identify Yourself
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-white font-sans selection:bg-luxury-gold selection:text-black pb-20">
      {/* Header Area */}
      <header className="px-10 py-12 flex justify-between items-start">
        <div className="space-y-2">
          <h1 className="text-5xl font-serif text-white tracking-tight leading-none">
            Agent Discovery
          </h1>
          <p className="text-white/40 text-sm font-medium italic">
            Curating elite representation for your real estate portfolio.
          </p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right hidden md:block">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/30">
              Network Status
            </p>
            <p className="text-xs font-serif text-luxury-emerald">
              Secured Connection
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-linear-to-br from-white/10 to-transparent p-px">
            <div className="w-full h-full rounded-xl bg-[#1A1A1A] flex items-center justify-center overflow-hidden border border-white/5 text-luxury-gold">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </div>
      </header>

      <div className="px-10 space-y-12">
        {/* I. NETWORK SYNOPSIS */}
        <SectionHeader numeral="I" title="NETWORK SYNOPSIS" />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              label: "AVAILABLE AGENTS",
              value: agents.length,
              icon: Users,
            },
            {
              label: "MY PORTFOLIO",
              value: properties.length,
              icon: Building,
            },
            {
              label: "ELITE REPRESENTATIVES",
              value: agents.filter((a: Agent) => (a.averageRating || 0) >= 4.5)
                .length,
              icon: Award,
            },
            {
              label: "STANDARD COMMISSION",
              value: "3%",
              icon: DollarSign,
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#1A1A1A] border border-white/5 p-8 rounded-sm space-y-4 hover:border-luxury-gold/30 transition-colors"
            >
              <div className="flex justify-between items-start">
                <stat.icon className="w-6 h-6 text-luxury-gold/50" />
                <TrendingUp className="w-4 h-4 text-luxury-emerald opacity-50" />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 leading-none mb-2">
                  {stat.label}
                </p>
                <p className="text-4xl font-serif text-white">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* II. FILTRATION ENGINE */}
        <SectionHeader numeral="II" title="FILTRATION ENGINE" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
          <div className="lg:col-span-5 space-y-3">
            <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-1">
              Agent Search
            </Label>
            <div className="relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
              <Input
                placeholder="Search by Name or Specialization..."
                className="h-16 bg-[#1A1A1A] border-white/5 text-white font-medium pl-14 pr-8 rounded-sm focus-visible:ring-luxury-gold transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="lg:col-span-3 space-y-3">
            <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-1">
              Specialization
            </Label>
            <Select
              value={specializationFilter}
              onValueChange={(value) => setSpecializationFilter(value || "all")}
            >
              <SelectTrigger className="h-16 bg-[#1A1A1A] border-white/5 text-white font-medium px-8 rounded-sm focus:ring-luxury-gold">
                <SelectValue placeholder="All Areas" />
              </SelectTrigger>
              <SelectContent className="bg-[#1A1A1A] border-white/10 text-white">
                <SelectItem value="all">All Areas</SelectItem>
                <SelectItem value="luxury">Luxury Properties</SelectItem>
                <SelectItem value="residential">Residential</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="investment">Investment</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="lg:col-span-2 space-y-3">
            <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-1">
              Performance Rating
            </Label>
            <Select
              value={ratingFilter}
              onValueChange={(value) => setRatingFilter(value || "all")}
            >
              <SelectTrigger className="h-16 bg-[#1A1A1A] border-white/5 text-white font-medium px-8 rounded-sm focus:ring-luxury-gold">
                <SelectValue placeholder="All Ratings" />
              </SelectTrigger>
              <SelectContent className="bg-[#1A1A1A] border-white/10 text-white">
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="4.5">4.5+ Stars</SelectItem>
                <SelectItem value="4.0">4.0+ Stars</SelectItem>
                <SelectItem value="3.5">3.5+ Stars</SelectItem>
                <SelectItem value="3.0">3.0+ Stars</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="lg:col-span-2 h-16 flex items-center justify-end px-4 border border-dashed border-white/10 rounded-sm">
            <p className="text-[9px] font-black uppercase tracking-widest text-white/20">
              {pagination.total} ENTRIES FOUND
            </p>
          </div>
        </div>

        {/* III. ELITE REPRESENTATIVES */}
        <SectionHeader numeral="III" title="ELITE REPRESENTATIVES" />

        {agents.length === 0 ? (
          <div className="h-100 border border-dashed border-white/10 rounded-sm flex flex-col items-center justify-center space-y-6 bg-white/5">
            <Users className="w-12 h-12 text-white/10" />
            <p className="font-serif text-xl text-white/40">
              No representatives available in the network.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {agents.map((agent: Agent, index: number) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-[#1A1A1A] border-white/5 rounded-sm overflow-hidden hover:border-luxury-gold/40 transition-all duration-500 group">
                  <div className="p-8 space-y-6">
                    {/* Agent Header */}
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16 border border-white/10 p-1">
                          <AvatarImage
                            src={agent.avatar || agent.user?.image}
                            alt={agent.name}
                            className="rounded-none object-cover"
                          />
                          <AvatarFallback className="bg-white/10 text-luxury-gold font-serif">
                            {agent.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-serif text-xl text-white">
                              {agent.name}
                            </h3>
                            <div className="flex items-center gap-1 bg-luxury-gold/10 px-2 py-0.5 rounded-full">
                              <Star
                                className="w-2.5 h-2.5 text-luxury-gold"
                                fill="currentColor"
                              />
                              <span className="text-[10px] font-black text-luxury-gold">
                                {(agent.averageRating || 0).toFixed(1)}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-white/30 font-bold uppercase tracking-widest">
                            <Mail className="w-3 h-3 text-luxury-gold/50" />
                            {agent.email}
                          </div>
                          {agent.contactNumber && (
                            <div className="flex items-center gap-2 text-[10px] text-white/30 font-bold uppercase tracking-widest">
                              <Phone className="w-3 h-3 text-luxury-gold/50" />
                              {agent.contactNumber}
                            </div>
                          )}
                        </div>
                      </div>
                      {agent.isAvailable && (
                        <Badge className="bg-luxury-emerald/10 text-luxury-emerald border-none font-black text-[9px] tracking-widest rounded-none px-2 uppercase">
                          Available
                        </Badge>
                      )}
                    </div>

                    {/* Agent Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border border-white/5 p-3 rounded-none">
                        <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">
                          Experience
                        </p>
                        <p className="text-lg font-serif text-white">
                          {agent.experience} Years
                        </p>
                      </div>
                      <div className="border border-white/5 p-3 rounded-none">
                        <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">
                          Commission
                        </p>
                        <p className="text-lg font-serif text-white">
                          {agent.commissionRate || 0}%
                        </p>
                      </div>
                    </div>

                    {/* Specialization */}
                    {agent.specialization && (
                      <div className="space-y-2">
                        <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">
                          Areas of Expertise
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {Array.isArray(agent.specialization) ? (
                            agent.specialization.map(
                              (spec: string, i: number) => (
                                <Badge
                                  key={i}
                                  className="bg-white/5 text-white/50 border-none font-black text-[9px] tracking-widest rounded-none px-2 uppercase"
                                >
                                  {spec}
                                </Badge>
                              ),
                            )
                          ) : (
                            <Badge className="bg-white/5 text-white/50 border-none font-black text-[9px] tracking-widest rounded-none px-2 uppercase">
                              {agent.specialization}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Bio */}
                    {agent.bio && (
                      <div className="space-y-2">
                        <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">
                          Profile Statement
                        </p>
                        <p className="text-sm text-white/40 line-clamp-3">
                          {agent.bio}
                        </p>
                      </div>
                    )}

                    {/* Action Button */}
                    <Button
                      className="w-full bg-white text-black hover:bg-luxury-gold transition-all font-black text-[10px] tracking-widest uppercase h-12 px-6 rounded-none"
                      onClick={() => {
                        setSelectedAgent(agent);
                        setCommissionRate(
                          agent.commissionRate?.toString() || "3",
                        );
                        setIsDialogOpen(true);
                      }}
                    >
                      Initiate Partnership
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* IV. PARTNERSHIP PROPOSAL DIALOG */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-[#0E0E0E] border-white/10 text-white rounded-none w-[95vw] sm:max-w-7xl max-h-[95vh] overflow-y-auto p-0">
            {selectedAgent && (
              <div className="p-4 sm:p-6 md:p-10 lg:p-16 space-y-8 sm:space-y-10 md:space-y-12">
                <div className="space-y-3 text-center">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-luxury-gold leading-tight">
                    Partnership Proposal
                  </h2>
                  <p className="text-[9px] sm:text-[10px] font-black text-white/30 uppercase tracking-[0.3em] sm:tracking-[0.4em]">
                    Establishing Professional Alliance
                  </p>
                </div>

                <div className="space-y-8 sm:space-y-10">
                  {/* Agent Summary - Responsive Layout */}
                  <div className="bg-[#1A1A1A] p-4 sm:p-6 border-l-2 border-luxury-gold">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4">
                      <Avatar className="h-16 w-16 sm:h-12 sm:w-12 border border-white/10 p-1">
                        <AvatarImage
                          src={
                            selectedAgent?.avatar || selectedAgent?.user?.image
                          }
                          alt={selectedAgent?.name}
                          className="rounded-none object-cover"
                        />
                        <AvatarFallback className="bg-white/10 text-luxury-gold font-serif">
                          {selectedAgent?.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <h4 className="font-serif text-xl sm:text-2xl text-white">
                          {selectedAgent?.name}
                        </h4>
                        <p className="text-[10px] uppercase text-white/40 tracking-widest">
                          {(selectedAgent?.averageRating || 0).toFixed(1)}{" "}
                          Rating · {selectedAgent?.experience || 0} Years
                          Experience
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Select Property */}
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-1">
                      Select Portfolio Asset
                    </Label>
                    <Select
                      value={selectedProperty || ""}
                      onValueChange={setSelectedProperty}
                    >
                      <SelectTrigger className="h-16 bg-[#1A1A1A] border-white/5 text-white font-medium px-8 rounded-none focus:ring-luxury-gold">
                        <SelectValue placeholder="Choose property" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1A1A1A] border-white/10 text-white font-sans">
                        {properties.map((property: Property) => (
                          <SelectItem
                            key={
                              property._id || (property as { id?: string }).id
                            }
                            value={
                              property._id || (property as { id?: string }).id
                            }
                            className="focus:bg-white/5"
                          >
                            <div className="flex items-center justify-between w-full">
                              <span>{property.title}</span>
                              <span className="text-luxury-gold font-serif">
                                {formatCurrency(property.price)}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-1">
                        Commission Premium (%)
                      </Label>
                      <Select
                        value={commissionRate}
                        onValueChange={(value) =>
                          setCommissionRate(value || "3")
                        }
                      >
                        <SelectTrigger className="h-16 bg-[#1A1A1A] border-white/5 text-white font-medium px-8 rounded-none focus:ring-luxury-gold">
                          <SelectValue placeholder="Select commission rate" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1A1A1A] border-white/10 text-white">
                          {[
                            "2",
                            "2.5",
                            "3",
                            "3.5",
                            "4",
                            "5",
                            selectedAgent?.commissionRate?.toString(),
                          ]
                            .filter(Boolean)
                            .filter((v, i, a) => a.indexOf(v) === i) // Unique values
                            .sort((a, b) => parseFloat(a!) - parseFloat(b!))
                            .map((v) => (
                              <SelectItem key={v} value={v!}>
                                {v}%{" "}
                                {v === selectedAgent?.commissionRate?.toString()
                                  ? "(Agent's Rate)"
                                  : ""}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-1">
                        Potential Payout
                      </Label>
                      <div className="h-16 px-8 bg-[#1A1A1A] border border-white/5 rounded-none flex items-center font-serif text-xl text-luxury-gold">
                        {selectedAgent && commissionRate && selectedProperty
                          ? formatCurrency(
                              (properties.find(
                                (p: Property) =>
                                  p._id === selectedProperty ||
                                  (p as { id?: string }).id ===
                                    selectedProperty,
                              )?.price || 0) *
                                (parseFloat(commissionRate) / 100),
                            )
                          : "$0"}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-1">
                      Partnership Terms
                    </Label>
                    <textarea
                      placeholder="Outline the terms of your professional engagement..."
                      className="w-full min-h-35 p-6 bg-[#1A1A1A] text-white border-white/5 rounded-none focus:ring-1 focus:ring-luxury-gold transition-all font-medium leading-relaxed placeholder:text-white/10"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                  <Button
                    variant="ghost"
                    onClick={() => setIsDialogOpen(false)}
                    className="flex-1 h-16 text-white/30 hover:text-white uppercase tracking-widest font-black text-[10px]"
                  >
                    ABORT
                  </Button>
                  <Button
                    onClick={handleRequestAgent}
                    disabled={
                      requestLoading ||
                      !selectedProperty ||
                      !message.trim() ||
                      !selectedAgent
                    }
                    className="flex-1 h-16 bg-luxury-gold hover:bg-white text-black font-serif text-lg rounded-none transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {requestLoading ? (
                      <Loader2 className="animate-spin mx-auto" />
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        Send Proposal{" "}
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* V. PAGE CHRONICLE */}
        {pagination.totalPages > 1 && (
          <div className="pt-12 flex justify-center border-t border-white/5">
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
