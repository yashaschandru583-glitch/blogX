import { Post, Comment, User, CategoryType } from '../types';

const STORAGE_KEYS = {
  users: 'blogx_users',
  posts: 'blogx_posts',
  comments: 'blogx_comments',
};

const DEMO_PASSWORD = 'password123';

/* =========================================================
   STORAGE
========================================================= */

function readStorage<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
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
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

function createExcerpt(content: string): string {
  const clean = content.replace(/\s+/g, ' ').trim();

  return clean.length <= 160
    ? clean
    : `${clean.substring(0, 157)}...`;
}

/* =========================================================
   USERS
========================================================= */

type StoredUser = User & {
  password: string;
};

function getUsers(): StoredUser[] {
  return readStorage<StoredUser[]>(STORAGE_KEYS.users, []);
}

function saveUsers(users: StoredUser[]): void {
  writeStorage(STORAGE_KEYS.users, users);
}

function publicUser(user: StoredUser): User {
  const { password: _password, ...safeUser } = user;
  return safeUser;
}

function getCurrentUser(): User | null {
  const token = localStorage.getItem('blogx_token');

  if (!token) {
    return null;
  }

  const user = getUsers().find(
    (item) => item._id === token
  );

  return user ? publicUser(user) : null;
}

function requireUser(): User {
  const user = getCurrentUser();

  if (!user) {
    throw new Error('Please login to continue.');
  }

  return user;
}

/* =========================================================
   DEMO USERS
========================================================= */

function initializeDemoUsers(): void {
  const users = getUsers();
  let changed = false;

  if (
    !users.some(
      (user) =>
        user.email.toLowerCase() === 'alex@blogx.dev'
    )
  ) {
    users.push({
      _id: 'demo_alex',
      name: 'Alex Chen',
      email: 'alex@blogx.dev',
      password: DEMO_PASSWORD,
      avatar: '',
      bio: 'Full-stack developer and engineering writer.',
      role: 'user',
      createdAt: '2026-01-10T10:00:00.000Z',
      stats: {
        totalPosts: 3,
        publishedPosts: 3,
        drafts: 0,
        totalCommentsReceived: 2,
        totalCommentsAuthored: 1,
        totalViews: 428,
      },
    });

    changed = true;
  }

  if (
    !users.some(
      (user) =>
        user.email.toLowerCase() === 'sarah@blogx.dev'
    )
  ) {
    users.push({
      _id: 'demo_sarah',
      name: 'Sarah Connor',
      email: 'sarah@blogx.dev',
      password: DEMO_PASSWORD,
      avatar: '',
      bio: 'Software engineer and technology enthusiast.',
      role: 'user',
      createdAt: '2026-01-15T10:00:00.000Z',
      stats: {
        totalPosts: 2,
        publishedPosts: 2,
        drafts: 0,
        totalCommentsReceived: 1,
        totalCommentsAuthored: 2,
        totalViews: 312,
      },
    });

    changed = true;
  }

  if (changed) {
    saveUsers(users);
  }
}

/* =========================================================
   POSTS
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

/* =========================================================
   DEMO POSTS
========================================================= */

function createDemoPosts(): Post[] {
  return [
    {
      _id: 'demo_post_1',
      title: 'Building Scalable React Applications',
      content: `Modern frontend applications need more than beautiful interfaces. They need a solid architecture that can grow with the product.

React provides a powerful component model, but large applications benefit from clear separation between pages, components, contexts, services, and shared utilities.

A good architecture makes applications easier to test, maintain, and extend.

The most important principle is to keep each part of the application responsible for one clear job.`,
      excerpt:
        'Learn practical architecture patterns for building scalable React applications that remain maintainable as they grow.',
      image: '',
      category: 'Programming',
      tags: ['React', 'JavaScript', 'Architecture', 'Frontend'],
      author: {
        _id: 'demo_alex',
        name: 'Alex Chen',
        email: 'alex@blogx.dev',
        avatar: '',
        bio: 'Full-stack developer and engineering writer.',
      },
      status: 'published',
      readTime: '4 min read',
      views: 186,
      commentsCount: 2,
      createdAt: '2026-08-18T10:00:00.000Z',
      updatedAt: '2026-08-18T10:00:00.000Z',
    },

    {
      _id: 'demo_post_2',
      title: 'Understanding Modern Web Development',
      content: `Web development has changed dramatically over the last decade.

Modern developers work with component-based interfaces, API-driven applications, cloud platforms, automated deployments, and increasingly powerful development tools.

Understanding the fundamentals remains important even when frameworks change.

HTML, CSS, JavaScript, HTTP, accessibility, performance, and security continue to form the foundation of the modern web.`,
      excerpt:
        'A practical overview of the technologies and principles behind modern web development.',
      image: '',
      category: 'Technology',
      tags: ['Web Development', 'JavaScript', 'Web', 'Technology'],
      author: {
        _id: 'demo_sarah',
        name: 'Sarah Connor',
        email: 'sarah@blogx.dev',
        avatar: '',
        bio: 'Software engineer and technology enthusiast.',
      },
      status: 'published',
      readTime: '3 min read',
      views: 143,
      commentsCount: 1,
      createdAt: '2026-08-16T12:00:00.000Z',
      updatedAt: '2026-08-16T12:00:00.000Z',
    },

    {
      _id: 'demo_post_3',
      title: 'How to Build Better Engineering Projects',
      content: `Great engineering projects start with a clear problem.

Before writing code, define the users, requirements, constraints, and expected outcome.

Break the project into smaller modules and build the simplest working version first.

Documentation, testing, version control, and regular iteration can make a huge difference to the final quality of a project.`,
      excerpt:
        'Simple project planning techniques that can help students and developers build better engineering projects.',
      image: '',
      category: 'Education',
      tags: ['Projects', 'Engineering', 'Students', 'Learning'],
      author: {
        _id: 'demo_alex',
        name: 'Alex Chen',
        email: 'alex@blogx.dev',
        avatar: '',
        bio: 'Full-stack developer and engineering writer.',
      },
      status: 'published',
      readTime: '3 min read',
      views: 99,
      commentsCount: 0,
      createdAt: '2026-08-14T09:00:00.000Z',
      updatedAt: '2026-08-14T09:00:00.000Z',
    },

    {
      _id: 'demo_post_4',
      title: 'AI Tools Every Developer Should Explore',
      content: `Artificial intelligence is becoming part of everyday software development.

Developers can use AI tools to explore unfamiliar APIs, generate test cases, explain existing code, brainstorm solutions, and automate repetitive tasks.

The best results come when developers treat AI as an engineering assistant rather than a replacement for understanding the code.`,
      excerpt:
        'Explore practical ways developers can use AI tools to improve productivity without losing engineering fundamentals.',
      image: '',
      category: 'Technology',
      tags: ['AI', 'Developer Tools', 'Productivity'],
      author: {
        _id: 'demo_sarah',
        name: 'Sarah Connor',
        email: 'sarah@blogx.dev',
        avatar: '',
        bio: 'Software engineer and technology enthusiast.',
      },
      status: 'published',
      readTime: '3 min read',
      views: 169,
      commentsCount: 0,
      createdAt: '2026-08-12T15:00:00.000Z',
      updatedAt: '2026-08-12T15:00:00.000Z',
    },

    {
      _id: 'demo_post_5',
      title: 'The Developer Mindset',
      content: `Being a good developer is not only about knowing programming languages.

Curiosity, problem solving, communication, patience, and the willingness to learn are equally important.

Technology changes quickly, so developers who continuously learn and experiment are better prepared for the future.`,
      excerpt:
        'The habits and mindset that help developers continue growing throughout their careers.',
      image: '',
      category: 'Lifestyle',
      tags: ['Career', 'Developers', 'Learning', 'Mindset'],
      author: {
        _id: 'demo_alex',
        name: 'Alex Chen',
        email: 'alex@blogx.dev',
        avatar: '',
        bio: 'Full-stack developer and engineering writer.',
      },
      status: 'published',
      readTime: '2 min read',
      views: 143,
      commentsCount: 0,
      createdAt: '2026-08-10T11:00:00.000Z',
      updatedAt: '2026-08-10T11:00:00.000Z',
    },

    {
      _id: 'demo_post_6',
      title: 'From College Project to Real Product',
      content: `A college project can become much more valuable when it is treated like a real product.

Start with a real-world problem, design for actual users, document your decisions, and build a working prototype.

Even a small project can demonstrate software engineering, UI design, database concepts, testing, and deployment skills.`,
      excerpt:
        'How students can turn academic projects into practical portfolio projects.',
      image: '',
      category: 'Education',
      tags: ['College', 'Projects', 'Career', 'Portfolio'],
      author: {
        _id: 'demo_sarah',
        name: 'Sarah Connor',
        email: 'sarah@blogx.dev',
        avatar: '',
        bio: 'Software engineer and technology enthusiast.',
      },
      status: 'published',
      readTime: '3 min read',
      views: 94,
      commentsCount: 0,
      createdAt: '2026-08-08T08:00:00.000Z',
      updatedAt: '2026-08-08T08:00:00.000Z',
    },
  ];
}

/* =========================================================
   DEMO COMMENTS
========================================================= */

function createDemoComments(): Comment[] {
  return [
    {
      _id: 'demo_comment_1',
      post: 'demo_post_1',
      author: {
        _id: 'demo_sarah',
        name: 'Sarah Connor',
        email: 'sarah@blogx.dev',
        avatar: '',
      },
      content:
        'Great explanation. The separation of responsibilities is especially useful for larger projects.',
      createdAt: '2026-08-19T10:30:00.000Z',
    },

    {
      _id: 'demo_comment_2',
      post: 'demo_post_1',
      author: {
        _id: 'demo_alex',
        name: 'Alex Chen',
        email: 'alex@blogx.dev',
        avatar: '',
      },
      content:
        'Thanks! Keeping the architecture simple early on makes scaling much easier later.',
      createdAt: '2026-08-19T12:00:00.000Z',
    },

    {
      _id: 'demo_comment_3',
      post: 'demo_post_2',
      author: {
        _id: 'demo_alex',
        name: 'Alex Chen',
        email: 'alex@blogx.dev',
        avatar: '',
      },
      content:
        'Nice overview of the fundamentals. HTTP and accessibility are often overlooked.',
      createdAt: '2026-08-17T09:30:00.000Z',
    },
  ];
}

/* =========================================================
   INITIALIZE DEMO DATA
========================================================= */

function initializeDemoData(): void {
  initializeDemoUsers();

  const posts = getStoredPosts();

  /*
   * Add demo posts if there are no posts.
   *
   * This also handles the situation where the previous
   * api.ts created an empty blogx_posts array.
   */
  if (posts.length === 0) {
    savePosts(createDemoPosts());
  }

  const comments = getStoredComments();

  if (comments.length === 0) {
    saveComments(createDemoComments());
  }
}

initializeDemoData();

/* =========================================================
   USER STATS
========================================================= */

function updateUserStats(userId: string): void {
  const users = getUsers();

  const index = users.findIndex(
    (user) => user._id === userId
  );

  if (index === -1) {
    return;
  }

  const posts = getStoredPosts().filter(
    (post) => post.author._id === userId
  );

  const comments = getStoredComments();

  const publishedPosts = posts.filter(
    (post) => post.status === 'published'
  );

  const drafts = posts.filter(
    (post) => post.status === 'draft'
  );

  const totalViews = posts.reduce(
    (sum, post) => sum + (post.views || 0),
    0
  );

  const totalCommentsAuthored =
    comments.filter(
      (comment) =>
        comment.author._id === userId
    ).length;

  const totalCommentsReceived =
    comments.filter((comment) =>
      posts.some(
        (post) =>
          post._id === comment.post
      )
    ).length;

  users[index].stats = {
    totalPosts: posts.length,
    publishedPosts: publishedPosts.length,
    drafts: drafts.length,
    totalCommentsReceived,
    totalCommentsAuthored,
    totalViews,
  };

  saveUsers(users);
}

/* =========================================================
   API
========================================================= */

export const api = {

  /* ================= AUTH ================= */

  async register(data: {
    name: string;
    email: string;
    password: string;
    avatar?: string;
    bio?: string;
  }): Promise<{ user: User; token: string }> {

    const users = getUsers();

    const email = data.email
      .trim()
      .toLowerCase();

    if (
      users.some(
        (user) =>
          user.email.toLowerCase() === email
      )
    ) {
      throw new Error(
        'An account with this email already exists.'
      );
    }

    if (data.password.length < 6) {
      throw new Error(
        'Password must contain at least 6 characters.'
      );
    }

    const user: StoredUser = {
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

    users.push(user);
    saveUsers(users);

    localStorage.setItem(
      'blogx_token',
      user._id
    );

    return {
      user: publicUser(user),
      token: user._id,
    };
  },

  async login(data: {
    email: string;
    password: string;
  }): Promise<{ user: User; token: string }> {

    initializeDemoData();

    const email = data.email
      .trim()
      .toLowerCase();

    const user = getUsers().find(
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

  async getMe(): Promise<User> {

    const user = getCurrentUser();

    if (!user) {
      throw new Error(
        'Please login again.'
      );
    }

    return user;
  },

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
        'User not found.'
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

  /* ================= POSTS ================= */

  async getPosts(params?: {
    search?: string;
    category?: string;
    tag?: string;
    authorId?: string;
    sort?: string;
  }): Promise<Post[]> {

    initializeDemoData();

    let posts = getStoredPosts().filter(
      (post) =>
        post.status !== 'draft'
    );

    if (params?.search) {

      const search =
        params.search
          .toLowerCase()
          .trim();

      posts = posts.filter(
        (post) =>
          post.title
            .toLowerCase()
            .includes(search) ||
          post.content
            .toLowerCase()
            .includes(search) ||
          post.tags.some(
            (tag) =>
              tag.toLowerCase()
                .includes(search)
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

      posts = posts.filter(
        (post) =>
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

  async getPostById(
    id: string
  ): Promise<{
    post: Post;
    related: Post[];
  }> {

    initializeDemoData();

    const posts = getStoredPosts();

    const post = posts.find(
      (item) =>
        item._id === id
    );

    if (!post) {
      throw new Error(
        'Post not found.'
      );
    }

    post.views =
      (post.views || 0) + 1;

    savePosts(posts);

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
      post: enrichPost(post),
      related,
    };
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

    const user = requireUser();

    const posts = getStoredPosts();

    const tags =
      Array.isArray(data.tags)
        ? data.tags
        : data.tags
            .split(',')
            .map(
              (tag) => tag.trim()
            )
            .filter(Boolean);

    const now =
      new Date().toISOString();

    const post: Post = {
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
        calculateReadTime(
          data.content
        ),

      views: 0,

      commentsCount: 0,

      createdAt: now,

      updatedAt: now,
    };

    posts.unshift(post);

    savePosts(posts);

    updateUserStats(user._id);

    return post;
  },

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
      (post) =>
        post._id === id
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

    const existing = posts[index];

    const tags =
      data.tags === undefined
        ? existing.tags
        : Array.isArray(data.tags)
        ? data.tags
        : data.tags
            .split(',')
            .map(
              (tag) => tag.trim()
            )
            .filter(Boolean);

    const updated: Post = {
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
          ? calculateReadTime(
              data.content
            )
          : existing.readTime,

      updatedAt:
        new Date().toISOString(),
    };

    posts[index] = updated;

    savePosts(posts);

    return enrichPost(updated);
  },

  async deletePost(
    id: string
  ): Promise<void> {

    const user = requireUser();

    const posts = getStoredPosts();

    const post = posts.find(
      (item) =>
        item._id === id
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

    savePosts(
      posts.filter(
        (item) =>
          item._id !== id
      )
    );

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

  async getMyPosts(): Promise<{
    posts: Post[];
    stats: any;
  }> {

    const user = requireUser();

    const posts =
      getStoredPosts()
        .filter(
          (post) =>
            post.author._id ===
            user._id
        )
        .map(enrichPost);

    const publishedPosts =
      posts.filter(
        (post) =>
          post.status ===
          'published'
      );

    const drafts =
      posts.filter(
        (post) =>
          post.status ===
          'draft'
      );

    const totalViews =
      posts.reduce(
        (sum, post) =>
          sum + (post.views || 0),
        0
      );

    const comments =
      getStoredComments();

    return {
      posts,

      stats: {
        totalPosts:
          posts.length,

        publishedPosts:
          publishedPosts.length,

        drafts:
          drafts.length,

        totalCommentsReceived:
          comments.filter(
            (comment) =>
              posts.some(
                (post) =>
                  post._id ===
                  comment.post
              )
          ).length,

        totalCommentsAuthored:
          comments.filter(
            (comment) =>
              comment.author._id ===
              user._id
          ).length,

        totalViews,
      },
    };
  },

  /* ================= COMMENTS ================= */

  async getComments(
    postId: string
  ): Promise<Comment[]> {

    return getStoredComments()
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

  async createComment(
    postId: string,
    content: string
  ): Promise<Comment> {

    const user = requireUser();

    if (!content.trim()) {
      throw new Error(
        'Comment cannot be empty.'
      );
    }

    const posts = getStoredPosts();

    if (
      !posts.some(
        (post) =>
          post._id === postId
      )
    ) {
      throw new Error(
        'Post not found.'
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

      content:
        content.trim(),

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

  /* ================= PHOTO ================= */

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

    return {
      url: imageData,
      size: imageData.length,
    };
  },
};
