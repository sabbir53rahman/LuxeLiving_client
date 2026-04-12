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
import { Label } from "@/components/ui/label";
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
    <div className="space-y-10">
      <div className="space-y-4">
        <h1 className="text-4xl font-heading font-black tracking-tight text-foreground">
          Welcome back
        </h1>
        <p className="text-muted-foreground text-lg font-medium">
          Enter your credentials to access your dashboard.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-5">
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-bold uppercase tracking-wider text-muted-foreground"
            >
              Email Address
            </Label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                className="pl-12 h-14 rounded-2xl bg-muted/50 border-border group-focus-within:border-primary group-focus-within:ring-1 group-focus-within:ring-primary transition-all text-base"
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-sm font-medium text-destructive mt-1 ml-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="password"
                className="text-sm font-bold uppercase tracking-wider text-muted-foreground"
              >
                Password
              </Label>
              <Link
                href="/forgot-password"
                className="text-sm font-bold text-primary hover:text-primary/80 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pl-12 pr-12 h-14 rounded-2xl bg-muted/50 border-border group-focus-within:border-primary group-focus-within:ring-1 group-focus-within:ring-primary transition-all text-base"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm font-medium text-destructive mt-1 ml-1">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-14 rounded-2xl bg-primary text-primary-foreground text-lg font-black shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-4 text-muted-foreground font-bold tracking-widest">
            Or continue with
          </span>
        </div>
      </div>

      {/* <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          className="h-14 rounded-2xl border-border bg-background hover:bg-muted/50 font-bold gap-3 transition-all"
        >
          <Chrome className="h-5 w-5" />
          Google
        </Button>
        <Button
          variant="outline"
          className="h-14 rounded-2xl border-border bg-background hover:bg-muted/50 font-bold gap-3 transition-all"
        >
          <Github className="h-5 w-5" />
          GitHub
        </Button>
      </div> */}

      <p className="text-center text-muted-foreground font-medium">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-primary font-black hover:underline underline-offset-4"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
