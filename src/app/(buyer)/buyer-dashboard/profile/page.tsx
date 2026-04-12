"use client";

import { useGetProfileQuery, useUpdateProfileMutation, useUpdateBuyerProfileMutation } from "@/redux/api/userApi";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Camera, Loader2, Save, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Image from "next/image";
import { useState } from "react";

export default function BuyerProfilePage() {
  const { user, isAuthenticated, token } = useAuth();
  console.log("Auth state:", { user, isAuthenticated, token });
  
  const { data: profileData, isLoading: isProfileLoading } = useGetProfileQuery(undefined);
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [updateBuyerProfile, { isLoading: isUpdatingBuyer }] = useUpdateBuyerProfileMutation();
  
  const profile = profileData?.data;
  
  const getInitialFormData = (profile: { name?: string; email?: string; buyer?: { contactNumber?: string; address?: string }; profilePhoto?: string; image?: string } | null | undefined) => ({
    name: profile?.name || "",
    email: profile?.email || "",
    contactNumber: profile?.buyer?.contactNumber || "",
    address: profile?.buyer?.address || "",
    profilePhoto: profile?.profilePhoto || profile?.image || "",
  });

  const [formData, setFormData] = useState(getInitialFormData(profile));

  // Update form data when profile data changes
  if (profile && (formData.name !== profile.name || formData.email !== profile.email)) {
    setFormData(getInitialFormData(profile));
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Update general user profile (only fields that exist in User model)
      await updateProfile({
        name: formData.name,
      }).unwrap();

      // Update buyer-specific profile with contactNumber and address
      if (formData.contactNumber || formData.address) {
        await updateBuyerProfile({
          contactNumber: formData.contactNumber || undefined,
          address: formData.address || undefined,
        }).unwrap();
      }

      toast.success("Profile updated successfully!");
    } catch (error: unknown) {
      console.error("updateProfile error:", error);
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to update profile");
    }
  };

  if (isProfileLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-10 h-10 animate-spin text-luxury-gold" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div>
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl lg:text-4xl font-heading font-bold text-foreground"
        >
          Profile Settings
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground mt-2 text-lg"
        >
          Manage your personal information and security settings.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Col: Avatar & Status */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:col-span-1 space-y-6"
        >
          <div className="bg-card rounded-3xl p-8 border border-border shadow-sm text-center">
             <div className="relative inline-block mb-4 group">
               <div className="w-32 h-32 rounded-3xl overflow-hidden bg-muted border-2 border-luxury-gold/20 shadow-xl mx-auto relative">
                 <Image 
                   fill
                   src={formData.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'User')}`} 
                   alt={formData.name || 'User Profile'}
                   className="object-cover"
                 />
               </div>
               <button className="absolute -bottom-2 -right-2 p-3 bg-luxury-gold text-luxury-slate rounded-2xl shadow-lg hover:scale-110 transition-transform">
                 <Camera className="w-4 h-4" />
               </button>
             </div>
             <h3 className="text-xl font-bold font-heading">{formData.name}</h3>
             <p className="text-muted-foreground text-sm flex items-center justify-center gap-1 mt-1 font-medium italic">
               <ShieldCheck className="w-4 h-4 text-luxury-emerald inline" /> Verified Buyer
             </p>
             
             <div className="mt-8 pt-8 border-t border-border flex flex-col gap-3">
               <div className="flex justify-between items-center text-sm">
                 <span className="text-muted-foreground font-medium">Account Type</span>
                 <Badge className="bg-luxury-gold/10 text-luxury-gold border-none">BUYER</Badge>
               </div>
               <div className="flex justify-between items-center text-sm">
                 <span className="text-muted-foreground font-medium">Member Since</span>
                 <span className="font-bold">{new Date(profile?.createdAt).getFullYear()}</span>
               </div>
             </div>
          </div>
        </motion.div>

        {/* Right Col: Form */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:col-span-2"
        >
          <form onSubmit={handleSaveProfile} className="bg-card rounded-3xl p-8 border border-border shadow-sm space-y-8">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-3">
                 <Label className="uppercase tracking-widest text-[10px] font-black opacity-50">Full Name</Label>
                 <div className="relative">
                   <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                   <Input 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="pl-12 h-14 rounded-2xl bg-muted/30 border-none font-bold"
                   />
                 </div>
               </div>

               <div className="space-y-3">
                 <Label className="uppercase tracking-widest text-[10px] font-black opacity-50">Email Address</Label>
                 <div className="relative">
                   <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                   <Input 
                    name="email"
                    value={formData.email}
                    disabled
                    className="pl-12 h-14 rounded-2xl bg-muted/50 border-none font-bold opacity-60 cursor-not-allowed"
                   />
                 </div>
               </div>

               <div className="space-y-3">
                 <Label className="uppercase tracking-widest text-[10px] font-black opacity-50">Phone Number</Label>
                 <div className="relative">
                   <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                   <Input 
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    placeholder="e.g. +1 234 567 890"
                    className="pl-12 h-14 rounded-2xl bg-muted/30 border-none font-bold"
                   />
                 </div>
               </div>

               <div className="space-y-3 md:col-span-2">
                 <Label className="uppercase tracking-widest text-[10px] font-black opacity-50">Resident Address</Label>
                 <div className="relative">
                   <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                   <Textarea 
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Full street address..."
                    className="pl-12 pt-4 h-32 rounded-3xl bg-muted/30 border-none font-bold resize-none"
                   />
                 </div>
               </div>
             </div>

             <div className="pt-6 border-t border-border flex justify-end">
               <Button 
                type="submit" 
                disabled={isUpdating || isUpdatingBuyer}
                className="h-16 px-10 rounded-2xl bg-luxury-slate text-white font-black text-lg shadow-xl hover:bg-black transition-all flex items-center gap-3"
               >
                 {isUpdating || isUpdatingBuyer ? (
                   <Loader2 className="w-5 h-5 animate-spin" />
                 ) : (
                   <>
                     <Save className="w-5 h-5" />
                     Save Changes
                   </>
                 )}
               </Button>
             </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
