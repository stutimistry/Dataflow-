"use client";
import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { postsService } from "@/services/api";
import { queryKeys } from "@/lib/query-client";
import type { CreatePostInput, UpdatePostInput, Post, PaginatedResponse } from "@/types";

export function usePosts(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: queryKeys.posts.list(page),
    queryFn: () => postsService.getPosts(page, limit),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 2,
  });
}

export function useSearchPosts(query: string, limit: number = 10) {
  return useQuery({
    queryKey: queryKeys.posts.search(query),
    queryFn: () => postsService.searchPosts(query, limit),
    enabled: true,
    staleTime: 1000 * 30,
  });
}

export function useInfinitePosts(limit: number = 8) {
  return useInfiniteQuery({
    queryKey: queryKeys.posts.infinite(),
    queryFn: ({ pageParam }) => postsService.getPostsInfinite(pageParam as number, limit),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 1000 * 60 * 2,
  });
}

export function useCreatePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreatePostInput) => postsService.createPost(input),
    onMutate: async (newPost) => {
      await qc.cancelQueries({ queryKey: queryKeys.posts.lists() });
      const snapshot = qc.getQueryData<PaginatedResponse<Post>>(queryKeys.posts.list(1));
      qc.setQueryData<PaginatedResponse<Post>>(queryKeys.posts.list(1), (old) => {
        if (!old) return old;
        const optimistic: Post = { id: Date.now(), ...newPost, reactions: { likes: 0, dislikes: 0 }, views: 0 };
        return { ...old, data: [optimistic, ...old.data], total: old.total + 1 };
      });
      return { snapshot };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.snapshot) qc.setQueryData(queryKeys.posts.list(1), ctx.snapshot);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: queryKeys.posts.lists() });
      qc.invalidateQueries({ queryKey: queryKeys.posts.infinite() });
    },
  });
}

export function useUpdatePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdatePostInput) => postsService.updatePost(input),
    onMutate: async (updated) => {
      await qc.cancelQueries({ queryKey: queryKeys.posts.all });
      const snapshots: Record<string, unknown> = {};
      qc.getQueriesData<PaginatedResponse<Post>>({ queryKey: queryKeys.posts.lists() }).forEach(([key, data]) => {
        snapshots[JSON.stringify(key)] = data;
        if (data) {
          qc.setQueryData(key, {
            ...data,
            data: data.data.map((p) => (p.id === updated.id ? { ...p, ...updated } : p)),
          });
        }
      });
      return { snapshots };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.snapshots) {
        Object.entries(ctx.snapshots).forEach(([key, data]) => {
          qc.setQueryData(JSON.parse(key), data);
        });
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: queryKeys.posts.all });
    },
  });
}

export function useDeletePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => postsService.deletePost(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: queryKeys.posts.lists() });
      const snapshots: Record<string, unknown> = {};
      qc.getQueriesData<PaginatedResponse<Post>>({ queryKey: queryKeys.posts.lists() }).forEach(([key, data]) => {
        snapshots[JSON.stringify(key)] = data;
        if (data) {
          qc.setQueryData(key, { ...data, data: data.data.filter((p) => p.id !== id), total: data.total - 1 });
        }
      });
      return { snapshots };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.snapshots) {
        Object.entries(ctx.snapshots).forEach(([key, data]) => {
          qc.setQueryData(JSON.parse(key), data);
        });
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: queryKeys.posts.lists() });
      qc.invalidateQueries({ queryKey: queryKeys.posts.infinite() });
    },
  });
}
