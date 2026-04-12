"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  Home,
  ChevronDown,
  Building,
  MapPin,
  Users,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useAppDispatch } from "@/hooks/useRedux";
import { logout } from "@/redux/features/auth/authSlice";
import { cn } from "@/lib/utils";
// import { ThemeToggle } from "./ThemeToggle";

const PROPERTY_CATEGORIES = [
  { label: "Luxury Villas", href: "/properties/villas", icon: Building },
  { label: "Penthouses", href: "/properties/penthouses", icon: Building },
  { label: "Mansions", href: "/properties/mansions", icon: Building },
  { label: "Apartments", href: "/properties/apartments", icon: Building },
  { label: "Condos", href: "/properties/condos", icon: Building },
];

const LOCATIONS = [
  { label: "New York", href: "/locations/new-york" },
  { label: "Los Angeles", href: "/locations/los-angeles" },
  { label: "Miami", href: "/locations/miami" },
  { label: "Dubai", href: "/locations/dubai" },
  { label: "London", href: "/locations/london" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(false);
  // const [isLocationsOpen, setIsLocationsOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogout = () => {
    dispatch(logout());
    document.cookie = "token=; path=/; max-age=0; SameSite=Lax";
    router.push("/");
  };

  const handlePropertiesMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsPropertiesOpen(true);
  };

  const handlePropertiesMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsPropertiesOpen(false);
    }, 200); // 200ms delay
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const getDashboardLink = () => {
    if (!user) return "/login";
    if (user.role.toLowerCase() === "agent") return "/agent-dashboard";
    if (user.role.toLowerCase() === "buyer") return "/buyer-dashboard";
    if (user.role.toLowerCase() === "seller") return "/seller-dashboard";
    return "/agent-dashboard";
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-strong border-b border-white/10">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-luxury-gold">
              <Home className="h-5 w-5 text-luxury-slate" />
            </div>
            <span className="text-luxury-gold font-heading">LuxeLiving</span>
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden lg:flex items-center gap-6">
            {/* Properties Mega Menu */}
            <li
              className="relative"
              onMouseEnter={handlePropertiesMouseEnter}
              onMouseLeave={handlePropertiesMouseLeave}
            >
              <button className="flex items-center gap-1 text-white hover:text-luxury-gold transition-colors py-2">
                Properties
                <ChevronDown className="h-4 w-4" />
              </button>

              {/* Mega Menu */}
              {isPropertiesOpen && (
                <div 
                  className="absolute top-full left-0 w-screen max-w-4xl glass-strong rounded-lg border border-white/20 mt-2 p-6 shadow-2xl"
                  onMouseEnter={handlePropertiesMouseEnter}
                  onMouseLeave={handlePropertiesMouseLeave}
                >
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-luxury-gold font-semibold mb-4 flex items-center gap-2">
                        <Building className="h-5 w-5" />
                        Property Types
                      </h3>
                      <div className="space-y-2">
                        {PROPERTY_CATEGORIES.map((category) => (
                          <Link
                            key={category.href}
                            href={category.href}
                            className="flex items-center gap-3 text-white/80 hover:text-luxury-gold hover:bg-white/10 p-2 rounded transition-all"
                          >
                            <category.icon className="h-4 w-4" />
                            <span>{category.label}</span>
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-luxury-gold font-semibold mb-4 flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Popular Locations
                      </h3>
                      <div className="space-y-2">
                        {LOCATIONS.map((location) => (
                          <Link
                            key={location.href}
                            href={location.href}
                            className="block text-white/80 hover:text-luxury-gold hover:bg-white/10 p-2 rounded transition-all"
                          >
                            {location.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-white/20">
                    <Link href="/properties">
                      <Button className="bg-luxury-gold text-luxury-slate hover:bg-luxury-gold/90">
                        View All Properties
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </li>

            {/* Agents */}
            <li>
              <Link
                href="/agents"
                className="text-white hover:text-luxury-gold transition-colors py-2 flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                Agents
              </Link>
            </li>

            {/* About */}
            <li>
              <Link
                href="/about"
                className="text-white hover:text-luxury-gold transition-colors py-2"
              >
                About
              </Link>
            </li>

            {/* Contact */}
            <li>
              <Link
                href="/contact"
                className="text-white hover:text-luxury-gold transition-colors py-2 flex items-center gap-2"
              >
                <Phone className="h-4 w-4" />
                Contact
              </Link>
            </li>
          </ul>

          {/* Desktop Auth */}
          <div className="hidden lg:flex items-center gap-3">
            {/* <ThemeToggle /> */}
            {isAuthenticated && user ? (
              <>
                <Link href={getDashboardLink()}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:text-luxury-gold"
                  >
                    Dashboard
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <button className="flex items-center gap-2 rounded-full p-1 hover:bg-white/10 transition-colors" />
                    }
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={user.avatar ?? undefined}
                        alt={user.name}
                      />
                      <AvatarFallback className="bg-luxury-gold text-luxury-slate">
                        {user.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="h-4 w-4 text-white" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-48 glass-strong border-white/20"
                  >
                    <div className="px-2 py-1.5 text-sm font-medium text-white">
                      {user.name}
                    </div>
                    <div className="px-2 pb-1.5 text-xs text-white/60 capitalize">
                      {user.role}
                    </div>
                    <DropdownMenuSeparator className="bg-white/20" />
                    <DropdownMenuItem
                      render={<Link href={getDashboardLink()} />}
                      className="text-white hover:text-luxury-gold"
                    >
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      render={<Link href="/profile" />}
                      className="text-white hover:text-luxury-gold"
                    >
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/20" />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-400 focus:text-red-400"
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:text-luxury-gold"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    size="sm"
                    className="bg-luxury-gold text-luxury-slate hover:bg-luxury-gold/90"
                  >
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 rounded-md hover:bg-white/10 text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </nav>

        {/* Mobile Menu */}
        <div
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-300",
            isMenuOpen ? "max-h-96 pb-4" : "max-h-0",
          )}
        >
          <div className="flex flex-col gap-1 pt-2">
            <Link
              href="/properties"
              className="px-4 py-2 text-sm font-medium text-white/80 hover:text-luxury-gold rounded-md hover:bg-white/10 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Properties
            </Link>
            <Link
              href="/agents"
              className="px-4 py-2 text-sm font-medium text-white/80 hover:text-luxury-gold rounded-md hover:bg-white/10 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Agents
            </Link>
            <Link
              href="/about"
              className="px-4 py-2 text-sm font-medium text-white/80 hover:text-luxury-gold rounded-md hover:bg-white/10 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="px-4 py-2 text-sm font-medium text-white/80 hover:text-luxury-gold rounded-md hover:bg-white/10 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>

            <div className="border-t border-white/20 mt-2 pt-2 flex flex-col gap-2">
              {isAuthenticated && user ? (
                <>
                  <Link
                    href={getDashboardLink()}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-white hover:text-luxury-gold"
                    >
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-400"
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button
                      variant="ghost"
                      className="w-full text-white hover:text-luxury-gold"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-luxury-gold text-luxury-slate hover:bg-luxury-gold/90">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
