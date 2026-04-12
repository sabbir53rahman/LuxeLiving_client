"use client";

import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { 
  Building, 
  Calendar, 
  Star,
  CheckCircle,
  DollarSign
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  useGetMyAgentProfileQuery, 
  useGetAgentViewingsQuery
} from "@/redux/api/agentApi";
import { Viewing } from "@/types/agent";

export default function AgentDashboardPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const { data: agentData, isLoading, error } = useGetMyAgentProfileQuery(undefined);
  const { data: viewingsData } = useGetAgentViewingsQuery({ limit: 5 });

  const agent = agentData?.data;
  const viewings = viewingsData?.data || [];

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "confirmed": return "bg-blue-100 text-blue-700 border-blue-200";
      case "completed": return "bg-green-100 text-green-700 border-green-200";
      case "cancelled": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-96"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-3xl"></div>
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
        <p className="text-red-600">Please log in to access your agent dashboard.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-3xl bg-red-50 border border-red-200">
        <h2 className="text-xl font-bold text-red-800 mb-2">Error Loading Dashboard</h2>
        <p className="text-red-600">Failed to load agent dashboard. Please try again later.</p>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="p-6 rounded-3xl bg-yellow-50 border border-yellow-200">
        <h2 className="text-xl font-bold text-yellow-800 mb-2">No Agent Profile</h2>
        <p className="text-yellow-600">You don&apos;t have an agent profile yet. Please contact support to set up your profile.</p>
      </div>
    );
  }

  const stats = {
    totalProperties: 0, // TODO: Fetch from agent properties API when available
    activeViewings: viewings.filter((v: Viewing) => v.status === 'confirmed').length,
    completedViewings: viewings.filter((v: Viewing) => v.status === 'completed').length,
    pendingViewings: viewings.filter((v: Viewing) => v.status === 'pending').length,
    averageRating: agent.averageRating || 0,
    totalReviews: agent.totalReviews || 0,
    totalEarnings: viewings.filter((v: Viewing) => v.status === 'completed').length * (agent.commissionRate || 0),
  };

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
            Agent Dashboard
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground mt-2 text-lg"
          >
            Manage your properties, viewings, and performance metrics.
          </motion.p>
        </div>
        
              </div>

      {/* Agent Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="rounded-3xl border-border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={agent?.avatar} alt={agent?.name} />
                  <AvatarFallback className="text-2xl font-bold">
                    {agent?.name?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">{agent?.name}</h2>
                    <p className="text-muted-foreground">{agent?.email}</p>
                    <p className="text-sm text-muted-foreground mt-1">{agent?.phone}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-luxury-gold">
                      <Star className="h-5 w-5 fill-current" />
                      <span className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{stats.totalReviews} reviews</p>
                  </div>
                </div>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {agent?.experience} years experience
                  </Badge>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {Array.isArray(agent?.specialization) ? agent.specialization.join(", ") : agent?.specialization}
                  </Badge>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                    {agent?.commissionRate}% commission
                  </Badge>
                  {agent?.isAvailable && (
                    <Badge className="bg-green-100 text-green-700">
                      Available
                    </Badge>
                  )}
                </div>
                
                {agent?.bio && (
                  <p className="mt-4 text-muted-foreground leading-relaxed">{agent?.bio}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="rounded-2xl border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProperties}</div>
              <p className="text-xs text-muted-foreground">Assigned to you</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="rounded-2xl border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Viewings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeViewings}</div>
              <p className="text-xs text-muted-foreground">Scheduled this week</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="rounded-2xl border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Viewings</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedViewings}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="rounded-2xl border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalEarnings.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">From completed viewings</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Overview Content */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="rounded-3xl border-border shadow-sm">
              <CardHeader>
                <CardTitle>Recent Viewings</CardTitle>
                <CardDescription>Your latest property viewings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {viewings.slice(0, 5).map((viewing: Viewing) => (
                    <div key={viewing._id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{viewing.property.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(viewing.scheduledDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge 
                        className={`text-xs ${getStatusColor(viewing.status)}`}
                      >
                        {viewing.status}
                      </Badge>
                    </div>
                  ))}
                  {viewings.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">No viewings scheduled</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="rounded-3xl border-border shadow-sm">
              <CardHeader>
                <CardTitle>Performance</CardTitle>
                <CardDescription>Your key performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Reviews</span>
                    <span className="font-semibold">{stats.totalReviews}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Average Rating</span>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold">{stats.averageRating.toFixed(1)}</span>
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Completion Rate</span>
                    <span className="font-semibold">
                      {viewings.length > 0 
                        ? `${((stats.completedViewings / viewings.length) * 100).toFixed(1)}%`
                        : '0%'
                      }
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Earnings</span>
                    <span className="font-semibold text-green-600">${stats.totalEarnings.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
