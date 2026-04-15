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
  Briefcase
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  role: z.enum(["agent", "buyer", "seller"]),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: string;
  contactNumber?: string;
  address?: string;
  licenseNumber?: string;
  experience?: number;
  specialization?: string;
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
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "buyer",
    },
  });

  const onSubmit: SubmitHandler<RegisterFormValues> = async (data) => {
    try {
      let result;
      const payload: RegisterPayload = {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      };

      // Call the appropriate registration API based on role
      if (data.role === 'agent') {
        result = await registerAgent(payload).unwrap();
      } else if (data.role === 'seller') {
        result = await registerSeller(payload).unwrap();
      } else {
        result = await registerBuyer(payload).unwrap();
      }

      // Support both { data: { accessToken } } and flat { token } shapes
      const token: string =
        result?.data?.accessToken ||
        result?.data?.token ||
        result?.accessToken ||
        result?.token;

      if (!token) {
        toast.error("Registration failed. No token received from server.");
        return;
      }

      // Save token to cookie so middleware can read it
      setCookieToken(token);

      // Decode token to get user info
      const decoded = jwtDecode<DecodedToken>(token);
      const user: User = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        name: decoded.name || data.name,
        createdAt: new Date().toISOString(),
      };

      dispatch(setCredentials({ user, token }));

      toast.success("Registration successful! Welcome to LuxeLiving.");

      // Redirect based on role
      const role = decoded.role.toLowerCase();
      if (role === "agent") router.push("/agent-dashboard");
      else if (role === "seller") router.push("/seller-dashboard");
      else if (role === "buyer") router.push("/buyer-dashboard");
      else router.push("/");
    } catch (error: unknown) {
      const err = error as { data?: { message?: string }; message?: string };
      toast.error(
        err?.data?.message || err?.message || "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="space-y-8">
      {/* Desktop Branding - Hidden on Mobile */}
      <div className="hidden lg:block text-center mb-8">
        <div className="inline-flex items-center justify-center mb-6">
          <div className="w-16 h-16 bg-linear-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-500/30">
            <div className="w-8 h-8 bg-blue-900 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-yellow-400 rounded-full" />
            </div>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-yellow-400 uppercase tracking-wider mb-2">
          THE CURATOR EXPERIENCE
        </h2>
        <h1 className="text-4xl font-bold text-white mb-2">
          Join LuxeLiving
        </h1>
        <p className="text-blue-200 text-sm">
          Create an account to start your luxury real estate journey
        </p>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden text-center mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">
          Join LuxeLiving
        </h1>
        <p className="text-blue-200 text-sm">
          Start your luxury real estate journey
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Role Selection */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-yellow-400/80">
            I WANT TO JOIN AS...
          </label>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => field.onChange("buyer")}
                  className={`relative group p-4 rounded-xl border-2 text-center transition-all duration-300 ${
                    field.value === "buyer"
                      ? "border-yellow-400 bg-yellow-400/10 shadow-lg shadow-yellow-400/20"
                      : "border-white/20 bg-white/5 hover:border-yellow-400/40"
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                      field.value === "buyer" ? "bg-yellow-400 text-blue-900" : "bg-white/10 text-yellow-400/60"
                    }`}>
                      <Home className="h-5 w-5" />
                    </div>
                    <div className="font-bold text-xs uppercase tracking-tight text-white">Buyer</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => field.onChange("seller")}
                  className={`relative group p-4 rounded-xl border-2 text-center transition-all duration-300 ${
                    field.value === "seller"
                      ? "border-yellow-400 bg-yellow-400/10 shadow-lg shadow-yellow-400/20"
                      : "border-white/20 bg-white/5 hover:border-yellow-400/40"
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                      field.value === "seller" ? "bg-yellow-400 text-blue-900" : "bg-white/10 text-yellow-400/60"
                    }`}>
                      <Building className="h-5 w-5" />
                    </div>
                    <div className="font-bold text-xs uppercase tracking-tight text-white">Seller</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => field.onChange("agent")}
                  className={`relative group p-4 rounded-xl border-2 text-center transition-all duration-300 ${
                    field.value === "agent"
                      ? "border-yellow-400 bg-yellow-400/10 shadow-lg shadow-yellow-400/20"
                      : "border-white/20 bg-white/5 hover:border-yellow-400/40"
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                      field.value === "agent" ? "bg-yellow-400 text-blue-900" : "bg-white/10 text-yellow-400/60"
                    }`}>
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <div className="font-bold text-xs uppercase tracking-tight text-white">Agent</div>
                  </div>
                </button>
              </div>
            )}
          />
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-yellow-400/80">
              FULL NAME
            </label>
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-yellow-400/60" />
              <Input 
                {...register("name")} 
                placeholder="Enter your full name" 
                className="pl-12 h-12 bg-white/10 border-white/20 text-white placeholder-white/40 rounded-xl focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 backdrop-blur-sm" 
              />
            </div>
            {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-yellow-400/80">
              EMAIL ADDRESS
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-yellow-400/60" />
              <Input 
                {...register("email")} 
                type="email" 
                placeholder="Enter your email" 
                className="pl-12 h-12 bg-white/10 border-white/20 text-white placeholder-white/40 rounded-xl focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 backdrop-blur-sm" 
              />
            </div>
            {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-yellow-400/80">
              PASSWORD
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-yellow-400/60" />
              <Input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                className="pl-12 pr-12 h-12 bg-white/10 border-white/20 text-white placeholder-white/40 rounded-xl focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 backdrop-blur-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-yellow-400/60 hover:text-yellow-400 transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>}
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-linear-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-blue-900 font-bold rounded-xl shadow-lg shadow-yellow-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/40 disabled:opacity-70"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Creating Account...
            </>
          ) : (
            "CREATE ACCOUNT"
          )}
        </Button>
      </form>

      {/* Footer Links */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center">
          <Link
            href="/login"
            className="text-sm text-yellow-400 hover:text-yellow-300 transition-colors font-medium"
          >
            Already have an account?
          </Link>
        </div>
        <p className="text-xs text-blue-300/60">
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
