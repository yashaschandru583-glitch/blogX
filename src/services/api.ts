import { Post, Comment, User, CategoryType } from '../types';

const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('blogx_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // Auth
  async register(data: { name: string; email: string; password: string; avatar?: string; bio?: string }): Promise<{ user: User; token: string }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Registration failed');
    return json;
  },

  async login(data: { email: string; password: string }): Promise<{ user: User; token: string }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Login failed');
    return json;
  },

  async getMe(): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to fetch user');
    return json.user;
  },

  async updateProfile(data: { name?: string; avatar?: string; bio?: string }): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to update profile');
    return json.user;
  },

  // Posts
  async getPosts(params?: { search?: string; category?: string; tag?: string; authorId?: string; sort?: string }): Promise<Post[]> {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.category && params.category !== 'All') query.append('category', params.category);
    if (params?.tag) query.append('tag', params.tag);
    if (params?.authorId) query.append('authorId', params.authorId);
    if (params?.sort) query.append('sort', params.sort);

    const res = await fetch(`${API_BASE}/posts?${query.toString()}`, {
      headers: getAuthHeaders()
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to fetch posts');
    return json.posts || [];
  },

  async getPostById(id: string): Promise<{ post: Post; related: Post[] }> {
    const res = await fetch(`${API_BASE}/posts/${id}`, {
      headers: getAuthHeaders()
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Post not found');
    return { post: json.post, related: json.related || [] };
  },

  async createPost(data: {
    title: string;
    content: string;
    excerpt?: string;
    image: string;
    category: CategoryType;
    tags: string[] | string;
    status?: 'published' | 'draft';
  }): Promise<Post> {
    const res = await fetch(`${API_BASE}/posts`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to create post');
    return json.post;
  },

  async updatePost(id: string, data: Partial<{
    title: string;
    content: string;
    excerpt: string;
    image: string;
    category: CategoryType;
    tags: string[] | string;
    status: 'published' | 'draft';
  }>): Promise<Post> {
    const res = await fetch(`${API_BASE}/posts/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to update post');
    return json.post;
  },

  async deletePost(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/posts/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to delete post');
  },

  async getMyPosts(): Promise<{ posts: Post[]; stats: any }> {
    const res = await fetch(`${API_BASE}/posts/user/my-posts`, {
      headers: getAuthHeaders()
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to fetch my posts');
    return { posts: json.posts || [], stats: json.stats };
  },

  // Comments
  async getComments(postId: string): Promise<Comment[]> {
    const res = await fetch(`${API_BASE}/posts/${postId}/comments`, {
      headers: getAuthHeaders()
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to fetch comments');
    return json.comments || [];
  },

  async createComment(postId: string, content: string): Promise<Comment> {
    const res = await fetch(`${API_BASE}/posts/${postId}/comments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ content })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to post comment');
    return json.comment;
  },

  async deleteComment(commentId: string): Promise<void> {
    const res = await fetch(`${API_BASE}/comments/${commentId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to delete comment');
  },

  // Upload Photo
  async uploadPhoto(imageData: string, filename?: string): Promise<{ url: string; size: number }> {
    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ image: imageData, name: filename })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Photo upload failed');
    return { url: json.url, size: json.size };
  }
};
