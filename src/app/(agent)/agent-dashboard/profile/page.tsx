"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Star,
  Edit,
  Save,
  X,
  TrendingUp,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  useGetMyAgentProfileQuery,
  useUpdateAgentProfileMutation,
} from "@/redux/api/agentApi";
import { useUploadSingleImageMutation } from "@/redux/api/uploadApi";
import { Agent, AgentUpdateData } from "@/types/agent";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

interface ProfileContentProps {
  agent: Agent;
  agentId: string;
  updateProfile: ReturnType<typeof useUpdateAgentProfileMutation>[0];
  updateLoading: boolean;
  refetch: () => void;
}

function ProfileContent({
  agent,
  agentId,
  updateProfile,
  updateLoading,
  refetch,
}: ProfileContentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [uploadSingleImage] = useUploadSingleImageMutation();
  const [isUploading, setIsUploading] = useState(false);

  // Initialize form data DIRECTLY in state - this is safe because the component
  // has a unique 'key' in the parent, meaning it only mounts once with the correct data.
  const [formData, setFormData] = useState<AgentUpdateData>({
    name: agent.name || "",
    contactNumber: agent.contactNumber || "",
    address: agent.address || "",
    bio: agent.bio || "",
    specialization: agent.specialization
      ? typeof agent.specialization === "string"
        ? [agent.specialization]
        : agent.specialization
      : [],
    commissionRate: agent.commissionRate || 0,
    experience: agent.experience || 0,
    profilePhoto: agent.profilePhoto || agent.user?.image || "",
    isAvailable: agent.isAvailable !== undefined ? agent.isAvailable : true,
  });

  const handleInputChange = (
    field: keyof AgentUpdateData,
    value: string | string[] | number | boolean,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const result = await uploadSingleImage(formData).unwrap();
      setFormData((prev) => ({
        ...prev,
        profilePhoto: result.data.url,
      }));
      toast.success("Profile picture uploaded successfully!");
      console.log("Profile photo updated in form data:", result.data.url);
    } catch (error) {
      const fetchError = error as FetchBaseQueryError;
      const errorMessage = fetchError?.data as { message?: string };
      console.error("Upload error:", error);
      toast.error(errorMessage?.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agentId) {
      toast.error("Agent profile not found. Please try refreshing the page.");
      return;
    }

    console.log("Submitting form data:", formData); // Debug log
    console.log("Agent ID being used:", agentId); // Debug agent ID

    try {
      const updateData = {
        id: agentId,
        data: formData,
      };
      console.log("Data being sent to API:", updateData); // Debug API call
      await updateProfile(updateData).unwrap();

      toast.success("Profile updated successfully!");
      setIsEditing(false);
      refetch();
    } catch (error: unknown) {
      console.error("Failed to update profile:", error);
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        "Failed to update profile. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-white font-sans selection:bg-luxury-gold selection:text-black pb-20">
      {/* Header */}
      <header className="px-10 py-12">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <div className="h-px w-8 bg-white/10" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 whitespace-nowrap">
                AGENT CONSOLE
              </span>
              <div className="h-px flex-1 bg-white/10" />
            </div>
            <h1 className="text-5xl font-serif text-white tracking-tight leading-none">
              Profile Management
            </h1>
          </div>
          <Button
            onClick={() => setIsEditing(!isEditing)}
            className={`font-black uppercase tracking-widest h-12 px-8 transition-all ${
              isEditing
                ? "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                : "bg-luxury-gold hover:bg-white text-black"
            }`}
          >
            {isEditing ? (
              <>
                <X className="w-5 h-5 mr-2" />
                CANCEL
              </>
            ) : (
              <>
                <Edit className="w-5 h-5 mr-2" />
                EDIT PROFILE
              </>
            )}
          </Button>
        </div>
      </header>

      <div className="px-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-[#1A1A1A] border border-white/5 rounded-sm overflow-hidden">
              {/* Profile Header */}
              <div className="relative h-32 bg-linear-to-br from-luxury-gold/20 to-luxury-emerald/20">
                <div className="absolute inset-0 bg-black/40" />
                {agent.isAvailable && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-green-500 text-white border-0 text-xs font-black uppercase tracking-wider">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      AVAILABLE
                    </Badge>
                  </div>
                )}
              </div>

              {/* Avatar Section */}
              <div className="relative px-8 -mt-16">
                <div className="relative inline-block">
                  <Avatar className="w-32 h-32 rounded-2xl border-4 border-[#1A1A1A] shadow-2xl">
                    <AvatarImage src={agent.user?.image} alt={agent.name} />
                    <AvatarFallback className="bg-luxury-gold text-black text-3xl font-black">
                      {agent.name?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <div className="absolute bottom-2 right-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={isUploading}
                        className="w-10 h-10 rounded-lg opacity-0 cursor-pointer"
                      />
                      <div className="absolute inset-0 bg-luxury-gold rounded-lg flex items-center justify-center pointer-events-none">
                        {isUploading ? (
                          <div className="w-4 h-4 border-2 border-black border-t-transparent animate-spin rounded-full" />
                        ) : (
                          <Edit className="w-4 h-4 text-black" />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Info */}
              <div className="px-8 py-6 space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-serif text-white font-bold mb-2">
                    {agent.name}
                  </h2>
                  <p className="text-luxury-gold font-black uppercase tracking-widest text-sm">
                    Real Estate Agent
                  </p>

                  {agent.averageRating && agent.averageRating > 0 && (
                    <div className="flex items-center justify-center gap-2 mt-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(agent.averageRating || 0)
                                ? "text-luxury-gold fill-current"
                                : "text-white/20"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-white font-bold">
                        {agent.averageRating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Contact Information */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-white/60">
                    <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center">
                      <Mail className="w-4 h-4 text-luxury-gold" />
                    </div>
                    <span className="text-sm truncate">{agent.email}</span>
                  </div>

                  {agent.contactNumber && (
                    <div className="flex items-center gap-3 text-white/60">
                      <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center">
                        <Phone className="w-4 h-4 text-luxury-gold" />
                      </div>
                      <span className="text-sm">{agent.contactNumber}</span>
                    </div>
                  )}

                  {agent.address && (
                    <div className="flex items-center gap-3 text-white/60">
                      <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-luxury-gold" />
                      </div>
                      <span className="text-sm truncate">{agent.address}</span>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 py-4 border-t border-white/10">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Briefcase className="w-5 h-5 text-luxury-gold" />
                    </div>
                    <div className="text-xs text-white/40 uppercase tracking-wider mb-1">
                      EXPERIENCE
                    </div>
                    <div className="text-lg font-serif text-white font-bold">
                      {agent.experience || 0}+ yrs
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <TrendingUp className="w-5 h-5 text-luxury-gold" />
                    </div>
                    <div className="text-xs text-white/40 uppercase tracking-wider mb-1">
                      COMMISSION
                    </div>
                    <div className="text-lg font-serif text-white font-bold">
                      {agent.commissionRate || 0}%
                    </div>
                  </div>
                </div>

                {/* Availability Toggle */}
                <div className="flex items-center justify-between py-4 border-t border-white/10">
                  <div>
                    <Label className="text-sm font-bold text-white uppercase tracking-wider">
                      Available for Assignments
                    </Label>
                    <p className="text-xs text-white/40 mt-1">
                      {formData.isAvailable
                        ? "Currently accepting new clients"
                        : "Not available at the moment"}
                    </p>
                  </div>
                  <Switch
                    checked={formData.isAvailable || false}
                    onCheckedChange={(checked) =>
                      handleInputChange("isAvailable", checked)
                    }
                    disabled={!isEditing}
                    className="data-[state=checked]:bg-luxury-gold"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Edit Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="bg-[#1A1A1A] border border-white/5 rounded-sm">
              {/* Form Header */}
              <div className="px-8 py-6 border-b border-white/10">
                <h2 className="text-2xl font-serif text-white font-bold">
                  Professional Information
                </h2>
                <p className="text-white/40 mt-2">
                  {isEditing
                    ? "Update your professional details"
                    : "View your professional information"}
                </p>
              </div>

              {/* Form Content */}
              <div className="p-8">
                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-1">
                          Full Name
                        </Label>
                        <Input
                          value={formData.name || ""}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          className="h-16 bg-[#0A0A0A] border-white/10 text-white placeholder:text-white/40 rounded-sm focus:border-luxury-gold px-8"
                          required
                        />
                      </div>

                      <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-1">
                          Phone Number
                        </Label>
                        <Input
                          value={formData.contactNumber || ""}
                          onChange={(e) =>
                            handleInputChange("contactNumber", e.target.value)
                          }
                          className="h-16 bg-[#0A0A0A] border-white/10 text-white placeholder:text-white/40 rounded-sm focus:border-luxury-gold px-8"
                        />
                      </div>

                      <div className="space-y-3 md:col-span-2">
                        <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-1">
                          Address
                        </Label>
                        <Input
                          value={formData.address || ""}
                          onChange={(e) =>
                            handleInputChange("address", e.target.value)
                          }
                          className="h-16 bg-[#0A0A0A] border-white/10 text-white placeholder:text-white/40 rounded-sm focus:border-luxury-gold px-8"
                        />
                      </div>

                      <div className="space-y-3 md:col-span-2">
                        <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-1">
                          Professional Bio
                        </Label>
                        <Textarea
                          value={formData.bio || ""}
                          onChange={(e) =>
                            handleInputChange("bio", e.target.value)
                          }
                          className="bg-[#0A0A0A] border-white/10 text-white placeholder:text-white/40 rounded-sm focus:border-luxury-gold px-8 py-4 min-h-32 resize-none"
                          placeholder="Tell us about your experience and expertise..."
                        />
                      </div>

                      <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-1">
                          Experience (years)
                        </Label>
                        <Input
                          type="number"
                          value={formData.experience || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "experience",
                              parseInt(e.target.value) || 0,
                            )
                          }
                          className="h-16 bg-[#0A0A0A] border-white/10 text-white placeholder:text-white/40 rounded-sm focus:border-luxury-gold px-8"
                          min="0"
                          max="50"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-1">
                          Commission Rate (%)
                        </Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={formData.commissionRate || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "commissionRate",
                              parseFloat(e.target.value),
                            )
                          }
                          className="h-16 bg-[#0A0A0A] border-white/10 text-white placeholder:text-white/40 rounded-sm focus:border-luxury-gold px-8"
                          min="0"
                          max="10"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-1">
                          License Number
                        </Label>
                        <Input
                          value={agent.licenseNumber || ""}
                          disabled
                          className="h-16 bg-white/5 border-white/10 text-white/60 rounded-sm px-8"
                          placeholder="Not provided"
                        />
                      </div>

                      <div className="space-y-3 md:col-span-2">
                        <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-1">
                          Specializations (comma-separated)
                        </Label>
                        <Input
                          value={
                            Array.isArray(formData.specialization)
                              ? formData.specialization.join(", ")
                              : ""
                          }
                          onChange={(e) =>
                            handleInputChange(
                              "specialization",
                              e.target.value.split(",").map((s) => s.trim()),
                            )
                          }
                          className="h-16 bg-[#0A0A0A] border-white/10 text-white placeholder:text-white/40 rounded-sm focus:border-luxury-gold px-8"
                          placeholder="e.g., Luxury, Residential, Commercial"
                        />
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button
                        type="submit"
                        disabled={updateLoading}
                        className="bg-luxury-gold hover:bg-white text-black font-black uppercase tracking-widest h-12 px-8 transition-all"
                      >
                        {updateLoading ? (
                          <>
                            <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-black border-t-transparent" />
                            SAVING...
                          </>
                        ) : (
                          <>
                            <Save className="w-5 h-5 mr-2" />
                            SAVE CHANGES
                          </>
                        )}
                      </Button>

                      <Button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="bg-white/10 hover:bg-white/20 text-white font-black uppercase tracking-widest h-12 px-8 transition-all border border-white/20"
                      >
                        CANCEL
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-8">
                    {/* Bio Section */}
                    <div>
                      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-1 mb-4">
                        Professional Bio
                      </h3>
                      <p className="text-white/80 leading-relaxed text-lg">
                        {agent.bio || "No bio provided"}
                      </p>
                    </div>

                    {/* Specializations */}
                    {agent.specialization &&
                      Array.isArray(agent.specialization) &&
                      agent.specialization.length > 0 && (
                        <div>
                          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-1 mb-4">
                            Specializations
                          </h3>
                          <div className="flex flex-wrap gap-3">
                            {agent.specialization.map(
                              (spec: string, idx: number) => (
                                <Badge
                                  key={idx}
                                  className="bg-luxury-gold/20 text-luxury-gold border border-luxury-gold/30 text-xs font-black uppercase tracking-wider px-4 py-2"
                                >
                                  {spec}
                                </Badge>
                              ),
                            )}
                          </div>
                        </div>
                      )}

                    {/* License Number */}
                    {agent.licenseNumber && (
                      <div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-1 mb-4">
                          License Number
                        </h3>
                        <p className="text-white font-mono text-lg">
                          {agent.licenseNumber}
                        </p>
                      </div>
                    )}

                    {/* Commission Rate */}
                    {agent.commissionRate && (
                      <div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-1 mb-4">
                          Commission Rate
                        </h3>
                        <p className="text-2xl font-serif text-luxury-gold font-bold">
                          {agent.commissionRate}%
                        </p>
                      </div>
                    )}

                    {/* Timestamps */}
                    <div className="pt-8 border-t border-white/10">
                      <div className="grid grid-cols-2 gap-8">
                        <div>
                          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-1 mb-2">
                            Member Since
                          </h3>
                          <p className="text-white font-serif text-lg">
                            {new Date(agent.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              },
                            )}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-1 mb-2">
                            Last Updated
                          </h3>
                          <p className="text-white font-serif text-lg">
                            {new Date(agent.updatedAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              },
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function AgentProfilePage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const {
    data: agentData,
    isLoading,
    error,
    refetch,
  } = useGetMyAgentProfileQuery(undefined);
  const [updateProfile, { isLoading: updateLoading }] =
    useUpdateAgentProfileMutation();

  // Extract agent data safely with proper typing
  let agent: Agent | undefined;

  // The API returns ApiResponse<Agent> structure: { success: true, data: Agent, message: string }
  if (agentData?.data) {
    // Standard ApiResponse<Agent> structure
    agent = agentData.data;
  } else if (
    agentData &&
    typeof agentData === "object" &&
    "success" in agentData &&
    agentData.success &&
    agentData.data
  ) {
    // Alternative ApiResponse structure
    agent = agentData.data;
  } else if (
    agentData &&
    typeof agentData === "object" &&
    !("success" in agentData) &&
    !("data" in agentData)
  ) {
    // Direct agent object (unlikely but possible)
    agent = agentData as Agent;
  }

  // Handle array response (unlikely for profile endpoint)
  if (Array.isArray(agent) && agent.length > 0) {
    agent = agent[0];
  }

  // Get agentId safely - check if agent exists and has id
  const agentId = agent?.id || "";

  // Debug logging to help identify the issue
  console.log("Agent data from API:", agentData);
  console.log("Extracted agent:", agent);
  console.log("Agent ID:", agentId);

  if (authLoading || isLoading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-96"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-96 bg-gray-200 rounded-3xl"></div>
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
          Please log in to access your agent profile.
        </p>
      </div>
    );
  }

  if (error) {
    console.error("API Error:", error);

    // Check if it's a 404 error (profile not found)
    if ("status" in error && error.status === 404) {
      return (
        <div className="min-h-screen bg-[#0E0E0E] flex items-center justify-center p-10">
          <div className="max-w-md w-full bg-[#1A1A1A] border border-white/5 rounded-sm p-12 text-center space-y-6">
            <div className="w-12 h-12 bg-white/5 rounded-2xl mx-auto flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-luxury-gold" />
            </div>
            <h2 className="text-2xl font-serif text-white">
              Agent Profile Not Found
            </h2>
            <p className="text-white/40">
              Your agent profile hasn&apos;t been created yet. Please contact
              support to set up your agent profile.
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => refetch()}
                className="w-full bg-luxury-gold hover:bg-white text-black font-black uppercase tracking-widest h-12 transition-all"
              >
                Retry Loading Profile
              </Button>
              <Button
                onClick={() => (window.location.href = "/contact-support")}
                className="w-full bg-white/10 hover:bg-white/20 text-white font-black uppercase tracking-widest h-12 transition-all border border-white/20"
              >
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      );
    }

    // Generic error
    return (
      <div className="min-h-screen bg-[#0E0E0E] flex items-center justify-center p-10">
        <div className="max-w-md w-full bg-[#1A1A1A] border border-white/5 rounded-sm p-12 text-center space-y-6">
          <div className="w-12 h-12 bg-red-500/20 rounded-2xl mx-auto flex items-center justify-center">
            <X className="w-6 h-6 text-red-500" />
          </div>
          <h2 className="text-2xl font-serif text-white">
            Error Loading Profile
          </h2>
          <p className="text-white/40">
            Failed to load agent profile. Please try again later.
          </p>
          <Button
            onClick={() => refetch()}
            className="w-full bg-luxury-gold hover:bg-white text-black font-black uppercase tracking-widest h-12 transition-all"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="min-h-screen bg-[#0E0E0E] flex items-center justify-center p-10">
        <div className="max-w-md w-full bg-[#1A1A1A] border border-white/5 rounded-sm p-12 text-center space-y-6">
          <div className="w-12 h-12 bg-white/5 rounded-2xl mx-auto flex items-center justify-center">
            <Briefcase className="w-6 h-6 text-luxury-gold" />
          </div>
          <h2 className="text-2xl font-serif text-white">
            No Agent Profile Found
          </h2>
          <p className="text-white/40">
            We couldn&apos;t find your agent profile. This might be because your
            profile hasn&apos;t been created yet.
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="w-full bg-luxury-gold hover:bg-white text-black font-black uppercase tracking-widest h-12 transition-all"
          >
            Retry Loading Profile
          </Button>
        </div>
      </div>
    );
  }

  // Use a 'key' to ensure the component remounts and re-initializes its
  // state whenever the agent data arrives or changes.
  return (
    <ProfileContent
      key={agentId}
      agent={agent}
      agentId={agentId}
      updateProfile={updateProfile}
      updateLoading={updateLoading}
      refetch={refetch}
    />
  );
}
