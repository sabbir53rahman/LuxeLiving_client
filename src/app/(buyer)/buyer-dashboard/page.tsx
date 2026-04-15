"use client";

import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { 
  Heart, 
  Calendar, 
  DollarSign,
  Star,
  Bell,
  User,
  Eye,
  MapPin,
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useGetMyViewingsQuery } from "@/redux/api/viewing";
import { useGetPropertiesQuery } from "@/redux/api/propertyApi";
import { IProperty, IViewing } from "@/types";
import Link from "next/link";
import Image from "next/image";


// Section Header Component to match the agent dashboard design
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
    
    {[45, 60, 35, 75, 85, 50, 90, 70, 80, 55, 65, 95].map((val, i) => (
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

function PropertyCard({ property }: { property: IProperty }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="bg-[#1A1A1A] border border-white/5 rounded-sm overflow-hidden group cursor-pointer"
    >
      <div className="relative aspect-4/3 overflow-hidden">
        <Image
          width={400}
          height={300}
          src={property.images?.[0] || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80"}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4">
          <Button variant="ghost" size="sm" className="bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full p-2 border border-white/10">
            <Heart className="w-4 h-4 text-white" />
          </Button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-4">
          <h3 className="text-white font-serif text-lg font-bold line-clamp-1">{property.title}</h3>
          <div className="flex items-center gap-2 text-white/80 text-sm">
            <MapPin className="w-4 h-4" />
            <span>{property.location}</span>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-4 text-sm text-white/60">
            <div className="flex items-center gap-1">
              <Home className="w-4 h-4" />
              {property.bedrooms || 0} beds
            </div>
            <div className="flex items-center gap-1">
              <Home className="w-4 h-4" />
              {property.bathrooms || 0} baths
            </div>
            <div className="flex items-center gap-1">
              <Home className="w-4 h-4" />
              {property.area || 0} sqft
            </div>
          </div>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-luxury-gold fill-current" />
            <span className="text-sm ml-1 text-white">{property.rating || '4.5'}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-serif text-luxury-gold">
            ${property.price?.toLocaleString() || '0'}
          </span>
          <Link href={`/properties/${property.id}`}>
            <Button 
              size="sm" 
              className="bg-luxury-gold hover:bg-white text-black font-black uppercase tracking-wider rounded-none"
            >
              <Eye className="w-4 h-4 mr-1" />
              View
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function BuyerDashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  // Fetch real data
  const { data: viewingsData } = useGetMyViewingsQuery({});
  const { data: propertiesData } = useGetPropertiesQuery({ 
    limit: 6,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  
  const viewings = viewingsData?.data || [];
  const properties = propertiesData?.data || [];
  
  const stats = {
    savedProperties: properties.length,
    scheduledViewings: viewings.filter((v: IViewing) => v.status === 'confirmed').length,
    activeOffers: viewings.filter((v: IViewing) => v.status === 'pending').length,
    completedReviews: viewings.filter((v: IViewing) => v.status === 'completed').length,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center space-y-6">
        <div className="w-12 h-12 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin" />
        <p className="text-white/40 font-black uppercase tracking-[0.3em] text-[10px]">
          Loading Buyer Dashboard
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

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-white font-sans selection:bg-luxury-gold selection:text-black pb-20">
      {/* Top Navigation / Header */}
      <header className="px-10 py-12 flex justify-between items-start">
        <div className="space-y-2">
          <h1 className="text-5xl font-serif text-white tracking-tight leading-none">
            Buyer Dashboard
          </h1>
          <p className="text-white/40 text-sm font-medium italic">
            Discovering your perfect luxury property.
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
          <Link href="/properties">
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
                    <Home className="w-5 h-5" />
                  </motion.div>
                  <div>
                    <p className="font-black text-lg">Browse Properties</p>
                    <p className="text-black/60 text-sm">Explore luxury listings</p>
                  </div>
                </div>
              </Button>
            </motion.div>
          </Link>

          <Link href="/buyer-dashboard/viewings">
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
                    <p className="font-black text-lg">My Viewings</p>
                    <p className="text-white/60 text-sm">Manage scheduled tours</p>
                  </div>
                </div>
              </Button>
            </motion.div>
          </Link>
        </div>
      </div>

      {/* Main Content - Full Width */}
      <div className="px-10 space-y-8">
        {/* I. PROPERTY INSIGHTS */}
        <SectionHeader numeral="I" title="PROPERTY INSIGHTS" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatCard
            title="Saved Properties"
            value={stats.savedProperties.toString()}
            icon={Heart}
            trend="2 newly reduced"
          />
          <StatCard
            title="Scheduled Tours"
            value={stats.scheduledViewings.toString()}
            icon={Calendar}
            trend="Next tour tomorrow"
          />
          <StatCard
            title="Active Offers"
            value={stats.activeOffers.toString()}
            icon={DollarSign}
            trend="Under review"
          />
          <StatCard
            title="Reviews Written"
            value={stats.completedReviews.toString()}
            icon={Star}
            trend="Help others"
          />
        </div>

        {/* II. PROPERTY ACTIVITY */}
        <SectionHeader numeral="II" title="PROPERTY ACTIVITY" />

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
                  Property Interest
                </h3>
              </div>
              <select className="bg-transparent text-sm text-white/40 border-none outline-none cursor-pointer">
                <option>Last 12 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Home className="w-4 h-4 text-luxury-gold" />
              <Eye className="w-4 h-4 text-white/40 ml-2" />
              <Heart className="w-4 h-4 text-luxury-gold" />
            </div>
          </div>
          <ActivityChart />
        </div>

        {/* III. RECOMMENDED PROPERTIES */}
        <SectionHeader numeral="III" title="RECOMMENDED PROPERTIES" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-serif text-white">Featured Listings</h3>
              <Link href="/properties">
                <Button variant="outline" className="border-white/10 hover:bg-white/10 text-white rounded-none">
                  View All
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {properties.slice(0, 4).map((property: IProperty) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <Card className="bg-[#1A1A1A] border border-white/5 rounded-sm p-8">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-xl font-serif text-white">Recent Activity</CardTitle>
                <CardDescription className="text-white/40">Your latest property interactions</CardDescription>
              </CardHeader>
              <CardContent className="p-0 space-y-4">
                {viewings.slice(0, 3).map((viewing: IViewing) => (
                  <div key={viewing.id} className="flex items-center gap-3 pb-3 border-b border-white/10 last:border-0">
                    <div className="w-8 h-8 bg-luxury-gold/10 rounded-full flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-luxury-gold" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">Viewing scheduled</p>
                      <p className="text-xs text-white/40">
                        {new Date(viewing.viewingDate || viewing.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge className={`text-xs ${
                      viewing.status === 'confirmed' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                      viewing.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                      'bg-red-500/20 text-red-400 border-red-500/30'
                    }`}>
                      {viewing.status}
                    </Badge>
                  </div>
                ))}
                {viewings.length === 0 && (
                  <p className="text-center text-white/40 py-4">No recent activity</p>
                )}
              </CardContent>
            </Card>

            <Link href="/agents">
              <Button className="w-full bg-white/10 hover:bg-white/20 text-white font-serif rounded-none border border-white/10">
                Find an Agent
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
