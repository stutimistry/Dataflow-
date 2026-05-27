import type { Post, User, PaginatedResponse, CreatePostInput, UpdatePostInput } from "@/types";

const BASE_URL = "https://dummyjson.com";

export const postsService = {
  async getPosts(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Post>> {
    const skip = (page - 1) * limit;
    const res = await fetch(`${BASE_URL}/posts?limit=${limit}&skip=${skip}&select=id,title,body,userId,tags,reactions,views`);
    if (!res.ok) throw new Error("Failed to fetch posts");
    const data = await res.json();
    return { data: data.posts, total: data.total, skip: data.skip, limit: data.limit };
  },

  async getPostsInfinite(pageParam: number = 0, limit: number = 8): Promise<PaginatedResponse<Post> & { nextPage: number | null }> {
    const res = await fetch(`${BASE_URL}/posts?limit=${limit}&skip=${pageParam}&select=id,title,body,userId,tags,reactions,views`);
    if (!res.ok) throw new Error("Failed to fetch posts");
    const data = await res.json();
    const nextSkip = pageParam + limit;
    return {
      data: data.posts,
      total: data.total,
      skip: pageParam,
      limit,
      nextPage: nextSkip < data.total ? nextSkip : null,
    };
  },

  async searchPosts(query: string, limit: number = 10): Promise<PaginatedResponse<Post>> {
    if (!query.trim()) return postsService.getPosts(1, limit);
    const res = await fetch(`${BASE_URL}/posts/search?q=${encodeURIComponent(query)}&limit=${limit}&select=id,title,body,userId,tags,reactions,views`);
    if (!res.ok) throw new Error("Failed to search posts");
    const data = await res.json();
    return { data: data.posts, total: data.total, skip: 0, limit };
  },

  async getPost(id: number): Promise<Post> {
    const res = await fetch(`${BASE_URL}/posts/${id}`);
    if (!res.ok) throw new Error("Failed to fetch post");
    return res.json();
  },

  async createPost(input: CreatePostInput): Promise<Post> {
    const res = await fetch(`${BASE_URL}/posts/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error("Failed to create post");
    return res.json();
  },

  async updatePost({ id, ...data }: UpdatePostInput): Promise<Post> {
    const res = await fetch(`${BASE_URL}/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update post");
    return res.json();
  },

  async deletePost(id: number): Promise<{ id: number; isDeleted: boolean }> {
    const res = await fetch(`${BASE_URL}/posts/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete post");
    return res.json();
  },
};

export const usersService = {
  async getUsers(): Promise<User[]> {
    const res = await fetch(`${BASE_URL}/users?limit=10&select=id,firstName,lastName,email,username,image`);
    if (!res.ok) throw new Error("Failed to fetch users");
    const data = await res.json();
    return data.users;
  },
};
