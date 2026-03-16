export function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="glass-card rounded-lg p-5 h-[100px]">
            <div className="h-3 w-20 bg-muted rounded mb-3" />
            <div className="h-6 w-16 bg-muted rounded" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass-card rounded-lg p-5 h-[340px]">
            <div className="h-4 w-40 bg-muted rounded mb-6" />
            <div className="h-full bg-muted/50 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
