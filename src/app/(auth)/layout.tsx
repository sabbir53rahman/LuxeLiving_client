import Image from "next/image";
import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";
// import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Button } from "@/components/ui/button";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-black">
      {/* Decorative Side - Hidden on Mobile */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2000"
          alt="Luxury real estate background"
          fill
          className="object-cover opacity-30"
          priority
        />

        {/* Medium Black Overlay - Balanced glossy effect */}
        <div className="absolute inset-0 bg-linear-to-br from-black/40 via-black/50 to-black/60" />
        
        {/* Secondary Black Overlay for depth */}
        <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-black/20" />
        
        {/* Gold Accent Overlay - Subtle luxury touch */}
        <div className="absolute inset-0 bg-linear-to-t from-yellow-400/3 via-transparent to-transparent" />

        {/* LuxeLiving Branding */}
        <div className="absolute top-12 left-12 z-20">
          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-yellow-400 to-yellow-600 shadow-lg shadow-yellow-500/30">
              <div className="h-6 w-6 bg-blue-900 rounded-lg flex items-center justify-center">
                <Home className="h-4 w-4 text-yellow-400" />
              </div>
            </div>
            <span className="font-bold text-2xl text-white tracking-tight">LuxeLiving</span>
          </Link>
        </div>

        <div className="absolute bottom-20 left-12 right-12 z-20">
          <div className="p-8 rounded-[2.5rem] bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
            <h2 className="text-5xl font-black text-white mb-4 leading-tight tracking-tight">
              THE CURATOR
              <br />
              <span className="text-yellow-400 font-bold">EXPERIENCE</span>
            </h2>
            <p className="text-blue-200 text-lg leading-relaxed max-w-md font-medium mb-6">
              Discover exclusive properties and connect with premier real estate professionals in your journey to find the perfect luxury home.
            </p>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-yellow-400 rounded-full" />
                <span className="text-blue-300 text-sm font-semibold">Premium Properties</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-yellow-400 rounded-full" />
                <span className="text-blue-300 text-sm font-semibold">Expert Agents</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Content Area */}
      <div className="flex-1 flex flex-col relative overflow-y-auto">
        <div className="absolute top-8 right-8 flex items-center gap-4 z-50">
          {/* <ThemeToggle /> */}
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 rounded-full px-4 text-white hover:text-yellow-400 hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </Button>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-20">
          <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* Mobile Logo */}
            <div className="lg:hidden flex justify-center mb-12">
              <Link
                href="/"
                className="flex items-center gap-3"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-yellow-400 to-yellow-600 shadow-lg shadow-yellow-500/30">
                  <div className="h-6 w-6 bg-blue-900 rounded-lg flex items-center justify-center">
                    <Home className="h-4 w-4 text-yellow-400" />
                  </div>
                </div>
                <span className="font-bold text-2xl text-white tracking-tight">LuxeLiving</span>
              </Link>
            </div>
            {children}
          </div>
        </div>

        {/* Footer info for mobile/auth */}
        <div className="p-8 text-center text-sm text-blue-300/60 font-medium lg:hidden">
          © {new Date().getFullYear()} LuxeLiving. Luxury Real Estate Platform.
        </div>
      </div>
    </div>
  );
}
