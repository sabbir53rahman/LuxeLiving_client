"use client";

import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { 
  Building, 
  Calendar, 
  Star,
  CheckCircle,
  DollarSign,
  Bell,
  User,
  Target,
  Activity,
  Sparkles,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  useGetMyAgentProfileQuery, 
  useGetAgentViewingsQuery
} from "@/redux/api/agentApi";
import { Viewing } from "@/types/agent";
import Link from "next/link";

// Section Header Component to match the seller dashboard design
const SectionHeader = ({
  numeral,
  title,
}: {
  numeral: string;
  title: string;
}) => (
  <div className="flex items-center gap-4 my-8">
    <div className="h-px w-8 bg-white/10" />
    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 whitespace-nowrap">
      {numeral}. <span className="text-white/80">{title}</span>
    </span>
    <div className="h-px flex-1 bg-white/10" />
  </div>
);

const ActivityChart = () => (
  <div className="h-48 w-full mt-4 flex items-end justify-between gap-2 relative">
    {/* Background grid lines */}
    <div className="absolute inset-0 flex flex-col justify-between">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="w-full h-px bg-white/5" />
      ))}
    </div>
    
    {[25, 40, 30, 55, 70, 35, 85, 60, 75, 50, 65, 80].map((val, i) => (
      <motion.div
        key={i}
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: `${val}%`, opacity: 1 }}
        whileHover={{ 
          height: `${Math.min(val + 10, 100)}%`,
          backgroundColor: "rgba(255, 215, 0, 0.6)",
          boxShadow: "0 0 20px rgba(255, 215, 0, 0.4)"
        }}
        transition={{ 
          delay: i * 0.05, 
          duration: 0.5,
          type: "spring",
          stiffness: 100
        }}
        className="w-full bg-linear-to-t from-luxury-gold/30 to-luxury-gold/10 rounded-t-sm cursor-pointer relative z-10"
      >
        {/* Glow effect on hover */}
        <motion.div 
          className="absolute inset-0 bg-luxury-gold rounded-t-sm opacity-0"
          whileHover={{ opacity: 0.3 }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>
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
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{ 
        scale: 1.02, 
        boxShadow: "0 20px 40px rgba(255, 215, 0, 0.1)",
        borderColor: "rgba(255, 215, 0, 0.2)"
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-[#1A1A1A] border border-white/5 rounded-sm p-6 space-y-4 relative overflow-hidden group"
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-luxury-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Animated corner accent */}
      <motion.div 
        className="absolute top-0 right-0 w-20 h-20 bg-luxury-gold/10 rounded-bl-full"
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <div className="flex items-start justify-between relative z-10">
        <motion.div 
          className="p-3 bg-white/5 rounded-sm group-hover:bg-luxury-gold/10 transition-colors duration-300"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
        >
          <Icon className="w-5 h-5 text-luxury-gold" />
        </motion.div>
        <motion.span 
          className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40"
          whileHover={{ color: "#FFD700", scale: 1.1 }}
          transition={{ duration: 0.2 }}
        >
          {trend}
        </motion.span>
      </div>
      
      <div className="space-y-2 relative z-10">
        <motion.h3 
          className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-1"
          whileHover={{ color: "#FFD700" }}
          transition={{ duration: 0.2 }}
        >
          {title}
        </motion.h3>
        <motion.p 
          className="text-3xl font-serif text-white tracking-tight"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {value}
        </motion.p>
      </div>
    </motion.div>
  );
}

export default function AgentDashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();

  const { data: agentData, isLoading: agentLoading, error } = useGetMyAgentProfileQuery(undefined);
  const { data: viewingsData } = useGetAgentViewingsQuery({ limit: 5 });

  const agent = agentData?.data;
  const viewings = viewingsData?.data || [];

  // Use the provided data
  const stats = {
    totalProperties: 0, // TODO: Fetch from agent properties API when available
    activeViewings: viewings.filter((v: Viewing) => v.status === 'confirmed').length,
    completedViewings: viewings.filter((v: Viewing) => v.status === 'completed').length,
    pendingViewings: viewings.filter((v: Viewing) => v.status === 'pending').length,
    averageRating: agent?.averageRating || 0,
    totalReviews: agent?.totalReviews || 0,
    totalEarnings: viewings.filter((v: Viewing) => v.status === 'completed').length * (agent?.commissionRate || 0),
  };

  if (isLoading || agentLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center space-y-6">
        <div className="w-12 h-12 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin" />
        <p className="text-white/40 font-black uppercase tracking-[0.3em] text-[10px]">
          Initializing Agent Dashboard
        </p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-10">
        <Card className="max-w-md w-full rounded-[2rem] border-white/5 bg-white/5 backdrop-blur-xl overflow-hidden">
          <CardContent className="p-12 text-center space-y-6">
            <div className="w-12 h-12 bg-white/5 rounded-2xl mx-auto flex items-center justify-center">
              <User className="w-6 h-6 text-luxury-gold" />
            </div>
            <h2 className="text-2xl font-serif text-white">
              Access Restricted
            </h2>
            <Link href="/login" className="block">
              <Button className="w-full h-12 bg-luxury-gold hover:bg-white text-black font-black uppercase tracking-widest transition-all">
                Identify Yourself
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-10">
        <Card className="max-w-md w-full rounded-[2rem] border-white/5 bg-white/5 backdrop-blur-xl overflow-hidden">
          <CardContent className="p-12 text-center space-y-6">
            <div className="w-12 h-12 bg-red-500/20 rounded-2xl mx-auto flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-red-500" />
            </div>
            <h2 className="text-2xl font-serif text-white">Error Loading Dashboard</h2>
            <p className="text-white/40">
              Failed to load agent dashboard. Please try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-10">
        <Card className="max-w-md w-full rounded-[2rem] border-white/5 bg-white/5 backdrop-blur-xl overflow-hidden">
          <CardContent className="p-12 text-center space-y-6">
            <div className="w-12 h-12 bg-white/5 rounded-2xl mx-auto flex items-center justify-center">
              <User className="w-6 h-6 text-luxury-gold" />
            </div>
            <h2 className="text-2xl font-serif text-white">No Agent Profile</h2>
            <p className="text-white/40">
              You don&apos;t have an agent profile yet. Please contact support to set up your profile.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-white font-sans selection:bg-luxury-gold selection:text-black pb-20">
      {/* Top Navigation / Header */}
      <header className="px-10 py-12 flex justify-between items-start">
        <div className="space-y-2">
          <h1 className="text-5xl font-serif text-white tracking-tight leading-none">
            Agent Dashboard
          </h1>
          <p className="text-white/40 text-sm font-medium italic">
            Managing your real estate expertise and client relationships.
          </p>
        </div>
        <div className="flex items-center gap-6">
          <button className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors relative">
            <Bell className="w-5 h-5 text-white/60" />
            <div className="absolute top-3 right-3 w-2 h-2 bg-luxury-gold rounded-full border-2 border-[#0E0E0E]" />
          </button>
          <div className="w-12 h-12 rounded-xl bg-linear-to-br from-white/10 to-transparent p-px">
            <div className="w-full h-full rounded-xl bg-[#1A1A1A] flex items-center justify-center overflow-hidden border border-white/5">
              <User className="text-luxury-gold w-6 h-6" />
            </div>
          </div>
        </div>
      </header>

      {/* Quick Actions - Top */}
      <div className="px-10 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/agent-dashboard/profile">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Button className="group w-full h-16 bg-luxury-gold hover:bg-white text-black font-serif shadow-2xl transition-all duration-500 rounded-sm overflow-hidden relative">
                {/* Animated background effect */}
                <motion.div 
                  className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-luxury-gold/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />
                
                <div className="flex items-center gap-4 relative z-10">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="w-10 h-10 bg-black/20 rounded-full flex items-center justify-center"
                  >
                    <User className="w-5 h-5" />
                  </motion.div>
                  <div>
                    <p className="font-black text-lg">Edit Profile</p>
                    <p className="text-black/60 text-sm">Update your professional information</p>
                  </div>
                </div>
              </Button>
            </motion.div>
          </Link>

          <Link href="/agent-dashboard/viewings">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Button className="group w-full h-16 bg-white/10 hover:bg-white/20 text-white font-serif shadow-2xl transition-all duration-500 rounded-sm overflow-hidden relative border border-white/10">
                {/* Animated background effect */}
                <motion.div 
                  className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />
                
                <div className="flex items-center gap-4 relative z-10">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center"
                  >
                    <Calendar className="w-5 h-5" />
                  </motion.div>
                  <div>
                    <p className="font-black text-lg">Manage Viewings</p>
                    <p className="text-white/60 text-sm">View and schedule property viewings</p>
                  </div>
                </div>
              </Button>
            </motion.div>
          </Link>
        </div>
      </div>

      {/* Main Content - Full Width */}
      <div className="px-10 space-y-8">
        {/* I. PERFORMANCE METRICS */}
        <SectionHeader numeral="I" title="PERFORMANCE METRICS" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatCard
            title="Assigned Properties"
            value={stats.totalProperties.toString()}
            icon={Building}
            trend={`${stats.activeViewings} active`}
          />
          <StatCard
            title="Active Viewings"
            value={stats.activeViewings.toString()}
            icon={Eye}
            trend={`${stats.completedViewings} completed`}
          />
          <StatCard
            title="Client Rating"
            value={stats.averageRating.toFixed(1)}
            icon={Star}
            trend={`${stats.totalReviews} reviews`}
          />
          <StatCard
            title="Total Earnings"
            value={`$${stats.totalEarnings.toLocaleString()}`}
            icon={DollarSign}
            trend={`${agent?.commissionRate}% commission`}
          />
        </div>

        {/* II. MARKET ANALYTICS */}
        <SectionHeader numeral="II" title="MARKET ANALYTICS" />

        <div className="bg-[#1A1A1A] border border-white/5 rounded-sm p-8 relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="grid grid-cols-8 gap-px">
              {[...Array(32)].map((_, i) => (
                <div key={i} className="h-px bg-white/5" />
              ))}
            </div>
          </div>

          <div className="relative z-10">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-luxury-gold rounded-full animate-pulse" />
                <h3 className="text-xl font-serif text-white ml-3">
                  Viewing Activity
                </h3>
              </div>
              <select className="bg-transparent text-sm text-white/40 border-none outline-none cursor-pointer">
                <option>Last 12 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-luxury-gold" />
              <Activity className="w-4 h-4 text-white/40 ml-2" />
              <Sparkles className="w-4 h-4 text-luxury-gold" />
            </div>
          </div>
          <ActivityChart />
        </div>

        {/* III. RECENT ACTIVITY */}
        <SectionHeader numeral="III" title="RECENT ACTIVITY" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-[#1A1A1A] border border-white/5 rounded-sm p-8">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="w-5 h-5 text-luxury-gold" />
              <h3 className="text-xl font-serif text-white">Recent Viewings</h3>
            </div>
            <div className="space-y-4">
              {viewings.slice(0, 5).map((viewing: Viewing) => (
                <div key={viewing._id} className="flex items-center justify-between p-4 bg-white/5 rounded-sm border border-white/10">
                  <div className="flex-1">
                    <p className="font-medium text-white">{viewing.property?.title || 'Property Viewing'}</p>
                    <p className="text-xs text-white/40">
                      {new Date(viewing.scheduledDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge className={`text-xs ${
                    viewing.status === 'completed' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                    viewing.status === 'confirmed' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                    viewing.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                    'bg-red-500/20 text-red-400 border-red-500/30'
                  }`}>
                    {viewing.status}
                  </Badge>
                </div>
              ))}
              {viewings.length === 0 && (
                <p className="text-center text-white/40 py-8">No viewings scheduled</p>
              )}
            </div>
          </div>

          <div className="bg-[#1A1A1A] border border-white/5 rounded-sm p-8">
            <div className="flex items-center gap-3 mb-6">
              <Star className="w-5 h-5 text-luxury-gold" />
              <h3 className="text-xl font-serif text-white">Performance Overview</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-sm">
                <span className="text-sm text-white/60">Total Reviews</span>
                <span className="font-semibold text-white">{stats.totalReviews}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-sm">
                <span className="text-sm text-white/60">Average Rating</span>
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-white">{stats.averageRating.toFixed(1)}</span>
                  <Star className="h-4 w-4 text-luxury-gold fill-current" />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-sm">
                <span className="text-sm text-white/60">Completion Rate</span>
                <span className="font-semibold text-white">
                  {viewings.length > 0 
                    ? `${((stats.completedViewings / viewings.length) * 100).toFixed(1)}%`
                    : '0%'
                  }
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-sm">
                <span className="text-sm text-white/60">Total Earnings</span>
                <span className="font-semibold text-luxury-gold">${stats.totalEarnings.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
