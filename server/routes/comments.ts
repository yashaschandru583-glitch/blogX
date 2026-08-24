import { Router, Response } from 'express';
import { dbService } from '../db.js';
import { requireAuth, optionalAuth, AuthenticatedRequest } from '../middleware/auth.js';

export const commentsRouter = Router();

// GET /api/posts/:postId/comments - Get comments for a post
commentsRouter.get('/posts/:postId/comments', optionalAuth, async (req, res: Response) => {
  try {
    const { postId } = req.params;
    const comments = await dbService.getCommentsByPostId(postId);

    return res.json({
      success: true,
      count: comments.length,
      comments
    });
  } catch (err: any) {
    console.error('Get comments error:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve comments.' 
    });
  }
});

// POST /api/posts/:postId/comments - Add a new comment
commentsRouter.post('/posts/:postId/comments', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { postId } = req.params;
    const userId = req.user!.userId;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Comment content cannot be empty.' 
      });
    }

    const post = await dbService.getPostById(postId);
    if (!post) {
      return res.status(404).json({ 
        success: false, 
        message: 'Blog post not found.' 
      });
    }

    const user = await dbService.findUserById(userId);
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'User profile not found.' 
      });
    }

    const newComment = await dbService.createComment({
      post: postId,
      author: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      },
      content: content.trim()
    });

    return res.status(201).json({
      success: true,
      message: 'Comment posted successfully!',
      comment: newComment
    });
  } catch (err: any) {
    console.error('Post comment error:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to post comment.' 
    });
  }
});

// DELETE /api/comments/:id - Delete a comment (Comment author or Post author)
commentsRouter.delete('/comments/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    const comment = await dbService.getCommentById(id);
    if (!comment) {
      return res.status(404).json({ 
        success: false, 
        message: 'Comment not found.' 
      });
    }

    // Check if user is comment author OR post author
    const post = await dbService.getPostById(comment.post);
    const isCommentAuthor = comment.author._id === userId;
    const isPostAuthor = post && post.author._id === userId;

    if (!isCommentAuthor && !isPostAuthor) {
      return res.status(403).json({ 
        success: false, 
        message: 'Unauthorized. You can only delete your own comments.' 
      });
    }

    const deleted = await dbService.deleteComment(id);
    if (!deleted) {
      return res.status(500).json({ 
        success: false, 
        message: 'Unable to delete comment.' 
      });
    }

    return res.json({
      success: true,
      message: 'Comment deleted successfully!'
    });
  } catch (err: any) {
    console.error('Delete comment error:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'Unable to delete comment.' 
    });
  }
});
