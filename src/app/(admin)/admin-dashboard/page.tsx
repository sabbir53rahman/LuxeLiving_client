"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Users,
  Building,
  CalendarCheck,
  Star,
  UserCheck,
  TrendingUp,
  ShieldCheck,
  Activity,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useGetOverviewStatsQuery } from "@/redux/api/metaApi";
import { useGetAllUsersQuery } from "@/redux/api/adminApi";
import { useGetPropertiesQuery } from "@/redux/api/propertyApi";
import { useGetAllViewingsQuery } from "@/redux/api/viewing";
import { useGetAllReviewsQuery } from "@/redux/api/reviewApi";
import { useGetAgentsQuery } from "@/redux/api/agentApi";

function StatCard({
  title,
  value,
  icon: Icon,
  color,
  delay = 0,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="p-6 rounded-3xl bg-card border border-border shadow-sm flex flex-col gap-4 hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-2xl ${color}`}>
          <Icon className="h-6 w-6" />
        </div>
        <TrendingUp className="h-4 w-4 text-green-500" />
      </div>
      <div>
        <p className="text-muted-foreground text-sm font-medium">{title}</p>
        <p className="text-3xl font-black font-heading text-foreground mt-1">
          {value ?? "—"}
        </p>
      </div>
    </motion.div>
  );
}

function ActivityBar({ value, index }: { value: number; index: number }) {
  return (
    <motion.div
      initial={{ height: 0 }}
      animate={{ height: `${value}%` }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      className="w-full bg-luxury-gold/20 hover:bg-luxury-gold rounded-t-sm transition-colors cursor-pointer"
    />
  );
}

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const { data: statsData, error: statsError, isLoading: statsLoading } = useGetOverviewStatsQuery(undefined, { 
    pollingInterval: 30000,
    refetchOnMountOrArgChange: true
  });
  const { data: usersData, error: usersError, isLoading: usersLoading } = useGetAllUsersQuery(undefined, { 
    pollingInterval: 30000,
    refetchOnMountOrArgChange: true
  });
  const { data: propertiesData, error: propertiesError, isLoading: propertiesLoading } = useGetPropertiesQuery(undefined, { 
    pollingInterval: 30000,
    refetchOnMountOrArgChange: true
  });
  const { data: viewingsData, error: viewingsError, isLoading: viewingsLoading } = useGetAllViewingsQuery(undefined, { 
    pollingInterval: 30000,
    refetchOnMountOrArgChange: true
  });
  const { data: reviewsData, error: reviewsError, isLoading: reviewsLoading } = useGetAllReviewsQuery(undefined, { 
    pollingInterval: 30000,
    refetchOnMountOrArgChange: true
  });
  const { data: agentsData, error: agentsError, isLoading: agentsLoading } = useGetAgentsQuery(undefined, { 
    pollingInterval: 30000,
    refetchOnMountOrArgChange: true
  });

  // Log errors and data for debugging
  React.useEffect(() => {
    console.log('=== Admin Dashboard Debug ===');
    console.log('Stats data:', statsData);
    console.log('Stats error:', statsError);
    console.log('Stats loading:', statsLoading);
    console.log('Users error:', usersError);
    console.log('Properties error:', propertiesError);
    console.log('Viewings error:', viewingsError);
    console.log('Reviews error:', reviewsError);
    console.log('Agents error:', agentsError);
    console.log('===============================');
  }, [statsData, statsError, statsLoading, usersError, propertiesError, viewingsError, reviewsError, agentsError]);

  const isLoading = statsLoading || usersLoading || propertiesLoading || viewingsLoading || reviewsLoading || agentsLoading;

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-10">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-96"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-gray-200 rounded-3xl"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Check if we have the essential stats data - if yes, show dashboard even if other APIs fail
  const hasStatsData = statsData && statsData.data;
  const criticalErrors = statsError; // Only stats error is critical for showing the dashboard
  
  // Show error state only if critical APIs fail and we have no data
  if (criticalErrors && !hasStatsData) {
    return (
      <div className="space-y-10">
        <div className="p-6 rounded-3xl bg-red-50 border border-red-200">
          <h2 className="text-xl font-bold text-red-800 mb-2">API Connection Error</h2>
          <p className="text-red-600 mb-4">
            Unable to connect to the backend server. Please ensure the backend is running on http://localhost:5000
          </p>
          <div className="text-sm text-red-500">
            <p>Check that:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Backend server is running on port 5000</li>
              <li>Database is connected</li>
              <li>API endpoints are accessible</li>
            </ul>
          </div>
        </div>
        
        {/* Show dashboard with fallback data */}
        <div className="space-y-10">
          <div>
            <h1 className="text-3xl lg:text-4xl font-heading font-bold text-foreground">
              Admin Dashboard (Offline Mode)
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Welcome back, {user?.name?.split(" ")[0]}. Showing cached data.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5">
            <StatCard title="Total Users" value="—" icon={Users} color="bg-blue-100 text-blue-600" />
            <StatCard title="Properties" value="—" icon={Building} color="bg-luxury-gold/10 text-luxury-gold" />
            <StatCard title="Viewings" value="—" icon={CalendarCheck} color="bg-purple-100 text-purple-600" />
            <StatCard title="Reviews" value="—" icon={Star} color="bg-amber-100 text-amber-600" />
            <StatCard title="Agents" value="—" icon={UserCheck} color="bg-emerald-100 text-emerald-600" />
          </div>
        </div>
      </div>
    );
  }

  // Show partial error warning if some non-critical APIs fail but we have main data
  const hasNonCriticalErrors = usersError || propertiesError || viewingsError || reviewsError || agentsError;
  if (hasNonCriticalErrors && hasStatsData) {
    console.log('Showing dashboard with partial data due to non-critical API errors');
  }

  const stats = statsData?.data ?? {};
  const totalUsers =
    stats.totalUsers ?? usersData?.data?.length ?? usersData?.meta?.total ?? 0;
  const totalProperties =
    stats.totalProperties ??
    propertiesData?.data?.length ??
    propertiesData?.meta?.total ??
    0;
  const totalViewings =
    stats.totalViewings ??
    viewingsData?.data?.length ??
    viewingsData?.meta?.total ??
    0;
  const totalReviews =
    stats.totalReviews ??
    reviewsData?.data?.length ??
    reviewsData?.meta?.total ??
    0;
  const totalAgents =
    stats.totalAgents ?? agentsData?.data?.length ?? agentsData?.meta?.total ?? 0;

  const chartValues = [30, 55, 40, 70, 85, 60, 90, 75, 55, 80, 65, 95];

  return (
    <div className="space-y-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 rounded-xl bg-luxury-gold/10">
            <ShieldCheck className="h-6 w-6 text-luxury-gold" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-heading font-bold text-foreground">
            Admin Dashboard
          </h1>
        </div>
        <p className="text-muted-foreground text-lg mt-1 ml-1">
          Welcome back, {user?.name?.split(" ")[0]}. Here&apos;s your platform overview.
        </p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5">
        <StatCard
          title="Total Users"
          value={totalUsers}
          icon={Users}
          color="bg-blue-100 text-blue-600"
          delay={0}
        />
        <StatCard
          title="Properties"
          value={totalProperties}
          icon={Building}
          color="bg-luxury-gold/10 text-luxury-gold"
          delay={0.05}
        />
        <StatCard
          title="Viewings"
          value={totalViewings}
          icon={CalendarCheck}
          color="bg-purple-100 text-purple-600"
          delay={0.1}
        />
        <StatCard
          title="Reviews"
          value={totalReviews}
          icon={Star}
          color="bg-amber-100 text-amber-600"
          delay={0.15}
        />
        <StatCard
          title="Agents"
          value={totalAgents}
          icon={UserCheck}
          color="bg-emerald-100 text-emerald-600"
          delay={0.2}
        />
      </div>

      {/* Chart + Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="lg:col-span-2 p-8 rounded-3xl bg-card border border-border shadow-sm"
        >
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <Activity className="h-5 w-5 text-luxury-gold" />
              <h2 className="text-xl font-bold font-heading">Platform Activity</h2>
            </div>
            <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
              Last 12 days
            </span>
          </div>
          <div className="h-48 w-full flex items-end justify-between gap-2">
            {chartValues.map((val, i) => (
              <ActivityBar key={i} value={val} index={i} />
            ))}
          </div>
          <div className="flex justify-between mt-3 text-xs text-muted-foreground">
            {["Apr 1", "", "", "Apr 4", "", "", "Apr 7", "", "", "Apr 10", "", "Apr 12"].map(
              (label, i) => (
                <span key={i} className="w-full text-center">
                  {label}
                </span>
              )
            )}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-8 rounded-3xl bg-luxury-slate text-white border border-white/10 shadow-lg relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-luxury-gold/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl" />

          <h2 className="text-xl font-bold font-heading mb-6 relative z-10">
            Quick Navigation
          </h2>

          <div className="space-y-3 relative z-10">
            {[
              { label: "Manage Users", href: "/admin-dashboard/users", icon: Users },
              { label: "All Properties", href: "/admin-dashboard/properties", icon: Building },
              { label: "All Viewings", href: "/admin-dashboard/viewings", icon: CalendarCheck },
              { label: "Moderate Reviews", href: "/admin-dashboard/reviews", icon: Star },
              { label: "Manage Agents", href: "/admin-dashboard/agents", icon: UserCheck },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold border border-white/10 hover:bg-white/10 transition-colors"
              >
                <item.icon className="h-4 w-4 text-luxury-gold" />
                {item.label}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
