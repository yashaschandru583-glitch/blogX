import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Post } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { CATEGORY_COLORS, formatDate } from '../utils/theme';
import { 
  PenSquare, 
  BookOpen, 
  MessageSquare, 
  FileCheck, 
  FileEdit, 
  Eye, 
  Trash2, 
  Edit3, 
  Search, 
  Plus, 
  ExternalLink,
  Flame,
  Clock
} from 'lucide-react';

export const MyPostsPage: React.FC = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [posts, setPosts] = useState<Post[]>([]);
  const [stats, setStats] = useState<{
    totalPosts: number;
    totalComments: number;
    publishedPosts: number;
    drafts: number;
    totalViews: number;
  }>({
    totalPosts: 0,
    totalComments: 0,
    publishedPosts: 0,
    drafts: 0,
    totalViews: 0
  });

  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchMyDashboard = async () => {
    setLoading(true);
    try {
      const data = await api.getMyPosts();
      setPosts(data.posts || []);
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (err: any) {
      showToast('error', err.message || 'Failed to load your posts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        showToast('warning', 'Please sign in to view your dashboard.');
        navigate('/login');
      } else {
        fetchMyDashboard();
      }
    }
  }, [isAuthenticated, authLoading]);

  const handleDeletePost = async () => {
    if (!postToDelete) return;
    setIsDeleting(true);
    try {
      await api.deletePost(postToDelete._id);
      setPosts((prev) => prev.filter((p) => p._id !== postToDelete._id));
      showToast('success', 'Post deleted successfully!');
      setPostToDelete(null);
      // Refresh stats
      setStats((prev) => ({
        ...prev,
        totalPosts: Math.max(0, prev.totalPosts - 1),
        publishedPosts: postToDelete.status === 'draft' ? prev.publishedPosts : Math.max(0, prev.publishedPosts - 1),
        drafts: postToDelete.status === 'draft' ? Math.max(0, prev.drafts - 1) : prev.drafts
      }));
    } catch (err: any) {
      showToast('error', err.message || 'Unable to delete post.');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredPosts = posts.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || (p.status || 'published') === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (authLoading || loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner size="lg" label="Loading author dashboard..." />
      </div>
    );
  }

  return (
    <div id="my-posts-page" className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Header & New Post Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#FF2B2B]" />
            <p className="text-xs uppercase font-bold tracking-widest text-[#FF2B2B]">
              Author Command Center
            </p>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            My Posts Dashboard
          </h1>
          <p className="text-xs text-[#9CA3AF] mt-1">
            Manage your articles, analyze reader engagements, and track publication lifecycles.
          </p>
        </div>

        <Link
          id="btn-dashboard-new-post"
          to="/create"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF2B2B] to-[#FF7A00] hover:brightness-110 text-white text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(255,43,43,0.35)] transition-all"
        >
          <Plus className="w-4 h-4" /> Create New Post
        </Link>
      </div>

      {/* Top Statistics Cards with Colored Accents */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {/* Total Posts (Red accent) */}
        <div
          id="stat-total-posts"
          className="p-5 rounded-2xl bg-[#151515] border border-[#FF2B2B]/30 shadow-[0_0_20px_rgba(255,43,43,0.15)] flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF]">
              Total Posts
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#FF2B2B]/15 border border-[#FF2B2B]/30 flex items-center justify-center text-[#FF2B2B]">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-white">
              {stats.totalPosts}
            </div>
            <p className="text-[11px] text-[#FF2B2B] font-semibold mt-1">All authored articles</p>
          </div>
        </div>

        {/* Total Comments (Yellow accent) */}
        <div
          id="stat-total-comments"
          className="p-5 rounded-2xl bg-[#151515] border border-[#FFD60A]/30 shadow-[0_0_20px_rgba(255,214,10,0.15)] flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF]">
              Total Comments
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#FFD60A]/15 border border-[#FFD60A]/30 flex items-center justify-center text-[#FFD60A]">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-white">
              {stats.totalComments}
            </div>
            <p className="text-[11px] text-[#FFD60A] font-semibold mt-1">Discussions received</p>
          </div>
        </div>

        {/* Published Posts (Green accent) */}
        <div
          id="stat-published-posts"
          className="p-5 rounded-2xl bg-[#151515] border border-[#22C55E]/30 shadow-[0_0_20px_rgba(34,197,94,0.15)] flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF]">
              Published Posts
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#22C55E]/15 border border-[#22C55E]/30 flex items-center justify-center text-[#22C55E]">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-white">
              {stats.publishedPosts}
            </div>
            <p className="text-[11px] text-[#22C55E] font-semibold mt-1">Live in catalog</p>
          </div>
        </div>

        {/* Drafts (Orange accent) */}
        <div
          id="stat-drafts"
          className="p-5 rounded-2xl bg-[#151515] border border-[#FF7A00]/30 shadow-[0_0_20px_rgba(255,122,0,0.15)] flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF]">
              Drafts
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#FF7A00]/15 border border-[#FF7A00]/30 flex items-center justify-center text-[#FF7A00]">
              <FileEdit className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-white">
              {stats.drafts}
            </div>
            <p className="text-[11px] text-[#FF7A00] font-semibold mt-1">Works in progress</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar for User Posts */}
      <div className="bg-[#151515] border border-[#292929] rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your posts..."
            className="w-full bg-[#0D0D0D] border border-[#292929] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-[#9CA3AF] focus:outline-none focus:border-[#FF2B2B]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              statusFilter === 'all'
                ? 'bg-[#FF2B2B] text-white border-[#FF2B2B]'
                : 'bg-[#0D0D0D] text-[#9CA3AF] border-[#292929]'
            }`}
          >
            All ({posts.length})
          </button>
          <button
            onClick={() => setStatusFilter('published')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              statusFilter === 'published'
                ? 'bg-[#22C55E]/20 text-[#22C55E] border-[#22C55E]/50'
                : 'bg-[#0D0D0D] text-[#9CA3AF] border-[#292929]'
            }`}
          >
            Published ({stats.publishedPosts})
          </button>
          <button
            onClick={() => setStatusFilter('draft')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              statusFilter === 'draft'
                ? 'bg-[#FF7A00]/20 text-[#FF7A00] border-[#FF7A00]/50'
                : 'bg-[#0D0D0D] text-[#9CA3AF] border-[#292929]'
            }`}
          >
            Drafts ({stats.drafts})
          </button>
        </div>
      </div>

      {/* Posts Table / Cards */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl bg-[#151515] border border-[#292929]">
          <BookOpen className="w-12 h-12 text-[#9CA3AF]/40 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No articles found</h3>
          <p className="text-xs text-[#9CA3AF] mb-6">
            {posts.length === 0
              ? "You haven't written any blog posts yet. Start by creating your first article!"
              : 'No posts match your current search and filter criteria.'}
          </p>
          <Link
            to="/create"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF2B2B] to-[#FF7A00] text-white text-xs font-bold uppercase tracking-wider shadow-lg"
          >
            <Plus className="w-4 h-4" /> Create Post
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => {
            const catStyle = CATEGORY_COLORS[post.category] || CATEGORY_COLORS.Other;
            const isDraft = post.status === 'draft';

            return (
              <div
                key={post._id}
                id={`my-post-row-${post._id}`}
                className="group p-5 rounded-2xl bg-[#151515] border border-[#292929] hover:border-[#FF2B2B]/40 hover:shadow-[0_0_20px_rgba(255,43,43,0.15)] transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
              >
                {/* Left: Image & Post Info */}
                <div className="flex items-start sm:items-center gap-4 flex-1">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover border border-[#292929] shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}
                      >
                        {post.category}
                      </span>
                      {isDraft ? (
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#FF7A00]/15 text-[#FF7A00] border border-[#FF7A00]/30">
                          Draft
                        </span>
                      ) : (
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30">
                          Live
                        </span>
                      )}
                      <span className="text-[11px] text-[#9CA3AF]">
                        {formatDate(post.createdAt)}
                      </span>
                    </div>

                    <Link to={`/post/${post._id}`}>
                      <h3 className="text-base font-bold text-white group-hover:text-[#FF7A00] transition-colors truncate">
                        {post.title}
                      </h3>
                    </Link>

                    <div className="flex items-center gap-4 text-xs text-[#9CA3AF]">
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5 text-[#FFD60A]" />
                        {post.commentsCount ?? 0} comments
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-[#22C55E]" />
                        {post.views ?? 0} views
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#FF7A00]" />
                        {post.readTime || '4 min'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions: View (Green), Edit (Yellow/Orange), Delete (Red) */}
                <div className="flex items-center gap-2 self-end md:self-center border-t md:border-t-0 pt-3 md:pt-0 border-[#292929] w-full md:w-auto justify-end">
                  {/* View (Green) */}
                  <Link
                    id={`btn-view-post-${post._id}`}
                    to={`/post/${post._id}`}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#22C55E]/15 border border-[#22C55E]/40 text-[#22C55E] hover:bg-[#22C55E]/25 text-xs font-semibold transition-all shadow-[0_0_10px_rgba(34,197,94,0.15)]"
                    title="View Public Post"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View</span>
                  </Link>

                  {/* Edit (Yellow/Orange) */}
                  <Link
                    id={`btn-edit-post-${post._id}`}
                    to={`/edit/${post._id}`}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FFD60A]/15 border border-[#FFD60A]/40 text-[#FFD60A] hover:bg-[#FFD60A]/25 text-xs font-semibold transition-all shadow-[0_0_10px_rgba(255,214,10,0.15)]"
                    title="Edit Post"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </Link>

                  {/* Delete (Red) */}
                  <button
                    id={`btn-delete-post-${post._id}`}
                    onClick={() => setPostToDelete(post)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FF2B2B]/15 border border-[#FF2B2B]/40 text-[#FF2B2B] hover:bg-[#FF2B2B]/25 text-xs font-semibold transition-all shadow-[0_0_10px_rgba(255,43,43,0.15)]"
                    title="Delete Post"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!postToDelete}
        title="Delete Blog Post"
        message={`Are you sure you want to permanently delete "${postToDelete?.title}"? All reader comments and metrics will be wiped.`}
        confirmLabel="Delete Post"
        isDeleting={isDeleting}
        onConfirm={handleDeletePost}
        onCancel={() => setPostToDelete(null)}
      />
    </div>
  );
};
