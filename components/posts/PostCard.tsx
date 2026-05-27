"use client";
import { useState } from "react";
import { Pencil, Trash2, Eye, ThumbsUp, ThumbsDown, X, Check } from "lucide-react";
import type { Post } from "@/types";
import { useUpdatePost, useDeletePost } from "@/hooks/usePosts";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(post.title);
  const [body, setBody] = useState(post.body);
  const updatePost = useUpdatePost();
  const deletePost = useDeletePost();

  const handleSave = () => {
    updatePost.mutate({ id: post.id, title, body }, { onSuccess: () => setEditing(false) });
  };

  const handleDelete = () => {
    if (confirm("Delete this post?")) deletePost.mutate(post.id);
  };

  const isPending = updatePost.isPending || deletePost.isPending;

  return (
    <article
      className={`group relative bg-[#0f1117] border border-[#1e2430] rounded-2xl p-5 flex flex-col gap-3 transition-all duration-300 hover:border-[#3b82f6]/40 hover:shadow-lg hover:shadow-[#3b82f6]/5 ${isPending ? "opacity-60 scale-[0.99]" : ""}`}
    >
      {/* Tag strip */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {post.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#1a2035] text-[#3b82f6] border border-[#3b82f6]/20">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Content */}
      {editing ? (
        <div className="flex flex-col gap-2">
          <input
            className="bg-[#1a2035] border border-[#3b82f6]/40 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#3b82f6] transition-colors"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
          />
          <textarea
            className="bg-[#1a2035] border border-[#3b82f6]/40 rounded-lg px-3 py-2 text-sm text-[#94a3b8] outline-none focus:border-[#3b82f6] transition-colors resize-none h-24"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Body"
          />
        </div>
      ) : (
        <>
          <h3 className="font-semibold text-white text-sm leading-snug line-clamp-2 group-hover:text-[#60a5fa] transition-colors">
            {post.title}
          </h3>
          <p className="text-[#64748b] text-xs leading-relaxed line-clamp-3">{post.body}</p>
        </>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#1e2430]">
        <div className="flex items-center gap-3 text-[#475569] text-xs">
          {post.views !== undefined && (
            <span className="flex items-center gap-1"><Eye size={11} />{post.views}</span>
          )}
          {post.reactions && (
            <>
              <span className="flex items-center gap-1 text-emerald-500/70"><ThumbsUp size={11} />{post.reactions.likes}</span>
              <span className="flex items-center gap-1 text-rose-500/70"><ThumbsDown size={11} />{post.reactions.dislikes}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-1">
          {editing ? (
            <>
              <button onClick={handleSave} disabled={updatePost.isPending} className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-400/10 transition-colors" title="Save">
                <Check size={14} />
              </button>
              <button onClick={() => { setEditing(false); setTitle(post.title); setBody(post.body); }} className="p-1.5 rounded-lg text-[#64748b] hover:bg-[#1e2430] transition-colors" title="Cancel">
                <X size={14} />
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setEditing(true)} className="p-1.5 rounded-lg text-[#64748b] hover:text-[#3b82f6] hover:bg-[#1a2035] transition-colors opacity-0 group-hover:opacity-100" title="Edit">
                <Pencil size={14} />
              </button>
              <button onClick={handleDelete} disabled={deletePost.isPending} className="p-1.5 rounded-lg text-[#64748b] hover:text-rose-400 hover:bg-rose-400/10 transition-colors opacity-0 group-hover:opacity-100" title="Delete">
                <Trash2 size={14} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Optimistic pending overlay */}
      {isPending && (
        <div className="absolute inset-0 rounded-2xl flex items-center justify-center bg-[#0f1117]/50 backdrop-blur-[1px]">
          <div className="w-5 h-5 border-2 border-[#3b82f6] border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </article>
  );
}
