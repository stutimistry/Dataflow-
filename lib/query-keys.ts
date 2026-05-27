// Server-safe query keys (no "use client" directive)
export const queryKeys = {
  posts: {
    all: ["posts"] as const,
    lists: () => [...queryKeys.posts.all, "list"] as const,
    list: (page: number) => [...queryKeys.posts.lists(), { page }] as const,
    infinite: () => [...queryKeys.posts.all, "infinite"] as const,
    search: (query: string) => [...queryKeys.posts.all, "search", query] as const,
    detail: (id: number) => [...queryKeys.posts.all, "detail", id] as const,
  },
  users: {
    all: ["users"] as const,
  },
};
