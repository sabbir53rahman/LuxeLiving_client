import Link from "next/link";
import {
  Home,
  Twitter,
  Linkedin,
  Github,
  Youtube,
  Instagram
} from "lucide-react";
import { FOOTER_LINKS } from "@/constants";

export default function Footer() {
  return (
    <footer className="border-t bg-luxury-slate text-white border-white/10">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 sm:gap-8 py-16 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-xl mb-4 text-luxury-gold font-heading"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-luxury-gold">
                <Home className="h-5 w-5 text-luxury-slate" />
              </div>
              <span>
                LuxeLiving
              </span>
            </Link>
            <p className="text-sm text-white/70 max-w-xs leading-relaxed">
              Experience the pinnacle of luxury real estate. We connect discerning buyers with extraordinary properties and exclusive estates globally.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {[
                { icon: Twitter, label: "Twitter", href: "#" },
                { icon: Linkedin, label: "LinkedIn", href: "#" },
                { icon: Instagram, label: "Instagram", href: "#" },
                { icon: Youtube, label: "YouTube", href: "#" },
              ].map(({ icon: Icon, label, href }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-white/20 bg-white/5 text-white/70 hover:text-luxury-gold hover:border-luxury-gold transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h3 className="font-semibold text-luxury-gold tracking-wide text-sm uppercase mb-6">
                {section}
              </h3>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 hover:text-luxury-gold hover:tracking-wide transition-all"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} LuxeLiving Real Estate Group. All rights reserved.
          </p>
          <div className="flex gap-4">
            <p className="text-xs text-white/50">
               Privacy Policy
            </p>
            <p className="text-xs text-white/50">
               Terms of Service
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
