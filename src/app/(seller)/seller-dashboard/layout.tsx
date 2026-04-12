"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  LayoutDashboard,
  Home,
  Search,
  UserCheck,
  Building,
} from "lucide-react";

const sellerLinks = [
  { name: "Dashboard", href: "/seller-dashboard", icon: LayoutDashboard },
  {
    name: "My Properties",
    href: "/seller-dashboard/my-properties",
    icon: Home,
  },
  { name: "Find Agents", href: "/seller-dashboard/find-agents", icon: Search },
  {
    name: "Assigned Agents",
    href: "/seller-dashboard/assigned-agents",
    icon: UserCheck,
  },
  {
    name: "Property Agents",
    href: "/seller-dashboard/property-agents",
    icon: Building,
  },
];

export default function SellerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout navLinks={sellerLinks}>{children}</DashboardLayout>;
}
