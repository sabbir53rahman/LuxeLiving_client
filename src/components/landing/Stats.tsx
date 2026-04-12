"use client";

import { Globe2, Users2, Zap, Trophy } from "lucide-react";

const stats = [
  {
    label: "Elite Mentors",
    value: "850+",
    icon: Trophy,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    label: "Global Reach",
    value: "145+",
    icon: Globe2,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    label: "Sessions Booked",
    value: "25K+",
    icon: Zap,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    label: "Community",
    value: "100K+",
    icon: Users2,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
  },
];

export function Stats() {
  return (
    <section className="py-24 bg-white dark:bg-slate-950/20 border-y border-border/40 transition-colors duration-500 relative">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-size-[32px_32px]" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-16">
          {stats.map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="text-center group space-y-4">
              <div
                className={`mx-auto h-20 w-20 rounded-[2rem] ${bg} flex items-center justify-center transition-transform duration-700 group-hover:rotate-12 group-hover:scale-105 shadow-md border border-border/40`}
              >
                <Icon className={`h-8 w-8 ${color}`} />
              </div>
              <div className="space-y-1">
                <div className="text-4xl md:text-5xl font-heading font-bold text-foreground tracking-tight">
                  {value}
                </div>
                <div className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.3em] leading-none">
                  {label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
