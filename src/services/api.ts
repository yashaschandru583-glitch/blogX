import { Post, Comment, User, CategoryType } from '../types';

const API_BASE = '/api';

const DEMO_POSTS_KEY = 'blogx_demo_posts';
const DEMO_COMMENTS_KEY = 'blogx_demo_comments';
const DEMO_USERS_KEY = 'blogx_demo_users';

/* =========================================================
   DEMO IMAGE GENERATOR
   Images are stored as SVG data URLs.
   No external image website is required.
========================================================= */

function demoImage(
  title: string,
  subtitle: string,
  color1: string,
  color2: string
): string {
  const svg = `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1200"
      height="700"
      viewBox="0 0 1200 700"
    >
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${color1}"/>
          <stop offset="100%" stop-color="${color2}"/>
        </linearGradient>

        <filter id="blur">
          <feGaussianBlur stdDeviation="40"/>
        </filter>
      </defs>

      <rect width="1200" height="700" fill="#070707"/>

      <circle
        cx="180"
        cy="130"
        r="190"
        fill="${color1}"
        opacity="0.30"
        filter="url(#blur)"
      />

      <circle
        cx="1020"
        cy="580"
        r="230"
        fill="${color2}"
        opacity="0.28"
        filter="url(#blur)"
      />

      <rect
        x="45"
        y="45"
        width="1110"
        height="610"
        rx="35"
        fill="url(#bg)"
        opacity="0.18"
        stroke="#ffffff"
        stroke-opacity="0.18"
      />

      <text
        x="90"
        y="155"
        fill="#ffffff"
        font-family="Arial, Helvetica, sans-serif"
        font-size="30"
        font-weight="700"
        opacity="0.8"
      >
        BLOGX
      </text>

      <text
        x="90"
        y="325"
        fill="#ffffff"
        font-family="Arial, Helvetica, sans-serif"
        font-size="58"
        font-weight="800"
      >
        ${title}
      </text>

      <text
        x="90"
        y="390"
        fill="#d5d5d5"
        font-family="Arial, Helvetica, sans-serif"
        font-size="27"
      >
        ${subtitle}
      </text>

      <rect
        x="90"
        y="455"
        width="190"
        height="8"
        rx="4"
        fill="${color1}"
      />

      <rect
        x="300"
        y="455"
        width="90"
        height="8"
        rx="4"
        fill="${color2}"
      />

      <circle
        cx="1060"
        cy="120"
        r="48"
        fill="${color1}"
        opacity="0.9"
      />

      <text
        x="1060"
        y="134"
        text-anchor="middle"
        fill="#ffffff"
        font-family="Arial, Helvetica, sans-serif"
        font-size="34"
        font-weight="800"
      >
        &lt;/&gt;
      </text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}


/* =========================================================
   DEMO USERS
========================================================= */

const demoUsers: User[] = [
  {
    _id: 'demo-user-1',
    name: 'Alex Chen',
    email: 'alex@blogx.dev',
    avatar: demoImage(
      'ALEX',
      'BLOGX DEVELOPER',
      '#ff2b2b',
      '#ff7a00'
    ),
    bio: 'Full-stack developer and technology writer.',
    role: 'user',
    createdAt: '2026-08-01T10:00:00.000Z'
  },
  {
    _id: 'demo-user-2',
    name: 'Sarah Connor',
    email: 'sarah@blogx.dev',
    avatar: demoImage(
      'SARAH',
      'BLOGX WRITER',
      '#22c55e',
      '#06b6d4'
    ),
    bio: 'Software engineer and engineering educator.',
    role: 'user',
    createdAt: '2026-08-02T10:00:00.000Z'
  }
];


/* =========================================================
   DEMO POSTS
========================================================= */

const defaultDemoPosts: Post[] = [
  {
    _id: 'demo-post-1',
    title: 'Building Scalable React Applications',
    content: `
# Building Scalable React Applications

Building a scalable React application requires good architecture,
clear component boundaries and maintainable state management.

Start by dividing the application into reusable components.

A clean folder structure makes the project easier to understand
and maintain as it grows.

## Important principles

- Reusable components
- Clear separation of concerns
- Predictable state management
- Consistent naming
- Good API design

The goal is to make your application easy to extend without
creating unnecessary complexity.
    `,
    excerpt:
      'Learn practical architecture patterns for building scalable React applications that remain maintainable.',
    image: demoImage(
      'React Architecture',
      'Build scalable frontend applications',
      '#61dafb',
      '#2563eb'
    ),
    category: 'Programming',
    tags: ['React', 'JavaScript', 'Architecture'],
    author: {
      _id: 'demo-user-1',
      name: 'Alex Chen',
      email: 'alex@blogx.dev',
      avatar: demoUsers[0].avatar,
      bio: demoUsers[0].bio
    },
    status: 'published',
    readTime: '4 min read',
    views: 187,
    commentsCount: 2,
    createdAt: '2026-08-18T10:00:00.000Z',
    updatedAt: '2026-08-18T10:00:00.000Z'
  },

  {
    _id: 'demo-post-2',
    title: 'Understanding Modern Web Development',
    content: `
# Understanding Modern Web Development

Modern web development combines frontend frameworks,
backend services, APIs and databases.

Developers need to understand how each layer communicates.

## Modern development stack

Frontend:
React, TypeScript and modern CSS.

Backend:
REST APIs and server-side applications.

Database:
MongoDB, PostgreSQL and other database systems.

Deployment:
Cloud platforms and CI/CD pipelines.

Understanding the complete stack helps developers build
better and more reliable applications.
    `,
    excerpt:
      'A practical overview of the technologies and principles behind modern web development.',
    image: demoImage(
      'Modern Web',
      'The technologies behind modern web development',
      '#ff7a00',
      '#ff2b2b'
    ),
    category: 'Technology',
    tags: ['Web Development', 'JavaScript', 'Web'],
    author: {
      _id: 'demo-user-2',
      name: 'Sarah Connor',
      email: 'sarah@blogx.dev',
      avatar: demoUsers[1].avatar,
      bio: demoUsers[1].bio
    },
    status: 'published',
    readTime: '3 min read',
    views: 143,
    commentsCount: 1,
    createdAt: '2026-08-16T10:00:00.000Z',
    updatedAt: '2026-08-16T10:00:00.000Z'
  },

  {
    _id: 'demo-post-3',
    title: 'How to Build Better Engineering Projects',
    content: `
# How to Build Better Engineering Projects

Good engineering projects start with a clearly defined problem.

Before writing code, understand the requirements and define
what success means.

## Project workflow

1. Identify the problem.
2. Research existing solutions.
3. Define requirements.
4. Design the solution.
5. Build a prototype.
6. Test the project.
7. Document the results.

Following a structured workflow makes academic and professional
projects easier to complete.
    `,
    excerpt:
      'Simple project planning techniques that can help students and developers build better engineering projects.',
    image: demoImage(
      'Engineering Projects',
      'Turn ideas into real working projects',
      '#22c55e',
      '#0ea5e9'
    ),
    category: 'Education',
    tags: ['Projects', 'Engineering', 'Students'],
    author: {
      _id: 'demo-user-1',
      name: 'Alex Chen',
      email: 'alex@blogx.dev',
      avatar: demoUsers[0].avatar,
      bio: demoUsers[0].bio
    },
    status: 'published',
    readTime: '3 min read',
    views: 99,
    commentsCount: 0,
    createdAt: '2026-08-14T10:00:00.000Z',
    updatedAt: '2026-08-14T10:00:00.000Z'
  },

  {
    _id: 'demo-post-4',
    title: 'Artificial Intelligence for Developers',
    content: `
# Artificial Intelligence for Developers

Artificial intelligence is changing the way software is built.

Developers can use AI tools to improve productivity,
generate ideas and automate repetitive tasks.

## Useful applications

- Code assistance
- Documentation
- Testing
- Data analysis
- Content generation
- Project planning

AI should be used as a development assistant while developers
continue to verify the results.
    `,
    excerpt:
      'Explore practical ways developers can use artificial intelligence in modern software projects.',
    image: demoImage(
      'Artificial Intelligence',
      'AI tools for modern developers',
      '#a855f7',
      '#ec4899'
    ),
    category: 'Technology',
    tags: ['AI', 'Technology', 'Developers'],
    author: {
      _id: 'demo-user-2',
      name: 'Sarah Connor',
      email: 'sarah@blogx.dev',
      avatar: demoUsers[1].avatar,
      bio: demoUsers[1].bio
    },
    status: 'published',
    readTime: '4 min read',
    views: 121,
    commentsCount: 3,
    createdAt: '2026-08-12T10:00:00.000Z',
    updatedAt: '2026-08-12T10:00:00.000Z'
  },

  {
    _id: 'demo-post-5',
    title: 'The Developer Mindset',
    content: `
# The Developer Mindset

Becoming a better developer is not only about learning
programming languages.

It is also about learning how to solve problems.

## Build the mindset

Ask questions.

Break large problems into smaller problems.

Test your assumptions.

Learn from errors.

Keep improving.

Consistency is more important than trying to learn
everything at once.
    `,
    excerpt:
      'Learn the habits and problem-solving techniques that help developers grow.',
    image: demoImage(
      'Developer Mindset',
      'Learn, build, experiment and grow',
      '#facc15',
      '#f97316'
    ),
    category: 'Lifestyle',
    tags: ['Developers', 'Learning', 'Career'],
    author: {
      _id: 'demo-user-1',
      name: 'Alex Chen',
      email: 'alex@blogx.dev',
      avatar: demoUsers[0].avatar,
      bio: demoUsers[0].bio
    },
    status: 'published',
    readTime: '3 min read',
    views: 87,
    commentsCount: 1,
    createdAt: '2026-08-10T10:00:00.000Z',
    updatedAt: '2026-08-10T10:00:00.000Z'
  },

  {
    _id: 'demo-post-6',
    title: 'From College Project to Real Product',
    content: `
# From College Project to Real Product

College projects can become much more valuable when they
solve real problems.

Start with a simple prototype and gradually improve it.

## Focus on

- Real-world usefulness
- Simple user experience
- Reliable functionality
- Good documentation
- Testing
- Presentation

A well-designed college project can demonstrate both
technical and problem-solving skills.
    `,
    excerpt:
      'Turn academic project ideas into practical products with a structured development approach.',
    image: demoImage(
      'College Projects',
      'Turn academic ideas into products',
      '#06b6d4',
      '#14b8a6'
    ),
    category: 'Education',
    tags: ['College', 'Projects', 'Development'],
    author: {
      _id: 'demo-user-2',
      name: 'Sarah Connor',
      email: 'sarah@blogx.dev',
      avatar: demoUsers[1].avatar,
      bio: demoUsers[1].bio
    },
    status: 'published',
    readTime: '4 min read',
    views: 76,
    commentsCount: 2,
    createdAt: '2026-08-08T10:00:00.000Z',
    updatedAt: '2026-08-08T10:00:00.000Z'
  }
];


/* =========================================================
   LOCAL STORAGE HELPERS
========================================================= */

function getStoredPosts(): Post[] {
  try {
    const stored = localStorage.getItem(DEMO_POSTS_KEY);

    if (!stored) {
      localStorage.setItem(
        DEMO_POSTS_KEY,
        JSON.stringify(defaultDemoPosts)
      );

      return defaultDemoPosts;
    }

    const posts = JSON.parse(stored);

    if (!Array.isArray(posts) || posts.length === 0) {
      localStorage.setItem(
        DEMO_POSTS_KEY,
        JSON.stringify(defaultDemoPosts)
      );

      return defaultDemoPosts;
    }

    return posts;
  } catch {
    return defaultDemoPosts;
  }
}


function savePosts(posts: Post[]): void {
  localStorage.setItem(
    DEMO_POSTS_KEY,
    JSON.stringify(posts)
  );
}


function getStoredComments(): Comment[] {
  try {
    const stored = localStorage.getItem(DEMO_COMMENTS_KEY);

    if (!stored) {
      localStorage.setItem(
        DEMO_COMMENTS_KEY,
        JSON.stringify([])
      );

      return [];
    }

    const comments = JSON.parse(stored);

    return Array.isArray(comments) ? comments : [];
  } catch {
    return [];
  }
}


function saveComments(comments: Comment[]): void {
  localStorage.setItem(
    DEMO_COMMENTS_KEY,
    JSON.stringify(comments)
  );
}


function getStoredUsers(): User[] {
  try {
    const stored = localStorage.getItem(DEMO_USERS_KEY);

    if (!stored) {
      localStorage.setItem(
        DEMO_USERS_KEY,
        JSON.stringify(demoUsers)
      );

      return demoUsers;
    }

    const users = JSON.parse(stored);

    return Array.isArray(users) ? users : demoUsers;
  } catch {
    return demoUsers;
  }
}


function saveUsers(users: User[]): void {
  localStorage.setItem(
    DEMO_USERS_KEY,
    JSON.stringify(users)
  );
}


/* =========================================================
   AUTH HELPERS
========================================================= */

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('blogx_token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}


function getCurrentDemoUser(): User | null {
  const userId = localStorage.getItem('blogx_demo_user_id');

  if (!userId) {
    return null;
  }

  const users = getStoredUsers();

  return users.find(user => user._id === userId) || null;
}


function isDemoToken(): boolean {
  const token = localStorage.getItem('blogx_token');

  return !!token && token.startsWith('demo-token-');
}


/* =========================================================
   SAFE JSON RESPONSE
========================================================= */

async function safeJson(res: Response): Promise<any> {
  const text = await res.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}


/* =========================================================
   API
========================================================= */

export const api = {

  /* =======================================================
     AUTH
  ======================================================= */

  async register(
    data: {
      name: string;
      email: string;
      password: string;
      avatar?: string;
      bio?: string;
    }
  ): Promise<{ user: User; token: string }> {

    try {
      const res = await fetch(
        `${API_BASE}/auth/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        }
      );

      const json = await safeJson(res);

      if (res.ok && json.user && json.token) {
        return json;
      }
    } catch {
      // GitHub Pages has no API server.
    }

    const users = getStoredUsers();

    const existing = users.find(
      user =>
        user.email.toLowerCase() ===
        data.email.toLowerCase()
    );

    if (existing) {
      throw new Error(
        'An account with this email already exists.'
      );
    }

    const newUser: User = {
      _id: `demo-user-${Date.now()}`,
      name: data.name,
      email: data.email,
      avatar:
        data.avatar ||
        demoImage(
          data.name.toUpperCase(),
          'BLOGX USER',
          '#ff2b2b',
          '#ff7a00'
        ),
      bio: data.bio || 'BLOGX community member.',
      role: 'user',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);

    saveUsers(users);

    localStorage.setItem(
      'blogx_demo_password',
      data.password
    );

    localStorage.setItem(
      'blogx_demo_user_id',
      newUser._id
    );

    return {
      user: newUser,
      token: `demo-token-${newUser._id}`
    };
  },


  async login(
    data: {
      email: string;
      password: string;
    }
  ): Promise<{ user: User; token: string }> {

    try {
      const res = await fetch(
        `${API_BASE}/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        }
      );

      const json = await safeJson(res);

      if (res.ok && json.user && json.token) {
        return json;
      }
    } catch {
      // Use local demo login.
    }

    const users = getStoredUsers();

    const user = users.find(
      item =>
        item.email.toLowerCase() ===
        data.email.toLowerCase()
    );

    /*
      Demo accounts:

      alex@blogx.dev
      password123

      sarah@blogx.dev
      password123
    */

    if (
      data.email.toLowerCase() ===
        'alex@blogx.dev' &&
      data.password === 'password123'
    ) {
      const alex = users.find(
        item => item.email === 'alex@blogx.dev'
      ) || demoUsers[0];

      localStorage.setItem(
        'blogx_demo_user_id',
        alex._id
      );

      return {
        user: alex,
        token: `demo-token-${alex._id}`
      };
    }


    if (
      data.email.toLowerCase() ===
        'sarah@blogx.dev' &&
      data.password === 'password123'
    ) {
      const sarah = users.find(
        item => item.email === 'sarah@blogx.dev'
      ) || demoUsers[1];

      localStorage.setItem(
        'blogx_demo_user_id',
        sarah._id
      );

      return {
        user: sarah,
        token: `demo-token-${sarah._id}`
      };
    }


    if (user) {
      const savedPassword =
        localStorage.getItem(
          'blogx_demo_password'
        );

      if (
        savedPassword &&
        savedPassword === data.password
      ) {
        localStorage.setItem(
          'blogx_demo_user_id',
          user._id
        );

        return {
          user,
          token: `demo-token-${user._id}`
        };
      }
    }

    throw new Error(
      'Invalid email or password.'
    );
  },


  async getMe(): Promise<User> {

    if (isDemoToken()) {
      const user = getCurrentDemoUser();

      if (!user) {
        throw new Error(
          'Demo session expired.'
        );
      }

      return user;
    }


    try {
      const res = await fetch(
        `${API_BASE}/auth/me`,
        {
          headers: getAuthHeaders()
        }
      );

      const json = await safeJson(res);

      if (!res.ok) {
        throw new Error(
          json.message ||
          'Failed to fetch user'
        );
      }

      return json.user;
    } catch {
      throw new Error(
        'Session expired.'
      );
    }
  },


  async updateProfile(
    data: {
      name?: string;
      avatar?: string;
      bio?: string;
    }
  ): Promise<User> {

    if (isDemoToken()) {
      const current = getCurrentDemoUser();

      if (!current) {
        throw new Error(
          'You are not logged in.'
        );
      }

      const users = getStoredUsers();

      const updated: User = {
        ...current,
        ...data
      };

      const index = users.findIndex(
        user => user._id === current._id
      );

      if (index !== -1) {
        users[index] = updated;
        saveUsers(users);
      }

      return updated;
    }


    const res = await fetch(
      `${API_BASE}/auth/profile`,
      {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      }
    );

    const json = await safeJson(res);

    if (!res.ok) {
      throw new Error(
        json.message ||
        'Failed to update profile'
      );
    }

    return json.user;
  },


  /* =======================================================
     POSTS
  ======================================================= */

  async getPosts(
    params?: {
      search?: string;
      category?: string;
      tag?: string;
      authorId?: string;
      sort?: string;
    }
  ): Promise<Post[]> {

    try {
      const query = new URLSearchParams();

      if (params?.search) {
        query.append(
          'search',
          params.search
        );
      }

      if (
        params?.category &&
        params.category !== 'All'
      ) {
        query.append(
          'category',
          params.category
        );
      }

      if (params?.tag) {
        query.append(
          'tag',
          params.tag
        );
      }

      if (params?.authorId) {
        query.append(
          'authorId',
          params.authorId
        );
      }

      if (params?.sort) {
        query.append(
          'sort',
          params.sort
        );
      }

      const res = await fetch(
        `${API_BASE}/posts?${query.toString()}`,
        {
          headers: getAuthHeaders()
        }
      );

      const json = await safeJson(res);

      if (res.ok && Array.isArray(json.posts)) {
        return json.posts;
      }
    } catch {
      // Use local demo posts.
    }


    let posts = getStoredPosts();


    if (params?.search) {
      const search =
        params.search.toLowerCase();

      posts = posts.filter(post =>
        post.title
          .toLowerCase()
          .includes(search) ||

        post.content
          .toLowerCase()
          .includes(search) ||

        post.tags.some(tag =>
          tag.toLowerCase().includes(search)
        )
      );
    }


    if (
      params?.category &&
      params.category !== 'All'
    ) {
      posts = posts.filter(
        post =>
          post.category ===
          params.category
      );
    }


    if (params?.tag) {
      posts = posts.filter(
        post =>
          post.tags.some(
            tag =>
              tag.toLowerCase() ===
              params.tag!.toLowerCase()
          )
      );
    }


    if (params?.authorId) {
      posts = posts.filter(
        post =>
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
    } else if (params?.sort === 'popular') {
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


    return posts;
  },


  async getPostById(
    id: string
  ): Promise<{
    post: Post;
    related: Post[];
  }> {

    try {
      const res = await fetch(
        `${API_BASE}/posts/${id}`,
        {
          headers: getAuthHeaders()
        }
      );

      const json = await safeJson(res);

      if (res.ok && json.post) {
        return {
          post: json.post,
          related: json.related || []
        };
      }
    } catch {
      // Local fallback.
    }


    const posts = getStoredPosts();

    const post = posts.find(
      item => item._id === id
    );

    if (!post) {
      throw new Error(
        'Post not found.'
      );
    }

    const related = posts
      .filter(
        item =>
          item._id !== id &&
          item.category === post.category
      )
      .slice(0, 3);

    return {
      post,
      related
    };
  },


  async createPost(
    data: {
      title: string;
      content: string;
      excerpt?: string;
      image: string;
      category: CategoryType;
      tags: string[] | string;
      status?: 'published' | 'draft';
    }
  ): Promise<Post> {

    if (isDemoToken()) {

      const user =
        getCurrentDemoUser();

      if (!user) {
        throw new Error(
          'Please login first.'
        );
      }

      const posts =
        getStoredPosts();

      const tags =
        Array.isArray(data.tags)
          ? data.tags
          : data.tags
              .split(',')
              .map(tag => tag.trim())
              .filter(Boolean);

      const post: Post = {
        _id: `demo-post-${Date.now()}`,
        title: data.title,
        content: data.content,
        excerpt: data.excerpt || '',
        image:
          data.image ||
          demoImage(
            data.title,
            'BLOGX ARTICLE',
            '#ff2b2b',
            '#ff7a00'
          ),
        category: data.category,
        tags,
        author: {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          bio: user.bio
        },
        status:
          data.status || 'published',
        readTime: '4 min read',
        views: 0,
        commentsCount: 0,
        createdAt:
          new Date().toISOString(),
        updatedAt:
          new Date().toISOString()
      };

      posts.unshift(post);

      savePosts(posts);

      return post;
    }


    const res = await fetch(
      `${API_BASE}/posts`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      }
    );

    const json = await safeJson(res);

    if (!res.ok) {
      throw new Error(
        json.message ||
        'Failed to create post'
      );
    }

    return json.post;
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

    if (isDemoToken()) {

      const posts =
        getStoredPosts();

      const index =
        posts.findIndex(
          post => post._id === id
        );

      if (index === -1) {
        throw new Error(
          'Post not found.'
        );
      }

      const existing =
        posts[index];

      let tags =
        existing.tags;

      if (data.tags) {
        tags =
          Array.isArray(data.tags)
            ? data.tags
            : data.tags
                .split(',')
                .map(tag => tag.trim())
                .filter(Boolean);
      }

      const updated: Post = {
        ...existing,
        ...data,
        tags,
        updatedAt:
          new Date().toISOString()
      };

      posts[index] = updated;

      savePosts(posts);

      return updated;
    }


    const res = await fetch(
      `${API_BASE}/posts/${id}`,
      {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      }
    );

    const json = await safeJson(res);

    if (!res.ok) {
      throw new Error(
        json.message ||
        'Failed to update post'
      );
    }

    return json.post;
  },


  async deletePost(
    id: string
  ): Promise<void> {

    if (isDemoToken()) {

      const posts =
        getStoredPosts();

      const filtered =
        posts.filter(
          post => post._id !== id
        );

      savePosts(filtered);

      return;
    }


    const res = await fetch(
      `${API_BASE}/posts/${id}`,
      {
        method: 'DELETE',
        headers: getAuthHeaders()
      }
    );

    const json = await safeJson(res);

    if (!res.ok) {
      throw new Error(
        json.message ||
        'Failed to delete post'
      );
    }
  },


  async getMyPosts(): Promise<{
    posts: Post[];
    stats: any;
  }> {

    if (isDemoToken()) {

      const user =
        getCurrentDemoUser();

      if (!user) {
        throw new Error(
          'Please login first.'
        );
      }

      const posts =
        getStoredPosts().filter(
          post =>
            post.author._id ===
            user._id
        );

      const stats = {
        totalPosts: posts.length,
        publishedPosts:
          posts.filter(
            post =>
              post.status ===
              'published'
          ).length,
        drafts:
          posts.filter(
            post =>
              post.status ===
              'draft'
          ).length,
        totalCommentsReceived:
          posts.reduce(
            (sum, post) =>
              sum +
              (post.commentsCount || 0),
            0
          ),
        totalCommentsAuthored: 0,
        totalViews:
          posts.reduce(
            (sum, post) =>
              sum +
              (post.views || 0),
            0
          )
      };

      return {
        posts,
        stats
      };
    }


    const res = await fetch(
      `${API_BASE}/posts/user/my-posts`,
      {
        headers: getAuthHeaders()
      }
    );

    const json = await safeJson(res);

    if (!res.ok) {
      throw new Error(
        json.message ||
        'Failed to fetch my posts'
      );
    }

    return {
      posts: json.posts || [],
      stats: json.stats
    };
  },


  /* =======================================================
     COMMENTS
  ======================================================= */

  async getComments(
    postId: string
  ): Promise<Comment[]> {

    try {
      const res = await fetch(
        `${API_BASE}/posts/${postId}/comments`,
        {
          headers: getAuthHeaders()
        }
      );

      const json = await safeJson(res);

      if (
        res.ok &&
        Array.isArray(json.comments)
      ) {
        return json.comments;
      }
    } catch {
      // Local fallback.
    }


    return getStoredComments()
      .filter(
        comment =>
          comment.post === postId
      );
  },


  async createComment(
    postId: string,
    content: string
  ): Promise<Comment> {

    if (isDemoToken()) {

      const user =
        getCurrentDemoUser();

      if (!user) {
        throw new Error(
          'Please login first.'
        );
      }

      const comments =
        getStoredComments();

      const comment: Comment = {
        _id:
          `demo-comment-${Date.now()}`,
        post: postId,
        author: {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar
        },
        content,
        createdAt:
          new Date().toISOString()
      };

      comments.push(comment);

      saveComments(comments);

      const posts =
        getStoredPosts();

      const postIndex =
        posts.findIndex(
          post =>
            post._id === postId
        );

      if (postIndex !== -1) {
        posts[postIndex] = {
          ...posts[postIndex],
          commentsCount:
            (posts[postIndex]
              .commentsCount || 0) + 1
        };

        savePosts(posts);
      }

      return comment;
    }


    const res = await fetch(
      `${API_BASE}/posts/${postId}/comments`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          content
        })
      }
    );

    const json = await safeJson(res);

    if (!res.ok) {
      throw new Error(
        json.message ||
        'Failed to post comment'
      );
    }

    return json.comment;
  },


  async deleteComment(
    commentId: string
  ): Promise<void> {

    if (isDemoToken()) {

      const comments =
        getStoredComments();

      saveComments(
        comments.filter(
          comment =>
            comment._id !==
            commentId
        )
      );

      return;
    }


    const res = await fetch(
      `${API_BASE}/comments/${commentId}`,
      {
        method: 'DELETE',
        headers: getAuthHeaders()
      }
    );

    const json = await safeJson(res);

    if (!res.ok) {
      throw new Error(
        json.message ||
        'Failed to delete comment'
      );
    }
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

    /*
      On GitHub Pages there is no upload server.

      Therefore the image is returned directly as a
      data URL. This works without a backend.
    */

    if (imageData) {
      return {
        url: imageData,
        size: imageData.length
      };
    }


    try {
      const res = await fetch(
        `${API_BASE}/upload`,
        {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            image: imageData,
            name: filename
          })
        }
      );

      const json = await safeJson(res);

      if (!res.ok) {
        throw new Error(
          json.message ||
          'Photo upload failed'
        );
      }

      return {
        url: json.url,
        size: json.size
      };
    } catch {
      throw new Error(
        'Photo upload is not available on this deployment.'
      );
    }
  }
};


/* =========================================================
   OPTIONAL RESET FUNCTION

   Useful while developing.
========================================================= */

export function resetDemoData(): void {
  localStorage.removeItem(
    DEMO_POSTS_KEY
  );

  localStorage.removeItem(
    DEMO_COMMENTS_KEY
  );

  localStorage.removeItem(
    DEMO_USERS_KEY
  );

  localStorage.removeItem(
    'blogx_token'
  );

  localStorage.removeItem(
    'blogx_demo_user_id'
  );

  localStorage.removeItem(
    'blogx_demo_password'
  );
}
