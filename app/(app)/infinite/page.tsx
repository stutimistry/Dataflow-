"use client";
import { useEffect, useRef } from "react";
import { Loader2, ArrowDown, CheckCircle2 } from "lucide-react";
import { useInfinitePosts } from "@/hooks/usePosts";
import { PostCard } from "@/components/posts/PostCard";
import { SkeletonGrid } from "@/components/ui/Skeleton";

export default function InfinitePage() {
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfinitePosts(8);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage();
      },
      { threshold: 0.1, rootMargin: "120px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allPosts = data?.pages.flatMap((p) => p.data) ?? [];
  const total = data?.pages[0]?.total ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold text-white">Infinite Scroll</h1>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[#3b82f6]/15 text-[#3b82f6] border border-[#3b82f6]/20 font-mono">useInfiniteQuery</span>
        </div>
        <p className="text-sm text-[#64748b] mt-1">{allPosts.length} of {total} posts loaded — scroll down to load more</p>
      </div>

      {total > 0 && (
        <div className="w-full h-1 bg-[#c3c5ca] rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#3b82f6] to-[#6366f1] rounded-full transition-all duration-500"
            style={{ width: `${(allPosts.length / total) * 100}%` }} />
        </div>
      )}

      {isLoading ? <SkeletonGrid count={8} /> : isError ? (
        <div className="flex flex-col items-center gap-3 py-20 text-center">
          <p className="text-white font-medium">Failed to load posts</p>
          <button onClick={() => fetchNextPage()} className="px-4 py-2 rounded-xl bg-[#1a2035] border border-[#1e2430] text-sm text-white">Retry</button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {allPosts.map((post, i) => (
              <div key={`${post.id}-${i}`} className="animate-fade-in-up" style={{ animationDelay: `${(i % 8) * 40}ms` }}>
                <PostCard post={post} />
              </div>
            ))}
          </div>
          <div ref={sentinelRef} className="flex items-center justify-center py-8 gap-3">
            {isFetchingNextPage ? (
              <div className="flex items-center gap-2 text-[#64748b] text-sm">
                <Loader2 size={16} className="animate-spin text-[#3b82f6]" /> Loading more posts…
              </div>
            ) : hasNextPage ? (
              <div className="flex flex-col items-center gap-2 text-[#334155] text-xs">
                <ArrowDown size={14} className="animate-bounce" /> Scroll to load more
              </div>
            ) : (
              <div className="flex items-center gap-2 text-[#64748b] text-sm">
                <CheckCircle2 size={14} className="text-emerald-500" /> All {total} posts loaded
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
