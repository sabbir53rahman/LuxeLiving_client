"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useGetPropertyDetailsQuery } from "@/redux/api/propertyApi";
import {
  Loader2,
  MapPin,
  BedDouble,
  Bath,
  Square,
  Calendar,
  Check,
  Shield,
  Heart,
  Share2,
  Phone,
  Mail,
  Star,
  Home,
  Camera,
  Maximize2,
  Car,
  Wifi,
  Wind,
  Droplets,
  Sun,
  Trees,
  Dumbbell,
  Utensils,
  Train,
  ShoppingBag,
  Stethoscope,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import Image from "next/image";
import { useCreateViewingMutation } from "@/redux/api/viewing";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";

export default function PropertyDetailsPage() {
  const { isAuthenticated } = useAuth();
  const { id } = useParams();
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { data, isLoading } = useGetPropertyDetailsQuery(id as string, {
    skip: !id,
  });
  const [createViewing, { isLoading: isBooking }] = useCreateViewingMutation();
  const [isViewingModalOpen, setIsViewingModalOpen] = useState(false);
  const [viewingForm, setViewingForm] = useState({
    date: "",
    notes: "",
  });

  const property = data?.data;

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? "Removed from favorites" : "Added to favorites");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property?.title,
        text: property?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  const handleCreateViewing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated)
      return toast.error("Please sign in to schedule a tour");
    if (!viewingForm.date) return toast.error("Please select a date and time");

    try {
      // datetime-local already returns valid format: "2024-04-11T14:00"
      const viewingDate = new Date(viewingForm.date).toISOString();

      await createViewing({
        propertyId: id as string,
        viewingDate: viewingDate, // Change from scheduledDate to viewingDate
        notes: viewingForm.notes || "",
      }).unwrap();

      toast.success("Viewing request sent! Check your dashboard for updates.");
      setIsViewingModalOpen(false);
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to schedule viewing");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-linear-to-br from-background via-background to-muted/20">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <Loader2 className="w-16 h-16 animate-spin text-luxury-gold mx-auto mb-4" />
            <p className="text-lg font-medium text-muted-foreground">
              Loading property details...
            </p>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <h2 className="text-2xl font-bold font-heading">
            Property not found
          </h2>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-linear-to-br from-background via-background to-muted/20">
      <Navbar />

      <main className="flex-1 pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section with Enhanced Design */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-8">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="px-4 py-2 bg-luxury-emerald/10 text-luxury-emerald font-bold rounded-full uppercase text-sm tracking-wide border border-luxury-emerald/20"
                  >
                    {property.type || "Premium Property"}
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="px-4 py-2 bg-luxury-gold/10 text-luxury-gold font-bold rounded-full uppercase text-sm tracking-wide flex items-center gap-2 border border-luxury-gold/20"
                  >
                    <Shield className="w-4 h-4" /> Verified Listing
                  </motion.span>
                  {property.status === "available" && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 }}
                      className="px-4 py-2 bg-green-500/10 text-green-600 font-bold rounded-full uppercase text-sm tracking-wide border border-green-500/20"
                    >
                      Available Now
                    </motion.span>
                  )}
                </div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-4xl md:text-5xl lg:text-6xl font-black font-heading text-foreground mb-6 leading-tight"
                >
                  {property.title}
                </motion.h1>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-wrap items-center gap-6 text-muted-foreground"
                >
                  <div className="flex items-center text-lg font-medium">
                    <MapPin className="w-5 h-5 mr-2 text-luxury-gold" />
                    {property.location}
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(property.averageRating || 0) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                      />
                    ))}
                    <span className="ml-2 text-sm font-medium">
                      {property.averageRating?.toFixed(1) || "0.0"} (
                      {property.totalReviews || 0} reviews)
                    </span>
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row lg:flex-col gap-4"
              >
                <div className="bg-linear-to-br from-card to-muted/30 backdrop-blur-sm p-6 rounded-3xl border border-border/50 shadow-premium">
                  <p className="text-sm text-muted-foreground font-bold uppercase mb-2">
                    Asking Price
                  </p>
                  <p className="text-4xl lg:text-5xl font-black text-luxury-gold mb-2">
                    ${property.price?.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ${(property.price / (property.area || 1)).toFixed(0)}/sqft
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleFavorite}
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 rounded-2xl border-border hover:bg-luxury-gold hover:text-white transition-all"
                  >
                    <Heart
                      className={`w-5 h-5 ${isFavorite ? "fill-current text-red-500" : ""}`}
                    />
                  </Button>
                  <Button
                    onClick={handleShare}
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 rounded-2xl border-border hover:bg-luxury-gold hover:text-white transition-all"
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </motion.div>
            </div>

            {/* Enhanced Image Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-100px lg:h-125 mb-12"
            >
              <div className="lg:col-span-3 rounded-3xl overflow-hidden relative group shadow-premium">
                <Image
                  src={
                    property.images?.[0] ||
                    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200"
                  }
                  alt={property.title}
                  width={1200}
                  height={800}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <div className="text-white">
                      <p className="text-sm font-medium opacity-90">
                        Main View
                      </p>
                      <p className="text-xs opacity-75">Click to expand</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-white border-white hover:bg-white hover:text-black"
                    >
                      <Maximize2 className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              </div>

              <div className="hidden lg:grid grid-rows-2 gap-4">
                <div className="rounded-3xl overflow-hidden relative group shadow-premium">
                  <Image
                    src={
                      property.images?.[1] ||
                      "https://images.unsplash.com/photo-1600607687931-57d1eb0bc369?w=800"
                    }
                    alt="Interior"
                    width={800}
                    height={600}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="rounded-3xl overflow-hidden relative group shadow-premium">
                  <Image
                    src={
                      property.images?.[2] ||
                      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800"
                    }
                    alt="Exterior"
                    width={800}
                    height={600}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="text-white text-center">
                      <p className="text-sm font-bold">
                        +{property.images?.length - 3 || 0}
                      </p>
                      <p className="text-xs">More Photos</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Enhanced Key Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-linear-to-br from-card to-muted/30 backdrop-blur-sm p-8 rounded-3xl border border-border/50 shadow-premium"
              >
                <h3 className="text-xl font-bold font-heading mb-6">
                  Property Specifications
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9 }}
                    className="text-center group"
                  >
                    <div className="w-16 h-16 bg-linear-to-br from-luxury-emerald to-luxury-emerald/80 rounded-2xl shadow-lg flex items-center justify-center text-white mx-auto mb-3 group-hover:shadow-xl transition-shadow">
                      <BedDouble className="w-8 h-8" />
                    </div>
                    <p className="text-3xl font-black text-foreground">
                      {property.bedrooms || 2}
                    </p>
                    <p className="text-sm font-medium text-muted-foreground uppercase">
                      Bedrooms
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.0 }}
                    className="text-center group"
                  >
                    <div className="w-16 h-16 bg-linear-to-br from-luxury-gold to-luxury-gold/80 rounded-2xl shadow-lg flex items-center justify-center text-white mx-auto mb-3 group-hover:shadow-xl transition-shadow">
                      <Bath className="w-8 h-8" />
                    </div>
                    <p className="text-3xl font-black text-foreground">
                      {property.bathrooms || 2}
                    </p>
                    <p className="text-sm font-medium text-muted-foreground uppercase">
                      Bathrooms
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.1 }}
                    className="text-center group"
                  >
                    <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg flex items-center justify-center text-white mx-auto mb-3 group-hover:shadow-xl transition-shadow">
                      <Square className="w-8 h-8" />
                    </div>
                    <p className="text-3xl font-black text-foreground">
                      {property.area || 15}
                    </p>
                    <p className="text-sm font-medium text-muted-foreground uppercase">
                      Square Feet
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2 }}
                    className="text-center group"
                  >
                    <div className="w-16 h-16 bg-linear-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg flex items-center justify-center text-white mx-auto mb-3 group-hover:shadow-xl transition-shadow">
                      <Home className="w-8 h-8" />
                    </div>
                    <p className="text-lg font-black text-foreground capitalize">
                      {property.type || "Apartment"}
                    </p>
                    <p className="text-sm font-medium text-muted-foreground uppercase">
                      Property Type
                    </p>
                  </motion.div>
                </div>
              </motion.div>

              {/* Enhanced Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 }}
                className="bg-card p-8 rounded-3xl border border-border shadow-premium"
              >
                <h3 className="text-2xl font-bold font-heading mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 bg-luxury-gold/10 rounded-lg flex items-center justify-center">
                    <Home className="w-5 h-5 text-luxury-gold" />
                  </div>
                  About This Property
                </h3>
                <div className="prose prose-lg text-muted-foreground max-w-none space-y-4">
                  <p className="text-lg leading-relaxed">
                    {property.description ||
                      "Discover exceptional living in this premium property that combines sophisticated design with modern convenience. This carefully curated space offers an unparalleled lifestyle experience with attention to every detail."}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="space-y-4">
                      <h4 className="font-bold text-foreground text-lg">
                        Key Highlights
                      </h4>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-luxury-emerald mt-0.5 shrink-0" />
                          <span>Premium location in {property.location}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-luxury-emerald mt-0.5 shrink-0" />
                          <span>Modern amenities and facilities</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-luxury-emerald mt-0.5 shrink-0" />
                          <span>Excellent investment opportunity</span>
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-bold text-foreground text-lg">
                        Property Features
                      </h4>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-luxury-emerald mt-0.5 shrink-0" />
                          <span>Spacious {property.area} sqft layout</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-luxury-emerald mt-0.5 shrink-0" />
                          <span>Natural lighting throughout</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-luxury-emerald mt-0.5 shrink-0" />
                          <span>High-quality finishes</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Enhanced Amenities */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 }}
                className="bg-card p-8 rounded-3xl border border-border shadow-premium"
              >
                <h3 className="text-2xl font-bold font-heading mb-8">
                  Premium Amenities
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      icon: Wifi,
                      name: "High-Speed Wi-Fi",
                      description: "Fiber optic internet",
                    },
                    {
                      icon: Car,
                      name: "Parking Space",
                      description: "Secure parking available",
                    },
                    {
                      icon: Wind,
                      name: "Air Conditioning",
                      description: "Central cooling system",
                    },
                    {
                      icon: Droplets,
                      name: "Water Supply",
                      description: "24/7 water availability",
                    },
                    {
                      icon: Sun,
                      name: "Natural Light",
                      description: "Abundant sunlight",
                    },
                    {
                      icon: Trees,
                      name: "Garden Area",
                      description: "Beautiful landscaping",
                    },
                  ].map((amenity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.5 + index * 0.1 }}
                      className="flex items-start gap-4 p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="w-12 h-12 bg-luxury-emerald/10 rounded-xl flex items-center justify-center shrink-0">
                        <amenity.icon className="w-6 h-6 text-luxury-emerald" />
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground mb-1">
                          {amenity.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {amenity.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Nearby Facilities */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6 }}
                className="bg-card p-8 rounded-3xl border border-border shadow-premium"
              >
                <h3 className="text-2xl font-bold font-heading mb-8">
                  Nearby Facilities
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { icon: Train, name: "Transportation", distance: "0.5 km" },
                    {
                      icon: ShoppingBag,
                      name: "Shopping Center",
                      distance: "1.2 km",
                    },
                    { icon: Stethoscope, name: "Hospital", distance: "2.0 km" },
                    {
                      icon: GraduationCap,
                      name: "Schools",
                      distance: "0.8 km",
                    },
                    { icon: Utensils, name: "Restaurants", distance: "0.3 km" },
                    {
                      icon: Dumbbell,
                      name: "Fitness Center",
                      distance: "0.6 km",
                    },
                  ].map((facility, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.7 + index * 0.1 }}
                      className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-luxury-gold/10 rounded-lg flex items-center justify-center">
                          <facility.icon className="w-5 h-5 text-luxury-gold" />
                        </div>
                        <span className="font-medium text-foreground">
                          {facility.name}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground font-medium">
                        {facility.distance}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Enhanced Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.8 }}
                className="sticky top-28 space-y-6"
              >
                {/* Contact Card */}
                <div className="bg-linear-to-br from-card to-muted/30 backdrop-blur-sm p-8 rounded-3xl border border-border/50 shadow-premium">
                  <h3 className="text-2xl font-bold font-heading mb-2">
                    Interested in this property?
                  </h3>
                  <p className="text-muted-foreground mb-8">
                    Schedule a private tour with our luxury real estate experts.
                  </p>

                  <div className="space-y-4 mb-8">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        onClick={() => setIsViewingModalOpen(true)}
                        className="w-full h-14 rounded-2xl bg-luxury-gold text-luxury-slate hover:bg-luxury-gold-light text-lg font-bold shadow-lg"
                      >
                        <Calendar className="w-5 h-5 mr-2" />
                        Schedule a Tour
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="outline"
                        className="w-full h-14 rounded-2xl border-luxury-slate text-luxury-slate hover:bg-luxury-slate hover:text-white text-lg font-bold"
                      >
                        <Mail className="w-5 h-5 mr-2" />
                        Request Information
                      </Button>
                    </motion.div>
                  </div>

                  {/* Quick Contact */}
                  <div className="pt-8 border-t border-border">
                    <p className="text-sm font-bold text-muted-foreground uppercase mb-4">
                      Quick Contact
                    </p>
                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start h-12 rounded-xl"
                      >
                        <Phone className="w-4 h-4 mr-3" />
                        +1 (555) 123-4567
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start h-12 rounded-xl"
                      >
                        <Mail className="w-4 h-4 mr-3" />
                        contact@luxeliving.com
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Agent Card */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.9 }}
                  className="bg-card p-6 rounded-3xl border border-border shadow-premium"
                >
                  <p className="text-xs uppercase font-bold text-muted-foreground tracking-wider mb-4">
                    Property Listed By
                  </p>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-linear-to-br from-luxury-emerald to-luxury-emerald/80 flex items-center justify-center">
                      <Home className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <p className="text-lg font-bold font-heading">
                        LuxeLiving Team
                      </p>
                      <p className="text-luxury-emerald text-sm font-medium">
                        Premium Real Estate
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-3 h-3 text-yellow-400 fill-current"
                          />
                        ))}
                        <span className="text-xs text-muted-foreground ml-1">
                          4.9 (127 reviews)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full h-10 rounded-xl"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call Agent
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full h-10 rounded-xl"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Email Agent
                    </Button>
                  </div>
                </motion.div>

                {/* Property Stats */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 2.0 }}
                  className="bg-card p-6 rounded-3xl border border-border shadow-premium"
                >
                  <h4 className="font-bold text-foreground mb-4">
                    Property Insights
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Price per sqft
                      </span>
                      <span className="font-bold text-foreground">
                        ${(property.price / (property.area || 1)).toFixed(0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Days on Market
                      </span>
                      <span className="font-bold text-foreground">12</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Views
                      </span>
                      <span className="font-bold text-foreground">1,247</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Saved
                      </span>
                      <span className="font-bold text-foreground">89</span>
                    </div>
                  </div>
                </motion.div>

                {/* Mortgage Calculator */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 2.1 }}
                  className="bg-linear-to-br from-luxury-gold/10 to-luxury-gold/5 p-6 rounded-3xl border border-luxury-gold/20"
                >
                  <h4 className="font-bold text-foreground mb-2">
                    Monthly Payment Estimate
                  </h4>
                  <p className="text-3xl font-black text-luxury-gold mb-1">
                    ${(property.price * 0.005).toFixed(0)}
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Based on 30-year mortgage at 5%
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full h-10 rounded-xl border-luxury-gold/50 text-luxury-gold hover:bg-luxury-gold hover:text-white"
                  >
                    Calculate Payment
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <Dialog open={isViewingModalOpen} onOpenChange={setIsViewingModalOpen}>
        <DialogContent className="max-w-md rounded-[2.5rem] p-10 border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black font-heading mb-2">
              Schedule Tour
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-lg">
              Reserve your private viewing of{" "}
              <span className="text-luxury-gold font-bold">
                {property?.title}
              </span>
              .
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateViewing} className="space-y-8 mt-6">
            <div className="space-y-3">
              <Label className="uppercase tracking-widest text-[10px] font-black opacity-50">
                Select Date & Time
              </Label>
              <Input
                type="datetime-local"
                value={viewingForm.date}
                onChange={(e) =>
                  setViewingForm((prev) => ({ ...prev, date: e.target.value }))
                }
                min={new Date().toISOString().slice(0, 16)}
                className="h-14 rounded-2xl bg-luxury-slate/5 border-none text-lg font-bold"
                required
              />
            </div>
            <div className="space-y-3">
              <Label className="uppercase tracking-widest text-[10px] font-black opacity-50">
                Special Requirements
              </Label>
              <Textarea
                value={viewingForm.notes}
                onChange={(e) =>
                  setViewingForm((prev) => ({ ...prev, notes: e.target.value }))
                }
                placeholder="Any specific focus for your tour?"
                className="rounded-2xl bg-luxury-slate/5 border-none p-6 text-lg min-h-[120px]"
              />
            </div>
            <Button
              type="submit"
              disabled={isBooking}
              className="w-full h-20 rounded-[1.5rem] bg-luxury-slate text-white text-xl font-black shadow-xl hover:bg-black transition-all"
            >
              {isBooking ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Confirm Request"
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
