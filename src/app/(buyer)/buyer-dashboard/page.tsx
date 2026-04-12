"use client";

import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { Heart, Calendar, DollarSign, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetMyViewingsQuery } from "@/redux/api/viewing";
import { useGetPropertiesQuery } from "@/redux/api/propertyApi";
import { IProperty, IViewing } from "@/types";
import Link from "next/link";
import Image from "next/image";


function StatCard({ title, value, icon: Icon, trend }: { title: string; value: string; icon: React.ComponentType<{ className?: string }>; trend: string }) {
  return (
    <motion.div 
       initial={{ opacity: 0, scale: 0.95 }}
       animate={{ opacity: 1, scale: 1 }}
       className="p-6 rounded-3xl bg-card border border-border shadow-sm flex flex-col justify-between"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 rounded-2xl bg-muted/50 text-luxury-gold">
          <Icon className="h-6 w-6" />
        </div>
        <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 rounded-full">
          {trend}
        </span>
      </div>
      <div>
        <h3 className="text-muted-foreground font-medium mb-1">{title}</h3>
        <p className="text-3xl font-black text-foreground font-heading">{value}</p>
      </div>
    </motion.div>
  );
}

function PropertyCard({ property }: { property: IProperty }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden group hover:shadow-hover transition-all duration-300"
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
          <Button variant="ghost" size="sm" className="bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full p-2">
            <Heart className="w-4 h-4 text-white" />
          </Button>
        </div>
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-foreground font-heading line-clamp-1 group-hover:text-luxury-gold transition-colors">
            {property.title}
          </h3>
          <span className="text-sm font-bold text-luxury-emerald">
            ${property.price?.toLocaleString() || '0'}
          </span>
        </div>
        <div className="flex items-center text-muted-foreground mb-4">
          <MapPin className="w-4 h-4 mr-1 text-luxury-emerald" />
          <span className="text-sm line-clamp-1">{property.location}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{property.bedrooms || 0} beds</span>
            <span>{property.bathrooms || 0} baths</span>
            <span>{property.area || 0} sqft</span>
          </div>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-sm ml-1">{property.rating || '4.5'}</span>
          </div>
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
          transition={{ delay: 0.1 }}
          className="text-3xl lg:text-4xl font-heading font-bold text-foreground"
        >
          Welcome Back, {user.name.split(' ')[0]}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground mt-2 text-lg"
        >
          Your dream home is closer than ever. Let&apos;s explore.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Saved Properties" value={stats.savedProperties.toString()} icon={Heart} trend="2 newly reduced" />
        <StatCard title="Scheduled Tours" value={stats.scheduledViewings.toString()} icon={Calendar} trend="Next tour tomorrow" />
        <StatCard title="Active Offers" value={stats.activeOffers.toString()} icon={DollarSign} trend="Under review" />
        <StatCard title="Reviews Written" value={stats.completedReviews.toString()} icon={Star} trend="Help others" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 p-8 rounded-3xl bg-card border border-border shadow-sm"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold font-heading">Recommended Properties</h2>
            <Link href="/properties">
              <Button variant="outline" className="rounded-xl">
                View All
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {properties.slice(0, 4).map((property: IProperty) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <Card className="rounded-3xl bg-luxury-slate text-white border border-white/10 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-luxury-gold/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-luxury-emerald/20 rounded-full blur-2xl" />
            
            <CardHeader>
              <CardTitle className="text-xl font-bold font-heading mb-6 relative z-10">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
              <Link href="/properties">
                <Button className="w-full bg-luxury-gold hover:bg-luxury-gold/90 text-luxury-slate rounded-xl h-12 font-bold">
                  Browse Properties
                </Button>
              </Link>
              <Link href="/buyer-dashboard/viewings">
                <Button variant="outline" className="w-full border-white/20 hover:bg-white/10 text-white rounded-xl h-12">
                  My Viewings ({viewings.length})
                </Button>
              </Link>
              <Link href="/agents">
                <Button variant="outline" className="w-full border-white/20 hover:bg-white/10 text-white rounded-xl h-12">
                  Find an Agent
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Recent Activity</CardTitle>
              <CardDescription>Your latest actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {viewings.slice(0, 3).map((viewing: IViewing) => (
                  <div key={viewing.id} className="flex items-center gap-3 pb-3 border-b last:border-0">
                    <div className="w-8 h-8 bg-luxury-emerald/10 rounded-full flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-luxury-emerald" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Viewing scheduled</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(viewing.viewingDate || viewing.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge className={viewing.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                      {viewing.status}
                    </Badge>
                  </div>
                ))}
                {viewings.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">No recent activity</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
