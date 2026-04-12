"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Building, Search, Trash2, MapPin, BedDouble, Bath, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";
import {
  useGetPropertiesQuery,
  useDeletePropertyMutation,
} from "@/redux/api/propertyApi";
import { Pagination } from "@/components/ui/Pagination";

export default function AdminPropertiesPage() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    sortBy: "createdAt",
    sortOrder: "desc" as "asc" | "desc",
    minPrice: "",
    maxPrice: "",
    location: "",
    type: "",
    bedrooms: "",
    bathrooms: "",
    status: "",
  });

  const { data, isLoading, isError } = useGetPropertiesQuery({
    searchTerm: search,
    ...Object.fromEntries(
      Object.entries(filters).filter(([, value]) => value !== "" && value !== undefined)
    ),
  });
  const [deleteProperty] = useDeletePropertyMutation();

  const properties: {
    id: string;
    title: string;
    location: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    status?: string;
    createdAt?: string;
    seller?: { name: string };
  }[] = data?.data ?? [];
  const total = data?.meta?.total ?? properties.length;
  const limit = data?.meta?.limit ?? 12;
  const totalPages = data?.meta?.totalPages ?? (total > 0 ? Math.ceil(total / limit) : 0);
  const currentPage = data?.meta?.page ?? 1;
  const pagination = { total, limit, page: currentPage, totalPages };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this property permanently?")) return;
    try {
      await deleteProperty(id).unwrap();
      toast.success("Property deleted.");
    } catch {
      toast.error("Failed to delete property.");
    }
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 rounded-xl bg-luxury-gold/10">
            <Building className="h-6 w-6 text-luxury-gold" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-foreground">
            Properties
          </h1>
        </div>
        <p className="text-muted-foreground mt-1 ml-1">
          Browse and manage all listed properties on the platform.
        </p>
      </motion.div>

      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setFilters(prev => ({ ...prev, page: 1 }));
            }}
            placeholder="Search by title or location…"
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-luxury-gold/50"
          />
        </div>

        {/* Advanced Filters */}
        <div className="flex flex-wrap gap-3">
          <input
            type="number"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value, page: 1 }))}
            className="px-4 py-2 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-luxury-gold/50"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value, page: 1 }))}
            className="px-4 py-2 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-luxury-gold/50"
          />
          <input
            type="text"
            placeholder="Location"
            value={filters.location}
            onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value, page: 1 }))}
            className="px-4 py-2 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-luxury-gold/50"
          />
          <select
            value={filters.type}
            onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value, page: 1 }))}
            className="px-4 py-2 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-luxury-gold/50"
          >
            <option value="">All Types</option>
            <option value="Villa">Villa</option>
            <option value="Apartment">Apartment</option>
            <option value="Penthouse">Penthouse</option>
            <option value="Mansion">Mansion</option>
            <option value="Condo">Condo</option>
            <option value="Townhouse">Townhouse</option>
          </select>
          <select
            value={filters.bedrooms}
            onChange={(e) => setFilters(prev => ({ ...prev, bedrooms: e.target.value, page: 1 }))}
            className="px-4 py-2 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-luxury-gold/50"
          >
            <option value="">Bedrooms</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
          </select>
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value, page: 1 }))}
            className="px-4 py-2 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-luxury-gold/50"
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="SOLD">Sold</option>
            <option value="PENDING">Pending</option>
          </select>
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value, page: 1 }))}
            className="px-4 py-2 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-luxury-gold/50"
          >
            <option value="createdAt">Sort by Date</option>
            <option value="price">Sort by Price</option>
            <option value="title">Sort by Title</option>
            <option value="location">Sort by Location</option>
          </select>
          <button
            onClick={() => setFilters(prev => ({ 
              ...prev, 
              sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc',
              page: 1 
            }))}
            className="px-4 py-2 rounded-xl bg-card border border-border text-sm hover:bg-muted/50 transition-colors flex items-center gap-2"
          >
            <ArrowUpDown className="h-4 w-4" />
            {filters.sortOrder === 'asc' ? 'Low-High' : 'High-Low'}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-luxury-gold border-t-transparent rounded-full animate-spin" />
        </div>
      ) : isError ? (
        <div className="flex items-center justify-center h-48 text-muted-foreground">
          Failed to load properties.
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="overflow-x-auto"
        >
          {properties.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              No properties found.
            </div>
          ) : (
            <table className="w-full bg-card rounded-xl border border-border overflow-hidden">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Beds/Baths
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Seller
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {properties.map((property, i) => (
                  <motion.tr
                    key={property.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <h4 className="font-semibold text-foreground font-heading line-clamp-2 mb-1">
                          {property.title}
                        </h4>
                        <div className="h-1 bg-gradient-to-r from-luxury-gold via-luxury-gold/60 to-transparent rounded-full" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <MapPin className="h-4 w-4 shrink-0" />
                        <span className="truncate max-w-xs">{property.location}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xl font-bold text-luxury-gold font-heading">
                        ${property.price?.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <BedDouble className="h-4 w-4" />
                          {property.bedrooms}
                        </span>
                        <span className="flex items-center gap-1">
                          <Bath className="h-4 w-4" />
                          {property.bathrooms}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          property.status === "SOLD" || property.status === "sold"
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {property.status ?? "Active"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-muted-foreground">
                        {property.seller?.name || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <button
                          onClick={() => handleDelete(property.id)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-red-600 border border-red-200 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </motion.div>
      )}

      {/* Pagination */}
      <div className="mt-8">
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={(page) => setFilters(prev => ({ ...prev, page }))}
        />
      </div>
    </div>
  );
}
