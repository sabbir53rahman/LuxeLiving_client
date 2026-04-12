"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  Upload, 
  MapPin,
  BedDouble,
  Bath,
  Square,
  Building,
  Home,
  DollarSign,
  Loader2
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateSellerPropertyMutation } from "@/redux/api/sellerApi";
import ImageUpload from "@/components/ui/ImageUpload";
import Link from "next/link";

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

export default function AddPropertyPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [createProperty, { isLoading: createLoading }] = useCreateSellerPropertyMutation();

  const [formData, setFormData] = useState<PropertyFormData>({
    title: "",
    description: "",
    price: 0,
    location: "",
    type: "",
    bedrooms: 1,
    bathrooms: 1,
    area: 0,
    images: [],
  });

  const handleInputChange = (field: keyof PropertyFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImagesChange = (urls: string[]) => {
    setFormData(prev => ({ ...prev, images: urls }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title?.trim()) return toast.error("Property title is required");
    if (!formData.price || formData.price <= 0) return toast.error("Invalid price");
    if (!formData.location?.trim()) return toast.error("Location is required");
    if (!formData.type?.trim()) return toast.error("Type is required");

    try {
      const loadingToast = toast.loading("Publishing listing...");
      
      const propertyData = {
        ...formData,
        title: formData.title.trim(),
        description: formData.description?.trim() || "",
        price: Number(formData.price),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        area: Number(formData.area),
      };

      await createProperty(propertyData).unwrap();
      
      toast.dismiss(loadingToast);
      toast.success("Property live on LuxeLiving!");
      
      setTimeout(() => {
        window.location.href = "/seller-dashboard/my-properties";
      }, 1500);
      
    } catch (error: unknown) {
      toast.dismiss();
      const err = error as { data?: { message?: string }; message?: string };
      toast.error(err?.data?.message || err?.message || "Failed to publish property");
    }
  };

  if (isLoading) return <div className="p-10 animate-pulse">Loading...</div>;

  if (!isAuthenticated || !user) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl font-bold">Authentication Required</h2>
        <Link href="/login"><Button className="mt-4">Sign In</Button></Link>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto py-10 px-4">
      <div className="mb-10">
        <Link href="/seller-dashboard/my-properties" className="text-muted-foreground hover:text-luxury-emerald flex items-center gap-2 mb-4 font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Portfolio
        </Link>
        <h1 className="text-5xl font-heading font-black text-luxury-slate tracking-tight">List New Estate</h1>
        <p className="text-muted-foreground text-xl mt-2">Bring your luxury property to the global stage.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-luxury-slate/5 overflow-hidden">
            <CardHeader className="bg-luxury-slate text-white p-10">
              <CardTitle className="text-2xl flex items-center gap-3">
                <Home className="text-luxury-gold" /> Core Identity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label className="uppercase tracking-widest text-[10px] font-black opacity-50">Estate Name</Label>
                  <Input 
                    value={formData.title} 
                    onChange={e => handleInputChange('title', e.target.value)}
                    className="h-14 rounded-2xl bg-luxury-slate/5 border-none text-lg font-bold"
                    placeholder="e.g. The Sapphire Manor"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="uppercase tracking-widest text-[10px] font-black opacity-50">Property Type</Label>
                  <Select value={formData.type} onValueChange={v => handleInputChange('type', v ?? "")}>
                    <SelectTrigger className="h-14 rounded-2xl bg-luxury-slate/5 border-none font-bold">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-none shadow-2xl font-bold">
                      <SelectItem value="Villa">Villa</SelectItem>
                      <SelectItem value="Mansion">Mansion</SelectItem>
                      <SelectItem value="Penthouse">Penthouse</SelectItem>
                      <SelectItem value="Apartment">Apartment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="uppercase tracking-widest text-[10px] font-black opacity-50">Narrative</Label>
                <Textarea 
                  value={formData.description} 
                  onChange={e => handleInputChange('description', e.target.value)}
                  className="min-h-37.5 rounded-2xl bg-luxury-slate/5 border-none p-6 text-lg"
                  placeholder="Describe the architectural soul..."
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label className="uppercase tracking-widest text-[10px] font-black opacity-50">Market Price ($)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-luxury-gold" />
                    <Input 
                      type="number"
                      value={formData.price || ""} 
                      onChange={e => handleInputChange('price', parseFloat(e.target.value) || 0)}
                      className="h-14 pl-12 rounded-2xl bg-luxury-slate/5 border-none text-lg font-bold"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="uppercase tracking-widest text-[10px] font-black opacity-50">Geographic Placement</Label>
                  <div className="relative">
                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-luxury-emerald" />
                    <Input 
                      value={formData.location} 
                      onChange={e => handleInputChange('location', e.target.value)}
                      className="h-14 pl-12 rounded-2xl bg-luxury-slate/5 border-none text-lg font-bold"
                      placeholder="e.g. Monaco, French Riviera"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-luxury-slate/5 overflow-hidden">
            <CardHeader className="bg-luxury-emerald text-white p-10">
              <CardTitle className="text-2xl flex items-center gap-3">
                <Building /> Architectural Specs
              </CardTitle>
            </CardHeader>
            <CardContent className="p-10 grid grid-cols-1 sm:grid-cols-3 gap-10">
              <div className="space-y-2">
                <Label className="uppercase tracking-widest text-[10px] font-black opacity-50">Suites</Label>
                <div className="flex items-center bg-luxury-slate/5 rounded-2xl px-6 h-14">
                  <BedDouble className="text-luxury-slate/30 mr-4" />
                  <input 
                    type="number"
                    value={formData.bedrooms}
                    onChange={e => handleInputChange('bedrooms', parseInt(e.target.value) || 0)}
                    className="bg-transparent border-none focus:outline-none w-full font-black text-xl"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="uppercase tracking-widest text-[10px] font-black opacity-50">Baths</Label>
                <div className="flex items-center bg-luxury-slate/5 rounded-2xl px-6 h-14">
                  <Bath className="text-luxury-slate/30 mr-4" />
                  <input 
                    type="number"
                    value={formData.bathrooms}
                    onChange={e => handleInputChange('bathrooms', parseInt(e.target.value) || 0)}
                    className="bg-transparent border-none focus:outline-none w-full font-black text-xl"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="uppercase tracking-widest text-[10px] font-black opacity-50">Area (sqft)</Label>
                <div className="flex items-center bg-luxury-slate/5 rounded-2xl px-6 h-14">
                  <Square className="text-luxury-slate/30 mr-4" />
                  <input 
                    type="number"
                    value={formData.area || ""}
                    onChange={e => handleInputChange('area', parseFloat(e.target.value) || 0)}
                    className="bg-transparent border-none focus:outline-none w-full font-black text-xl"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-10">
          <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-luxury-slate/5 overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-black">Visual Portfolio</CardTitle>
              <CardDescription>Select up to 10 visual assets.</CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUpload
                value={formData.images}
                onChange={handleImagesChange}
                maxFiles={10}
                aspectRatio="aspect-square"
              />
            </CardContent>
          </Card>

          <Button
            type="submit"
            disabled={createLoading}
            className="w-full h-24 rounded-[2rem] bg-luxury-slate hover:bg-black text-white text-2xl font-black shadow-2xl transition-all transform hover:scale-[1.02] active:scale-[0.98] group"
          >
            {createLoading ? (
              <Loader2 className="animate-spin w-8 h-8" />
            ) : (
              <span className="flex items-center gap-3">
                List Estate <Upload className="group-hover:-translate-y-1 transition-transform" />
              </span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
