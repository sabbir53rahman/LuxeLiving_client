"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLoginMutation } from "@/redux/api/authApi";
import { useAppDispatch } from "@/hooks/useRedux";
import { setCredentials } from "@/redux/features/auth/authSlice";
import { User } from "@/types";

interface DecodedToken { userId: string; email: string; role: string; name?: string; exp: number; }

function setCookieToken(token: string) {
  document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
}

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const result = await login(data).unwrap();

      // Support both { data: { accessToken } } and flat { token } shapes
      const token: string =
        result?.data?.accessToken ||
        result?.data?.token ||
        result?.accessToken ||
        result?.token;

      if (!token) {
        toast.error("Login failed. No token received from server.");
        return;
      }

      // Save token to cookie so middleware can read it
      setCookieToken(token);

      // Decode token to get user info
      const decoded = jwtDecode<DecodedToken>(token);
      const user: User = {
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role,
        name: decoded.name || data.email,
        createdAt: new Date().toISOString(),
      };

      dispatch(setCredentials({ user, token }));

      toast.success("Login successful! Welcome back.");

      // Redirect based on role
      const role = decoded.role.toLowerCase();
      if (role === "buyer") router.push("/buyer-dashboard");
      else if (role === "seller") router.push("/seller-dashboard");
      else if (role === "agent") router.push("/agent-dashboard");
      else if (role === "admin" || role === "super_admin") router.push("/admin-dashboard");
      else router.push("/");
    } catch (error: unknown) {
      const err = error as { data?: { message?: string }; message?: string };
      toast.error(
        err?.data?.message || err?.message || "Login failed. Please check your credentials.",
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
          Welcome Back
        </h1>
        <p className="text-blue-200 text-sm">
          Enter your credentials to access your account
        </p>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden text-center mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome Back
        </h1>
        <p className="text-blue-200 text-sm">
          Sign in to your LuxeLiving account
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email Field */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-yellow-400/80">
            EMAIL ADDRESS
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-yellow-400/60" />
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="pl-12 h-12 bg-white/10 border-white/20 text-white placeholder-white/40 rounded-xl focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 backdrop-blur-sm"
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-400 mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-yellow-400/80">
              PASSWORD
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-yellow-400 hover:text-yellow-300 transition-colors font-medium"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-yellow-400/60" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="pl-12 pr-12 h-12 bg-white/10 border-white/20 text-white placeholder-white/40 rounded-xl focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 backdrop-blur-sm"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-yellow-400/60 hover:text-yellow-400 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-400 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Remember Me Checkbox */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <input
              type="checkbox"
              id="remember"
              className="sr-only peer"
            />
            <div className="w-5 h-5 bg-white/10 border border-white/20 rounded peer-checked:bg-yellow-400 peer-checked:border-yellow-400 transition-colors flex items-center justify-center">
              <div className="w-3 h-3 bg-blue-900 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity" />
            </div>
          </div>
          <label htmlFor="remember" className="text-sm text-blue-200 cursor-pointer">
            Maintain session on this device
          </label>
        </div>

        {/* Sign In Button */}
        <Button
          type="submit"
          className="w-full h-12 bg-linear-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-blue-900 font-bold rounded-xl shadow-lg shadow-yellow-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/40 disabled:opacity-70"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Signing in...
            </>
          ) : (
            "SIGN IN"
          )}
        </Button>
      </form>

      {/* Footer Links */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-6">
          <Link
            href="/forgot-password"
            className="text-sm text-yellow-400 hover:text-yellow-300 transition-colors font-medium"
          >
            FORGOT PASSWORD?
          </Link>
          <span className="text-yellow-400/40">•</span>
          <Link
            href="/register"
            className="text-sm text-yellow-400 hover:text-yellow-300 transition-colors font-medium"
          >
            Request Registration
          </Link>
        </div>
        <p className="text-xs text-blue-300/60">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors"
          >
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}
