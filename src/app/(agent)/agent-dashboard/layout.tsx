"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { 
  LayoutDashboard, 
  Building, 
  Calendar, 
  Users, 
  Star,
  DollarSign,
  Handshake
} from "lucide-react";

const agentLinks = [
  { name: "Dashboard", href: "/agent-dashboard", icon: LayoutDashboard },
  { name: "Profile", href: "/agent-dashboard/profile", icon: Users },
  { name: "Properties", href: "/agent-dashboard/properties", icon: Building },
  { name: "Viewings", href: "/agent-dashboard/viewings", icon: Calendar },
  { name: "Reviews", href: "/agent-dashboard/reviews", icon: Star },
  { name: "Earnings", href: "/agent-dashboard/earnings", icon: DollarSign },
  { name: "Collaborations", href: "/agent-dashboard/collaborations", icon: Handshake },
];

export default function AgentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout navLinks={agentLinks}>{children}</DashboardLayout>;
}
