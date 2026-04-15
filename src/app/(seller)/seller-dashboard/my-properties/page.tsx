"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import {
  Building,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  MapPin,
  BedDouble,
  Bath,
  Square,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useGetMySellerPropertiesQuery,
  useDeleteSellerPropertyMutation,
} from "@/redux/api/sellerApi";
import Link from "next/link";
import Image from "next/image";

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  type: string;
  status?: string;
  agentId?: string;
  sellerId?: string;
  seller?: {
    id: string;
    name: string;
    email: string;
    contactNumber?: string;
  };
  agent?: {
    id: string;
    name: string;
    email: string;
    contactNumber?: string;
    avatar?: string;
    rating?: number;
    experience?: number;
  };
  viewings?: Array<{
    id: string;
    viewingDate: string;
    status: string;
  }>;
  views?: number;
  createdAt?: string;
  updatedAt?: string;
}

export default function MyPropertiesPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const { data: propertiesData, isLoading: propertiesLoading } =
    useGetMySellerPropertiesQuery({
      searchTerm,
      status: statusFilter !== "all" ? statusFilter : undefined,
      type: typeFilter !== "all" ? typeFilter : undefined,
    });

  const [deleteProperty, { isLoading: deleteLoading }] =
    useDeleteSellerPropertyMutation();

  const properties = propertiesData?.data || [];

  const handleDeleteProperty = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        await deleteProperty(id).unwrap();
      } catch (error) {
        console.error("Failed to delete property:", error);
      }
    }
  };

  if (isLoading || propertiesLoading) {
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
        <div className="max-w-md w-full bg-[#1A1A1A] border border-white/5 rounded-sm p-12 text-center space-y-6">
          <div className="w-12 h-12 bg-white/5 rounded-2xl mx-auto flex items-center justify-center">
            <Building className="w-6 h-6 text-luxury-gold" />
          </div>
          <h2 className="text-2xl font-serif text-white">Access Restricted</h2>
          <Link href="/login" className="block">
            <Button className="w-full h-12 bg-luxury-gold hover:bg-white text-black font-black uppercase tracking-widest transition-all">
              Identify Yourself
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-white font-sans selection:bg-luxury-gold selection:text-black pb-20">
      {/* Header */}
      <header className="px-10 py-12">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <div className="h-px w-8 bg-white/10" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 whitespace-nowrap">
                MANAGEMENT CONSOLE
              </span>
              <div className="h-px flex-1 bg-white/10" />
            </div>
            <h1 className="text-5xl font-serif text-white tracking-tight leading-none">
              My Properties
            </h1>
          </div>
          <Link href="/seller-dashboard/add-property">
            <Button className="bg-luxury-gold hover:bg-white text-black font-black uppercase tracking-widest h-12 px-8 transition-all">
              <Plus className="w-5 h-5 mr-2" />
              ADD NEW PROPERTY
            </Button>
          </Link>
        </div>
      </header>

      {/* Search and Filter Bar */}
      <div className="px-10">
        <div className="bg-[#1A1A1A] border border-white/5 rounded-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <Input
                placeholder="Search by name, address & city "
                className="pl-12 bg-[#0A0A0A] border-white/10 text-white placeholder:text-white/40 rounded-sm h-12 focus:border-luxury-gold"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value || "all")}
            >
              <SelectTrigger className="bg-[#0A0A0A] border-white/10 text-white rounded-sm h-12">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="bg-[#1A1A1A] border-white/10">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
                <SelectItem value="rented">Rented</SelectItem>
                <SelectItem value="available">Available</SelectItem>
              </SelectContent>
            </Select>
            {/* <Select
              value={typeFilter}
              onValueChange={(value) => setTypeFilter(value || "all")}
            >
              <SelectTrigger className="bg-[#0A0A0A] border-white/10 text-white rounded-sm h-12">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent className="bg-[#1A1A1A] border-white/10">
                <SelectItem value="all">Price Range</SelectItem>
                <SelectItem value="0-500000">Under $500K</SelectItem>
                <SelectItem value="500000-1000000">$500K - $1M</SelectItem>
                <SelectItem value="1000000-2000000">$1M - $2M</SelectItem>
                <SelectItem value="2000000+">Over $2M</SelectItem>
              </SelectContent>
            </Select> */}
            <Button
              variant="outline"
              className="bg-[#0A0A0A] border-white/10 text-white rounded-sm h-12 hover:bg-white/10"
            >
              <Filter className="w-5 h-5 mr-2" />
              FILTERS
            </Button>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="px-10 mt-8">
        {properties.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 bg-[#1A1A1A] border border-white/5 rounded-sm"
          >
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building className="w-10 h-10 text-luxury-gold" />
            </div>
            <h3 className="text-xl font-serif text-white mb-2">
              No properties found
            </h3>
            <p className="text-white/40 mb-6">
              Get started by adding your first property listing.
            </p>
            <Link href="/seller-dashboard/add-property">
              <Button className="bg-luxury-gold hover:bg-white text-black font-black uppercase tracking-widest">
                <Plus className="w-5 h-5 mr-2" />
                Add Your First Property
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property: Property, index: number) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#1A1A1A] border border-white/5 rounded-sm overflow-hidden group hover:border-luxury-gold/30 transition-all duration-300"
              >
                {/* Property Image */}
                <div className="relative aspect-4/3 overflow-hidden">
                  <Image
                    width={400}
                    height={300}
                    src={
                      property.images?.[0] ||
                      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80"
                    }
                    alt={property.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Status Badge */}
                  <div className="absolute top-4 left-4">
                    <span
                      className={`px-3 py-1 text-xs font-black rounded-sm uppercase tracking-wider ${
                        property.status === "active" ||
                        property.status === "available"
                          ? "bg-luxury-gold text-black"
                          : property.status === "pending"
                            ? "bg-orange-500 text-white"
                            : property.status === "sold"
                              ? "bg-red-500 text-white"
                              : "bg-blue-500 text-white"
                      }`}
                    >
                      {property.status === "available"
                        ? "AVAILABLE"
                        : property.status?.toUpperCase() || "ACTIVE"}
                    </span>
                  </div>

                  {/* Actions Menu */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-full p-2"
                        >
                          <Edit className="w-4 h-4 text-white" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-[#1A1A1A] border-white/10"
                      >
                        <DropdownMenuItem>
                          <Link
                            href={`/seller-dashboard/edit-property/${property.id}`}
                            className="text-white"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Property
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-white/10" />
                        <DropdownMenuItem
                          onClick={() => handleDeleteProperty(property.id)}
                          className="text-red-500"
                          disabled={deleteLoading}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Property
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Property Details */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-serif text-white font-bold line-clamp-1">
                        {property.title}
                      </h3>
                      <div className="flex items-center text-white/60 mt-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="text-sm line-clamp-1">
                          {property.location}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-serif text-luxury-gold font-bold">
                        ${property.price.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 py-4 border-t border-white/10 border-b">
                    <div className="text-center">
                      <BedDouble className="w-5 h-5 text-luxury-gold mx-auto mb-1" />
                      <div className="text-xs text-white/60">BEDS</div>
                      <div className="text-sm font-bold text-white">
                        {property.bedrooms}
                      </div>
                    </div>
                    <div className="text-center">
                      <Bath className="w-5 h-5 text-luxury-gold mx-auto mb-1" />
                      <div className="text-xs text-white/60">BATHS</div>
                      <div className="text-sm font-bold text-white">
                        {property.bathrooms}
                      </div>
                    </div>
                    <div className="text-center">
                      <Square className="w-5 h-5 text-luxury-gold mx-auto mb-1" />
                      <div className="text-xs text-white/60">SQFT</div>
                      <div className="text-sm font-bold text-white">
                        {property.area}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Link href={`/properties/${property.id}`}>
                      <Button className="w-full bg-luxury-gold hover:bg-white text-black font-black uppercase tracking-widest h-12 transition-all">
                        VIEW DETAILS
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
