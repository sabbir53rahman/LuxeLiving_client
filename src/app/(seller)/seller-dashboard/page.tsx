"use client";

import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { Building, TrendingUp, Users, DollarSign, Eye, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetMySellerPropertiesQuery, useGetSellerStatsQuery } from "@/redux/api/sellerApi";
import Link from "next/link";

const ActivityChart = () => (
  <div className="h-48 w-full mt-4 flex items-end justify-between gap-2">
    {[30, 45, 25, 60, 75, 40, 90, 65, 80, 55, 70, 85].map((val, i) => (
      <motion.div
        key={i}
        initial={{ height: 0 }}
        animate={{ height: `${val}%` }}
        transition={{ delay: i * 0.05, duration: 0.5 }}
        className="w-full bg-luxury-emerald/20 rounded-t-sm hover:bg-luxury-emerald transition-colors cursor-pointer"
      />
    ))}
  </div>
);

function StatCard({
  title,
  value,
  icon: Icon,
  trend,
}: {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  trend: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-6 rounded-3xl bg-card border border-border shadow-sm flex flex-col justify-between"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 rounded-2xl bg-muted/50 text-luxury-emerald">
          <Icon className="h-6 w-6" />
        </div>
        <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 rounded-full">
          {trend}
        </span>
      </div>
      <div>
        <h3 className="text-muted-foreground font-medium mb-1">{title}</h3>
        <p className="text-3xl font-black text-foreground font-heading">
          {value}
        </p>
      </div>
    </motion.div>
  );
}

export default function SellerDashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { data: propertiesData } = useGetMySellerPropertiesQuery({});
  const { data: statsData } = useGetSellerStatsQuery({});

  const properties = propertiesData?.data || [];
  const stats = statsData?.data;
  
  const totalViews = stats?.totalViews || properties.reduce((sum: number, property: { views?: number }) => sum + (property.views || 0), 0);
  const pendingViewings = stats?.pendingViewings || 0;
  const totalRevenue = stats?.totalRevenue || 0;
  const activeProperties = stats?.activeProperties || properties.filter((p: { status?: string }) => p.status === 'active').length;
  const completedViewings = stats?.completedViewings || 0;

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-96"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
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
        <p className="text-red-600">Please log in to access your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl lg:text-4xl font-heading font-bold text-foreground"
        >
          Welcome Back, {user.name.split(" ")[0]}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground mt-2 text-lg"
        >
          Track your property&apos;s performance on the market.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Properties"
          value={properties.length.toString()}
          icon={Building}
          trend={`${activeProperties} active`}
        />
        <StatCard
          title="Total Views"
          value={totalViews.toLocaleString()}
          icon={Eye}
          trend="+22% this week"
        />
        <StatCard
          title="Pending Requests"
          value={pendingViewings.toString()}
          icon={Users}
          trend={`${pendingViewings} pending`}
        />
        <StatCard
          title="Completed Viewings"
          value={completedViewings.toString()}
          icon={Calendar}
          trend="This month"
        />
        <StatCard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          trend="+15% this month"
        />
        <StatCard
          title="Active Listings"
          value={activeProperties.toString()}
          icon={TrendingUp}
          trend="Live now"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 p-8 rounded-3xl bg-card border border-border shadow-sm"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold font-heading">
              Property Engagement
            </h2>
            <select className="bg-transparent text-sm text-muted-foreground border-none outline-none cursor-pointer">
              <option>Last 12 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <ActivityChart />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-8 rounded-3xl bg-luxury-slate text-white border border-white/10 shadow-lg relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-luxury-emerald/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-luxury-gold/20 rounded-full blur-2xl" />

          <h2 className="text-xl font-bold font-heading mb-6 relative z-10">
            Quick Actions
          </h2>

          <div className="space-y-4 relative z-10">
            <Link href="/seller-dashboard/requests">
              <Button className="w-full bg-luxury-emerald hover:bg-luxury-emerald-light text-white rounded-xl h-12 font-bold border-none">
                Review New Offers ({pendingViewings})
              </Button>
            </Link>
            <Link href="/seller-dashboard/my-properties">
              <Button
                variant="outline"
                className="w-full border-white/20 hover:bg-white/10 text-white rounded-xl h-12"
              >
                Manage Properties
              </Button>
            </Link>
            <Link href="/seller-dashboard/assigned-agents">
              <Button
                variant="outline"
                className="w-full border-white/20 hover:bg-white/10 text-white rounded-xl h-12"
              >
                Manage Agents
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
