import Image from "next/image";
import Link from "next/link";
import { GraduationCap, ArrowLeft } from "lucide-react";
// import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Button } from "@/components/ui/button";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Decorative Side - Hidden on Mobile */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900 group">
        <Image
          src="/images/auth-side-panel.png"
          alt="Auth background"
          fill
          className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-[10s]"
          priority
        />

        {/* Abstract Overlays */}
        <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/20 to-transparent" />
        <div className="absolute top-12 left-12 z-20">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-2xl text-white"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-2xl shadow-primary/40">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-heading tracking-tight">Guidely</span>
          </Link>
        </div>

        <div className="absolute bottom-20 left-12 right-12 z-20">
          <div className="p-8 rounded-[2.5rem] bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
            <h2 className="text-4xl font-heading font-black text-white mb-6 leading-tight tracking-tight">
              Empower your future with <br />
              <span className="text-secondary italic">expert guidance.</span>
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed max-w-md font-medium">
              Join a global network of professionals and students collaborating
              to reach new heights in career and skill development.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-10 w-10 rounded-full border-2 border-slate-900 bg-slate-800"
                  />
                ))}
              </div>
              <span className="text-slate-400 text-sm font-semibold">
                Join 10k+ active users
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Content Area */}
      <div className="flex-1 flex flex-col relative overflow-y-auto">
        <div className="absolute top-8 right-8 flex items-center gap-4 z-50">
          {/* <ThemeToggle /> */}
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 rounded-full px-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </Button>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-20">
          <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* Mobile Logo */}
            <div className="lg:hidden flex justify-center mb-12">
              <Link
                href="/"
                className="flex items-center gap-2 font-bold text-2xl"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg">
                  <GraduationCap className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="font-heading tracking-tight">Guidely</span>
              </Link>
            </div>
            {children}
          </div>
        </div>

        {/* Footer info for mobile/auth */}
        <div className="p-8 text-center text-sm text-muted-foreground font-medium lg:hidden">
          © {new Date().getFullYear()} Guidely. Built for creators.
        </div>
      </div>
    </div>
  );
}
