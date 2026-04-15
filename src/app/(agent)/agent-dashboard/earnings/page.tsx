"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  Building,
  Target,
  Download,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pagination } from "@/components/ui/Pagination";
import { DataTable } from "@/components/ui/data-table";
import {
  useGetMyAgentProfileQuery,
  useGetAgentEarningsQuery,
} from "@/redux/api/agentApi";
import Link from "next/link";

// Define types for earnings data
interface EarningRecord {
  _id: string;
  propertyTitle: string;
  clientName: string;
  amount: number;
  commissionRate: number;
  saleDate: string;
  status: "completed" | "pending" | "cancelled";
}

interface EarningsStats {
  totalEarnings: number;
  monthlyEarnings: number;
  totalSales: number;
  averageCommission: number;
}

export default function AgentEarningsPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [periodFilter, setPeriodFilter] = useState<string | null>("all");
  const [statusFilter, setStatusFilter] = useState<string | null>("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const { data: agentData, isLoading: agentLoading } =
    useGetMyAgentProfileQuery(undefined);
  const agent = agentData?.data || agentData?.data;

  // API call for earnings data
  const { data: earningsData, isLoading: earningsLoading } =
    useGetAgentEarningsQuery({
      page,
      limit,
      period: periodFilter,
      status: statusFilter,
    });

  const earnings = earningsData?.data?.earnings || [];
  const stats = earningsData?.data?.stats || {};
  const pagination = earningsData?.data?.pagination || {
    total: 0,
    page,
    limit,
    totalPages: 0,
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Define columns for the earnings data table
  const earningsColumns = [
    {
      key: "propertyTitle",
      header: "Property",
      cell: (row: EarningRecord) => (
        <div>
          <div className="font-semibold text-foreground">
            {row.propertyTitle}
          </div>
          <div className="text-sm text-muted-foreground">{row.clientName}</div>
        </div>
      ),
      className: "w-64",
    },
    {
      key: "saleDate",
      header: "Date",
      cell: (row: EarningRecord) => (
        <div className="text-muted-foreground">
          {new Date(row.saleDate).toLocaleDateString()}
        </div>
      ),
      className: "w-32",
    },
    {
      key: "amount",
      header: "Amount",
      cell: (row: EarningRecord) => (
        <div className="font-bold text-foreground">
          {formatCurrency(row.amount)}
        </div>
      ),
      className: "w-32 text-right",
    },
    {
      key: "commissionRate",
      header: "Commission Rate",
      cell: (row: EarningRecord) => (
        <div className="text-center">
          <div className="font-bold">{row.commissionRate}%</div>
          <div className="text-xs text-muted-foreground">
            {formatCurrency(row.amount * (row.commissionRate / 100))}
          </div>
        </div>
      ),
      className: "w-40 text-center",
    },
    {
      key: "status",
      header: "Status",
      cell: (row: EarningRecord) => (
        <Badge className={getStatusColor(row.status)}>{row.status}</Badge>
      ),
      className: "w-24 text-center",
    },
  ];

  if (authLoading || agentLoading || earningsLoading) {
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
        <h2 className="text-xl font-bold text-red-800 mb-2">
          Authentication Required
        </h2>
        <p className="text-red-600">
          Please log in to access your earnings dashboard.
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
          <Button
            variant="outline"
            className="rounded-2xl h-12 px-6 font-semibold"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
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

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <Card className="rounded-2xl border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Earnings
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.totalEarnings || 0)}
            </div>
            <p className="text-xs text-muted-foreground">All time earnings</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Earnings
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.monthlyEarnings || 0)}
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSales || 0}</div>
            <p className="text-xs text-muted-foreground">Properties sold</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Commission
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.averageCommission || 0)}
            </div>
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
            <CardDescription>
              Your commission earnings over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-muted/10 rounded-2xl border border-dashed border-border">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Earnings chart will be displayed here
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Integration with chart library needed
                </p>
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
            <CardDescription>
              Your commission earnings from property sales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              data={earnings}
              columns={earningsColumns}
              isLoading={earningsLoading}
              emptyMessage="No earnings found. Your commission earnings will appear here once you start selling properties."
            />
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
