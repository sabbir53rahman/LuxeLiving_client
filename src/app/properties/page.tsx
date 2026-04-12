"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { PropertyCard } from "@/components/property/PropertyCard";
import { useGetPropertiesQuery } from "@/redux/api/propertyApi";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/Pagination";

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
  createdAt?: string;
  seller?: { name: string };
  agent?: { name: string };
  image?: string;
}

export default function PropertiesPage() {
  const [searchTerm, setSearchTerm] = useState("");
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
  });

  // Filter out empty strings from query params to avoid over-filtering on the backend
  const queryParams = {
    searchTerm: searchTerm || undefined,
    ...Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== "" && v !== undefined)
    )
  };

  const { data, isLoading, isError, error } = useGetPropertiesQuery(queryParams);

  const properties = data?.data || [];
  const pagination = data?.meta ?? { total: 0, page: 1, limit: 12, totalPages: 0 };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      
      {/* Header Section */}
      <div className="bg-luxury-slate pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 font-heading">
            Discover Premium <span className="text-luxury-gold">Properties</span>
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto text-lg mb-10">
            Browse our exclusive collection of luxury homes, villas, and apartments tailored to your exquisite taste.
          </p>

          {/* Search Filter Bar */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl max-w-5xl mx-auto flex flex-col md:flex-row gap-4">
            <div className="relative grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <Input 
                placeholder="Search by location, title..." 
                className="pl-10 bg-white/5 border-white/10 text-white placeholder-white/50 h-12 rounded-xl focus:border-luxury-gold"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setFilters(prev => ({ ...prev, page: 1 }));
                }}
              />
            </div>
            <div className="w-full md:w-48">
              <Select value={filters.type} onValueChange={(value: string | null) => setFilters(prev => ({ ...prev, type: value || '', page: 1 }))}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:border-luxury-gold">
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  <SelectItem value="Villa">Villa</SelectItem>
                  <SelectItem value="Apartment">Apartment</SelectItem>
                  <SelectItem value="Penthouse">Penthouse</SelectItem>
                  <SelectItem value="Mansion">Mansion</SelectItem>
                  <SelectItem value="Condo">Condo</SelectItem>
                  <SelectItem value="Townhouse">Townhouse</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-48">
              <Select value={filters.maxPrice} onValueChange={(value: string | null) => setFilters(prev => ({ ...prev, maxPrice: value || '', page: 1 }))}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:border-luxury-gold">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any Price</SelectItem>
                  <SelectItem value="1000000">Under $1M</SelectItem>
                  <SelectItem value="5000000">$1M - $5M</SelectItem>
                  <SelectItem value="10000000">Over $5M</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Select value={filters.sortBy} onValueChange={(value: string | null) => setFilters(prev => ({ ...prev, sortBy: value || 'createdAt', page: 1 }))}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:border-luxury-gold w-full md:w-48">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Newest</SelectItem>
                <SelectItem value="price">Price: Low to High</SelectItem>
                <SelectItem value="location">Location</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-16 w-full">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-10 h-10 animate-spin text-luxury-gold" />
          </div>
        ) : isError ? (
          <div className="text-center py-20 text-destructive bg-destructive/10 rounded-3xl border border-destructive/20 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold mb-2">Connection interupted</h3>
            <p>{(error as { data?: { message?: string } })?.data?.message || "Establish a connection to the vault to view these estates."}</p>
            <Button variant="outline" className="mt-4 border-destructive/50 hover:bg-destructive/10" onClick={() => window.location.reload()}>Retry Extraction</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property: Property, index: number) => (
              <PropertyCard key={property.id || index} property={property} index={index} />
            ))}
            {properties.length === 0 && (
              <div className="col-span-full text-center py-20 text-muted-foreground">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 text-muted-foreground/50" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">No properties found</h3>
                <p>Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        )}
        
        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={(page) => setFilters(prev => ({ ...prev, page }))}
            />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
