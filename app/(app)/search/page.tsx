"use client";
import { useState } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { useSearchPosts } from "@/hooks/usePosts";
import { useDebounce } from "@/hooks/useDebounce";
import { PostCard } from "@/components/posts/PostCard";
import { SkeletonGrid } from "@/components/ui/Skeleton";

export default function SearchPage() {
  const [input, setInput] = useState("");
  const query = useDebounce(input, 400);
  const { data, isLoading, isFetching, isError } = useSearchPosts(query, 12);
  const isTyping = input !== query;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold text-white">Search Posts</h1>
          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">debounced</span>
        </div>
        <p className="text-sm text-[#64748b] mt-1">Results update 400ms after you stop typing</p>
      </div>

      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#334155]">
          {(isLoading || isFetching || isTyping) ? <Loader2 size={16} className="animate-spin text-[#3b82f6]" /> : <Search size={16} />}
        </div>
        <input value={input} onChange={(e) => setInput(e.target.value)}
          placeholder="Search posts by title, content, or tags…"
          className="w-full bg-[#170f13] border border-[#1e2430] rounded-2xl pl-11 pr-11 py-4 text-sm text-white outline-none focus:border-[#3b82f6]/60 focus:shadow-lg focus:shadow-[#3b82f6]/5 transition-all placeholder:text-[#334155]"
          autoFocus />
        {input && (
          <button onClick={() => setInput("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#334155] hover:text-white transition-colors">
            <X size={14} />
          </button>
        )}
      </div>

      {isTyping && input && (
        <div className="flex items-center gap-2 text-xs text-[#64748b]">
          <div className="flex gap-0.5">
            {[0,1,2].map((i) => <div key={i} className="w-1 h-1 bg-[#3b82f6] rounded-full animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />)}
          </div>
          Waiting for you to finish typing…
        </div>
      )}

      {!isTyping && query && data && (
        <p className="text-sm text-[#64748b]">
          <span className="text-white font-medium">{data.total}</span> results for{" "}
          <span className="text-[#3b82f6]">&ldquo;{query}&rdquo;</span>
        </p>
      )}

      {isLoading ? <SkeletonGrid count={6} /> : isError ? (
        <div className="flex flex-col items-center gap-2 py-16 text-center">
          <p className="text-white">Search failed</p>
          <p className="text-[#64748b] text-sm">Please try again</p>
        </div>
      ) : data?.data.length === 0 && query && !isTyping ? (
        <div className="flex flex-col items-center gap-3 py-20 text-center">
          <div className="text-4xl">🔍</div>
          <p className="text-white font-medium">No results found</p>
          <p className="text-[#64748b] text-sm">Try different keywords</p>
        </div>
      ) : (
        <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 transition-opacity ${isFetching && !isTyping ? "opacity-60" : "opacity-100"}`}>
          {data?.data.map((post, i) => (
            <div key={post.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 25}ms` }}>
              <PostCard post={post} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
