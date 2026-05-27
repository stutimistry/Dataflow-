"use client";
import { useState } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { usePosts } from "@/hooks/usePosts";
import { PostCard } from "@/components/posts/PostCard";
import { SkeletonGrid } from "@/components/ui/Skeleton";
import { Pagination } from "@/components/ui/Pagination";
import { CreatePostModal } from "@/components/posts/CreatePostModal";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-client";

export default function PostsPage() {
  const [page, setPage] = useState(1);
  const [showCreate, setShowCreate] = useState(false);
  const qc = useQueryClient();
  const { data, isLoading, isError, isFetching } = usePosts(page, 9);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">All Posts</h1>
          <p className="text-sm text-[#64748b] mt-0.5">
            {data ? `${data.total} total posts` : "Loading…"}
            {isFetching && !isLoading && (
              <span className="ml-2 inline-flex items-center gap-1 text-[#3b82f6] text-xs">
                <RefreshCw size={10} className="animate-spin" /> Syncing
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => qc.invalidateQueries({ queryKey: queryKeys.posts.all })}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[#1e2430] text-sm text-[#64748b] hover:text-white hover:border-[#2a3548] transition-all">
            <RefreshCw size={13} className={isFetching ? "animate-spin" : ""} /> Refresh
          </button>
          <button onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#3b82f6] text-sm font-medium text-white hover:bg-[#2563eb] transition-colors shadow-lg shadow-[#3b82f6]/20">
            <Plus size={14} /> New Post
          </button>
        </div>
      </div>

      {isLoading ? <SkeletonGrid count={9} /> : isError ? (
        <div className="flex flex-col items-center gap-3 py-20 text-center">
          <div className="text-4xl">⚠️</div>
          <p className="text-white font-medium">Failed to load posts</p>
          <button onClick={() => qc.invalidateQueries({ queryKey: queryKeys.posts.list(page) })}
            className="mt-2 px-4 py-2 rounded-xl bg-[#1a2035] border border-[#1e2430] text-sm text-white">Retry</button>
        </div>
      ) : (
        <>
          <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 transition-opacity ${isFetching ? "opacity-70" : "opacity-100"}`}>
            {data?.data.map((post, i) => (
              <div key={post.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 30}ms` }}>
                <PostCard post={post} />
              </div>
            ))}
          </div>
          {data && <Pagination page={page} total={data.total} limit={9} onPageChange={setPage} />}
        </>
      )}
      {showCreate && <CreatePostModal onClose={() => setShowCreate(false)} />}
    </div>
  );
}
