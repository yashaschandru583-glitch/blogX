import { Post, Comment, User, CategoryType } from '../types';

const STORAGE_KEYS = {
  users: 'blogx_users',
  posts: 'blogx_posts',
  comments: 'blogx_comments',
};

const DEMO_PASSWORD = 'password123';

/* =========================================================
   STORAGE HELPERS
========================================================= */

function readStorage<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);

    if (!value) {
      return fallback;
    }

    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random()
    .toString(36)
    .substring(2, 9)}`;
}

function calculateReadTime(content: string): string {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));

  return `${minutes} min read`;
}

function createExcerpt(content: string): string {
  const clean = content.replace(/\s+/g, ' ').trim();

  if (clean.length <= 160) {
    return clean;
  }

  return `${clean.substring(0, 157)}...`;
}

/* =========================================================
   USER HELPERS
========================================================= */

function getUsers(): Array<User & { password: string }> {
  return readStorage<Array<User & { password: string }>>(
    STORAGE_KEYS.users,
    []
  );
}

function saveUsers(users: Array<User & { password: string }>): void {
  writeStorage(STORAGE_KEYS.users, users);
}

function publicUser(user: User & { password: string }): User {
  const { password: _password, ...safeUser } = user;

  return safeUser;
}

function findUserById(id: string): User | null {
  const users = getUsers();
  const user = users.find((item) => item._id === id);

  return user ? publicUser(user) : null;
}

function getCurrentUser(): User | null {
  const token = localStorage.getItem('blogx_token');

  if (!token) {
    return null;
  }

  const users = getUsers();

  const user = users.find(
    (item) => item._id === token
  );

  return user ? publicUser(user) : null;
}

/* =========================================================
   DEMO USERS
========================================================= */

function initializeDemoUsers(): void {
  const users = getUsers();

  let changed = false;

  const alexExists = users.some(
    (user) => user.email.toLowerCase() === 'alex@blogx.dev'
  );

  if (!alexExists) {
    users.push({
      _id: 'demo_alex',
      name: 'Alex Chen',
      email: 'alex@blogx.dev',
      password: DEMO_PASSWORD,
      avatar: '',
      bio: 'Full-stack developer and engineering writer.',
      role: 'user',
      createdAt: new Date().toISOString(),
      stats: {
        totalPosts: 0,
        publishedPosts: 0,
        drafts: 0,
        totalCommentsReceived: 0,
        totalCommentsAuthored: 0,
        totalViews: 0,
      },
    });

    changed = true;
  }

  const sarahExists = users.some(
    (user) =>
      user.email.toLowerCase() === 'sarah@blogx.dev'
  );

  if (!sarahExists) {
    users.push({
      _id: 'demo_sarah',
      name: 'Sarah Connor',
      email: 'sarah@blogx.dev',
      password: DEMO_PASSWORD,
      avatar: '',
      bio: 'Software engineer and technology enthusiast.',
      role: 'user',
      createdAt: new Date().toISOString(),
      stats: {
        totalPosts: 0,
        publishedPosts: 0,
        drafts: 0,
        totalCommentsReceived: 0,
        totalCommentsAuthored: 0,
        totalViews: 0,
      },
    });

    changed = true;
  }

  if (changed) {
    saveUsers(users);
  }
}

initializeDemoUsers();

/* =========================================================
   POST HELPERS
========================================================= */

function getStoredPosts(): Post[] {
  return readStorage<Post[]>(STORAGE_KEYS.posts, []);
}

function savePosts(posts: Post[]): void {
  writeStorage(STORAGE_KEYS.posts, posts);
}

function getStoredComments(): Comment[] {
  return readStorage<Comment[]>(
    STORAGE_KEYS.comments,
    []
  );
}

function saveComments(comments: Comment[]): void {
  writeStorage(STORAGE_KEYS.comments, comments);
}

function enrichPost(post: Post): Post {
  const comments = getStoredComments();

  return {
    ...post,
    commentsCount: comments.filter(
      (comment) => comment.post === post._id
    ).length,
  };
}

function requireUser(): User {
  const user = getCurrentUser();

  if (!user) {
    throw new Error('Please login to continue.');
  }

  return user;
}

/* =========================================================
   API
========================================================= */

export const api = {

  /* =======================================================
     AUTH
  ======================================================= */

  async register(data: {
    name: string;
    email: string;
    password: string;
    avatar?: string;
    bio?: string;
  }): Promise<{ user: User; token: string }> {

    const users = getUsers();

    const email = data.email.trim().toLowerCase();

    const existingUser = users.find(
      (user) =>
        user.email.toLowerCase() === email
    );

    if (existingUser) {
      throw new Error(
        'An account with this email already exists.'
      );
    }

    if (data.password.length < 6) {
      throw new Error(
        'Password must contain at least 6 characters.'
      );
    }

    const newUser: User & { password: string } = {
      _id: generateId('user'),
      name: data.name.trim(),
      email,
      password: data.password,
      avatar: data.avatar || '',
      bio: data.bio || '',
      role: 'user',
      createdAt: new Date().toISOString(),

      stats: {
        totalPosts: 0,
        publishedPosts: 0,
        drafts: 0,
        totalCommentsReceived: 0,
        totalCommentsAuthored: 0,
        totalViews: 0,
      },
    };

    users.push(newUser);

    saveUsers(users);

    const user = publicUser(newUser);

    localStorage.setItem(
      'blogx_token',
      newUser._id
    );

    return {
      user,
      token: newUser._id,
    };
  },

  /* =======================================================
     LOGIN
  ======================================================= */

  async login(data: {
    email: string;
    password: string;
  }): Promise<{ user: User; token: string }> {

    initializeDemoUsers();

    const users = getUsers();

    const email = data.email.trim().toLowerCase();

    const user = users.find(
      (item) =>
        item.email.toLowerCase() === email
    );

    if (!user) {
      throw new Error(
        'No account found with this email.'
      );
    }

    if (user.password !== data.password) {
      throw new Error(
        'Incorrect password.'
      );
    }

    localStorage.setItem(
      'blogx_token',
      user._id
    );

    return {
      user: publicUser(user),
      token: user._id,
    };
  },

  /* =======================================================
     GET CURRENT USER
  ======================================================= */

  async getMe(): Promise<User> {

    const user = getCurrentUser();

    if (!user) {
      throw new Error(
        'Session expired. Please login again.'
      );
    }

    return user;
  },

  /* =======================================================
     UPDATE PROFILE
  ======================================================= */

  async updateProfile(data: {
    name?: string;
    avatar?: string;
    bio?: string;
  }): Promise<User> {

    const currentUser = requireUser();

    const users = getUsers();

    const index = users.findIndex(
      (user) =>
        user._id === currentUser._id
    );

    if (index === -1) {
      throw new Error(
        'User account not found.'
      );
    }

    if (data.name !== undefined) {
      users[index].name =
        data.name.trim();
    }

    if (data.avatar !== undefined) {
      users[index].avatar =
        data.avatar;
    }

    if (data.bio !== undefined) {
      users[index].bio =
        data.bio;
    }

    saveUsers(users);

    return publicUser(users[index]);
  },

  /* =======================================================
     GET POSTS
  ======================================================= */

  async getPosts(params?: {
    search?: string;
    category?: string;
    tag?: string;
    authorId?: string;
    sort?: string;
  }): Promise<Post[]> {

    let posts = getStoredPosts();

    posts = posts.filter(
      (post) =>
        post.status !== 'draft'
    );

    if (params?.search) {

      const search =
        params.search
          .toLowerCase()
          .trim();

      posts = posts.filter((post) =>
        post.title
          .toLowerCase()
          .includes(search) ||
        post.content
          .toLowerCase()
          .includes(search) ||
        post.tags.some((tag) =>
          tag.toLowerCase().includes(search)
        )
      );
    }

    if (
      params?.category &&
      params.category !== 'All'
    ) {

      posts = posts.filter(
        (post) =>
          post.category ===
          params.category
      );
    }

    if (params?.tag) {

      const tag =
        params.tag.toLowerCase();

      posts = posts.filter((post) =>
        post.tags.some(
          (item) =>
            item.toLowerCase() === tag
        )
      );
    }

    if (params?.authorId) {

      posts = posts.filter(
        (post) =>
          post.author._id ===
          params.authorId
      );
    }

    if (params?.sort === 'oldest') {

      posts.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime()
      );

    } else if (params?.sort === 'views') {

      posts.sort(
        (a, b) =>
          (b.views || 0) -
          (a.views || 0)
      );

    } else {

      posts.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      );
    }

    return posts.map(enrichPost);
  },

  /* =======================================================
     GET SINGLE POST
  ======================================================= */

  async getPostById(
    id: string
  ): Promise<{
    post: Post;
    related: Post[];
  }> {

    const posts = getStoredPosts();

    const post = posts.find(
      (item) => item._id === id
    );

    if (!post) {
      throw new Error(
        'Post not found.'
      );
    }

    post.views =
      (post.views || 0) + 1;

    savePosts(posts);

    const enrichedPost =
      enrichPost(post);

    const related = posts
      .filter(
        (item) =>
          item._id !== id &&
          item.category === post.category &&
          item.status !== 'draft'
      )
      .slice(0, 3)
      .map(enrichPost);

    return {
      post: enrichedPost,
      related,
    };
  },

  /* =======================================================
     CREATE POST
  ======================================================= */

  async createPost(data: {
    title: string;
    content: string;
    excerpt?: string;
    image: string;
    category: CategoryType;
    tags: string[] | string;
    status?: 'published' | 'draft';
  }): Promise<Post> {

    const user = requireUser();

    const posts = getStoredPosts();

    const tags = Array.isArray(data.tags)
      ? data.tags
      : data.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean);

    const now =
      new Date().toISOString();

    const newPost: Post = {
      _id: generateId('post'),

      title: data.title.trim(),

      content: data.content,

      excerpt:
        data.excerpt?.trim() ||
        createExcerpt(data.content),

      image: data.image || '',

      category: data.category,

      tags,

      author: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
      },

      status:
        data.status || 'published',

      readTime:
        calculateReadTime(data.content),

      views: 0,

      commentsCount: 0,

      createdAt: now,

      updatedAt: now,
    };

    posts.unshift(newPost);

    savePosts(posts);

    updateUserStats(
      user._id
    );

    return newPost;
  },

  /* =======================================================
     UPDATE POST
  ======================================================= */

  async updatePost(
    id: string,
    data: Partial<{
      title: string;
      content: string;
      excerpt: string;
      image: string;
      category: CategoryType;
      tags: string[] | string;
      status: 'published' | 'draft';
    }>
  ): Promise<Post> {

    const user = requireUser();

    const posts = getStoredPosts();

    const index = posts.findIndex(
      (post) => post._id === id
    );

    if (index === -1) {
      throw new Error(
        'Post not found.'
      );
    }

    if (
      posts[index].author._id !==
      user._id
    ) {
      throw new Error(
        'You can only edit your own posts.'
      );
    }

    const existing =
      posts[index];

    let tags = existing.tags;

    if (data.tags !== undefined) {

      tags = Array.isArray(data.tags)
        ? data.tags
        : data.tags
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean);
    }

    const updatedPost: Post = {
      ...existing,

      title:
        data.title !== undefined
          ? data.title.trim()
          : existing.title,

      content:
        data.content !== undefined
          ? data.content
          : existing.content,

      excerpt:
        data.excerpt !== undefined
          ? data.excerpt
          : existing.excerpt,

      image:
        data.image !== undefined
          ? data.image
          : existing.image,

      category:
        data.category !== undefined
          ? data.category
          : existing.category,

      tags,

      status:
        data.status !== undefined
          ? data.status
          : existing.status,

      readTime:
        data.content !== undefined
          ? calculateReadTime(data.content)
          : existing.readTime,

      updatedAt:
        new Date().toISOString(),
    };

    posts[index] = updatedPost;

    savePosts(posts);

    return enrichPost(updatedPost);
  },

  /* =======================================================
     DELETE POST
  ======================================================= */

  async deletePost(
    id: string
  ): Promise<void> {

    const user = requireUser();

    const posts = getStoredPosts();

    const post = posts.find(
      (item) => item._id === id
    );

    if (!post) {
      throw new Error(
        'Post not found.'
      );
    }

    if (
      post.author._id !==
      user._id
    ) {
      throw new Error(
        'You can only delete your own posts.'
      );
    }

    const remaining =
      posts.filter(
        (item) =>
          item._id !== id
      );

    savePosts(remaining);

    const comments =
      getStoredComments();

    saveComments(
      comments.filter(
        (comment) =>
          comment.post !== id
      )
    );

    updateUserStats(
      user._id
    );
  },

  /* =======================================================
     MY POSTS
  ======================================================= */

  async getMyPosts(): Promise<{
    posts: Post[];
    stats: any;
  }> {

    const user = requireUser();

    const posts = getStoredPosts()
      .filter(
        (post) =>
          post.author._id ===
          user._id
      )
      .map(enrichPost);

    const publishedPosts =
      posts.filter(
        (post) =>
          post.status === 'published'
      );

    const drafts =
      posts.filter(
        (post) =>
          post.status === 'draft'
      );

    const totalViews =
      posts.reduce(
        (sum, post) =>
          sum + (post.views || 0),
        0
      );

    const comments =
      getStoredComments();

    const totalCommentsReceived =
      comments.filter((comment) =>
        posts.some(
          (post) =>
            post._id ===
            comment.post
        )
      ).length;

    const totalCommentsAuthored =
      comments.filter(
        (comment) =>
          comment.author._id ===
          user._id
      ).length;

    return {
      posts,

      stats: {
        totalPosts: posts.length,
        publishedPosts:
          publishedPosts.length,
        drafts:
          drafts.length,
        totalCommentsReceived,
        totalCommentsAuthored,
        totalViews,
      },
    };
  },

  /* =======================================================
     COMMENTS
  ======================================================= */

  async getComments(
    postId: string
  ): Promise<Comment[]> {

    const comments =
      getStoredComments();

    return comments
      .filter(
        (comment) =>
          comment.post === postId
      )
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime()
      );
  },

  /* =======================================================
     CREATE COMMENT
  ======================================================= */

  async createComment(
    postId: string,
    content: string
  ): Promise<Comment> {

    const user = requireUser();

    const posts = getStoredPosts();

    const post = posts.find(
      (item) =>
        item._id === postId
    );

    if (!post) {
      throw new Error(
        'Post not found.'
      );
    }

    if (!content.trim()) {
      throw new Error(
        'Comment cannot be empty.'
      );
    }

    const comments =
      getStoredComments();

    const comment: Comment = {
      _id: generateId('comment'),

      post: postId,

      author: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },

      content: content.trim(),

      createdAt:
        new Date().toISOString(),
    };

    comments.push(comment);

    saveComments(comments);

    updateUserStats(
      user._id
    );

    return comment;
  },

  /* =======================================================
     DELETE COMMENT
  ======================================================= */

  async deleteComment(
    commentId: string
  ): Promise<void> {

    const user = requireUser();

    const comments =
      getStoredComments();

    const comment =
      comments.find(
        (item) =>
          item._id === commentId
      );

    if (!comment) {
      throw new Error(
        'Comment not found.'
      );
    }

    if (
      comment.author._id !==
      user._id
    ) {
      throw new Error(
        'You can only delete your own comments.'
      );
    }

    saveComments(
      comments.filter(
        (item) =>
          item._id !== commentId
      )
    );

    updateUserStats(
      user._id
    );
  },

  /* =======================================================
     PHOTO UPLOAD
  ======================================================= */

  async uploadPhoto(
    imageData: string,
    filename?: string
  ): Promise<{
    url: string;
    size: number;
  }> {

    if (!imageData) {
      throw new Error(
        'No image was provided.'
      );
    }

    /*
      GitHub Pages has no upload API.
      For the frontend-only version we simply
      return the data URL itself.
    */

    return {
      url: imageData,
      size: imageData.length,
    };
  },
};

/* =========================================================
   USER STATS
========================================================= */

function updateUserStats(
  userId: string
): void {

  const users = getUsers();

  const userIndex =
    users.findIndex(
      (user) =>
        user._id === userId
    );

  if (userIndex === -1) {
    return;
  }

  const posts =
    getStoredPosts().filter(
      (post) =>
        post.author._id ===
        userId
    );

  const comments =
    getStoredComments();

  const publishedPosts =
    posts.filter(
      (post) =>
        post.status === 'published'
    );

  const drafts =
    posts.filter(
      (post) =>
        post.status === 'draft'
    );

  const totalViews =
    posts.reduce(
      (sum, post) =>
        sum + (post.views || 0),
      0
    );

  const totalCommentsAuthored =
    comments.filter(
      (comment) =>
        comment.author._id ===
        userId
    ).length;

  const totalCommentsReceived =
    comments.filter((comment) =>
      posts.some(
        (post) =>
          post._id ===
          comment.post
      )
    ).length;

  users[userIndex].stats = {
    totalPosts:
      posts.length,

    publishedPosts:
      publishedPosts.length,

    drafts:
      drafts.length,

    totalCommentsReceived,

    totalCommentsAuthored,

    totalViews,
  };

  saveUsers(users);
}
