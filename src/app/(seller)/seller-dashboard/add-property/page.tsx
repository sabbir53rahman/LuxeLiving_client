"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  MapPin,
  Loader2,
  ShieldCheck,
  Zap,
  Bell,
  User,
  ChevronRight,
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
import { Card, CardContent } from "@/components/ui/card";
import { useCreateSellerPropertyMutation } from "@/redux/api/sellerApi";
import ImageUpload from "@/components/ui/ImageUpload";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

// Section Header Component to match the image
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

export default function AddPropertyPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [createProperty, { isLoading: createLoading }] =
    useCreateSellerPropertyMutation();

  const [formData, setFormData] = useState<PropertyFormData>({
    title: "",
    description: "",
    price: 0,
    location: "",
    type: "",
    bedrooms: 0,
    bathrooms: 0,
    area: 0,
    images: [],
  });

  const handleInputChange = (
    field: keyof PropertyFormData,
    value: string | number,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImagesChange = (urls: string[]) => {
    setFormData((prev) => ({ ...prev, images: urls }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) return toast.error("Estate title is required");
    if (!formData.price || formData.price <= 0)
      return toast.error("A worthy valuation is required");
    if (formData.images.length === 0)
      return toast.error("At least one visual asset is required");

    try {
      const loadingToast = toast.loading("Finalizing your listing...");
      
      // Debug: Log the form data before sending
      console.log("Submitting property with data:", {
        ...formData,
        price: Number(formData.price),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        area: Number(formData.area),
        images: formData.images,
      });
      
      await createProperty({
        ...formData,
        price: Number(formData.price),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        area: Number(formData.area),
        images: formData.images, // Ensure images are included
      }).unwrap();
      toast.dismiss(loadingToast);
      toast.success("Empire expanded. Estate is now live!");
      router.push("/seller-dashboard/my-properties");
    } catch (error: unknown) {
      toast.dismiss();
      console.error("Property creation failed:", error);
      const errorMessage = error && typeof error === 'object' && 'data' in error 
        ? (error as { data?: { message?: string } }).data?.message 
        : 'Failed to establish listing';
      toast.error(errorMessage || "Failed to establish listing");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center space-y-6">
        <Loader2 className="w-12 h-12 text-luxury-gold animate-spin" />
        <p className="text-white/40 font-black uppercase tracking-[0.3em] text-[10px]">
          Initializing Interface
        </p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-10">
        <Card className="max-w-md w-full rounded-[2rem] border-white/5 bg-white/5 backdrop-blur-xl overflow-hidden">
          <CardContent className="p-12 text-center space-y-6">
            <ShieldCheck className="w-12 h-12 text-luxury-gold mx-auto" />
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
      {/* Top Navigation / Breadcrumb style header */}
      <header className="px-10 py-12 flex justify-between items-start">
        <div className="space-y-2">
          <h1 className="text-5xl font-serif text-white tracking-tight leading-none">
            Add Property
          </h1>
          <p className="text-white/40 text-sm font-medium italic">
            Manifesting architectural legacy into the digital domain.
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

      <form
        onSubmit={handleSubmit}
        className="px-10 grid grid-cols-1 lg:grid-cols-12 gap-16"
      >
        {/* Left Form Content */}
        <div className="lg:col-span-7 space-y-4">
          {/* I. CORE IDENTITY */}
          <SectionHeader numeral="I" title="CORE IDENTITY" />

          <div className="space-y-8">
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-1">
                Estate Name
              </Label>
              <Input
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="h-20 bg-[#1A1A1A] border-white/5 text-white text-2xl font-serif px-8 placeholder:text-white/10 rounded-sm focus-visible:ring-luxury-gold focus-visible:ring-offset-0 transition-all"
                placeholder="The Obsidian Manor"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-1">
                Classification
              </Label>
              <Select
                value={formData.type}
                onValueChange={(v) => handleInputChange("type", v ?? "")}
              >
                <SelectTrigger className="h-16 bg-[#1A1A1A] border-white/5 text-white font-medium px-8 rounded-sm focus:ring-luxury-gold">
                  <SelectValue placeholder="Architectural Landmark" />
                </SelectTrigger>
                <SelectContent className="bg-[#1A1A1A] border-white/10 text-white">
                  <SelectItem value="Villa">Villa</SelectItem>
                  <SelectItem value="Mansion">Mansion</SelectItem>
                  <SelectItem value="Penthouse">Penthouse</SelectItem>
                  <SelectItem value="Apartment">Apartment</SelectItem>
                  <SelectItem value="Chateau">
                    Architectural Landmark
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-1">
                The Narrative
              </Label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                className="min-h-45 bg-[#161616] border-white/5 p-8 text-white font-medium leading-relaxed rounded-sm focus-visible:ring-luxury-gold placeholder:text-white/10"
                placeholder="Craft the story of this residence..."
              />
            </div>
          </div>

          {/* II. MARKET PLACEMENT */}
          <SectionHeader numeral="II" title="MARKET PLACEMENT" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-1">
                Market Valuation
              </Label>
              <div className="relative group">
                <span className="absolute left-8 top-1/2 -translate-y-1/2 text-luxury-gold font-serif text-xl">
                  $
                </span>
                <Input
                  type="number"
                  value={formData.price || ""}
                  onChange={(e) =>
                    handleInputChange("price", parseFloat(e.target.value) || 0)
                  }
                  className="h-16 bg-[#1A1A1A] border-white/5 text-white text-xl font-bold pl-14 pr-8 rounded-sm focus-visible:ring-luxury-gold"
                  placeholder="00,000,000"
                />
              </div>
            </div>
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-1">
                Geographic Placement
              </Label>
              <div className="relative group">
                <Input
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  className="h-16 bg-[#1A1A1A] border-white/5 text-white text-lg font-medium px-8 pr-14 rounded-sm focus-visible:ring-luxury-gold"
                  placeholder="Bel Air, California"
                />
                <MapPin className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-luxury-gold opacity-50" />
              </div>
            </div>
          </div>

          {/* III. SPECIFICATIONS */}
          <SectionHeader numeral="III" title="SPECIFICATIONS" />

          <div className="grid grid-cols-3 gap-6">
            {[
              { id: "bedrooms", label: "SUITES" },
              { id: "bathrooms", label: "BATHS" },
              { id: "area", label: "SQ. FT." },
            ].map((spec) => (
              <div key={spec.id} className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-1">
                  {spec.label}
                </Label>
                <div className="h-16 bg-[#1A1A1A] border border-white/5 flex items-center justify-center rounded-sm">
                  <input
                    type="number"
                    value={
                      (formData[spec.id as keyof PropertyFormData] as number) ||
                      0
                    }
                    onChange={(e) =>
                      handleInputChange(
                        spec.id as keyof PropertyFormData,
                        parseFloat(e.target.value) || 0,
                      )
                    }
                    className="w-full text-center bg-transparent border-none focus:outline-none text-white text-2xl font-serif"
                    placeholder="00"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Visuals & Submit */}
        <div className="lg:col-span-5 space-y-4">
          <SectionHeader numeral="IV" title="VISUAL PORTFOLIO" />

          <div className="bg-[#1A1A1A]/50 border border-white/5 rounded-sm p-10 min-h-112.5 flex flex-col items-center justify-center space-y-8 relative">
            <div className="absolute inset-0 border-2 border-dashed border-white/5 rounded-sm m-4 pointer-events-none" />

            <ImageUpload
              value={formData.images}
              onChange={handleImagesChange}
              maxFiles={10}
              aspectRatio="aspect-square"
              className="w-full"
            />

            {!formData.images.length && (
              <div className="text-center space-y-4 z-10 pointer-events-none absolute md:relative">
                <div className="w-16 h-16 bg-white/5 rounded-2xl mx-auto flex items-center justify-center">
                  <Zap className="w-8 h-8 text-luxury-gold" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-serif text-white/90 leading-tight">
                    Deploy High-Res Assets
                  </h3>
                  <p className="text-[10px] text-white/30 font-medium uppercase tracking-widest max-w-50 mx-auto leading-loose">
                    Support for 8K stills and architectural walkthroughs.
                    Maximum 10 items.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="pt-12 space-y-6">
            <Button
              type="submit"
              disabled={createLoading}
              className="group w-full h-24 bg-luxury-gold hover:bg-white text-black text-3xl font-serif shadow-2xl transition-all duration-500 rounded-sm overflow-hidden relative"
            >
              {createLoading ? (
                <Loader2 className="animate-spin w-10 h-10" />
              ) : (
                <div className="flex items-center gap-4">
                  Initialize Listing{" "}
                  <ChevronRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
                </div>
              )}
            </Button>

            <p className="text-center text-[9px] font-black uppercase tracking-[0.2em] text-white/20 px-8">
              SUBJECT TO EDITORIAL REVIEW & TIER VERIFICATION
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
