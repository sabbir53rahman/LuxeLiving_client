"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { 
  ArrowLeft,
  Mail,
  Phone,
  Building,
  Trash2,
  Users,
  Star,
  Search,
  UserCheck,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetMySellerPropertiesQuery } from "@/redux/api/sellerApi";
import { useRemoveAgentFromPropertyMutation } from "@/redux/api/sellerApi";
import { DataTable, Column } from "@/components/ui/data-table";
import { Pagination } from "@/components/ui/Pagination";
import Link from "next/link";

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

export default function AssignedAgentsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const { data: propertiesData, isLoading: propertiesLoading, error } = useGetMySellerPropertiesQuery({
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
    } catch (error: unknown) {
      console.error("Failed to remove agent:", error);
      const errorMessage = (error as { data?: { message?: string } })?.data?.message || "Failed to remove agent. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Process properties to get unique agents
  const properties = propertiesData?.data || [];
  const agentsWithProperties = properties
    .filter((property: Property) => property.agent)
    .reduce((acc: Array<{agent: Property['agent'], properties: Property[]}>, property: Property) => {
      const existingAgent = acc.find(item => item.agent?.id === property.agent?.id);
      if (existingAgent && property.agent) {
        existingAgent.properties.push(property);
      } else if (property.agent) {
        acc.push({
          agent: property.agent,
          properties: [property]
        });
      }
      return acc;
    }, []);

  // Define table columns
  const columns: Column<{agent: Property['agent'], properties: Property[]}>[] = [
    {
      key: "agent",
      header: "Agent",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={row.agent?.avatar} alt={row.agent?.name} />
            <AvatarFallback className="bg-luxury-emerald text-white text-sm font-bold">
              {row.agent?.name?.charAt(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{row.agent?.name}</div>
            {row.agent?.rating && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="w-3 h-3 text-yellow-500" fill="currentColor" />
                <span>{row.agent.rating.toFixed(1)}</span>
                {row.agent?.experience && (
                  <span>· {row.agent.experience} years</span>
                )}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "contact",
      header: "Contact",
      cell: (row) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-sm">
            <Mail className="w-3 h-3 text-muted-foreground" />
            <span className="truncate">{row.agent?.email}</span>
          </div>
          {row.agent?.contactNumber && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Phone className="w-3 h-3" />
              <span>{row.agent.contactNumber}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "properties",
      header: "Properties",
      cell: (row) => (
        <div>
          <div className="font-medium">{row.properties.length}</div>
          <div className="text-sm text-muted-foreground">
            {row.properties.map((p: Property) => p.title).join(', ')}
          </div>
        </div>
      ),
    },
    {
      key: "value",
      header: "Value",
      cell: (row) => (
        <div>
          <div className="font-medium">
            ${row.properties.reduce((sum: number, p: Property) => sum + p.price, 0).toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground">
            Total value
          </div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: () => (
        <Badge className="bg-green-100 text-green-700">
          Active
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      cell: (row) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="rounded-xl">
            <Mail className="w-3 h-3 mr-1" />
            Contact
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => handleRemoveAgent(row.properties[0]?.id)}
            disabled={removeLoading}
          >
            <Trash2 className="w-3 h-3 mr-1" />
            Remove
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading || propertiesLoading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-96"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-96 bg-gray-200 rounded-3xl"></div>
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
        <p className="text-red-600">Please log in to view your assigned agents.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-3xl bg-red-50 border border-red-200">
        <h2 className="text-xl font-bold text-red-800 mb-2">Error Loading Agents</h2>
        <p className="text-red-600">Failed to load assigned agents. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="flex items-center gap-4">
          <Link href="/seller-dashboard">
            <Button variant="outline" size="sm" className="rounded-xl">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl lg:text-4xl font-heading font-bold text-foreground"
            >
              Assigned Agents
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground mt-2 text-lg"
            >
              Manage agents assigned to your properties.
            </motion.p>
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex gap-3"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
            <Input
              placeholder="Search agents..."
              className="pl-12 h-12 rounded-2xl bg-muted/30 border-none focus:ring-2 focus:ring-purple-500/20 transition-all text-base w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value || "all")}>
            <SelectTrigger className="h-12 rounded-2xl bg-muted/30 border-none px-6 font-semibold w-48">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-none shadow-2xl">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="sold">Sold</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>
      </div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Card className="rounded-2xl border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned Agents</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agentsWithProperties.length}</div>
            <p className="text-xs text-muted-foreground">Active collaborations</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{properties.length}</div>
            <p className="text-xs text-muted-foreground">Your listings</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">With Agents</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {properties.filter((p: Property) => p.agent).length}
            </div>
            <p className="text-xs text-muted-foreground">Agent-managed</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Agents Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {agentsWithProperties.length === 0 ? (
          <Card className="rounded-3xl border-border shadow-sm">
            <CardContent className="text-center py-24">
              <div className="w-28 h-28 bg-muted rounded-full flex items-center justify-center mx-auto mb-6 text-muted-foreground/20">
                <Users className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">No Agents Assigned</h3>
              <p className="text-muted-foreground mb-10 max-w-sm mx-auto leading-relaxed">
                {searchTerm 
                  ? `No agents match "${searchTerm}". Try different keywords or browse all agents.`
                  : "You haven't assigned any agents to your properties yet."
                }
              </p>
              <Link href="/seller-dashboard/find-agents">
                <Button className="rounded-2xl h-12 px-6 font-semibold">
                  <Plus className="w-4 h-4 mr-2" />
                  Find Agents
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <DataTable
              data={agentsWithProperties}
              columns={columns as Column<{ id?: string; _id?: string; agent?: { id: string; name: string; email: string; contactNumber?: string; avatar?: string; rating?: number; experience?: number; }; properties: Property[]; }>[]}
              isLoading={propertiesLoading}
              emptyMessage="No agents assigned to your properties."
            />
            
            {/* Pagination */}
            {propertiesData?.meta && propertiesData.meta.totalPages > 1 && (
              <Pagination
                currentPage={propertiesData.meta.page}
                totalPages={propertiesData.meta.totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
