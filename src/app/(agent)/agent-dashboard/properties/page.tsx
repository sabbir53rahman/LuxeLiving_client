"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  Building,
  Eye,
  MapPin,
  Home,
  Bed,
  Bath,
  Search,
  User,
  DollarSign,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Mail } from "lucide-react";
import { useGetAssignedSellerPropertiesQuery } from "@/redux/api/agentApi";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AgentProperty {
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
  viewings: Array<{
    id: string;
    viewingDate: string;
    status: string;
  }>;
}
import Link from "next/link";
import Image from "next/image";

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

function PropertyCard({
  property,
}: {
  property: AgentProperty;
  index: number;
}) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="bg-[#1A1A1A] border border-white/5 rounded-none overflow-hidden">
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
          
          {/* Property & Seller Info */}
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
            
            {/* Seller Information */}
            <div className="border-t border-white/10 pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-luxury-gold/20 flex items-center justify-center">
                    <User className="w-6 h-6 text-luxury-gold" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{property.seller.name}</p>
                    <div className="flex items-center gap-2 text-white/60 text-sm">
                      <Mail className="w-3 h-3" />
                      {property.seller.email}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="sm" className="text-white/60 hover:text-white hover:bg-white/5 rounded-none">
                    <Mail className="w-4 h-4 mr-1" />
                    Contact
                  </Button>
                  <Link href={`/properties/${property.id}`}>
                    <Button 
                      size="sm" 
                      className="bg-luxury-gold hover:bg-white text-black font-black uppercase tracking-wider rounded-none"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AgentPropertiesPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(12);

  const {
    data: agentData,
    isLoading,
    error,
  } = useGetAssignedSellerPropertiesQuery({
    page,
    limit,
    searchTerm,
    status: statusFilter !== "all" ? statusFilter : undefined,
  });

  const properties = agentData?.data || [];
  const pagination = agentData?.meta ?? {
    total: 0,
    page: 1,
    limit,
    totalPages: 0,
  };


  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center space-y-6">
        <div className="w-12 h-12 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin" />
        <p className="text-white/40 font-black uppercase tracking-[0.3em] text-[10px]">
          Loading Properties
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
              <Building className="w-6 h-6 text-red-500" />
            </div>
            <h2 className="text-2xl font-serif text-white">
              Error Loading Properties
            </h2>
            <p className="text-white/40">
              Failed to load properties. Please try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans selection:bg-luxury-gold selection:text-black pb-20">
      {/* Top Navigation / Header */}
      <header className="px-10 py-12">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-5xl font-serif text-white tracking-tight leading-none">
              Assigned Properties
            </h1>
            <p className="text-white/40 text-sm font-medium italic mt-2">
              Managing your luxury property portfolio.
            </p>
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
                <p className="text-3xl font-serif text-white font-bold mt-1">{properties.length}</p>
              </div>
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                <Building className="w-6 h-6 text-luxury-gold" />
              </div>
            </div>
          </Card>
          
          <Card className="bg-[#1A1A1A] border border-white/5 rounded-none p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/40 text-sm font-black uppercase tracking-widest">Available</p>
                <p className="text-3xl font-serif text-white font-bold mt-1">
                  {properties.filter((p: AgentProperty) => p.status === "available").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </Card>
          
          <Card className="bg-[#1A1A1A] border border-white/5 rounded-none p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/40 text-sm font-black uppercase tracking-widest">Total Value</p>
                <p className="text-3xl font-serif text-white font-bold mt-1">
                  ${properties.reduce((sum: number, p: AgentProperty) => sum + p.price, 0).toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </Card>
          
          <Card className="bg-[#1A1A1A] border border-white/5 rounded-none p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/40 text-sm font-black uppercase tracking-widest">Sold/Rented</p>
                <p className="text-3xl font-serif text-white font-bold mt-1">
                  {properties.filter((p: AgentProperty) => p.status === "sold" || p.status === "rented").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Eye className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* II. PROPERTY SEARCH & FILTERS */}
        <SectionHeader numeral="II" title="PROPERTY SEARCH & FILTERS" />

        <div className="bg-[#1A1A1A] border border-white/5 rounded-none p-6">
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

        {/* III. PROPERTY LISTINGS */}
        <SectionHeader numeral="III" title="PROPERTY LISTINGS" />

        {properties.length === 0 ? (
          <div className="text-center py-24 bg-[#1A1A1A] border border-white/5 rounded-none border-dashed">
            <div className="w-28 h-28 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Building className="w-12 h-12 text-luxury-gold" />
            </div>
            <h3 className="text-2xl font-serif text-white mb-3">
              No Properties Found
            </h3>
            <p className="text-white/40 mb-8 max-w-sm mx-auto leading-relaxed">
              You don&apos;t have any properties assigned to you yet. Contact
              your agency to get started.
            </p>
            <Link href="/agent-dashboard">
              <Button className="bg-luxury-gold hover:bg-white text-black font-black uppercase tracking-widest h-12 px-8 transition-all">
                Return to Dashboard
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {properties.map((property: AgentProperty, index: number) => (
              <PropertyCard
                key={property.id}
                property={property}
                index={index}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center gap-4 mt-8">
            <Button
              onClick={() => setPage(page - 1)}
              disabled={page <= 1}
              className="bg-white/10 hover:bg-white/20 text-white font-black uppercase tracking-wider h-12 px-8 rounded-none transition-all border border-white/10"
            >
              Previous
            </Button>
            <span className="px-4 py-3 text-sm text-white/40">
              Page {page} of {pagination.totalPages}
            </span>
            <Button
              onClick={() => setPage(page + 1)}
              disabled={page >= pagination.totalPages}
              className="bg-white/10 hover:bg-white/20 text-white font-black uppercase tracking-wider h-12 px-8 rounded-none transition-all border border-white/10"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
