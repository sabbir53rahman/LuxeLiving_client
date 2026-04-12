"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  GraduationCap,
  LayoutDashboard,
  Calendar,
  UserCircle,
  MessageSquare,
  // Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  Activity,
  Users,
  BookOpen,
  Star,
  Briefcase,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/useRedux";
import { logout } from "@/redux/features/auth/authSlice";
import type { ElementType } from "react";

interface NavItem {
  label: string;
  href: string;
  icon: ElementType;
}

const NAV_CONFIG: Record<string, NavItem[]> = {
  admin: [
    { label: "Dashboard", href: "/admin-dashboard", icon: LayoutDashboard },
    { label: "Manage Users", href: "/manage-users", icon: Users },
    { label: "Live Sessions", href: "/all-schedules", icon: Activity },
    { label: "Payment History", href: "/payments", icon: DollarIcon },
    // { label: "Settings", href: "/settings", icon: Settings },
  ],
  mentor: [
    { label: "Dashboard", href: "/mentor-dashboard", icon: LayoutDashboard },
    { label: "My Calendar", href: "/availability", icon: Calendar },
    { label: "My Sessions", href: "/manage-sessions", icon: MessageSquare },
    { label: "Reviews", href: "/reviews", icon: Star },
    { label: "My Profile", href: "/profile", icon: UserCircle },
    // { label: "Settings", href: "/settings", icon: Settings },
  ],
  student: [
    { label: "Dashboard", href: "/student-dashboard", icon: LayoutDashboard },
    { label: "Book a Session", href: "/book-session", icon: Calendar },
    { label: "My Learning", href: "/session-history", icon: BookOpen },
    { label: "Reviews", href: "/my-reviews", icon: Star },
    // { label: "My Profile", href: "/profile", icon: UserCircle },
    // { label: "Settings", href: "/settings", icon: Settings },
  ],
};

function DollarIcon(props: React.ComponentProps<"svg">) {
  return <CreditCard {...props} />;
}

export function DashboardSidebar({
  isMobile,
  onNavClick,
}: {
  isMobile?: boolean;
  onNavClick?: () => void;
}) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Determine the correct navigation based on user role
  const role = user?.role?.toLowerCase() || "student";
  const normalizedRole = role === "super_admin" ? "admin" : role;
  const items = NAV_CONFIG[normalizedRole] || NAV_CONFIG.student;

  const collapsed = !isMobile && isCollapsed;

  const handleLogout = () => {
    dispatch(logout());
    document.cookie = "token=; path=/; max-age=0; SameSite=Lax";
    router.push("/");
  };

  return (
    <aside
      className={cn(
        "relative flex flex-col bg-card text-card-foreground transition-all duration-300 h-screen top-0 border-r border-border shadow-soft",
        collapsed ? "w-20" : "w-72",
      )}
    >
      {/* Brand / Logo */}
      <Link
        href={
          normalizedRole === "admin"
            ? "/admin-dashboard"
            : normalizedRole === "mentor"
              ? "/mentor-dashboard"
              : "/student-dashboard"
        }
        className="p-6 h-20 flex items-center gap-3 border-b border-border/50 hover:bg-accent/50 transition-colors"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-primary to-secondary shadow-lg shadow-primary/20">
          {normalizedRole === "admin" ? (
            <ShieldCheck className="h-5 w-5 text-white" />
          ) : normalizedRole === "mentor" ? (
            <Briefcase className="h-5 w-5 text-white" />
          ) : (
            <GraduationCap className="h-5 w-5 text-white" />
          )}
        </div>
        {!collapsed && (
          <span className="font-heading font-black text-2xl tracking-tight bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary">
            Guidely
          </span>
        )}
      </Link>

      {/* Toggle Button */}
      {!isMobile && (
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-24 h-6 w-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-xl hover:scale-110 transition-transform z-50 ring-4 ring-background"
        >
          {collapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </button>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto hide-scrollbar">
        {items.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavClick}
              className={cn(
                "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group relative overflow-hidden",
                isActive
                  ? "bg-primary text-primary-foreground font-bold shadow-md shadow-primary/20"
                  : "text-muted-foreground font-medium hover:text-foreground hover:bg-accent/50",
              )}
            >
              {/* Animated active background overlay */}
              {isActive && (
                <div className="absolute inset-0 bg-primary opacity-10" />
              )}

              <Icon
                className={cn(
                  "h-5 w-5 shrink-0 transition-transform group-hover:scale-110 relative z-10",
                )}
              />

              {!collapsed && (
                <span className="text-sm tracking-wide relative z-10">
                  {item.label}
                </span>
              )}

              {/* Tooltip for collapsed state */}
              {collapsed && !isMobile && (
                <div className="absolute left-full ml-4 px-3 py-1.5 bg-foreground text-background text-xs font-bold rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap shadow-xl">
                  {item.label}
                  <div className="absolute top-1/2 -translate-y-1/2 -left-1 border-4 border-transparent border-r-foreground" />
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / User controls */}
      <div className="p-4 border-t border-border/50 bg-background/50 backdrop-blur-sm">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className={cn(
            "w-full flex items-center gap-4 h-14 rounded-2xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all px-4 group",
            collapsed && "justify-center",
          )}
        >
          <LogOut className="h-5 w-5 shrink-0 group-hover:-translate-x-1 transition-transform" />
          {!collapsed && (
            <span className="font-bold text-sm tracking-wide text-left">
              Logout Account
            </span>
          )}
        </Button>
      </div>
    </aside>
  );
}
