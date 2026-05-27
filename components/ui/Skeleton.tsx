export function PostSkeleton() {
  return (
    <div className="bg-[#0f1117] border border-[#1e2430] rounded-2xl p-5 flex flex-col gap-3 animate-pulse">
      <div className="flex gap-2">
        <div className="h-4 w-12 bg-[#1a2035] rounded-full" />
        <div className="h-4 w-16 bg-[#1a2035] rounded-full" />
      </div>
      <div className="h-4 bg-[#1a2035] rounded-lg w-4/5" />
      <div className="h-4 bg-[#1a2035] rounded-lg w-3/5" />
      <div className="space-y-1.5 mt-1">
        <div className="h-3 bg-[#1a2035] rounded w-full" />
        <div className="h-3 bg-[#1a2035] rounded w-full" />
        <div className="h-3 bg-[#1a2035] rounded w-2/3" />
      </div>
      <div className="pt-3 border-t border-[#1e2430] flex justify-between">
        <div className="flex gap-3">
          <div className="h-3 w-12 bg-[#1a2035] rounded" />
          <div className="h-3 w-10 bg-[#1a2035] rounded" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => <PostSkeleton key={i} />)}
    </div>
  );
}
