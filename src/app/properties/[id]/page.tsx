"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { useGetPropertyDetailsQuery } from "@/redux/api/propertyApi";
import {
  MapPin,
  BedDouble,
  Bath,
  Square,
  Home,
  Heart,
  Share2,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Image from "next/image";
import { useCreateViewingMutation } from "@/redux/api/viewing";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";

export default function PropertyDetailsPage() {
  const { isAuthenticated } = useAuth();
  const { id } = useParams();
  const [isFavorite, setIsFavorite] = useState(false);
  const { data, isLoading } = useGetPropertyDetailsQuery(id as string, {
    skip: !id,
  });
  const [createViewing, { isLoading: isCreatingViewing }] = useCreateViewingMutation();
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");

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

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      return toast.error("Please sign in to schedule a viewing");
    }
    if (!inquiryForm.name || !inquiryForm.email || !inquiryForm.phone) {
      return toast.error("Please fill in all required fields");
    }
    if (!preferredDate || !preferredTime) {
      return toast.error("Please select your preferred date and time");
    }

    try {
      const viewingData = {
        property: id as string,
        name: inquiryForm.name,
        email: inquiryForm.email,
        phone: inquiryForm.phone,
        message: inquiryForm.message,
        preferredDate: new Date(preferredDate).toISOString(),
        preferredTime,
        status: 'pending'
      };

      await createViewing(viewingData).unwrap();
      toast.success("Viewing scheduled successfully! We'll contact you soon.");
      setIsInquiryModalOpen(false);
      setInquiryForm({ name: "", email: "", phone: "", message: "" });
      setPreferredDate("");
      setPreferredTime("");
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'data' in error 
        ? (error as { data?: { message?: string } }).data?.message 
        : 'Failed to schedule viewing. Please try again.';
      toast.error(errorMessage || "Failed to schedule viewing. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center space-y-6">
        <div className="w-12 h-12 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin" />
        <p className="text-white/40 font-black uppercase tracking-[0.3em] text-[10px]">
          Loading Property Details
        </p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-10">
        <div className="max-w-md w-full bg-[#1A1A1A] border border-white/5 rounded-sm p-12 text-center space-y-6">
          <div className="w-12 h-12 bg-white/5 rounded-2xl mx-auto flex items-center justify-center">
            <Home className="w-6 h-6 text-luxury-gold" />
          </div>
          <h2 className="text-2xl font-serif text-white">Property Not Found</h2>
          <p className="text-white/40">
            The property you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={property.images[0] || "/images/property-placeholder.jpg"}
            alt={property.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#0A0A0A] via-transparent to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-10">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 text-luxury-gold">
                <MapPin className="w-5 h-5" />
                <span className="text-sm uppercase tracking-widest">
                  {property.location}
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-serif text-white">
                {property.title}
              </h1>
              <div className="flex items-center gap-6 text-white">
                <div className="flex items-center gap-2">
                  <BedDouble className="w-5 h-5" />
                  <span>{property.bedrooms} Beds</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="w-5 h-5" />
                  <span>{property.bathrooms} Baths</span>
                </div>
                <div className="flex items-center gap-2">
                  <Square className="w-5 h-5" />
                  <span>{property.area} sqft</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Property Details */}
      <section className="py-20 px-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                <h2 className="text-3xl md:text-4xl font-serif text-white">
                  Description
                </h2>
                <p className="text-white/60 leading-relaxed">
                  {property.description}
                </p>
              </motion.div>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-6"
              >
                <h2 className="text-3xl md:text-4xl font-serif text-white">
                  Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {property.features?.map((feature: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 text-white"
                    >
                      <Check className="w-5 h-5 text-luxury-gold" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Gallery */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-6"
              >
                <h2 className="text-3xl md:text-4xl font-serif text-white">
                  Gallery
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {property.images
                    ?.slice(1)
                    .map((image: string, index: number) => (
                      <div
                        key={index}
                        className="relative aspect-video rounded-lg overflow-hidden"
                      >
                        <Image
                          src={image}
                          alt={`${property.title} - Image ${index + 2}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-[#1A1A1A] border border-white/5 rounded-sm p-8 space-y-6"
              >
                <div className="text-center">
                  <div className="text-4xl font-serif text-luxury-gold">
                    ${property.price.toLocaleString()}
                  </div>
                  <p className="text-white/60 text-sm mt-2">
                    $
                    {Math.round(
                      property.price / property.area,
                    ).toLocaleString()}
                    /sqft
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleFavorite}
                    variant="outline"
                    className="flex-1 border-white/20 text-white hover:bg-white hover:text-black"
                  >
                    <Heart
                      className={`w-4 h-4 mr-2 ${isFavorite ? "fill-current" : ""}`}
                    />
                    {isFavorite ? "Saved" : "Save"}
                  </Button>
                  <Button
                    onClick={handleShare}
                    variant="outline"
                    className="flex-1 border-white/20 text-white hover:bg-white hover:text-black"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>

                <Button
                  onClick={() => setIsInquiryModalOpen(true)}
                  className="w-full bg-luxury-gold hover:bg-white text-black font-black uppercase tracking-widest py-4"
                  disabled={!isAuthenticated}
                >
                  {isAuthenticated
                    ? "Schedule Private Tour"
                    : "Sign In to Schedule Tour"}
                </Button>

                {!isAuthenticated && (
                  <p className="text-white/60 text-sm text-center">
                    Please sign in to schedule a property tour
                  </p>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section className="py-20 px-10 bg-[#1A1A1A]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h2 className="text-4xl md:text-5xl font-serif text-white mb-4">
                Schedule a Private Tour
              </h2>
              <div className="w-24 h-1 bg-luxury-gold mx-auto" />
              <p className="text-white/60 mt-4 max-w-2xl mx-auto">
                Interested in this property? Fill out the form below and our
                team will contact you to schedule a private viewing.
              </p>
            </div>

            <form onSubmit={handleInquirySubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label
                    htmlFor="name"
                    className="text-white/80 text-sm uppercase tracking-widest mb-2 block"
                  >
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={inquiryForm.name}
                    onChange={(e) =>
                      setInquiryForm({ ...inquiryForm, name: e.target.value })
                    }
                    className="bg-[#0A0A0A] border-white/10 text-white placeholder:text-white/40 rounded-sm h-12 focus:border-luxury-gold"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <Label
                    htmlFor="email"
                    className="text-white/80 text-sm uppercase tracking-widest mb-2 block"
                  >
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={inquiryForm.email}
                    onChange={(e) =>
                      setInquiryForm({ ...inquiryForm, email: e.target.value })
                    }
                    className="bg-[#0A0A0A] border-white/10 text-white placeholder:text-white/40 rounded-sm h-12 focus:border-luxury-gold"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <Label
                  htmlFor="phone"
                  className="text-white/80 text-sm uppercase tracking-widest mb-2 block"
                >
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={inquiryForm.phone}
                  onChange={(e) =>
                    setInquiryForm({ ...inquiryForm, phone: e.target.value })
                  }
                  className="bg-[#0A0A0A] border-white/10 text-white placeholder:text-white/40 rounded-sm h-12 focus:border-luxury-gold"
                  placeholder="+1 (555) 123-4567"
                  required
                />
              </div>

              <div>
                <Label
                  htmlFor="message"
                  className="text-white/80 text-sm uppercase tracking-widest mb-2 block"
                >
                  Message (Optional)
                </Label>
                <Textarea
                  id="message"
                  value={inquiryForm.message}
                  onChange={(e) =>
                    setInquiryForm({ ...inquiryForm, message: e.target.value })
                  }
                  className="bg-[#0A0A0A] border-white/10 text-white placeholder:text-white/40 rounded-sm min-h-32 focus:border-luxury-gold resize-none"
                  placeholder="Tell us about your ideal viewing time or any specific questions..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label
                    htmlFor="preferred-date"
                    className="text-white/80 text-sm uppercase tracking-widest mb-2 block"
                  >
                    Preferred Date *
                  </Label>
                  <Input
                    id="preferred-date"
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="bg-[#0A0A0A] border-white/10 text-white placeholder:text-white/40 rounded-sm h-12 focus:border-luxury-gold"
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div>
                  <Label
                    htmlFor="preferred-time"
                    className="text-white/80 text-sm uppercase tracking-widest mb-2 block"
                  >
                    Preferred Time *
                  </Label>
                  <Input
                    id="preferred-time"
                    type="time"
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="bg-[#0A0A0A] border-white/10 text-white placeholder:text-white/40 rounded-sm h-12 focus:border-luxury-gold"
                    min="09:00"
                    max="18:00"
                    required
                  />
                </div>
              </div>

              <div className="text-center">
                <Button
                  type="submit"
                  className="bg-luxury-gold hover:bg-white text-black font-black uppercase tracking-widest px-12 py-4 h-auto"
                  disabled={!isAuthenticated || isCreatingViewing}
                >
                  {isCreatingViewing
                    ? "Scheduling..."
                    : isAuthenticated
                    ? "Schedule Private Tour"
                    : "Sign In to Schedule Tour"}
                </Button>
                {!isAuthenticated && (
                  <p className="text-white/60 mt-4 text-sm">
                    Please sign in to schedule a property tour
                  </p>
                )}
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Location Map */}
      <section className="py-20 px-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h2 className="text-4xl md:text-5xl font-serif text-white mb-4">
                Location
              </h2>
              <div className="w-24 h-1 bg-luxury-gold mx-auto" />
              <p className="text-white/60 mt-4">{property.location}</p>
            </div>

            <div className="bg-[#1A1A1A] border border-white/5 rounded-sm aspect-video flex items-center justify-center">
              <div className="text-center space-y-4">
                <MapPin className="w-16 h-16 text-luxury-gold mx-auto" />
                <p className="text-white/80">
                  Interactive map showing property location in{" "}
                  {property.location}
                </p>
                <p className="text-white/60 text-sm">
                  Map integration coming soon
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Inquiry Modal */}
      <Dialog open={isInquiryModalOpen} onOpenChange={setIsInquiryModalOpen}>
        <DialogContent className="bg-[#1A1A1A] border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif text-white">
              Schedule Private Tour
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleInquirySubmit} className="space-y-4">
            <div>
              <Label htmlFor="modal-name" className="text-white/80 text-sm">
                Full Name *
              </Label>
              <Input
                id="modal-name"
                type="text"
                value={inquiryForm.name}
                onChange={(e) =>
                  setInquiryForm({ ...inquiryForm, name: e.target.value })
                }
                className="bg-[#0A0A0A] border-white/10 text-white placeholder:text-white/40 rounded-sm h-10 focus:border-luxury-gold mt-2"
                placeholder="John Doe"
                required
              />
            </div>
            <div>
              <Label htmlFor="modal-email" className="text-white/80 text-sm">
                Email *
              </Label>
              <Input
                id="modal-email"
                type="email"
                value={inquiryForm.email}
                onChange={(e) =>
                  setInquiryForm({ ...inquiryForm, email: e.target.value })
                }
                className="bg-[#0A0A0A] border-white/10 text-white placeholder:text-white/40 rounded-sm h-10 focus:border-luxury-gold mt-2"
                placeholder="john@example.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="modal-phone" className="text-white/80 text-sm">
                Phone *
              </Label>
              <Input
                id="modal-phone"
                type="tel"
                value={inquiryForm.phone}
                onChange={(e) =>
                  setInquiryForm({ ...inquiryForm, phone: e.target.value })
                }
                className="bg-[#0A0A0A] border-white/10 text-white placeholder:text-white/40 rounded-sm h-10 focus:border-luxury-gold mt-2"
                placeholder="+1 (555) 123-4567"
                required
              />
            </div>
            <div>
              <Label htmlFor="modal-date" className="text-white/80 text-sm">
                Preferred Date *
              </Label>
              <Input
                id="modal-date"
                type="date"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                className="bg-[#0A0A0A] border-white/10 text-white placeholder:text-white/40 rounded-sm h-10 focus:border-luxury-gold mt-2"
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            <div>
              <Label htmlFor="modal-time" className="text-white/80 text-sm">
                Preferred Time *
              </Label>
              <Input
                id="modal-time"
                type="time"
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className="bg-[#0A0A0A] border-white/10 text-white placeholder:text-white/40 rounded-sm h-10 focus:border-luxury-gold mt-2"
                min="09:00"
                max="18:00"
                required
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsInquiryModalOpen(false)}
                className="flex-1 border-white/20 text-white hover:bg-white hover:text-black"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-luxury-gold hover:bg-white text-black font-black uppercase tracking-widest"
                disabled={isCreatingViewing}
              >
                {isCreatingViewing ? "Scheduling..." : "Schedule Tour"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
