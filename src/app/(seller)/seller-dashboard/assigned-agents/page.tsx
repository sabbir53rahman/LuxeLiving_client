"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  ArrowLeft,
  Mail,
  Building,
  Trash2,
  Users,
  Search,
  UserCheck,
  Plus,
  DollarSign,
  ShieldCheck,
  Loader2,
  Bed,
  Bath,
  MapPin,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetMySellerPropertiesQuery } from "@/redux/api/sellerApi";
import { useRemoveAgentFromPropertyMutation } from "@/redux/api/sellerApi";
import { Pagination } from "@/components/ui/Pagination";
import Link from "next/link";
import Image from "next/image";

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  bedrooms: number;
  bathrooms: number;
  area: number;
  type: string;
  status: string;
  agentId: string;
  sellerId: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  seller: {
    id: string;
    name: string;
    email: string;
    contactNumber?: string;
  };
  agent: {
    id: string;
    name: string;
    email: string;
    contactNumber?: string;
  };
  viewings: Array<{
    id: string;
    viewingDate: string;
    status: string;
  }>;
}

// Section Header Component to match the luxury aesthetic
const SectionHeader = ({
  numeral,
  title,
}: {
  numeral: string;
  title: string;
}) => (
  <div className="flex items-center gap-6">
    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-luxury-gold">
      {numeral}
    </span>
    <h2 className="text-[24px] font-serif text-white font-black">
      {title}
    </h2>
    <div className="flex-1 h-px bg-linear-to-r from-white/20 to-transparent" />
  </div>
);

export default function AssignedAgentsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const { data: propertiesData, isLoading: propertiesLoading, error, refetch: refetchProperties } = useGetMySellerPropertiesQuery({
    searchTerm,
    status: statusFilter !== "all" ? statusFilter : undefined,
    page,
    limit
  });
  const [removeAgentFromProperty, { isLoading: removeLoading }] = useRemoveAgentFromPropertyMutation();

  const handleRemoveAgent = async (propertyId: string) => {
    try {
      await removeAgentFromProperty(propertyId).unwrap();
      toast.success("Agent removed from property successfully!");
      // Manually refetch the properties to ensure UI updates
      await refetchProperties();
    } catch (error: unknown) {
      console.error("Failed to remove agent:", error);
      const errorMessage = (error as { data?: { message?: string } })?.data?.message || "Failed to remove agent. Please try again.";
      toast.error(errorMessage);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Filter properties that have agents assigned
  const properties = propertiesData?.data || [];
  const assignedProperties = properties.filter((property: Property) => property.agent && property.agentId);
  const pagination = propertiesData?.meta ?? {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  };


  if (isLoading || propertiesLoading) {
    return (
      <div className="min-h-screen bg-[#0E0E0E] flex flex-col items-center justify-center space-y-6">
        <Loader2 className="w-12 h-12 text-luxury-gold animate-spin" />
        <p className="text-white/40 font-black uppercase tracking-[0.3em] text-[10px]">
          Accessing Assigned Agents
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
            <p className="text-white/60 leading-relaxed">
              Please log in to view your assigned agents.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0E0E0E] flex items-center justify-center p-10">
        <Card className="max-w-md w-full border-white/5 bg-white/5 backdrop-blur-xl overflow-hidden rounded-sm">
          <CardContent className="p-12 text-center space-y-6">
            <h2 className="text-2xl font-serif text-white">
              Error Loading Agents
            </h2>
            <p className="text-white/60 leading-relaxed">
              Failed to load assigned agents. Please try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0E0E0E]">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="px-10 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/seller-dashboard">
                <Button variant="ghost" size="sm" className="text-white/60 hover:text-white hover:bg-white/5 rounded-none">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-serif text-white font-black">
                  Assigned Agents
                </h1>
                <p className="text-white/40 text-sm mt-1">
                  Manage agents assigned to your properties
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <Input
                  placeholder="Search properties..."
                  className="pl-12 bg-[#1A1A1A] border-white/10 text-white placeholder:text-white/40 rounded-none h-10 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value || "all")}>
                <SelectTrigger className="bg-[#1A1A1A] border-white/10 text-white rounded-none h-10 w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-[#1A1A1A] border-white/10 text-white">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                  <SelectItem value="rented">Rented</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      <div className="px-10 space-y-12">
        {/* I. NETWORK SYNOPSIS */}
        <SectionHeader numeral="I" title="NETWORK SYNOPSIS" />
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-[#1A1A1A] border border-white/5 rounded-none p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/40 text-sm font-black uppercase tracking-widest">Total Properties</p>
                <p className="text-2xl font-serif text-white mt-2">{properties.length}</p>
              </div>
              <Building className="w-8 h-8 text-luxury-gold" />
            </div>
          </Card>
          
          <Card className="bg-[#1A1A1A] border border-white/5 rounded-none p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/40 text-sm font-black uppercase tracking-widest">Assigned Properties</p>
                <p className="text-2xl font-serif text-white mt-2">{assignedProperties.length}</p>
              </div>
              <Users className="w-8 h-8 text-luxury-gold" />
            </div>
          </Card>
          
          <Card className="bg-[#1A1A1A] border border-white/5 rounded-none p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/40 text-sm font-black uppercase tracking-widest">Active Agents</p>
                <p className="text-2xl font-serif text-white mt-2">
                  {new Set(assignedProperties.map((p: Property) => p.agent?.id)).size}
                </p>
              </div>
              <UserCheck className="w-8 h-8 text-luxury-gold" />
            </div>
          </Card>
          
          <Card className="bg-[#1A1A1A] border border-white/5 rounded-none p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/40 text-sm font-black uppercase tracking-widest">Total Value</p>
                <p className="text-2xl font-serif text-white mt-2">
                  {formatCurrency(assignedProperties.reduce((sum: number, p: Property) => sum + p.price, 0))}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-luxury-gold" />
            </div>
          </Card>
        </div>

      {/* II. PROPERTY ASSIGNMENTS */}
        <SectionHeader numeral="II" title="PROPERTY ASSIGNMENTS" />
        
        {assignedProperties.length === 0 ? (
          <Card className="bg-[#1A1A1A] border border-white/5 rounded-none">
            <CardContent className="text-center py-24">
              <div className="w-28 h-28 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-12 h-12 text-white/20" />
              </div>
              <h3 className="text-2xl font-serif text-white mb-3">No Agents Assigned</h3>
              <p className="text-white/60 mb-10 max-w-sm mx-auto leading-relaxed">
                {searchTerm 
                  ? `No properties match "${searchTerm}". Try different keywords.`
                  : "You haven't assigned any agents to your properties yet."
                }
              </p>
              <Link href="/seller-dashboard/find-agents">
                <Button className="bg-luxury-gold hover:bg-white text-black rounded-none h-12 px-6 font-black uppercase tracking-widest text-sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Find Agents
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {assignedProperties.map((property: Property) => (
              <Card key={property.id} className="bg-[#1A1A1A] border border-white/5 rounded-none overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col lg:flex-row">
                    {/* Property Image */}
                    <div className="lg:w-80 h-48 lg:h-auto">
                      {property.images && property.images.length > 0 ? (
                        <Image
                          src={property.images[0]}
                          alt={property.title}
                          className="w-full h-full object-cover"
                          width={320}
                          height={192}
                        />
                      ) : (
                        <div className="w-full h-full bg-white/5 flex items-center justify-center">
                          <Home className="w-12 h-12 text-white/20" />
                        </div>
                      )}
                    </div>
                    
                    {/* Property & Agent Info */}
                    <div className="flex-1 p-8">
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <h3 className="text-xl font-serif text-white mb-2">{property.title}</h3>
                          <div className="flex items-center gap-4 text-white/60 text-sm">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {property.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Bed className="w-4 h-4" />
                              {property.bedrooms} beds
                            </div>
                            <div className="flex items-center gap-1">
                              <Bath className="w-4 h-4" />
                              {property.bathrooms} baths
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-serif text-luxury-gold">
                            {formatCurrency(property.price)}
                          </p>
                          <Badge className="bg-luxury-gold/20 text-luxury-gold border-none mt-1">
                            {property.status}
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Agent Information */}
                      <div className="border-t border-white/10 pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback className="bg-luxury-gold text-black font-bold">
                                {property.agent?.name?.charAt(0)?.toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-white font-medium">{property.agent?.name}</p>
                              <div className="flex items-center gap-2 text-white/60 text-sm">
                                <Mail className="w-3 h-3" />
                                {property.agent?.email}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <Button variant="ghost" size="sm" className="text-white/60 hover:text-white hover:bg-white/5 rounded-none">
                              <Mail className="w-4 h-4 mr-1" />
                              Contact
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-none"
                              onClick={() => handleRemoveAgent(property.id)}
                              disabled={removeLoading}
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}
