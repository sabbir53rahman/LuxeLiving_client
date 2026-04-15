"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Building,
  Users,
  Star,
  MapPin,
  Plus,
  X,
  Search,
  Loader2,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  Award,
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
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Pagination } from "@/components/ui/Pagination";
import { useGetMySellerPropertiesQuery } from "@/redux/api/sellerApi";
import { useGetAgentsQuery } from "@/redux/api/agentApi";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useRequestAgentCollaborationMutation } from "@/redux/api/sellerApi";
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

export default function PropertyAgentsPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null,
  );
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [commissionRate, setCommissionRate] = useState("3");
  const [message, setMessage] = useState("");
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  const {
    data: propertiesData,
    isLoading: propertiesLoading,
    refetch: refetchProperties,
  } = useGetMySellerPropertiesQuery({
    page,
    limit,
    searchTerm,
    status: statusFilter !== "all" ? statusFilter : undefined,
  });

  const { data: agentsData } = useGetAgentsQuery({ limit: 100 });
  const [requestAgent, { isLoading: requestLoading }] =
    useRequestAgentCollaborationMutation();
  const [removeAgentFromProperty] = useRemoveAgentFromPropertyMutation();

  const properties = propertiesData?.data || [];
  const agents: Agent[] = agentsData?.data || [];
  const pagination = propertiesData?.meta ?? {
    total: 0,
    page: 1,
    limit,
    totalPages: 0,
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleAssignAgent = async () => {
    if (!selectedProperty || !selectedAgent || !message.trim()) {
      toast.error("Please provide the terms of collaboration");
      return;
    }

    try {
      const loadingToast = toast.loading("Establishing partnership...");
      await requestAgent({
        agentId: selectedAgent.id,
        propertyId: selectedProperty.id,
        commissionRate: parseFloat(commissionRate),
        message: message.trim(),
      }).unwrap();

      toast.dismiss(loadingToast);
      toast.success("Custody transition initiated.");
      setIsAssignDialogOpen(false);
      setSelectedProperty(null);
      setSelectedAgent(null);
      setCommissionRate("3");
      setMessage("");
      refetchProperties();
    } catch (error) {
      toast.dismiss();
      const fetchError = error as FetchBaseQueryError;
      const errorMessage = fetchError?.data as { message?: string };
      toast.error(errorMessage?.message || "Failed to finalize assignment");
    }
  };

  const handleRemoveAgent = async (propertyId: string) => {
    try {
      const loadingToast = toast.loading("Dissolving partnership...");
      await removeAgentFromProperty(propertyId).unwrap();
      toast.dismiss(loadingToast);
      toast.success("Custody reclaimed.");
      refetchProperties();
    } catch (error) {
      toast.dismiss();
      const fetchError = error as FetchBaseQueryError;
      const errorMessage = fetchError?.data as { message?: string };
      toast.error(errorMessage?.message || "Failed to dissolve relationship");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (authLoading || propertiesLoading) {
    return (
      <div className="min-h-screen bg-[#0E0E0E] flex flex-col items-center justify-center space-y-6">
        <Loader2 className="w-12 h-12 text-luxury-gold animate-spin" />
        <p className="text-white/40 font-black uppercase tracking-[0.3em] text-[10px]">
          Accessing Vault Records
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
            Property Custodians
          </h1>
          <p className="text-white/40 text-sm font-medium italic">
            Managing elite human capital for your architectural assets.
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
        {/* I. ESTATE SYNOPSIS */}
        <SectionHeader numeral="I" title="ESTATE SYNOPSIS" />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              label: "ACTIVE LISTINGS",
              value: properties.length,
              icon: Building,
            },
            {
              label: "DELEGATED CUSTODY",
              value: properties.filter((p: Property) => p.assignedAgent).length,
              icon: ShieldCheck,
            },
            {
              label: "VACANT ROLES",
              value: properties.filter((p: Property) => !p.assignedAgent)
                .length,
              icon: Plus,
            },
            {
              label: "ELITE REPRESENTATIVES",
              value: agents.length,
              icon: Award,
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
          <div className="lg:col-span-6 space-y-3">
            <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-1">
              Archive Search
            </Label>
            <div className="relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
              <Input
                placeholder="Search by Estate Name or Identifier..."
                className="h-16 bg-[#1A1A1A] border-white/5 text-white font-medium pl-14 pr-8 rounded-sm focus-visible:ring-luxury-gold transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="lg:col-span-4 space-y-3">
            <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-1">
              Operational Status
            </Label>
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value || "all")}
            >
              <SelectTrigger className="h-16 bg-[#1A1A1A] border-white/5 text-white font-medium px-8 rounded-sm focus:ring-luxury-gold">
                <SelectValue placeholder="All Assets" />
              </SelectTrigger>
              <SelectContent className="bg-[#1A1A1A] border-white/10 text-white">
                <SelectItem value="all">All Assets</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="lg:col-span-2 h-16 flex items-center justify-end px-4 border border-dashed border-white/10 rounded-sm">
            <p className="text-[9px] font-black uppercase tracking-widest text-white/20">
              {pagination.total} ENTRIES FOUND
            </p>
          </div>
        </div>

        {/* III. ASSET DELEGATION */}
        <SectionHeader numeral="III" title="ASSET DELEGATION" />

        {properties.length === 0 ? (
          <div className="h-100 border border-dashed border-white/10 rounded-sm flex flex-col items-center justify-center space-y-6 bg-white/5">
            <Building className="w-12 h-12 text-white/10" />
            <p className="font-serif text-xl text-white/40">
              No estates qualify for delegation.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {properties.map((property: Property, index: number) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-[#1A1A1A] border-white/5 rounded-sm overflow-hidden hover:border-luxury-gold/40 transition-all duration-500 group">
                  <div className="p-8 space-y-8">
                    {/* Property Header */}
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="text-2xl font-serif text-white">
                            {property.title}
                          </h3>
                          <Badge className="bg-white/5 text-white/50 border-none font-black text-[9px] tracking-widest rounded-none px-2 uppercase">
                            {property.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-white/30 font-bold uppercase tracking-widest">
                          <MapPin className="w-3 h-3 text-luxury-gold/50" />
                          {property.location}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-serif text-luxury-gold">
                          {formatCurrency(property.price)}
                        </p>
                        <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">
                          Market Value
                        </p>
                      </div>
                    </div>

                    {/* Agent Section */}
                    {property.assignedAgent ? (
                      <div className="bg-[#141414] border border-white/5 p-6 rounded-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveAgent(property.id)}
                            className="w-8 h-8 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-all"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-4">
                          <Avatar className="h-16 w-16 border border-white/10 p-1">
                            <AvatarImage
                              src={property.assignedAgent.avatar}
                              alt={property.assignedAgent.name}
                              className="rounded-none object-cover"
                            />
                            <AvatarFallback className="bg-white/10 text-luxury-gold font-serif">
                              {property.assignedAgent.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-serif text-lg text-white">
                                {property.assignedAgent.name}
                              </h4>
                              <div className="flex items-center gap-1 bg-luxury-gold/10 px-2 py-0.5 rounded-full">
                                <Star
                                  className="w-2.5 h-2.5 text-luxury-gold"
                                  fill="currentColor"
                                />
                                <span className="text-[10px] font-black text-luxury-gold">
                                  {property.assignedAgent.rating.toFixed(1)}
                                </span>
                              </div>
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/30">
                              Senior Portfolio Manager •{" "}
                              {property.assignedAgent.experience}Y
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-6">
                          <div className="border border-white/5 p-3 rounded-none">
                            <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">
                              Agreed Commission
                            </p>
                            <p className="text-lg font-serif text-white">
                              {property.assignedAgent.commissionRate}%
                            </p>
                          </div>
                          <div className="border border-white/5 p-3 rounded-none">
                            <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">
                              Custody Established
                            </p>
                            <p className="text-lg font-serif text-white">
                              {new Date(
                                property.assignedAgent.assignedAt,
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-40 border border-dashed border-white/10 rounded-sm flex flex-col items-center justify-center space-y-6 bg-white/1">
                        <div className="text-center space-y-2">
                          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
                            Awaiting Representative
                          </p>
                        </div>

                        <Dialog
                          open={
                            isAssignDialogOpen &&
                            selectedProperty?.id === property.id
                          }
                          onOpenChange={setIsAssignDialogOpen}
                        >
                          <DialogTrigger>
                            <Button
                              className="bg-white text-black hover:bg-luxury-gold transition-all font-black text-[10px] tracking-widest uppercase h-10 px-6 rounded-none"
                              onClick={() => setSelectedProperty(property)}
                            >
                              Commence Delegation
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-[#0E0E0E] border-white/10 text-white rounded-none max-w-none w-[98vw]! md:w-[95vw]! lg:w-[90vw]! xl:w-[85vw]! p-0 overflow-hidden" style={{ maxWidth: 'none !important', width: '98vw !important' }}>
                            <div className="p-6 md:p-8 lg:p-12 space-y-6 md:space-y-8 lg:space-y-10">
                              <div className="space-y-2 text-center">
                                <h2 className="text-4xl font-serif text-luxury-gold">
                                  Delegation Accord
                                </h2>
                                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">
                                  Establishing Portfolio Custody
                                </p>
                              </div>

                              <div className="space-y-8">
                                {/* Asset Summary */}
                                <div className="bg-[#1A1A1A] p-6 border-l-2 border-luxury-gold">
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <h4 className="font-serif text-xl">
                                        {selectedProperty?.title ||
                                          property.title}
                                      </h4>
                                      <p className="text-[10px] uppercase text-white/40 tracking-widest">
                                        {selectedProperty?.location ||
                                          property.location}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-xl font-serif text-luxury-emerald">
                                        {formatCurrency(
                                          selectedProperty?.price ||
                                            property.price,
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {/* Select Agent */}
                                <div className="space-y-3">
                                  <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-1">
                                    Select Representative
                                  </Label>
                                  <Select
                                    value={selectedAgent?.id || ""}
                                    onValueChange={(agentId) => {
                                      const agent = agents.find(
                                        (a) => a.id === agentId,
                                      );
                                      setSelectedAgent(agent || null);
                                    }}
                                  >
                                    <SelectTrigger className="h-16 bg-[#1A1A1A] border-white/5 text-white font-medium px-8 rounded-none focus:ring-luxury-gold">
                                      <SelectValue placeholder="Choose authorized agent" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#1A1A1A] border-white/10 text-white font-sans">
                                      {agents.map((agent: Agent) => (
                                        <SelectItem
                                          key={agent.id}
                                          value={agent.id}
                                          className="focus:bg-white/5"
                                        >
                                          <div className="flex items-center gap-3 py-1">
                                            <Avatar className="h-8 w-8 rounded-none">
                                              <AvatarImage
                                                src={agent.avatar}
                                                alt={agent.name}
                                              />
                                              <AvatarFallback className="text-[8px] bg-white/5">
                                                {agent.name.charAt(0)}
                                              </AvatarFallback>
                                            </Avatar>
                                            <div className="text-left">
                                              <p className="font-serif text-sm">
                                                {agent.name}
                                              </p>
                                              <p className="text-[9px] text-white/30 uppercase tracking-widest">
                                                {agent.experience}Y EXPERIENCE ·{" "}
                                                {agent.averageRating?.toFixed(
                                                  1,
                                                )}{" "}
                                                RATING ·{" "}
                                                {agent.commissionRate || 0}% COMMISSION
                                              </p>
                                            </div>
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
                                      <SelectTrigger className="h-16 bg-[#1A1A1A] border-white/5 text-white font-medium px-8 rounded-none">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent className="bg-[#1A1A1A] border-white/10 text-white">
                                        {["2", "2.5", "3", "3.5", "4", "5"].map(
                                          (v) => (
                                            <SelectItem key={v} value={v}>
                                              {v}%
                                            </SelectItem>
                                          ),
                                        )}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-1">
                                      Potential Payout
                                    </Label>
                                    <div className="h-16 px-8 bg-[#1A1A1A] border border-white/5 rounded-none flex items-center font-serif text-xl text-luxury-gold">
                                      {selectedAgent && commissionRate
                                        ? formatCurrency(
                                            (selectedProperty?.price ||
                                              property.price) *
                                              (parseFloat(commissionRate) /
                                                100),
                                          )
                                        : "$0"}
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-3">
                                  <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-1">
                                    Contractual Directives
                                  </Label>
                                  <textarea
                                    placeholder="State the terms of your engagement..."
                                    className="w-full min-h-35 p-6 bg-[#1A1A1A] text-white border-white/5 rounded-none focus:ring-1 focus:ring-luxury-gold transition-all font-medium leading-relaxed placeholder:text-white/10"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                  />
                                </div>
                              </div>

                              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                                <Button
                                  variant="ghost"
                                  onClick={() => setIsAssignDialogOpen(false)}
                                  className="flex-1 h-16 text-white/30 hover:text-white uppercase tracking-widest font-black text-[10px]"
                                >
                                  ABORT
                                </Button>
                                <Button
                                  onClick={handleAssignAgent}
                                  disabled={requestLoading || !selectedAgent}
                                  className="flex-1 h-16 bg-luxury-gold hover:bg-white text-black font-serif text-lg rounded-none transition-all group"
                                >
                                  {requestLoading ? (
                                    <Loader2 className="animate-spin" />
                                  ) : (
                                    <div className="flex items-center gap-2">
                                      Initialize Guardianship{" "}
                                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                  )}
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* IV. PAGE CHRONICLE */}
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
