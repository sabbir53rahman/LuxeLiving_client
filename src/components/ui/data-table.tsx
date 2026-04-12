"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  header: React.ReactNode;
  cell: (row: T) => React.ReactNode;
  className?: string; // Optional custom Tailwind class (e.g., width or text alignment)
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  emptyMessage?: React.ReactNode;
  className?: string;
}

export function DataTable<T extends { id?: string; _id?: string }>({
  data,
  columns,
  isLoading,
  emptyMessage = "No records found.",
  className,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className={cn("w-full overflow-hidden rounded-[2rem] border border-border/50 bg-card/30 backdrop-blur-xl shadow-premium animate-pulse space-y-4 p-6", className)}>
        <div className="h-10 w-full bg-muted/40 rounded-xl mb-6"></div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            {columns.map((_, j) => (
              <div key={j} className="h-12 flex-1 bg-muted/20 rounded-xl"></div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("w-full overflow-hidden rounded-[2rem] border border-border/50 bg-card/60 backdrop-blur-xl shadow-premium group", className)}>
      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full text-sm text-left align-middle border-collapse">
          <thead className="bg-muted/40 border-b border-border/50 backdrop-blur-lg">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={col.key || idx}
                  className={cn(
                    "px-6 py-5 font-bold text-xs uppercase tracking-widest text-muted-foreground/80 first:pl-8 last:pr-8",
                    col.className
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/20">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-20 text-center font-medium h-48"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-muted/30 flex items-center justify-center">
                       <span className="text-xl opacity-40">📂</span>
                    </div>
                    <span className="text-muted-foreground/60">{emptyMessage}</span>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, rIdx) => {
                const rowKey = row.id || row._id || String(rIdx);
                return (
                  <tr
                    key={rowKey}
                    className="group/row hover:bg-muted/20 transition-all duration-300 relative"
                  >
                    {columns.map((col, cIdx) => (
                      <td
                        key={`${rowKey}-${col.key || cIdx}`}
                        className={cn("px-6 py-5 relative first:pl-8 last:pr-8", col.className)}
                      >
                        {/* Interactive row highlight effect */}
                        {cIdx === 0 && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0 w-1 bg-primary rounded-r-full transition-all duration-300 group-hover/row:h-2/3 opacity-0 group-hover/row:opacity-100" />
                        )}
                        {col.cell(row)}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
