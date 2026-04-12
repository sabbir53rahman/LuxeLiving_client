"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { LayoutDashboard, Calendar, Heart, MessageSquare, Settings } from "lucide-react";

const buyerLinks = [
  { name: "Dashboard", href: "/buyer-dashboard", icon: LayoutDashboard },
  { name: "My Viewings", href: "/buyer-dashboard/viewings", icon: Calendar },
  { name: "Saved Homes", href: "/buyer-dashboard/saved", icon: Heart },
  { name: "Messages", href: "/buyer-dashboard/messages", icon: MessageSquare },
  { name: "Profile", href: "/buyer-dashboard/profile", icon: Settings },
];

export default function BuyerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout navLinks={buyerLinks}>{children}</DashboardLayout>;
}
