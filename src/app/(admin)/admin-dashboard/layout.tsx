"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  LayoutDashboard,
  Users,
  Building,
  CalendarCheck,
  Star,
  UserCheck,
} from "lucide-react";

const adminLinks = [
  { name: "Overview", href: "/admin-dashboard", icon: LayoutDashboard },
  { name: "Users", href: "/admin-dashboard/users", icon: Users },
  { name: "Properties", href: "/admin-dashboard/properties", icon: Building },
  { name: "Viewings", href: "/admin-dashboard/viewings", icon: CalendarCheck },
  { name: "Reviews", href: "/admin-dashboard/reviews", icon: Star },
  { name: "Agents", href: "/admin-dashboard/agents", icon: UserCheck },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout navLinks={adminLinks}>{children}</DashboardLayout>
  );
}
