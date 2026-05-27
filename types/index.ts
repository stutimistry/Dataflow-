export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
  tags?: string[];
  reactions?: { likes: number; dislikes: number };
  views?: number;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  image?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  skip: number;
  limit: number;
}

export interface CreatePostInput {
  title: string;
  body: string;
  userId: number;
  tags: string[];
}

export interface UpdatePostInput extends Partial<CreatePostInput> {
  id: number;
}
