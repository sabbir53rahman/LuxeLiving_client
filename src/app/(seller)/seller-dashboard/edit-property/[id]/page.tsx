"use client";

import { useState, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  Upload, 
  X, 
  MapPin,
  BedDouble,
  Bath,
  Square,
  Building,
  Home,
  DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  useGetPropertyDetailsQuery,
} from "@/redux/api/propertyApi";
import { useUpdateSellerPropertyMutation } from "@/redux/api/sellerApi";
import Link from "next/link";
import { useParams } from "next/navigation";
import Image from "next/image";

interface PropertyFormData {
  title: string;
  description: string;
  price: number;
  location: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
}

export default function EditPropertyPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const params = useParams();
  const propertyId = params.id as string;

  const { data: propertyData, isLoading: propertyLoading } =
    useGetPropertyDetailsQuery(propertyId);
  const [updateProperty, { isLoading: updateLoading }] =
    useUpdateSellerPropertyMutation();


  const initialFormData = useMemo((): PropertyFormData => {
    if (propertyData) {
      const property = propertyData.data;
      return {
        title: property.title || "",
        description: property.description || "",
        price: property.price || 0,
        location: property.location || "",
        type: property.type || "",
        bedrooms: property.bedrooms || 1,
        bathrooms: property.bathrooms || 1,
        area: property.area || 0,
        images: property.images || [],
      };
    }

    return {
      title: "",
      description: "",
      price: 0,
      location: "",
      type: "",
      bedrooms: 1,
      bathrooms: 1,
      area: 0,
      images: [],
    };
  }, [propertyData]);

  const [formData, setFormData] = useState<PropertyFormData>(initialFormData);

  const initialImagePreviews = useMemo(() => {
    return propertyData?.data?.images || [];
  }, [propertyData]);

  const [imagePreviews, setImagePreviews] = useState<string[]>(initialImagePreviews);

  const handleInputChange = (
    field: keyof PropertyFormData,
    value: string | number,
  ) => {
    setFormData((prev: PropertyFormData) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newPreviews = [...imagePreviews];

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        setImagePreviews([...newPreviews]);
      };
      reader.readAsDataURL(file);
    });

    // For now, we'll just store the previews since backend expects string[]
    setImagePreviews(newPreviews);
  };

  const removeImage = (index: number) => {
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(newPreviews);
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title?.trim()) {
      toast.error("Property title is required");
      return;
    }
    
    if (!formData.price || formData.price <= 0) {
      toast.error("Property price must be greater than 0");
      return;
    }
    
    if (!formData.location?.trim()) {
      toast.error("Property location is required");
      return;
    }
    
    if (!formData.type?.trim()) {
      toast.error("Property type is required");
      return;
    }

    if (formData.bedrooms <= 0) {
      toast.error("Number of bedrooms must be greater than 0");
      return;
    }

    if (formData.bathrooms <= 0) {
      toast.error("Number of bathrooms must be greater than 0");
      return;
    }

    if (formData.area <= 0) {
      toast.error("Property area must be greater than 0");
      return;
    }

    try {
      toast.loading("Updating property...");
      
      // Prepare property data to match backend
      const propertyData = {
        title: formData.title.trim(),
        description: formData.description?.trim() || "",
        price: Number(formData.price),
        location: formData.location.trim(),
        type: formData.type.trim(),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        area: Number(formData.area),
        images: imagePreviews || [],
      };

      await updateProperty({ id: propertyId, data: propertyData }).unwrap();
      
      toast.success("Property updated successfully!");
      
      // Redirect to my properties page after a short delay
      setTimeout(() => {
        window.location.href = "/seller-dashboard/my-properties";
      }, 1500);
      
    } catch (error) {
      console.error("Failed to update property:", error);
      
      // Handle different error scenarios
      let errorMessage = "Failed to update property. Please try again.";
      
      if (error && typeof error === 'object') {
        const errorObj = error as { data?: { message?: string }; message?: string };
        if (errorObj.data?.message) {
          errorMessage = errorObj.data.message;
        } else if (errorObj.message) {
          errorMessage = errorObj.message;
        }
      }
      
      toast.error(errorMessage);
    }
  };

  if (isLoading || propertyLoading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-96"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-200 rounded-3xl"></div>
          </div>
          <div className="animate-pulse">
            <div className="h-96 bg-gray-200 rounded-3xl"></div>
          </div>
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
        <p className="text-red-600">Please log in to edit this property.</p>
      </div>
    );
  }

  if (!propertyData) {
    return (
      <div className="p-6 rounded-3xl bg-red-50 border border-red-200">
        <h2 className="text-xl font-bold text-red-800 mb-2">
          Property Not Found
        </h2>
        <p className="text-red-600">
          The property you&apos;re trying to edit doesn&apos;t exist.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/seller-dashboard/my-properties">
          <Button variant="outline" size="sm" className="rounded-xl">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Properties
          </Button>
        </Link>
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl lg:text-4xl font-heading font-bold text-foreground"
          >
            Edit Property
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground mt-2 text-lg"
          >
            Update your property details and information.
          </motion.p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="rounded-3xl border-border shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Home className="w-5 h-5 mr-2 text-luxury-emerald" />
                    Basic Information
                  </CardTitle>
                  <CardDescription>
                    Update essential details about your property.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="title">Property Title *</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Luxury Villa with Ocean View"
                        value={formData.title}
                        onChange={(e) =>
                          handleInputChange("title", e.target.value)
                        }
                        className="mt-2 rounded-xl"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Property Type *</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) =>
                          handleInputChange("type", value || "")
                        }
                      >
                        <SelectTrigger className="mt-2 rounded-xl">
                          <SelectValue placeholder="Select property type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Villa">Villa</SelectItem>
                          <SelectItem value="Apartment">Apartment</SelectItem>
                          <SelectItem value="Penthouse">Penthouse</SelectItem>
                          <SelectItem value="Mansion">Mansion</SelectItem>
                          <SelectItem value="Condo">Condo</SelectItem>
                          <SelectItem value="Townhouse">Townhouse</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your property's features, location benefits, and unique selling points..."
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      className="mt-2 min-h-32 rounded-xl resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="price">Price ($) *</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="price"
                          type="number"
                          placeholder="500000"
                          value={formData.price || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "price",
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          className="mt-2 pl-10 rounded-xl"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="location">Location *</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="location"
                          placeholder="Miami Beach, FL"
                          value={formData.location}
                          onChange={(e) =>
                            handleInputChange("location", e.target.value)
                          }
                          className="mt-2 pl-10 rounded-xl"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Property Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="rounded-3xl border-border shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building className="w-5 h-5 mr-2 text-luxury-emerald" />
                    Property Details
                  </CardTitle>
                  <CardDescription>
                    Update physical characteristics of your property.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="bedrooms">Bedrooms</Label>
                      <div className="relative">
                        <BedDouble className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="bedrooms"
                          type="number"
                          min="0"
                          value={formData.bedrooms}
                          onChange={(e) =>
                            handleInputChange(
                              "bedrooms",
                              parseInt(e.target.value) || 0,
                            )
                          }
                          className="mt-2 pl-10 rounded-xl"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="bathrooms">Bathrooms</Label>
                      <div className="relative">
                        <Bath className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="bathrooms"
                          type="number"
                          min="0"
                          value={formData.bathrooms}
                          onChange={(e) =>
                            handleInputChange(
                              "bathrooms",
                              parseInt(e.target.value) || 0,
                            )
                          }
                          className="mt-2 pl-10 rounded-xl"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="area">Area (sqft)</Label>
                      <div className="relative">
                        <Square className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="area"
                          type="number"
                          min="0"
                          value={formData.area || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "area",
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          className="mt-2 pl-10 rounded-xl"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Images */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="rounded-3xl border-border shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Upload className="w-5 h-5 mr-2 text-luxury-emerald" />
                    Property Images
                  </CardTitle>
                  <CardDescription>
                    Update photos of your property.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-border rounded-xl p-6 text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG, GIF up to 10MB each
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-4 rounded-xl"
                      onClick={() =>
                        document.getElementById("image-upload")?.click()
                      }
                    >
                      Add Images
                    </Button>
                  </div>

                  {imagePreviews.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">
                        Images ({imagePreviews.length})
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {imagePreviews.map((preview: string, index: number) => (
                          <div key={index} className="relative group">
                            <div className="aspect-4/3 rounded-lg overflow-hidden">
                              <Image
                                width={200}
                                height={150}
                                src={preview}
                                alt={`Property image ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="rounded-3xl border-border shadow-sm">
                <CardContent className="p-6">
                  <Button
                    type="submit"
                    disabled={updateLoading}
                    className="w-full bg-luxury-emerald hover:bg-luxury-emerald-light text-white rounded-xl h-12 font-bold"
                  >
                    {updateLoading ? "Updating..." : "Update Property"}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    By updating, you agree to our terms and conditions.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </form>
    </div>
  );
}
