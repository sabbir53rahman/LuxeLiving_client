"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { 
  Building, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search,
  Filter,
  MoreVertical,
  MapPin,
  BedDouble,
  Bath,
  Square,
  Users,
  Star,
  Phone,
  Mail,
  UserCheck,
  Calendar
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useGetMySellerPropertiesQuery, useDeleteSellerPropertyMutation } from "@/redux/api/sellerApi";
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

  const { data: propertiesData, isLoading: propertiesLoading } = useGetMySellerPropertiesQuery({
    searchTerm,
    status: statusFilter !== "all" ? statusFilter : undefined,
    type: typeFilter !== "all" ? typeFilter : undefined,
  });

  const [deleteProperty, { isLoading: deleteLoading }] = useDeleteSellerPropertyMutation();

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
        <p className="text-red-600">Please log in to access your properties.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl lg:text-4xl font-heading font-bold text-foreground"
          >
            My Properties
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground mt-2 text-lg"
          >
            Manage your property listings and track their performance.
          </motion.p>
        </div>
        <Link href="/seller-dashboard/add-property">
          <Button className="bg-luxury-emerald hover:bg-luxury-emerald-light text-white rounded-xl h-12 font-bold">
            <Plus className="w-5 h-5 mr-2" />
            Add Property
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card p-6 rounded-3xl border border-border shadow-sm"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search properties..."
              className="pl-10 rounded-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value || "all")}>
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="sold">Sold</SelectItem>
              <SelectItem value="rented">Rented</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value || "all")}>
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="Property Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Villa">Villa</SelectItem>
              <SelectItem value="Apartment">Apartment</SelectItem>
              <SelectItem value="Penthouse">Penthouse</SelectItem>
              <SelectItem value="Mansion">Mansion</SelectItem>
              <SelectItem value="Condo">Condo</SelectItem>
              <SelectItem value="Townhouse">Townhouse</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="rounded-xl">
            <Filter className="w-5 h-5 mr-2" />
            More Filters
          </Button>
        </div>
      </motion.div>

      {/* Properties Grid */}
      {properties.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20"
        >
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Building className="w-10 h-10 text-muted-foreground/50" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">No properties found</h3>
          <p className="text-muted-foreground mb-6">Get started by adding your first property listing.</p>
          <Link href="/seller-dashboard/add-property">
            <Button className="bg-luxury-emerald hover:bg-luxury-emerald-light text-white rounded-xl">
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
              className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden group hover:shadow-hover transition-all duration-300"
            >
              {/* Property Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  width={400}
                  height={300}
                  src={property.images?.[0] || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80"}
                  alt={property.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Status Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${
                    property.status === 'active' 
                      ? 'bg-green-100 text-green-700' 
                      : property.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : property.status === 'sold'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {property.status || 'Active'}
                  </span>
                </div>

                {/* Actions Menu */}
                <div className="absolute top-4 right-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger >
                      <Button variant="ghost" size="sm" className="bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full p-2">
                        <MoreVertical className="w-4 h-4 text-white" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem >
                        <Link href={`/properties/${property.id}`}>
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem >
                        <Link href={`/seller-dashboard/edit-property/${property.id}`}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleDeleteProperty(property.id)}
                        className="text-red-600"
                        disabled={deleteLoading}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Views Counter */}
                <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full">
                  <span className="text-white text-sm font-medium">
                    {property.views || 0} views
                  </span>
                </div>
              </div>

              {/* Property Details */}
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-foreground font-heading line-clamp-1 group-hover:text-luxury-emerald transition-colors">
                    {property.title}
                  </h3>
                  <span className="text-sm font-bold text-luxury-emerald">
                    ${property.price.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center text-muted-foreground mb-4">
                  <MapPin className="w-4 h-4 mr-1 text-luxury-emerald" />
                  <span className="text-sm line-clamp-1">{property.location}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 py-4 border-t border-b border-border/50 mb-4">
                  <div className="flex flex-col items-center">
                    <BedDouble className="w-4 h-4 text-luxury-emerald mb-1" />
                    <span className="text-xs font-medium text-muted-foreground">
                      {property.bedrooms} Beds
                    </span>
                  </div>
                  <div className="flex flex-col items-center border-l border-r border-border/50">
                    <Bath className="w-4 h-4 text-luxury-emerald mb-1" />
                    <span className="text-xs font-medium text-muted-foreground">
                      {property.bathrooms} Baths
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Square className="w-4 h-4 text-luxury-emerald mb-1" />
                    <span className="text-xs font-medium text-muted-foreground">
                      {property.area} sqft
                    </span>
                  </div>
                </div>

                {/* Assigned Agent Section */}
                {property.agent ? (
                  <div className="p-3 bg-muted/30 rounded-2xl border border-border/50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-luxury-emerald" />
                        <span className="text-sm font-semibold text-foreground">Assigned Agent</span>
                      </div>
                      <Badge className="bg-luxury-emerald/10 text-luxury-emerald border-luxury-emerald/20 text-xs">
                        Active
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={property.agent.avatar} alt={property.agent.name} />
                        <AvatarFallback className="bg-luxury-emerald text-white text-sm font-bold">
                          {property.agent.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h5 className="font-medium text-foreground text-sm">{property.agent.name}</h5>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          {property.agent.rating && (
                            <>
                              <Star className="w-3 h-3 text-yellow-500" fill="currentColor" />
                              <span>{property.agent.rating.toFixed(1)}</span>
                              <span>·</span>
                            </>
                          )}
                          {property.agent.experience && (
                            <>
                              <span>{property.agent.experience} years</span>
                              <span>·</span>
                            </>
                          )}
                          <span>{property.agent.email}</span>
                        </div>
                        {property.agent.contactNumber && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Phone className="w-3 h-3" />
                            <span>{property.agent.contactNumber}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {property.viewings && property.viewings.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-border/50">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            <span>{property.viewings.length} viewing{property.viewings.length > 1 ? 's' : ''} scheduled</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="font-medium text-foreground">
                              {new Date(property.viewings[0].viewingDate).toLocaleDateString()}
                            </span>
                            <Badge variant={property.viewings[0].status === 'SCHEDULED' ? 'default' : 'secondary'} className="text-xs">
                              {property.viewings[0].status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-3 bg-muted/30 rounded-2xl border border-dashed border-border/50">
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>No agent assigned</span>
                    </div>
                    <Link href="/seller-dashboard/find-agents" className="block mt-2">
                      <Button variant="outline" size="sm" className="w-full rounded-xl text-xs">
                        <Plus className="w-3 h-3 mr-1" />
                        Assign Agent
                      </Button>
                    </Link>
                  </div>
                )}

                <div className="flex gap-2">
                  <Link href={`/seller-dashboard/edit-property/${property.id}`} className="flex-1">
                    <Button variant="outline" className="w-full rounded-xl">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </Link>
                  <Link href={`/properties/${property.id}`} className="flex-1">
                    <Button className="w-full bg-luxury-emerald hover:bg-luxury-emerald-light text-white rounded-xl">
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
