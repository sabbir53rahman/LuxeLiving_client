"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { 
  DollarSign,
  TrendingUp,
  Calendar,
  Building,
  Target,
  Award,
  Download,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination } from "@/components/ui/Pagination";
import { useGetMyAgentProfileQuery } from "@/redux/api/agentApi";
import Link from "next/link";

// Mock earnings data - in real app, this would come from API
const mockEarningsData = {
  totalEarnings: 125750,
  monthlyEarnings: 15450,
  totalSales: 42,
  averageCommission: 2994,
  earnings: [
    {
      id: "1",
      propertyTitle: "Luxury Downtown Apartment",
      clientName: "John Smith",
      amount: 4500,
      commissionRate: 3,
      saleDate: "2024-01-15",
      status: "completed"
    },
    {
      id: "2", 
      propertyTitle: "Suburban Family Home",
      clientName: "Sarah Johnson",
      amount: 6750,
      commissionRate: 2.5,
      saleDate: "2024-01-22",
      status: "completed"
    },
    {
      id: "3",
      propertyTitle: "Beachfront Villa",
      clientName: "Michael Chen",
      amount: 8900,
      commissionRate: 3.5,
      saleDate: "2024-02-05",
      status: "completed"
    }
  ]
};

export default function AgentEarningsPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [periodFilter, setPeriodFilter] = useState<string | null>("all");
  const [statusFilter, setStatusFilter] = useState<string | null>("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const { data: agentData, isLoading } = useGetMyAgentProfileQuery(undefined);
  const agent = agentData?.data || agentData?.data;

  // Mock data - replace with actual API call
  const earningsData = mockEarningsData;
  const earnings = earningsData.earnings || [];
  const pagination = { total: earnings.length, page, limit, totalPages: Math.ceil(earnings.length / limit) };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (authLoading || isLoading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-96"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-gray-200 rounded-3xl"></div>
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
        <p className="text-red-600">Please log in to access your earnings dashboard.</p>
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
            Earnings Dashboard
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground mt-2 text-lg"
          >
            Track your commission earnings and sales performance.
          </motion.p>
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex gap-3"
        >
          <Button variant="outline" className="rounded-2xl h-12 px-6 font-semibold">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Link href="/agent-dashboard">
            <Button variant="outline" className="rounded-2xl h-12 px-6 font-semibold">
              Back to Dashboard
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <Card className="rounded-2xl border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(earningsData.totalEarnings)}</div>
            <p className="text-xs text-muted-foreground">All time earnings</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Earnings</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(earningsData.monthlyEarnings)}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{earningsData.totalSales}</div>
            <p className="text-xs text-muted-foreground">Properties sold</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Commission</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(earningsData.averageCommission)}</div>
            <p className="text-xs text-muted-foreground">Per sale</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Performance Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <Card className="lg:col-span-2 rounded-3xl border-border shadow-sm">
          <CardHeader>
            <CardTitle>Earnings Overview</CardTitle>
            <CardDescription>Your commission earnings over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-muted/10 rounded-2xl border border-dashed border-border">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">Earnings chart will be displayed here</p>
                <p className="text-sm text-muted-foreground mt-2">Integration with chart library needed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-border shadow-sm">
          <CardHeader>
            <CardTitle>Commission Rates</CardTitle>
            <CardDescription>Your current commission structure</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                <span className="font-medium">Standard Rate</span>
                <Badge variant="secondary">{agent?.commissionRate || 0}%</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                <span className="font-medium">Premium Properties</span>
                <Badge variant="secondary">3.5%</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                <span className="font-medium">Bulk Sales</span>
                <Badge variant="secondary">2.5%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card/40 backdrop-blur-md p-5 rounded-3xl border border-border/50 shadow-sm"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select value={periodFilter} onValueChange={setPeriodFilter}>
            <SelectTrigger className="h-14 rounded-2xl bg-muted/30 border-none px-6 font-semibold">
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-none shadow-2xl">
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-14 rounded-2xl bg-muted/30 border-none px-6 font-semibold">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-none shadow-2xl">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Button className="h-14 rounded-2xl bg-muted/30 border-none px-6 font-semibold">
            <Filter className="w-4 h-4 mr-2" />
            Apply Filters
          </Button>
        </div>
      </motion.div>

      {/* Earnings List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="rounded-3xl border-border shadow-sm">
          <CardHeader>
            <CardTitle>Earnings History</CardTitle>
            <CardDescription>Your commission earnings from property sales</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {earnings.length === 0 ? (
                <div className="text-center py-24 bg-muted/10 rounded-[3rem] border border-dashed border-border">
                  <div className="w-28 h-28 bg-muted rounded-full flex items-center justify-center mx-auto mb-6 text-muted-foreground/20">
                    <DollarSign className="w-12 h-12" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">
                    No Earnings Yet
                  </h3>
                  <p className="text-muted-foreground mb-10 max-w-sm mx-auto leading-relaxed">
                    Your commission earnings will appear here once you start selling properties.
                  </p>
                </div>
              ) : (
                earnings.map((earning, index) => (
                  <motion.div
                    key={earning.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border rounded-2xl p-6 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="font-bold text-lg text-foreground mb-1">{earning.propertyTitle}</h4>
                        <p className="text-sm text-muted-foreground">Client: {earning.clientName}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(earning.saleDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-foreground">{formatCurrency(earning.amount)}</div>
                        <Badge className={`mt-2 ${getStatusColor(earning.status)}`}>
                          {earning.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                      <div className="text-center p-3 bg-muted/50 rounded-xl">
                        <div className="font-bold text-lg">{earning.commissionRate}%</div>
                        <div className="text-xs text-muted-foreground">Commission Rate</div>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-xl">
                        <div className="font-bold text-lg">{formatCurrency(earning.amount * (earning.commissionRate / 100))}</div>
                        <div className="text-xs text-muted-foreground">Commission Earned</div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </motion.div>
      )}
    </div>
  );
}
