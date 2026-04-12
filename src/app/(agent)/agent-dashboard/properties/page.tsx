"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import {
  Building,
  Eye,
  MapPin,
  Home,
  BedDouble,
  Bath,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { useGetAssignedSellerPropertiesQuery } from "@/redux/api/agentApi";
import { Property } from "@/types/agent";
import Link from "next/link";
import Image from "next/image";

export default function AgentPropertiesPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
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
    sortBy,
    sortOrder,
  });

  const agent = agentData?.data;
  const properties = agent?.assignedProperties || [];
  const pagination = agentData?.meta ?? {
    total: 0,
    page: 1,
    limit,
    totalPages: 0,
  };

  const handleStatusFilterChange = (value: string | null) => {
    setStatusFilter(value || "all");
  };

  const handleSortByChange = (value: string | null) => {
    setSortBy(value || "createdAt");
  };

  const handleSortOrderChange = (value: string | null) => {
    setSortOrder(value || "desc");
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "sold":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "rented":
        return "bg-purple-100 text-purple-700 border-purple-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (authLoading || isLoading) {
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
        <h2 className="text-xl font-bold text-red-800 mb-2">
          Authentication Required
        </h2>
        <p className="text-red-600">
          Please log in to access your agent properties.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-3xl bg-red-50 border border-red-200">
        <h2 className="text-xl font-bold text-red-800 mb-2">
          Error Loading Properties
        </h2>
        <p className="text-red-600">
          Failed to load properties. Please try again later.
        </p>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="p-6 rounded-3xl bg-yellow-50 border border-yellow-200">
        <h2 className="text-xl font-bold text-yellow-800 mb-2">
          No Agent Profile
        </h2>
        <p className="text-yellow-600">
          You don&apos;t have an agent profile yet. Please contact support to
          set up your profile.
        </p>
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
            My Properties
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground mt-2 text-lg"
          >
            Manage and showcase your assigned properties.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex gap-3"
        >
          <Link href="/agent-dashboard">
            <Button
              variant="outline"
              className="rounded-2xl h-12 px-6 font-semibold"
            >
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
              placeholder="Search properties by title or location..."
              className="pl-12 h-14 rounded-2xl bg-muted/30 border-none focus:ring-2 focus:ring-purple-500/20 transition-all text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
            <SelectTrigger className="h-14 rounded-2xl bg-muted/30 border-none px-6 font-semibold">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-none shadow-2xl">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="sold">Sold</SelectItem>
              <SelectItem value="rented">Rented</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={handleSortByChange}>
            <SelectTrigger className="h-14 rounded-2xl bg-muted/30 border-none px-6 font-semibold">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-none shadow-2xl">
              <SelectItem value="createdAt">Date</SelectItem>
              <SelectItem value="price">Price</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="location">Location</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortOrder} onValueChange={handleSortOrderChange}>
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

      {/* Properties Grid */}
      {properties.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-24 bg-muted/10 rounded-[3rem] border border-dashed border-border"
        >
          <div className="w-28 h-28 bg-muted rounded-full flex items-center justify-center mx-auto mb-6 text-muted-foreground/20">
            <Building className="w-12 h-12" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-3">
            No Properties Found
          </h3>
          <p className="text-muted-foreground mb-8 max-w-sm mx-auto leading-relaxed">
            You don&apos;t have any properties assigned to you yet. Contact your
            agency to get started.
          </p>
        </motion.div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {properties.map((property: Property, index: number) => (
              <motion.div
                key={property._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-card hover:bg-muted/5 rounded-[2.5rem] border border-border shadow-soft overflow-hidden transition-all duration-500 hover:-translate-y-1"
              >
                {/* Property Image */}
                <div className="relative h-48 overflow-hidden">
                  {property.images && property.images.length > 0 ? (
                    <Image
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      width={400}
                      height={300}
                    />
                  ) : (
                    <div className="w-full h-full bg-linear-to-br from-luxury-emerald/20 to-luxury-emerald/10 flex items-center justify-center">
                      <Home className="w-12 h-12 text-luxury-emerald/50" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <Badge className={getStatusColor(property.status)}>
                      {property.status}
                    </Badge>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-foreground font-heading leading-tight line-clamp-2 group-hover:text-purple-600 transition-colors">
                      {property.title}
                    </h3>
                    <div className="text-right">
                      <p className="text-2xl font-black text-luxury-gold font-heading">
                        ${property.price.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-4">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{property.address}</span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <BedDouble className="h-4 w-4" />
                      {property.bedrooms} Beds
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath className="h-4 w-4" />
                      {property.bathrooms} Baths
                    </span>
                    <span className="flex items-center gap-1">
                      <Home className="h-4 w-4" />
                      {property.area} sqft
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={property.seller.profilePhoto || ""}
                          alt={property.seller.name}
                        />
                        <AvatarFallback className="text-xs font-bold">
                          {property.seller.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-xs font-medium text-foreground">
                          {property.seller.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {property.seller.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link href={`/properties/${property._id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl border-foreground/10 hover:bg-foreground hover:text-background transition-colors"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8"
            >
              <div className="flex justify-center">
                <Button
                  onClick={() => setPage(page - 1)}
                  disabled={page <= 1}
                  variant="outline"
                  className="rounded-xl mr-2"
                >
                  Previous
                </Button>
                <span className="px-4 py-2 text-sm text-muted-foreground">
                  Page {page} of {pagination.totalPages}
                </span>
                <Button
                  onClick={() => setPage(page + 1)}
                  disabled={page >= pagination.totalPages}
                  variant="outline"
                  className="rounded-xl ml-2"
                >
                  Next
                </Button>
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
