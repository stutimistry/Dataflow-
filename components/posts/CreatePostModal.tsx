"use client";
import { useState } from "react";
import { X, Plus, Loader2 } from "lucide-react";
import { useCreatePost } from "@/hooks/usePosts";

interface CreatePostModalProps {
  onClose: () => void;
}

export function CreatePostModal({ onClose }: CreatePostModalProps) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const createPost = useCreatePost();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    createPost.mutate(
      { title, body, userId: 1, tags: tags.split(",").map((t) => t.trim()).filter(Boolean) },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-[#0f1117] border border-[#1e2430] rounded-3xl shadow-2xl shadow-black/50 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#1e2430]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#3b82f6]/20 flex items-center justify-center">
              <Plus size={16} className="text-[#3b82f6]" />
            </div>
            <h2 className="text-white font-semibold">New Post</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-[#64748b] hover:text-white hover:bg-[#1e2430] transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#64748b] uppercase tracking-wider">Title</label>
            <input
              className="bg-[#1a2035] border border-[#1e2430] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#3b82f6]/60 transition-colors placeholder:text-[#334155]"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title..."
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#64748b] uppercase tracking-wider">Body</label>
            <textarea
              className="bg-[#1a2035] border border-[#1e2430] rounded-xl px-4 py-3 text-sm text-[#94a3b8] outline-none focus:border-[#3b82f6]/60 transition-colors resize-none h-32 placeholder:text-[#334155]"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your post content..."
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#64748b] uppercase tracking-wider">Tags <span className="normal-case text-[#334155]">(comma separated)</span></label>
            <input
              className="bg-[#1a2035] border border-[#1e2430] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#3b82f6]/60 transition-colors placeholder:text-[#334155]"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="tech, news, opinion"
            />
          </div>

          {createPost.isError && (
            <p className="text-rose-400 text-xs bg-rose-400/10 border border-rose-400/20 rounded-xl px-4 py-2">
              Failed to create post. Please try again.
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-3 rounded-xl border border-[#1e2430] text-sm text-[#64748b] hover:text-white hover:border-[#2a3548] transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              disabled={createPost.isPending}
              className="flex-1 px-4 py-3 rounded-xl bg-[#3b82f6] text-sm font-medium text-white hover:bg-[#2563eb] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {createPost.isPending ? <><Loader2 size={14} className="animate-spin" />Creating...</> : "Create Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
