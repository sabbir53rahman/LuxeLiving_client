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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    phone: agent.contactNumber || "",
    address: agent.address || "",
    bio: agent.bio || "",
    specialization: agent.specialization
      ? typeof agent.specialization === "string"
        ? [agent.specialization]
        : agent.specialization
      : [],
    commissionRate: agent.commissionRate || 0,
    image: agent.user?.image || "", // Use image field
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
        image: result.data.url, // Use image field to match backend API
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
    console.log("Form data image:", formData.image); // Debug image field specifically

    try {
      await updateProfile({
        id: agentId,
        data: formData,
      }).unwrap();

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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl lg:text-4xl font-heading font-bold text-foreground"
          >
            My Agent Profile
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground mt-2 text-lg"
          >
            Manage your professional information and availability.
          </motion.p>
        </div>

        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? "outline" : "default"}
          className="rounded-xl"
        >
          {isEditing ? (
            <>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </>
          ) : (
            <>
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="rounded-3xl border-border shadow-sm">
            <CardHeader className="text-center">
              <div className="relative inline-block mx-auto">
                <Avatar className="w-32 h-32 rounded-full border-4 border-luxury-emerald/20">
                  <AvatarImage
                    src={agent.avatar || agent.user?.image}
                    alt={agent.name}
                  />
                  <AvatarFallback className="bg-luxury-emerald text-white text-3xl font-bold">
                    {agent.name?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {agent.isAvailable && (
                  <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-background"></div>
                )}
                {isEditing && (
                  <div className="absolute top-0 right-0">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                      className="w-32 h-32 rounded-full opacity-0 cursor-pointer"
                    />
                    {isUploading && (
                      <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <CardTitle className="text-xl font-bold mt-4">
                {agent.name}
              </CardTitle>
              <CardDescription className="text-luxury-gold font-medium">
                Real Estate Agent
              </CardDescription>

              {agent.averageRating && (
                <div className="flex items-center justify-center gap-1 mt-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="font-semibold">
                    {agent.averageRating.toFixed(1)}
                  </span>
                  {agent.totalReviews && (
                    <span className="text-sm text-muted-foreground">
                      ({agent.totalReviews} reviews)
                    </span>
                  )}
                </div>
              )}
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span className="truncate">{agent.email}</span>
              </div>

              {agent.contactNumber && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span>{agent.contactNumber}</span>
                </div>
              )}

              {agent.address && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">{agent.address}</span>
                </div>
              )}

              {agent.experience && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Briefcase className="w-4 h-4" />
                  <span>{agent.experience} years experience</span>
                </div>
              )}

              <div className="pt-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="availability" className="text-sm font-medium">
                    Available for Assignments
                  </Label>
                  <Switch
                    id="availability"
                    checked={formData.isAvailable || false}
                    onCheckedChange={(checked) =>
                      handleInputChange("isAvailable", checked)
                    }
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Edit Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card className="rounded-3xl border-border shadow-sm">
            <CardHeader>
              <CardTitle>Professional Information</CardTitle>
              <CardDescription>
                {isEditing
                  ? "Update your professional details"
                  : "View your professional information"}
              </CardDescription>
            </CardHeader>

            <CardContent>
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name || ""}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        className="rounded-xl"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={formData.phone || ""}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        className="rounded-xl"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={formData.address || ""}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                        className="rounded-xl"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="bio">Professional Bio</Label>
                      <Textarea
                        id="bio"
                        value={formData.bio || ""}
                        onChange={(e) =>
                          handleInputChange("bio", e.target.value)
                        }
                        className="rounded-xl min-h-24"
                        placeholder="Tell us about your experience and expertise..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="commission">Commission Rate (%)</Label>
                      <Input
                        id="commission"
                        type="number"
                        step="0.1"
                        value={formData.commissionRate || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "commissionRate",
                            parseFloat(e.target.value),
                          )
                        }
                        className="rounded-xl"
                        min="0"
                        max="10"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="specialization">
                        Specializations (comma-separated)
                      </Label>
                      <Input
                        id="specialization"
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
                        className="rounded-xl"
                        placeholder="e.g., Luxury, Residential, Commercial"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      disabled={updateLoading}
                      className="bg-luxury-emerald hover:bg-luxury-emerald-light text-white rounded-xl"
                    >
                      {updateLoading ? (
                        <>
                          <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      className="rounded-xl"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">
                      Professional Bio
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {agent.bio || "No bio provided"}
                    </p>
                  </div>

                  {agent.specialization &&
                    Array.isArray(agent.specialization) &&
                    agent.specialization.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">
                          Specializations
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {agent.specialization.map(
                            (spec: string, idx: number) => (
                              <Badge
                                key={idx}
                                variant="secondary"
                                className="text-xs"
                              >
                                {spec}
                              </Badge>
                            ),
                          )}
                        </div>
                      </div>
                    )}

                  {agent.licenseNumber && (
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">
                        License Number
                      </h3>
                      <p className="text-muted-foreground">
                        {agent.licenseNumber}
                      </p>
                    </div>
                  )}

                  {agent.commissionRate && (
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">
                        Commission Rate
                      </h3>
                      <p className="text-muted-foreground">
                        {agent.commissionRate}%
                      </p>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">
                          Member Since
                        </span>
                        <p className="font-semibold">
                          {new Date(agent.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Last Updated
                        </span>
                        <p className="font-semibold">
                          {new Date(agent.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
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
  
  if (agentData?.data) {
    // Standard ApiResponse<Agent> structure
    agent = agentData.data;
  } else if (agentData && typeof agentData === 'object' && 'data' in agentData && agentData.data && typeof agentData.data === 'object' && 'data' in agentData.data) {
    // Nested data structure: data.data.data
    const nestedData = agentData.data as { data?: Agent };
    agent = nestedData.data;
  } else if (agentData && !('success' in agentData)) {
    // Direct agent object
    agent = agentData;
  }
  
  // Handle array response
  if (Array.isArray(agent) && agent.length > 0) {
    agent = agent[0];
  }
  const agentId = agent!._id;

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
    return (
      <div className="p-6 rounded-3xl bg-red-50 border border-red-200">
        <h2 className="text-xl font-bold text-red-800 mb-2">
          Error Loading Profile
        </h2>
        <p className="text-red-600">
          Failed to load agent profile. Please try again later.
        </p>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="p-6 rounded-3xl bg-yellow-50 border border-yellow-200">
        <h2 className="text-xl font-bold text-yellow-800 mb-2">
          No Agent Profile Found
        </h2>
        <p className="text-yellow-600 mb-6">
          We couldn&apos;t find your agent profile. This might be because:
        </p>
        <ul className="list-disc list-inside space-y-2 text-yellow-700 mb-6 max-w-2xl mx-auto">
          <li>Your agent profile hasn&apos;t been created yet</li>
          <li>Your account isn&apos;t linked to an agent profile</li>
          <li>There might be a temporary server issue</li>
        </ul>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button
            onClick={() => window.location.reload()}
            className="bg-yellow-600 hover:bg-yellow-700 text-white rounded-xl px-8 py-3 font-semibold"
          >
            Retry Loading Profile
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/contact-support")}
            className="rounded-xl px-8 py-3 font-semibold border-yellow-300"
          >
            Contact Support
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
