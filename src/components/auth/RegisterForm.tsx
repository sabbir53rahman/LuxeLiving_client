"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Loader2,
  Mail,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  Home,
  Building,
  Briefcase,
  Phone,
  MapPin
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  useRegisterAgentMutation, 
  useRegisterBuyerMutation, 
  useRegisterSellerMutation 
} from "@/redux/api/authApi";
import { useAppDispatch } from "@/hooks/useRedux";
import { setCredentials } from "@/redux/features/auth/authSlice";
import { jwtDecode } from "jwt-decode";
import { User } from "@/types";

interface DecodedToken { id: string; email: string; role: string; name?: string; exp: number; }

function setCookieToken(token: string) {
  document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
}

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["buyer", "seller", "agent"]),
  contactNumber: z.string().min(10, "Contact number must be at least 10 digits"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  licenseNumber: z.string().optional(),
  experience: z.number().min(0).optional(),
  specialization: z.string().optional(),
  bio: z.string().optional(),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: string;
  contactNumber: string;
  address: string;
  licenseNumber?: string;
  experience?: number;
  specialization?: string;
  bio?: string;
}

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  
  const [registerAgent, { isLoading: isAgentLoading }] = useRegisterAgentMutation();
  const [registerBuyer, { isLoading: isBuyerLoading }] = useRegisterBuyerMutation();
  const [registerSeller, { isLoading: isSellerLoading }] = useRegisterSellerMutation();
  
  const isLoading = isAgentLoading || isBuyerLoading || isSellerLoading;
  
  const router = useRouter();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "buyer",
      contactNumber: "",
      address: "",
      licenseNumber: "",
      experience: 0,
      specialization: "",
      bio: "",
    },
  });

  const selectedRole = watch("role");

  const onSubmit: SubmitHandler<RegisterFormValues> = async (data) => {
    try {
      let result;
      const payload: RegisterPayload = {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        contactNumber: data.contactNumber,
        address: data.address,
      };

      if (data.role === 'agent') {
        payload.licenseNumber = data.licenseNumber;
        payload.experience = data.experience;
        payload.specialization = data.specialization;
        payload.bio = data.bio;
      }

      if (data.role === "agent") {
        result = await registerAgent(payload).unwrap();
      } else if (data.role === "buyer") {
        result = await registerBuyer(payload).unwrap();
      } else if (data.role === "seller") {
        result = await registerSeller(payload).unwrap();
      }

      if (result) {
        const token: string = result.data?.token || result.token;

        if (token) {
          setCookieToken(token);
          const decoded = jwtDecode<DecodedToken>(token);
          const user: User = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
            name: decoded.name || data.name || data.email,
            createdAt: new Date().toISOString(),
          };

          dispatch(setCredentials({ user, token }));
        }

        toast.success("Registration successful! Welcome to LuxeLiving.");

        if (data.role === "agent") router.push("/agent-dashboard");
        else if (data.role === "buyer") router.push("/buyer-dashboard");
        else if (data.role === "seller") router.push("/seller-dashboard");
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string }; message?: string };
      toast.error(
        err?.data?.message || err?.message || "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="space-y-8 py-8 px-4 sm:px-0">
      <div className="space-y-2 text-left">
        <h1 className="text-4xl font-heading font-black tracking-tight text-luxury-slate">
          Join LuxeLiving
        </h1>
        <p className="text-luxury-slate/60 text-lg font-medium">
          Create an account to start your luxury real estate journey.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-3">
          <Label className="text-sm font-bold uppercase tracking-wider text-luxury-slate/70">
            I want to join as...
          </Label>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => field.onChange("buyer")}
                  className={`relative group p-3 rounded-2xl border-2 text-center transition-all duration-300 ${
                    field.value === "buyer"
                      ? "border-luxury-gold bg-luxury-gold/5 shadow-md shadow-luxury-gold/20"
                      : "border-luxury-slate/10 bg-white hover:border-luxury-gold/40"
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      field.value === "buyer" ? "bg-luxury-gold text-white" : "bg-luxury-slate/5 text-luxury-slate/50"
                    }`}>
                      <Home className="h-5 w-5" />
                    </div>
                    <div className="font-bold text-xs uppercase tracking-tight text-luxury-slate">Buyer</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => field.onChange("seller")}
                  className={`relative group p-3 rounded-2xl border-2 text-center transition-all duration-300 ${
                    field.value === "seller"
                      ? "border-luxury-emerald bg-luxury-emerald/5 shadow-md shadow-luxury-emerald/20"
                      : "border-luxury-slate/10 bg-white hover:border-luxury-emerald/40"
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      field.value === "seller" ? "bg-luxury-emerald text-white" : "bg-luxury-slate/5 text-luxury-slate/50"
                    }`}>
                      <Building className="h-5 w-5" />
                    </div>
                    <div className="font-bold text-xs uppercase tracking-tight text-luxury-slate">Seller</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => field.onChange("agent")}
                  className={`relative group p-3 rounded-2xl border-2 text-center transition-all duration-300 ${
                    field.value === "agent"
                      ? "border-luxury-slate bg-luxury-slate/5 shadow-md shadow-luxury-slate/20"
                      : "border-luxury-slate/10 bg-white hover:border-luxury-slate/40"
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      field.value === "agent" ? "bg-luxury-slate text-white" : "bg-luxury-slate/5 text-luxury-slate/50"
                    }`}>
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <div className="font-bold text-xs uppercase tracking-tight text-luxury-slate">Agent</div>
                  </div>
                </button>
              </div>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 col-span-1 md:col-span-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-luxury-slate/70">Full Name</Label>
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-luxury-slate/40" />
              <Input {...register("name")} placeholder="John Doe" className="pl-12 h-12 rounded-xl bg-white/50 border-luxury-slate/20" />
            </div>
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-luxury-slate/70">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-luxury-slate/40" />
              <Input {...register("email")} type="email" placeholder="john@example.com" className="pl-12 h-12 rounded-xl bg-white/50 border-luxury-slate/20" />
            </div>
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-luxury-slate/70">Contact Number</Label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-luxury-slate/40" />
              <Input {...register("contactNumber")} placeholder="Optional but recommended" className="pl-12 h-12 rounded-xl bg-white/50 border-luxury-slate/20" />
            </div>
            {errors.contactNumber && <p className="text-xs text-red-500 mt-1">{errors.contactNumber.message}</p>}
          </div>

          <div className="space-y-2 col-span-1 md:col-span-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-luxury-slate/70">Address</Label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-luxury-slate/40" />
              <Input {...register("address")} placeholder="123 Luxury Ln, Miami, FL" className="pl-12 h-12 rounded-xl bg-white/50 border-luxury-slate/20" />
            </div>
            {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address.message}</p>}
          </div>

          {selectedRole === 'agent' && (
            <>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-luxury-slate/70">License Number</Label>
                <Input {...register("licenseNumber")} placeholder="RE-123456" className="h-12 rounded-xl bg-white border-luxury-slate/20" />
                {errors.licenseNumber && <p className="text-xs text-red-500 mt-1">{errors.licenseNumber.message}</p>}
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-luxury-slate/70">Experience (Years)</Label>
                <Input {...register("experience", { valueAsNumber: true })} type="number" placeholder="5" className="h-12 rounded-xl bg-white border-luxury-slate/20" />
              </div>
              <div className="space-y-2 col-span-1 md:col-span-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-luxury-slate/70">Specialization</Label>
                <Input {...register("specialization")} placeholder="e.g. Luxury Villas" className="h-12 rounded-xl bg-white border-luxury-slate/20" />
              </div>
            </>
          )}

          <div className="space-y-2 col-span-1 md:col-span-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-luxury-slate/70">Password</Label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-luxury-slate/40" />
              <Input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pl-12 pr-12 h-12 rounded-xl bg-white/50 border-luxury-slate/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-luxury-slate/40"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-14 rounded-2xl bg-luxury-slate text-white text-lg font-bold shadow-xl hover:bg-black transition-all"
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Create Account"}
        </Button>
      </form>

      <p className="text-center text-luxury-slate/70 font-medium">
        Already have an account?{" "}
        <Link href="/login" className="text-luxury-gold font-black hover:underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </div>
  );
}
