"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  UserCircle,
  MessageSquare,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const SIDEBAR_ITEMS = [
  {
    label: "Dashboard",
    href: "/mentor-dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Manage Sessions",
    href: "/manage-sessions",
    icon: MessageSquare,
  },
  {
    label: "Availability",
    href: "/availability",
    icon: Calendar,
  },
  {
    label: "My Profile",
    href: "/profile",
    icon: UserCircle,
  },
  {
    label: "Payments",
    href: "/payments",
    icon: CreditCard,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function MentorSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "sticky flex flex-col bg-slate-950 text-white transition-all duration-300 h-screen  top-0 border-r border-white/5",
        isCollapsed ? "w-20" : "w-72",
      )}
    >
      {/* Brand / Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
          <ShieldCheck className="h-6 w-6 text-primary-foreground" />
        </div>
        {!isCollapsed && (
          <span className="font-heading font-black text-2xl tracking-tight">
            MentorHub
          </span>
        )}
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 h-6 w-6 rounded-full bg-primary flex items-center justify-center text-white shadow-xl hover:scale-110 transition-transform z-50"
      >
        {isCollapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </button>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
        {SIDEBAR_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group relative",
                isActive
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "text-slate-400 hover:text-white hover:bg-white/5",
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 shrink-0 transition-transform group-hover:scale-110",
                  isActive && "text-white",
                )}
              />

              {!isCollapsed && (
                <span className="font-bold text-sm tracking-wide">
                  {item.label}
                </span>
              )}

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-4 px-3 py-1 bg-slate-800 text-white text-xs rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap border border-white/10 shadow-2xl">
                  {item.label}
                </div>
              )}

              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-white/5">
        <Button
          variant="ghost"
          className={cn(
            "w-full flex items-center gap-4 h-14 rounded-2xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all px-4",
            isCollapsed && "justify-center",
          )}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!isCollapsed && (
            <span className="font-bold text-sm tracking-wide text-left">
              Logout
            </span>
          )}
        </Button>
      </div>
    </aside>
  );
}
