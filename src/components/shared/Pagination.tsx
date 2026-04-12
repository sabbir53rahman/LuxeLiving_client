"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 0) return null;

  const getPageNumbers = () => {
    const pages = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("ellipsis");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-center gap-4 mt-12",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="rounded-xl border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 disabled:opacity-50 h-10 w-10"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="sr-only">Previous Page</span>
        </Button>

        <div className="flex items-center gap-1.5 px-2">
          {getPageNumbers().map((page, index) => {
            if (page === "ellipsis") {
              return (
                <div
                  key={`ellipsis-${index}`}
                  className="w-10 h-10 flex items-center justify-center text-muted-foreground font-bold"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </div>
              );
            }

            const isCurrent = Number(page) === currentPage;
            return (
              <Button
                key={index}
                variant={isCurrent ? "default" : "ghost"}
                size="icon"
                className={cn(
                  "w-10 h-10 rounded-xl font-bold transition-all duration-300 transform",
                  isCurrent
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-110"
                    : "text-muted-foreground hover:text-foreground hover:bg-primary/5 active:scale-95"
                )}
                onClick={() => onPageChange(Number(page))}
              >
                {page}
              </Button>
            );
          })}
        </div>

        <Button
          variant="outline"
          size="icon"
          className="rounded-xl border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 disabled:opacity-50 h-10 w-10"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          <ChevronRight className="h-5 w-5" />
          <span className="sr-only">Next Page</span>
        </Button>
      </div>

      <div className="text-sm font-semibold text-muted-foreground bg-muted/30 px-5 py-2 rounded-2xl border border-border/50 backdrop-blur-sm">
        Page <span className="text-primary font-bold">{currentPage}</span> /{" "}
        <span className="text-foreground font-bold">{totalPages}</span>
      </div>
    </div>
  );
}
