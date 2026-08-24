export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  avatar: string;
  bio?: string;
  role?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface IPost {
  _id: string;
  title: string;
  content: string;
  excerpt?: string;
  image: string;
  category: 'Technology' | 'Programming' | 'Education' | 'Travel' | 'Lifestyle' | 'Business' | 'Other';
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

export interface IComment {
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
  updatedAt?: string;
}

export interface AuthResponse {
  user: Omit<IUser, 'password'>;
  token: string;
}

export interface JwtPayload {
  userId: string;
  email: string;
}
