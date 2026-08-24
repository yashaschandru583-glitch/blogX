export type CategoryType = 
  | 'Technology' 
  | 'Programming' 
  | 'Education' 
  | 'Travel' 
  | 'Lifestyle' 
  | 'Business' 
  | 'Other';

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  bio?: string;
  role?: string;
  createdAt: string;
  stats?: {
    totalPosts: number;
    publishedPosts: number;
    drafts: number;
    totalCommentsReceived: number;
    totalCommentsAuthored: number;
    totalViews: number;
  };
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  excerpt?: string;
  image: string;
  category: CategoryType;
  tags: string[];
  author: {
    _id: string;
    name: string;
    email: string;
    avatar: string;
    bio?: string;
  };
  status?: 'published' | 'draft';
  readTime?: string;
  views?: number;
  commentsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  post: string;
  author: {
    _id: string;
    name: string;
    email: string;
    avatar: string;
  };
  content: string;
  createdAt: string;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}
