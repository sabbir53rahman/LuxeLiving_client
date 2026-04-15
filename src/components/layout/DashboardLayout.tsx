"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
import { useAppDispatch } from "@/hooks/useRedux";
import { logout } from "@/redux/features/auth/authSlice";
import { Button } from "../ui/button";

interface NavLink {
  name: string;
  href: string;
  icon: React.ElementType;
}

export default function DashboardLayout({
  children,
  navLinks,
}: {
  children: React.ReactNode;
  navLinks: NavLink[];
}) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const hasToken = document.cookie.split(';').some(item => item.trim().startsWith('token='));
    
    // Only redirect if NOT loading, NOT authenticated, AND actually have no token cookie
    // This prevents accidental redirects during hot-reloads where Redux is cleared but cookies remain
    if (!isLoading && !isAuthenticated && !hasToken) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-luxury-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleLogout = () => {
    dispatch(logout());
    document.cookie = "token=; path=/; max-age=0; SameSite=Lax";
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-[#0A0A0A] relative border-r border-white/5 flex-col hidden md:flex min-h-screen">
        <div className="p-10 pb-10">
          <Link href="/" className="space-y-1 block group">
            <h2 className="font-serif text-3xl text-luxury-gold tracking-tight group-hover:text-white transition-colors">
              Luxe Living
            </h2>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">
              Elite Tier
            </p>
          </Link>
        </div>

        <nav className="flex-1 px-6 space-y-2 relative z-10">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-500 relative group overflow-hidden ${
                  isActive
                    ? "text-luxury-gold bg-white/3 shadow-inner"
                    : "text-white/60 hover:text-white/80 hover:bg-white/2"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 border-l-2 border-luxury-gold z-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                )}

                <span className="relative z-10 flex items-center gap-4 text-xs font-black uppercase tracking-widest">
                  <link.icon
                    className={`h-4 w-4 ${isActive ? "text-luxury-gold" : "opacity-50"}`}
                  />
                  {link.name}
                </span>
              </Link>
            );
          })}

          {user.role === "seller" && (
            <div className="pt-8 px-2">
              <Link href="/seller-dashboard/add-property">
                <Button className="w-full h-14 bg-white/5 hover:bg-luxury-gold hover:text-white border border-white/5 text-luxury-gold font-serif text-lg rounded-sm transition-all group shadow-2xl">
                  New Listing
                </Button>
              </Link>
            </div>
          )}
        </nav>

        <div className="p-8 space-y-4">
          <Link
            href="/help"
            className="flex items-center gap-4 px-4 py-2 text-white/40 hover:text-white/60 transition-colors text-[10px] font-black uppercase tracking-widest"
          >
            <div className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center">
              ?
            </div>
            Help
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 px-4 py-2 text-red-400 transition-colors text-[10px] font-black uppercase tracking-widest w-full text-left"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#0E0E0E]">
        {/* Mobile Header */}
        <div className="md:hidden sticky top-0 z-50 px-6 py-4 border-b border-white/5 bg-[#0A0A0A] flex justify-between items-center text-white">
          <Link href="/" className="font-serif text-xl text-luxury-gold">
            The Curator
          </Link>
          <button
            onClick={handleLogout}
            className="p-2 text-white/30 hover:text-white"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
