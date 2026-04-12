import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

// ── Route groups ──────────────────────────────────────────────────────────────
const buyerRoutes = ["/buyer-dashboard"];
const sellerRoutes = ["/seller-dashboard"];
const agentRoutes = ["/agent-dashboard"];
const adminRoutes = ["/admin-dashboard"];
const authRoutes = ["/login", "/register"];

// All dashboard routes combined
const allDashboardRoutes = [
  ...buyerRoutes,
  ...sellerRoutes,
  ...agentRoutes,
  ...adminRoutes,
];

interface DecodedToken {
  id: string;
  email: string;
  role: string;
  exp: number;
  iat: number;
}

/** Returns the correct dashboard URL for the given role */
function getDashboardForRole(role: string): string {
  const r = role.toLowerCase();
  if (r === "buyer") return "/buyer-dashboard";
  if (r === "seller") return "/seller-dashboard";
  if (r === "agent") return "/agent-dashboard";
  if (r === "admin" || r === "super_admin") return "/admin-dashboard";
  return "/";
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  // ── 1. Decode token once (if present) ────────────────────────────────────
  let decoded: DecodedToken | null = null;
  if (token) {
    try {
      const d = jwtDecode<DecodedToken>(token);
      // Treat as logged-in only if token is not expired
      if (d.exp * 1000 > Date.now()) {
        decoded = d;
      }
    } catch {
      // Malformed token – treat as not logged in
    }
  }

  // ── 2. /dashboard → redirect to role-specific dashboard ──────────────────
  if (pathname === "/dashboard") {
    if (decoded) {
      return NextResponse.redirect(
        new URL(getDashboardForRole(decoded.role), request.url),
      );
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ── 3. Auth pages (login / register) – redirect away if already logged in ─
  if (authRoutes.some((r) => pathname.startsWith(r))) {
    if (decoded) {
      return NextResponse.redirect(
        new URL(getDashboardForRole(decoded.role), request.url),
      );
    }
    return NextResponse.next();
  }

  // ── 4. Dashboard routes – must be authenticated ───────────────────────────
  const isDashboardRoute = allDashboardRoutes.some((r) =>
    pathname.startsWith(r),
  );

  if (isDashboardRoute) {
    // Not logged in → go to login
    if (!decoded) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const role = decoded.role.toLowerCase();

    // Wrong role → redirect to their own dashboard
    if (
      buyerRoutes.some((r) => pathname.startsWith(r)) &&
      role !== "buyer"
    ) {
      return NextResponse.redirect(
        new URL(getDashboardForRole(role), request.url),
      );
    }

    if (
      sellerRoutes.some((r) => pathname.startsWith(r)) &&
      role !== "seller"
    ) {
      return NextResponse.redirect(
        new URL(getDashboardForRole(role), request.url),
      );
    }

    if (
      agentRoutes.some((r) => pathname.startsWith(r)) &&
      role !== "agent"
    ) {
      return NextResponse.redirect(
        new URL(getDashboardForRole(role), request.url),
      );
    }

    if (
      adminRoutes.some((r) => pathname.startsWith(r)) &&
      role !== "admin" &&
      role !== "super_admin"
    ) {
      return NextResponse.redirect(
        new URL(getDashboardForRole(role), request.url),
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/buyer-dashboard/:path*",
    "/seller-dashboard/:path*",
    "/agent-dashboard/:path*",
    "/admin-dashboard/:path*",
    "/login",
    "/register",
  ],
};
