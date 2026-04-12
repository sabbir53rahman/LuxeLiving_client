"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Settings, 
  LogOut, 
  Home
} from "lucide-react";
import { useAppDispatch } from "@/hooks/useRedux";
import { logout } from "@/redux/features/auth/authSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
    if (!isLoading && (!isAuthenticated || !user)) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, user, router]);

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
      <aside className="w-full md:w-72 bg-luxury-slate relative border-r border-white/5 flex-col hidden md:flex min-h-screen">
        <div className="p-8 pb-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-luxury-gold">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-luxury-gold">
              <Home className="h-5 w-5 text-luxury-slate" />
            </div>
            <span className="font-heading">LuxeLiving</span>
          </Link>
        </div>

        <div className="px-6 py-6 border-b border-white/5">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 border-2 border-luxury-gold/50">
              <AvatarImage src={user.avatar ?? undefined} alt={user.name} />
              <AvatarFallback className="bg-luxury-gold text-luxury-slate font-bold">
                {user.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-white whitespace-nowrap overflow-hidden text-ellipsis w-40">{user.name}</h3>
              <p className="text-sm text-luxury-gold capitalize">{user.role}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2 relative z-10">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 relative group overflow-hidden ${
                  isActive 
                    ? "text-luxury-slate font-semibold" 
                    : "text-white/60 hover:text-white"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-luxury-gold rounded-2xl z-0"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                
                <span className="relative z-10 flex items-center gap-4">
                  <link.icon className={`h-5 w-5 ${isActive ? "text-luxury-slate" : "group-hover:scale-110 transition-transform"}`} />
                  {link.name}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="cursor-pointer flex items-center gap-4 px-4 py-3 rounded-2xl text-white/60 hover:text-white hover:bg-white/5 transition-colors">
            <Settings className="h-5 w-5" />
            Settings
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 px-4 py-3 rounded-2xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors w-full text-left mt-2"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#F8F9FA] dark:bg-[#0A0A0A]">
        {/* Mobile Header */}
        <div className="md:hidden glass-strong sticky top-0 z-50 px-4 py-3 border-b flex justify-between items-center bg-luxury-slate border-white/10">
           <Link href="/" className="flex items-center gap-2 font-bold text-lg text-luxury-gold">
            <Home className="h-5 w-5" />
            <span>LuxeLiving</span>
          </Link>
          <button onClick={handleLogout} className="p-2 text-white/50 hover:text-white">
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
