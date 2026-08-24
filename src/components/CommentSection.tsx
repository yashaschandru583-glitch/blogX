import React, { useState, useEffect } from 'react';
import { Comment, User } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatTimeAgo } from '../utils/theme';
import { MessageSquare, Send, Trash2, LogIn, Sparkles } from 'lucide-react';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { Link } from 'react-router-dom';

interface CommentSectionProps {
  postId: string;
  postAuthorId: string;
  onCommentCountChange?: (count: number) => void;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  postId,
  postAuthorId,
  onCommentCountChange
}) => {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchComments = async () => {
    try {
      const data = await api.getComments(postId);
      setComments(data);
      if (onCommentCountChange) onCommentCountChange(data.length);
    } catch (err: any) {
      console.error('Failed to load comments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      showToast('warning', 'Login required to post a comment.');
      return;
    }

    if (!content.trim()) {
      showToast('warning', 'Please write something before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      const newComment = await api.createComment(postId, content.trim());
      setComments((prev) => [newComment, ...prev]);
      setContent('');
      showToast('success', 'Comment posted successfully!');
      if (onCommentCountChange) onCommentCountChange(comments.length + 1);
    } catch (err: any) {
      showToast('error', err.message || 'Failed to post comment.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!commentToDelete) return;
    setIsDeleting(true);
    try {
      await api.deleteComment(commentToDelete);
      setComments((prev) => prev.filter((c) => c._id !== commentToDelete));
      showToast('success', 'Comment deleted successfully.');
      if (onCommentCountChange) onCommentCountChange(Math.max(0, comments.length - 1));
      setCommentToDelete(null);
    } catch (err: any) {
      showToast('error', err.message || 'Unable to delete comment.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <section id="comments-section" className="mt-12 pt-10 border-t border-[#292929]">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FF2B2B]/10 border border-[#FF2B2B]/30 flex items-center justify-center text-[#FF2B2B]">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-wide">
              Comments <span className="text-[#FF7A00] font-mono text-lg ml-1">({comments.length})</span>
            </h2>
            <p className="text-xs text-[#9CA3AF]">Join the community debate and share your perspective</p>
          </div>
        </div>
      </div>

      {/* Comment Creation Box */}
      <div className="mb-10 bg-[#151515] border border-[#292929] rounded-2xl p-5 shadow-lg relative">
        {isAuthenticated && user ? (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex items-center gap-3 mb-2">
              <img
                src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.name)}`}
                alt={user.name}
                className="w-8 h-8 rounded-full border border-[#292929] object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="text-xs font-semibold text-white">Commenting as <span className="text-[#FF7A00]">{user.name}</span></span>
            </div>

            <textarea
              id="input-comment-content"
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What are your thoughts on this article? Markdown formatting supported..."
              className="w-full bg-[#0D0D0D] border border-[#292929] rounded-xl px-4 py-3 text-sm text-white placeholder-[#9CA3AF] focus:outline-none focus:border-[#FF2B2B] focus:ring-1 focus:ring-[#FF2B2B] transition-all resize-none"
            />

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-[#9CA3AF] flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#FFD60A]" /> Be constructive and respectful
              </span>
              <button
                id="btn-post-comment"
                type="submit"
                disabled={submitting || !content.trim()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF2B2B] to-[#FF7A00] hover:brightness-110 text-white text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(255,43,43,0.35)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-3.5 h-3.5" />
                {submitting ? 'Posting...' : 'POST COMMENT'}
              </button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-[#0D0D0D] border border-[#292929]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#FF7A00]/15 flex items-center justify-center text-[#FF7A00]">
                <LogIn className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Have something to say?</p>
                <p className="text-xs text-[#9CA3AF]">Sign in to participate in the discussion</p>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Link
                id="btn-comment-login"
                to="/login"
                className="flex-1 sm:flex-none text-center px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#1E1E1E] border border-[#292929] hover:border-[#FF2B2B]/50 transition-all"
              >
                Log In
              </Link>
              <Link
                id="btn-comment-register"
                to="/register"
                className="flex-1 sm:flex-none text-center px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#FF2B2B] to-[#FF7A00] shadow-[0_0_12px_rgba(255,43,43,0.3)] transition-all"
              >
                Register
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Comments List */}
      <div id="comments-list" className="space-y-4">
        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="p-4 rounded-2xl bg-[#151515] border border-[#292929] animate-pulse space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#252525]" />
                  <div className="w-32 h-4 bg-[#252525] rounded" />
                </div>
                <div className="w-full h-10 bg-[#1E1E1E] rounded" />
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <div id="empty-comments-notice" className="text-center py-12 px-4 rounded-2xl bg-[#151515] border border-dashed border-[#292929]">
            <MessageSquare className="w-10 h-10 text-[#9CA3AF]/40 mx-auto mb-3" />
            <p className="text-sm font-medium text-[#E5E5E5] mb-1">
              No comments yet. Be the first to start the discussion!
            </p>
            <p className="text-xs text-[#9CA3AF]">
              Share your insights, code feedback, or questions with the author.
            </p>
          </div>
        ) : (
          comments.map((comment) => {
            const canDelete =
              isAuthenticated &&
              user &&
              (comment.author._id === user._id || postAuthorId === user._id);

            return (
              <div
                key={comment._id}
                id={`comment-${comment._id}`}
                className="group p-5 rounded-2xl bg-[#151515] border border-[#292929] hover:border-[#292929] transition-all relative"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={comment.author.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(comment.author.name)}`}
                      alt={comment.author.name}
                      className="w-8 h-8 rounded-full border border-[#292929] object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">
                          {comment.author.name}
                        </span>
                        {comment.author._id === postAuthorId && (
                          <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#FFD60A]/15 text-[#FFD60A] border border-[#FFD60A]/30">
                            Author
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-[#9CA3AF]">
                        {formatTimeAgo(comment.createdAt)}
                      </span>
                    </div>
                  </div>

                  {canDelete && (
                    <button
                      id={`btn-delete-comment-${comment._id}`}
                      onClick={() => setCommentToDelete(comment._id)}
                      className="text-[#9CA3AF] hover:text-[#FF2B2B] p-1.5 rounded-lg hover:bg-[#FF2B2B]/10 transition-colors"
                      title="Delete comment"
                      aria-label="Delete comment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="mt-3 text-sm text-[#E5E5E5] leading-relaxed whitespace-pre-wrap pl-11">
                  {comment.content}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!commentToDelete}
        title="Delete Comment"
        message="Are you sure you want to permanently remove this comment? This action cannot be undone."
        confirmLabel="Delete Comment"
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setCommentToDelete(null)}
      />
    </section>
  );
};
