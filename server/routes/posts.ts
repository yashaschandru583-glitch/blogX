import { Router, Response } from 'express';
import { dbService } from '../db.js';
import { requireAuth, optionalAuth, AuthenticatedRequest } from '../middleware/auth.js';

export const postsRouter = Router();

// Helper to estimate read time
function calculateReadTime(text: string): string {
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

// GET /api/posts - Search, filter, and list posts
postsRouter.get('/', optionalAuth, async (req, res: Response) => {
  try {
    const { search, category, tag, authorId, sort } = req.query;

    const posts = await dbService.getPosts({
      search: typeof search === 'string' ? search : undefined,
      category: typeof category === 'string' ? category : undefined,
      tag: typeof tag === 'string' ? tag : undefined,
      authorId: typeof authorId === 'string' ? authorId : undefined,
      sort: typeof sort === 'string' ? sort : undefined
    });

    return res.json({
      success: true,
      count: posts.length,
      posts
    });
  } catch (err: any) {
    console.error('Fetch posts error:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve blog posts.' 
    });
  }
});

// GET /api/posts/user/my-posts - Current logged in user's posts & dashboard metrics
postsRouter.get('/user/my-posts', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const posts = await dbService.getPosts({ authorId: userId });
    const stats = await dbService.getUserStats(userId);

    return res.json({
      success: true,
      stats: {
        totalPosts: stats.totalPosts,
        totalComments: stats.totalCommentsReceived,
        publishedPosts: stats.publishedPosts,
        drafts: stats.drafts,
        totalViews: stats.totalViews
      },
      posts
    });
  } catch (err: any) {
    console.error('Fetch my-posts error:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to load user dashboard posts.' 
    });
  }
});

// GET /api/posts/:id - Single post details
postsRouter.get('/:id', optionalAuth, async (req, res: Response) => {
  try {
    const { id } = req.params;
    const post = await dbService.getPostById(id, true);

    if (!post) {
      return res.status(404).json({ 
        success: false, 
        message: 'Blog post not found.' 
      });
    }

    // Get related posts in same category
    const allCategoryPosts = await dbService.getPosts({ category: post.category });
    const related = allCategoryPosts
      .filter((p) => p._id !== post._id)
      .slice(0, 3);

    return res.json({
      success: true,
      post,
      related
    });
  } catch (err: any) {
    console.error('Fetch post by id error:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve blog post.' 
    });
  }
});

// POST /api/posts - Create post
postsRouter.post('/', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const user = await dbService.findUserById(userId);

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authenticated user profile not found.' 
      });
    }

    const { title, content, excerpt, image, category, tags, status } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Post title is required.' 
      });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Post content is required.' 
      });
    }

    const formattedTags = Array.isArray(tags)
      ? tags.map((t: string) => t.trim().replace(/^#/, '')).filter(Boolean)
      : typeof tags === 'string'
      ? tags.split(',').map((t: string) => t.trim().replace(/^#/, '')).filter(Boolean)
      : ['General'];

    const defaultImages = [
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&auto=format&fit=crop&q=80'
    ];
    const postImage = image && image.trim() 
      ? image.trim() 
      : defaultImages[Math.floor(Math.random() * defaultImages.length)];

    const calculatedExcerpt = excerpt && excerpt.trim() 
      ? excerpt.trim() 
      : content.replace(/[#*`_]/g, '').slice(0, 160) + '...';

    const newPost = await dbService.createPost({
      title: title.trim(),
      content: content.trim(),
      excerpt: calculatedExcerpt,
      image: postImage,
      category: category || 'Technology',
      tags: formattedTags.length > 0 ? formattedTags : ['Technology'],
      status: status === 'draft' ? 'draft' : 'published',
      readTime: calculateReadTime(content),
      author: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Post published successfully!',
      post: newPost
    });
  } catch (err: any) {
    console.error('Create post error:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error while creating post.' 
    });
  }
});

// PUT /api/posts/:id - Edit post (Owner only)
postsRouter.put('/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    const existingPost = await dbService.getPostById(id);
    if (!existingPost) {
      return res.status(404).json({ 
        success: false, 
        message: 'Post not found.' 
      });
    }

    if (existingPost.author._id !== userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'Unauthorized. You can only edit your own posts.' 
      });
    }

    const { title, content, excerpt, image, category, tags, status } = req.body;
    const updates: any = {};

    if (title && title.trim()) updates.title = title.trim();
    if (content && content.trim()) {
      updates.content = content.trim();
      updates.readTime = calculateReadTime(content);
      if (!excerpt) {
        updates.excerpt = content.replace(/[#*`_]/g, '').slice(0, 160) + '...';
      }
    }
    if (excerpt !== undefined) updates.excerpt = excerpt.trim();
    if (image !== undefined && image.trim()) updates.image = image.trim();
    if (category) updates.category = category;
    if (tags !== undefined) {
      updates.tags = Array.isArray(tags)
        ? tags.map((t: string) => t.trim().replace(/^#/, '')).filter(Boolean)
        : typeof tags === 'string'
        ? tags.split(',').map((t: string) => t.trim().replace(/^#/, '')).filter(Boolean)
        : existingPost.tags;
    }
    if (status) updates.status = status;

    const updatedPost = await dbService.updatePost(id, updates);

    return res.json({
      success: true,
      message: 'Post updated successfully!',
      post: updatedPost
    });
  } catch (err: any) {
    console.error('Update post error:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to update post.' 
    });
  }
});

// DELETE /api/posts/:id - Delete post (Owner only)
postsRouter.delete('/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    const existingPost = await dbService.getPostById(id);
    if (!existingPost) {
      return res.status(404).json({ 
        success: false, 
        message: 'Post not found.' 
      });
    }

    if (existingPost.author._id !== userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'Unauthorized. You can only delete your own posts.' 
      });
    }

    const deleted = await dbService.deletePost(id);
    if (!deleted) {
      return res.status(500).json({ 
        success: false, 
        message: 'Unable to delete post.' 
      });
    }

    return res.json({
      success: true,
      message: 'Post deleted successfully!'
    });
  } catch (err: any) {
    console.error('Delete post error:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'Unable to delete post.' 
    });
  }
});
