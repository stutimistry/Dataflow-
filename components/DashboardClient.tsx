"use client";
import { useState } from "react";
import { Plus, RefreshCw, Database, Layers, Search as SearchIcon, Activity } from "lucide-react";
import { usePosts } from "@/hooks/usePosts";
import { PostCard } from "@/components/posts/PostCard";
import { SkeletonGrid } from "@/components/ui/Skeleton";
import { Pagination } from "@/components/ui/Pagination";
import { CreatePostModal } from "@/components/posts/CreatePostModal";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-client";
import Link from "next/link";

const NAV_CARDS = [
  { href: "/posts", icon: Database, label: "Paginated Posts", desc: "Browse with page controls", color: "#3b82f6" },
  { href: "/infinite", icon: Layers, label: "Infinite Scroll", desc: "Auto-load as you scroll", color: "#6366f1" },
  { href: "/search", icon: SearchIcon, label: "Search", desc: "Debounced live search", color: "#10b981" },
];

export function DashboardClient() {
  const [page, setPage] = useState(1);
  const [showCreate, setShowCreate] = useState(false);
  const qc = useQueryClient();
  const { data, isLoading, isError, isFetching } = usePosts(page, 9);

  return (
    <div className="flex flex-col gap-8">
      {/* Hero */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#0f1117] to-[#0d1526] border border-[#1e2430] p-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#3b82f6]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-24 w-48 h-48 bg-[#6366f1]/5 rounded-full blur-2xl pointer-events-none" />
        <div className="relative flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-[#3b82f6] flex items-center justify-center">
                <Activity size={16} className="text-white" />
              </div>
              <span className="text-xs font-mono text-[#3b82f6] uppercase tracking-widest">DataFlow</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 leading-tight">
              Advanced Data<br />Management
            </h1>
            <p className="text-[#64748b] text-sm max-w-md leading-relaxed">
              Next.js App Router + TanStack Query v5. SSR hydration, optimistic updates, infinite scroll, debounced search, and full CRUD.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-w-fit">
            {[
              { label: "SSR Hydrated", color: "emerald" },
              { label: "Optimistic Updates", color: "blue" },
              { label: "Background Sync", color: "violet" },
            ].map(({ label, color }) => (
              <span key={label} className={`text-xs px-3 py-1 rounded-full border font-mono
                ${color === "emerald" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                  color === "blue" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                  "bg-violet-500/10 text-violet-400 border-violet-500/20"}`}>
                ✓ {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Feature nav cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {NAV_CARDS.map(({ href, icon: Icon, label, desc, color }) => (
          <Link key={href} href={href}
            className="group flex items-center gap-4 p-4 rounded-2xl bg-[#0f1117] border border-[#1e2430] hover:border-[#2a3548] hover:bg-[#111827] transition-all"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all group-hover:scale-110"
              style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
              <Icon size={18} style={{ color }} />
            </div>
            <div>
              <p className="text-sm font-medium text-white">{label}</p>
              <p className="text-xs text-[#64748b]">{desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Posts section */}
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-white">Recent Posts</h2>
            <p className="text-xs text-[#64748b] mt-0.5 flex items-center gap-1.5">
              {data ? `${data.total} posts` : "Loading…"}
              {isFetching && !isLoading && (
                <span className="inline-flex items-center gap-1 text-[#3b82f6]">
                  <RefreshCw size={9} className="animate-spin" /> syncing
                </span>
              )}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => qc.invalidateQueries({ queryKey: queryKeys.posts.all })}
              title="Refresh"
              className="p-2 rounded-xl border border-[#1e2430] text-[#64748b] hover:text-white hover:border-[#2a3548] transition-all"
            >
              <RefreshCw size={13} className={isFetching ? "animate-spin" : ""} />
            </button>
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#3b82f6] text-xs font-medium text-white hover:bg-[#2563eb] transition-colors shadow-lg shadow-[#3b82f6]/20"
            >
              <Plus size={13} /> New Post
            </button>
          </div>
        </div>

        {isLoading ? (
          <SkeletonGrid count={9} />
        ) : isError ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <p className="text-white">Failed to load posts</p>
            <button onClick={() => qc.invalidateQueries({ queryKey: queryKeys.posts.list(page) })}
              className="px-4 py-2 rounded-xl bg-[#1a2035] text-sm text-white border border-[#1e2430]">
              Retry
            </button>
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
      </div>

      {showCreate && <CreatePostModal onClose={() => setShowCreate(false)} />}
    </div>
  );
}
