import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import mongoose, { Schema, Document } from 'mongoose';
import { IUser, IPost, IComment } from './types.js';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'blogx-db.json');

// Mongoose Models definition for optional live MongoDB instances
const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: '' },
  bio: { type: String, default: '' },
  role: { type: String, default: 'user' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const postSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  excerpt: { type: String },
  image: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Technology', 'Programming', 'Education', 'Travel', 'Lifestyle', 'Business', 'Other'],
    default: 'Technology'
  },
  tags: [{ type: String }],
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['published', 'draft'], default: 'published' },
  readTime: { type: String, default: '4 min read' },
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const commentSchema = new Schema({
  post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export let UserModel: any = null;
export let PostModel: any = null;
export let CommentModel: any = null;
export let isMongoConnected = false;

interface DatabaseSchema {
  users: IUser[];
  posts: IPost[];
  comments: IComment[];
}

let inMemoryDb: DatabaseSchema = {
  users: [],
  posts: [],
  comments: []
};

// Seed dataset with realistic high-impact articles
const initialSeedData = async (): Promise<DatabaseSchema> => {
  const hashedPassword = await bcrypt.hash('password123', 10);
  const now = new Date();
  
  const user1: IUser = {
    _id: 'usr_alex_chen',
    name: 'Alex Chen',
    email: 'alex@blogx.dev',
    password: hashedPassword,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    bio: 'Lead Full-Stack Architect & Open Source Contributor. Passionate about distributed systems, Rust, and high-performance web tooling.',
    role: 'author',
    createdAt: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString()
  };

  const user2: IUser = {
    _id: 'usr_sarah_connor',
    name: 'Sarah Connor',
    email: 'sarah@blogx.dev',
    password: hashedPassword,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    bio: 'AI Systems Researcher & Cloud Infrastructure Engineer. Exploring LLM evaluation, vector databases, and real-time streaming.',
    role: 'author',
    createdAt: new Date(Date.now() - 45 * 24 * 3600 * 1000).toISOString()
  };

  const user3: IUser = {
    _id: 'usr_marcus_vance',
    name: 'Marcus Vance',
    email: 'marcus@blogx.dev',
    password: hashedPassword,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    bio: 'Senior Frontend Engineer & UI/UX Craftsman. Building accessible, fluid design systems and high frame-rate web applications.',
    role: 'author',
    createdAt: new Date(Date.now() - 60 * 24 * 3600 * 1000).toISOString()
  };

  const posts: IPost[] = [
    {
      _id: 'post_101',
      title: 'Architecting High-Throughput Microservices with Node.js & Redis Pipelines',
      excerpt: 'Learn how to eliminate I/O latency bottlenecks, implement token-bucket rate limiting, and achieve sub-millisecond API response times.',
      content: `## The Modern Latency Challenge

In distributed architectures, microservices frequently bottleneck not on compute capacity, but on repetitive network round-trips and serialized database calls. When processing thousands of concurrent events per second, every millisecond shaved off the critical I/O path compounds into massive infrastructure cost savings and silky-smooth user experiences.

### Key Architectural Pillars

1. **Pipelined Redis Operations**: Batch non-dependent queries to cut network round trips from *O(N)* to *O(1)*.
2. **Buffer Stream Transformations**: Instead of loading huge JSON payloads into memory, stream chunked responses directly into downstream consumers.
3. **Optimistic Locking**: Reduce transactional lock contentions in distributed databases.

\`\`\`typescript
import Redis from 'ioredis';

export async function batchFetchUserFeeds(userIds: string[]) {
  const redis = new Redis(process.env.REDIS_URL);
  const pipeline = redis.pipeline();

  userIds.forEach((id) => {
    pipeline.hgetall(\`user:\${id}:cache\`);
    pipeline.zrevrange(\`user:\${id}:activity\`, 0, 10);
  });

  const results = await pipeline.exec();
  return results?.map(([err, res]) => (err ? null : res));
}
\`\`\`

### Benchmark Results

After swapping sequential database lookups with pipelined memory stores and non-blocking worker pools, average latency dropped from **142ms** to **8.4ms** at peak 99th percentile traffic.

> "Optimization is not about guessing; it is about rigorous profiling, locating the slowest network boundary, and structuring data access patterns to match physical memory layout."

Try integrating connection pooling and keep-alive headers on all your internal HTTP/2 gRPC channels to maximize pipeline saturation!`,
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80',
      category: 'Technology',
      tags: ['Node.js', 'Architecture', 'Microservices', 'Redis', 'Backend'],
      author: {
        _id: user1._id,
        name: user1.name,
        email: user1.email,
        avatar: user1.avatar,
        bio: user1.bio
      },
      status: 'published',
      readTime: '6 min read',
      views: 1420,
      createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString()
    },
    {
      _id: 'post_102',
      title: 'Mastering Modern React 19: Actions, Optimistic UI, and Server State',
      excerpt: 'Deep-dive into the newest asynchronous capabilities in React 19, eliminating boilerplate state hooks, and creating instant-feel UI flows.',
      content: `## The Next Evolution of Client-Server Interactivity

React 19 introduces a fundamental shift in how applications handle mutations, form submissions, and transient UI transitions. Instead of managing five separate state variables (\`isLoading\`, \`isError\`, \`data\`, \`isPending\`, \`validationErrors\`), modern primitives encapsulate asynchronous lifecycles effortlessly.

### Why Optimistic Updates Matter

Nothing breaks user immersion faster than an unresponsive button waiting 600ms for a remote server confirmation before updating the screen. By utilizing optimistic mutations, we update the UI immediately while rolling back transparently if the remote promise rejects.

\`\`\`tsx
import { useOptimistic, useState } from 'react';

export function CommentThread({ initialComments, onAddComment }) {
  const [comments, setComments] = useState(initialComments);
  const [optimisticComments, setOptimisticComments] = useOptimistic(
    comments,
    (state, newComment: string) => [
      ...state,
      { id: 'temp-' + Date.now(), text: newComment, pending: true }
    ]
  );

  async function handleAction(formData: FormData) {
    const text = formData.get('comment') as string;
    setOptimisticComments(text);
    const saved = await onAddComment(text);
    setComments((prev) => [...prev, saved]);
  }

  return (
    <form action={handleAction}>
      {optimisticComments.map((c) => (
        <div key={c.id} className={c.pending ? 'opacity-50' : ''}>
          {c.text}
        </div>
      ))}
      <input name="comment" placeholder="Write thoughts..." />
      <button type="submit">Send</button>
    </form>
  );
}
\`\`\`

### Summary Takeaways

- Embrace Actions for seamless data mutations.
- Keep optimistic UI snappy and robust with automatic fallback rollbacks.
- Design forms to treat network latencies as asynchronous flows rather than UI blockers.`,
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&auto=format&fit=crop&q=80',
      category: 'Programming',
      tags: ['React', 'TypeScript', 'Frontend', 'WebDev', 'UI/UX'],
      author: {
        _id: user3._id,
        name: user3.name,
        email: user3.email,
        avatar: user3.avatar,
        bio: user3.bio
      },
      status: 'published',
      readTime: '5 min read',
      views: 2890,
      createdAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString()
    },
    {
      _id: 'post_103',
      title: 'Building Scalable RAG Pipelines: Embeddings, Chunking & Vector Search',
      excerpt: 'An end-to-end practical guide on chunking strategies, semantic similarity indexing, and reranking algorithms for enterprise AI search.',
      content: `## Retrieval-Augmented Generation at Scale

While Foundation Models hold immense reasoning power, their parametric knowledge is static and prone to hallucinations. Retrieval-Augmented Generation (RAG) grounds conversational agents in authoritative, up-to-date domain data.

### 1. The Critical Role of Chunking

Naive character-count chunking cuts off semantic thoughts midway through sentences. Instead, employ structural Markdown and AST-aware chunking:

- Split on headers, code fences, and logical paragraphs.
- Maintain a **15-20% sliding window token overlap** to preserve antecedent context.
- Enrich chunks with metadata headers (e.g. document title, module namespace, last modified date).

### 2. Hybrid Search: Dense + Sparse

Combining dense embeddings (e.g., Cosine Vector similarity) with sparse lexical algorithms (such as BM25) yields the highest accuracy across specialized terminologies and acronym queries.

\`\`\`typescript
// Hybrid Query Construction
export async function executeHybridSearch(query: string, vectorStore: any) {
  const queryEmbedding = await generateEmbedding(query);
  
  const [vectorMatches, lexicalMatches] = await Promise.all([
    vectorStore.similaritySearch(queryEmbedding, { limit: 20 }),
    vectorStore.bm25Search(query, { limit: 20 })
  ]);

  return reciprocalRankFusion([vectorMatches, lexicalMatches]);
}
\`\`\`

Implement reranking models (e.g., cross-encoders) on the top 20 candidate documents to filter out tangential matches before injecting context into the final LLM prompt context window!`,
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
      category: 'Education',
      tags: ['AI', 'Machine Learning', 'RAG', 'VectorDB', 'Search'],
      author: {
        _id: user2._id,
        name: user2.name,
        email: user2.email,
        avatar: user2.avatar,
        bio: user2.bio
      },
      status: 'published',
      readTime: '8 min read',
      views: 3120,
      createdAt: new Date(Date.now() - 6 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 6 * 24 * 3600 * 1000).toISOString()
    },
    {
      _id: 'post_104',
      title: 'The Solo Founder Playbook: Bootstrapping a Developer SaaS in 2026',
      excerpt: 'From validating product-market fit to pricing tiers, automated marketing loops, and building sustainable revenue without venture debt.',
      content: `## The Modern Solo Software Venture

With modern cloud infrastructure, AI-accelerated development, and frictionless global billing, an individual engineer can now launch products that previously required a ten-person engineering crew.

### Core Principles for Sustainable SaaS

1. **Solve an Expensive Problem for Businesses**: B2B software is paid from operational budgets, whereas B2C apps fight for discretionary pocket change.
2. **Ruthless Scope Discipline**: Build one killer feature that operates 10x better than competitors before expanding features.
3. **Transparent Pricing**: Avoid "Contact Sales" barriers for early adopters. Clear self-serve tiers build trust instantly.

### Metrics That Actually Matter

- **MRR / ARR Growth Rate**: The pulse of user willingness to pay.
- **Net Revenue Retention (NRR)**: Ensuring expansion revenue offsets normal churn.
- **Payback Period**: Keep customer acquisition costs recoverable within 3 months.`,
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80',
      category: 'Business',
      tags: ['SaaS', 'Startup', 'Bootstrapping', 'Growth', 'Business'],
      author: {
        _id: user1._id,
        name: user1.name,
        email: user1.email,
        avatar: user1.avatar,
        bio: user1.bio
      },
      status: 'published',
      readTime: '7 min read',
      views: 1950,
      createdAt: new Date(Date.now() - 8 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 8 * 24 * 3600 * 1000).toISOString()
    },
    {
      _id: 'post_105',
      title: 'Digital Nomad Engineering: Working from 12 Countries in 12 Months',
      excerpt: 'Navigating timezones, asynchronous team communication, ergonomic portable workstations, and tax residency as a nomadic tech lead.',
      content: `## Life on the Move

Over the past year, I shipped four major product releases across 12 countries spanning Kyoto, Lisbon, Cape Town, and Buenos Aires. Working remotely while exploring the world is exhilarating, but requires rigorous discipline and communication hygiene.

### The Remote Nomad Checklist

- **Strict Asynchronous Documentation**: If a decision isn't written down in an issue tracker or spec doc, it doesn't exist.
- **Dual eSIM & Mobile Hotspot redundancy**: Never rely solely on café Wi-Fi when deploying production systems.
- **Dedicated Focus Windows**: Establish clear daily blocks (e.g. 8 AM - 1 PM) for deep uninterrupted coding, regardless of location.

Embrace the freedom of international exploration while maintaining peak professional output!`,
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80',
      category: 'Travel',
      tags: ['Travel', 'Nomad', 'RemoteWork', 'Productivity', 'Lifestyle'],
      author: {
        _id: user2._id,
        name: user2.name,
        email: user2.email,
        avatar: user2.avatar,
        bio: user2.bio
      },
      status: 'published',
      readTime: '4 min read',
      views: 2450,
      createdAt: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString()
    },
    {
      _id: 'post_106',
      title: 'Crafting Obsidian-Grade Dark Mode UI: Contrast Ratios and Spatial Hierarchy',
      excerpt: 'Why pure black #000000 causes eye strain, how to layer charcoal elevation scales, and applying optical glow for focal hierarchy.',
      content: `## The Art of Dark Interface Craft

A truly refined dark mode is not simply an inverted light theme. It requires careful balance of luminance steps, subtle warm/cool undertones, and selective chromatic accents.

### Elevation via Surface Brightness

In physical optics, objects closer to the light source receive more illumination. We translate this into digital interfaces by using lighter charcoal shades as depth increases:

- **Base Canvas**: \`#050505\`
- **Surface Level 1 (Panels & Sidebar)**: \`#0D0D0D\`
- **Surface Level 2 (Interactive Cards & Inputs)**: \`#151515\`
- **Surface Level 3 (Dropdowns & Modals)**: \`#1E1E1E\`
- **Structural Borders**: \`#292929\`

### Strategic Accent Pops

Limit intense chromatic saturation to primary user actions (such as primary buttons in glowing Crimson Red, highlight badges in Sunshine Yellow, or status pills in Emerald Green). This keeps the visual field serene, high-contrast, and effortlessly readable.`,
      image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200&auto=format&fit=crop&q=80',
      category: 'Lifestyle',
      tags: ['Design', 'UI/UX', 'DarkTheme', 'Tailwind', 'CSS'],
      author: {
        _id: user3._id,
        name: user3.name,
        email: user3.email,
        avatar: user3.avatar,
        bio: user3.bio
      },
      status: 'published',
      readTime: '5 min read',
      views: 1870,
      createdAt: new Date(Date.now() - 12 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 12 * 24 * 3600 * 1000).toISOString()
    }
  ];

  const comments: IComment[] = [
    {
      _id: 'comm_201',
      post: 'post_101',
      author: {
        _id: user2._id,
        name: user2.name,
        email: user2.email,
        avatar: user2.avatar
      },
      content: 'Excellent breakdown of the pipeline batching! We saw similar 10x throughput jumps after pipelining Redis cache lookups in our vector search worker cluster.',
      createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString()
    },
    {
      _id: 'comm_202',
      post: 'post_101',
      author: {
        _id: user3._id,
        name: user3.name,
        email: user3.email,
        avatar: user3.avatar
      },
      content: 'The buffer stream code snippet is crystal clear. Are you handling backpressure with custom transform streams or native pipeTo?',
      createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString()
    },
    {
      _id: 'comm_203',
      post: 'post_102',
      author: {
        _id: user1._id,
        name: user1.name,
        email: user1.email,
        avatar: user1.avatar
      },
      content: 'React 19 Actions have completely cleaned up our form validation workflows. Great practical walkthrough, Marcus!',
      createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString()
    },
    {
      _id: 'comm_204',
      post: 'post_103',
      author: {
        _id: user1._id,
        name: user1.name,
        email: user1.email,
        avatar: user1.avatar
      },
      content: 'RRF (Reciprocal Rank Fusion) has made our hybrid BM25 + embedding queries significantly more accurate on technical documentation. Highly recommend!',
      createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString()
    }
  ];

  return {
    users: [user1, user2, user3],
    posts,
    comments
  };
};

// Persistence handler
function saveLocalDb() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(inMemoryDb, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write database file:', err);
  }
}

function loadLocalDb(): boolean {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      inMemoryDb = JSON.parse(raw);
      return true;
    }
  } catch (err) {
    console.error('Failed to load database file, re-initializing:', err);
  }
  return false;
}

// Database Initialization (dual-mode: MongoDB / Persistent JSON Store)
export async function initDatabase() {
  const mongoUri = process.env.MONGODB_URI;

  if (mongoUri) {
    try {
      console.log('Connecting to MongoDB instance...');
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000
      });
      UserModel = mongoose.models.User || mongoose.model('User', userSchema);
      PostModel = mongoose.models.Post || mongoose.model('Post', postSchema);
      CommentModel = mongoose.models.Comment || mongoose.model('Comment', commentSchema);
      isMongoConnected = true;
      console.log('Successfully connected to MongoDB!');
      return;
    } catch (err) {
      console.warn('MongoDB connection failed. Falling back to persistent local storage:', (err as Error).message);
    }
  }

  // Local storage fallback
  const loaded = loadLocalDb();
  if (!loaded || !inMemoryDb.users || inMemoryDb.users.length === 0) {
    console.log('Initializing database with high-quality seed content...');
    inMemoryDb = await initialSeedData();
    saveLocalDb();
  }
  console.log(`Database ready. Loaded ${inMemoryDb.users.length} users, ${inMemoryDb.posts.length} posts, and ${inMemoryDb.comments.length} comments.`);
}

// Database service layer with uniform interface
export const dbService = {
  // Users
  async findUserByEmail(email: string): Promise<IUser | null> {
    const cleanEmail = email.trim().toLowerCase();
    const user = inMemoryDb.users.find((u) => u.email.toLowerCase() === cleanEmail);
    return user ? { ...user } : null;
  },

  async findUserById(id: string): Promise<IUser | null> {
    const user = inMemoryDb.users.find((u) => u._id === id);
    return user ? { ...user } : null;
  },

  async createUser(userData: { name: string; email: string; password?: string; avatar?: string; bio?: string }): Promise<IUser> {
    const newUser: IUser = {
      _id: 'usr_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
      name: userData.name.trim(),
      email: userData.email.trim().toLowerCase(),
      password: userData.password,
      avatar: userData.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userData.name)}`,
      bio: userData.bio || 'Passionate blogger & knowledge seeker on BLOGX.',
      role: 'user',
      createdAt: new Date().toISOString()
    };
    inMemoryDb.users.push(newUser);
    saveLocalDb();
    return { ...newUser };
  },

  async updateUser(id: string, updates: Partial<IUser>): Promise<IUser | null> {
    const index = inMemoryDb.users.findIndex((u) => u._id === id);
    if (index === -1) return null;
    inMemoryDb.users[index] = {
      ...inMemoryDb.users[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    // Also update author info across their posts and comments
    const updatedUser = inMemoryDb.users[index];
    inMemoryDb.posts.forEach((p) => {
      if (p.author._id === id) {
        p.author.name = updatedUser.name;
        p.author.avatar = updatedUser.avatar;
        if (updatedUser.bio) p.author.bio = updatedUser.bio;
      }
    });
    inMemoryDb.comments.forEach((c) => {
      if (c.author._id === id) {
        c.author.name = updatedUser.name;
        c.author.avatar = updatedUser.avatar;
      }
    });

    saveLocalDb();
    return { ...updatedUser };
  },

  // Posts
  async getPosts(filter?: { search?: string; category?: string; tag?: string; authorId?: string; sort?: string }): Promise<IPost[]> {
    let list = inMemoryDb.posts.map((p) => {
      const commentCount = inMemoryDb.comments.filter((c) => c.post === p._id).length;
      return {
        ...p,
        commentsCount: commentCount
      };
    });

    if (filter?.category && filter.category !== 'All') {
      list = list.filter((p) => p.category.toLowerCase() === filter.category!.toLowerCase());
    }

    if (filter?.tag) {
      list = list.filter((p) => p.tags.some((t) => t.toLowerCase() === filter.tag!.toLowerCase()));
    }

    if (filter?.authorId) {
      list = list.filter((p) => p.author._id === filter.authorId);
    }

    if (filter?.search) {
      const q = filter.search.toLowerCase().trim();
      list = list.filter((p) => 
        p.title.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.author.name.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (filter?.sort === 'popular') {
      list.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (filter?.sort === 'comments') {
      list.sort((a, b) => (b.commentsCount || 0) - (a.commentsCount || 0));
    } else {
      // Latest first
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return list;
  },

  async getPostById(id: string, incrementViews = false): Promise<IPost | null> {
    const post = inMemoryDb.posts.find((p) => p._id === id);
    if (!post) return null;

    if (incrementViews) {
      post.views = (post.views || 0) + 1;
      saveLocalDb();
    }

    const commentsCount = inMemoryDb.comments.filter((c) => c.post === post._id).length;
    return {
      ...post,
      commentsCount
    };
  },

  async createPost(postData: Omit<IPost, '_id' | 'createdAt' | 'updatedAt' | 'commentsCount'>): Promise<IPost> {
    const newPost: IPost = {
      ...postData,
      _id: 'post_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      commentsCount: 0
    };
    inMemoryDb.posts.unshift(newPost);
    saveLocalDb();
    return { ...newPost };
  },

  async updatePost(id: string, updates: Partial<IPost>): Promise<IPost | null> {
    const index = inMemoryDb.posts.findIndex((p) => p._id === id);
    if (index === -1) return null;

    inMemoryDb.posts[index] = {
      ...inMemoryDb.posts[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    saveLocalDb();

    const commentsCount = inMemoryDb.comments.filter((c) => c.post === id).length;
    return {
      ...inMemoryDb.posts[index],
      commentsCount
    };
  },

  async deletePost(id: string): Promise<boolean> {
    const initialLen = inMemoryDb.posts.length;
    inMemoryDb.posts = inMemoryDb.posts.filter((p) => p._id !== id);
    // Also cascade delete comments for this post
    inMemoryDb.comments = inMemoryDb.comments.filter((c) => c.post !== id);
    saveLocalDb();
    return inMemoryDb.posts.length < initialLen;
  },

  // Comments
  async getCommentsByPostId(postId: string): Promise<IComment[]> {
    return inMemoryDb.comments
      .filter((c) => c.post === postId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async createComment(commentData: { post: string; author: IComment['author']; content: string }): Promise<IComment> {
    const newComment: IComment = {
      _id: 'comm_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
      post: commentData.post,
      author: commentData.author,
      content: commentData.content.trim(),
      createdAt: new Date().toISOString()
    };
    inMemoryDb.comments.unshift(newComment);
    saveLocalDb();
    return { ...newComment };
  },

  async deleteComment(id: string): Promise<boolean> {
    const initialLen = inMemoryDb.comments.length;
    inMemoryDb.comments = inMemoryDb.comments.filter((c) => c._id !== id);
    saveLocalDb();
    return inMemoryDb.comments.length < initialLen;
  },

  async getCommentById(id: string): Promise<IComment | null> {
    const comment = inMemoryDb.comments.find((c) => c._id === id);
    return comment ? { ...comment } : null;
  },

  // User Dashboard Stats
  async getUserStats(userId: string) {
    const userPosts = inMemoryDb.posts.filter((p) => p.author._id === userId);
    const userPostIds = new Set(userPosts.map((p) => p._id));
    const totalCommentsReceived = inMemoryDb.comments.filter((c) => userPostIds.has(c.post)).length;
    const userAuthoredComments = inMemoryDb.comments.filter((c) => c.author._id === userId).length;
    const publishedCount = userPosts.filter((p) => (p.status || 'published') === 'published').length;
    const draftCount = userPosts.filter((p) => p.status === 'draft').length;
    const totalViews = userPosts.reduce((acc, curr) => acc + (curr.views || 0), 0);

    return {
      totalPosts: userPosts.length,
      publishedPosts: publishedCount,
      drafts: draftCount,
      totalCommentsReceived,
      totalCommentsAuthored: userAuthoredComments,
      totalViews
    };
  }
};
