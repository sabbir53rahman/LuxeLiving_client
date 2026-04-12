export function SkeletonCard() {
  return (
    <div className="glass-card rounded-xl overflow-hidden">
      {/* Image Skeleton */}
      <div className="h-64 bg-muted/20 animate-pulse" />
      
      {/* Content Skeleton */}
      <div className="p-6 space-y-4">
        {/* Price and Location */}
        <div className="space-y-2">
          <div className="h-6 bg-muted/20 rounded animate-pulse w-32" />
          <div className="h-4 bg-muted/20 rounded animate-pulse w-48" />
        </div>
        
        {/* Title */}
        <div className="h-6 bg-muted/20 rounded animate-pulse w-full" />
        
        {/* Description */}
        <div className="space-y-2">
          <div className="h-4 bg-muted/20 rounded animate-pulse w-full" />
          <div className="h-4 bg-muted/20 rounded animate-pulse w-3/4" />
        </div>
        
        {/* Features */}
        <div className="flex items-center gap-4">
          <div className="h-4 bg-muted/20 rounded animate-pulse w-16" />
          <div className="h-4 bg-muted/20 rounded animate-pulse w-16" />
          <div className="h-4 bg-muted/20 rounded animate-pulse w-16" />
        </div>
        
        {/* Agent and Button */}
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-muted/20 rounded-full animate-pulse" />
            <div className="h-4 bg-muted/20 rounded animate-pulse w-24" />
          </div>
          <div className="h-8 bg-muted/20 rounded animate-pulse w-24" />
        </div>
      </div>
    </div>
  );
}
