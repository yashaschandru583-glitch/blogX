import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Post } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { CATEGORY_COLORS, formatDate } from '../utils/theme';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { CommentSection } from '../components/CommentSection';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { BlogCard } from '../components/BlogCard';
import { 
  Clock, 
  Eye, 
  Calendar, 
  Edit3, 
  Trash2, 
  ArrowLeft, 
  Share2, 
  Bookmark, 
  Check, 
  Copy,
  Tag as TagIcon
} from 'lucide-react';

export const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [post, setPost] = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchPost = async () => {
      setLoading(true);
      try {
        const data = await api.getPostById(id);
        setPost(data.post);
        setRelatedPosts(data.related || []);
      } catch (err: any) {
        showToast('error', err.message || 'Article not found');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const handleDeletePost = async () => {
    if (!post) return;
    setIsDeleting(true);
    try {
      await api.deletePost(post._id);
      showToast('success', 'Post deleted successfully!');
      setIsDeleteModalOpen(false);
      navigate('/my-posts');
    } catch (err: any) {
      showToast('error', err.message || 'Unable to delete post.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      showToast('info', 'Link copied to clipboard!');
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const copyCodeToClipboard = (code: string, index: number) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCodeIndex(index);
      setTimeout(() => setCopiedCodeIndex(null), 2500);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner size="lg" label="Loading article..." />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-[70vh] max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Article Not Found</h2>
        <p className="text-sm text-[#9CA3AF] mb-6">
          The requested article may have been removed or is temporarily unavailable.
        </p>
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF2B2B] to-[#FF7A00] text-white text-xs font-bold uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Explore
        </Link>
      </div>
    );
  }

  const isAuthor = isAuthenticated && user && user._id === post.author._id;
  const categoryStyle = CATEGORY_COLORS[post.category] || CATEGORY_COLORS.Other;

  // Custom parser to format headers, paragraphs, quotes, and code blocks
  const renderFormattedContent = (raw: string) => {
    const lines = raw.split('\n');
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeLanguage = '';
    let codeBuffer: string[] = [];
    let codeBlockCount = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Code blocks
      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          // close block
          const codeString = codeBuffer.join('\n');
          const currentIndex = codeBlockCount++;
          elements.push(
            <div key={`code-${i}`} className="my-6 rounded-2xl overflow-hidden bg-[#0A0A0A] border border-[#292929] shadow-2xl">
              <div className="flex items-center justify-between px-4 py-2 bg-[#121212] border-b border-[#292929] text-xs">
                <span className="font-mono text-[#FFD60A] font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#FFD60A]" />
                  {codeLanguage || 'code'}
                </span>
                <button
                  type="button"
                  onClick={() => copyCodeToClipboard(codeString, currentIndex)}
                  className="flex items-center gap-1 text-[#9CA3AF] hover:text-white transition-colors py-1 px-2 rounded hover:bg-[#1E1E1E]"
                >
                  {copiedCodeIndex === currentIndex ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#22C55E]" />
                      <span className="text-[#22C55E] text-[11px]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span className="text-[11px]">Copy Code</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 overflow-x-auto text-xs sm:text-sm font-mono text-[#E5E5E5] leading-relaxed">
                <code>{codeString}</code>
              </pre>
            </div>
          );
          codeBuffer = [];
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
          codeLanguage = line.trim().replace('```', '') || 'typescript';
        }
        continue;
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        continue;
      }

      // Headings
      if (line.startsWith('### ')) {
        elements.push(
          <h3 key={i} className="text-xl sm:text-2xl font-bold text-white mt-8 mb-3 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-[#FF7A00] rounded-full" />
            {line.replace('### ', '')}
          </h3>
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          <h2 key={i} className="text-2xl sm:text-3xl font-extrabold text-white mt-10 mb-4 flex items-center gap-2 pb-2 border-b border-[#292929]">
            <span className="w-2 h-6 bg-gradient-to-b from-[#FF2B2B] to-[#FF7A00] rounded-full" />
            {line.replace('## ', '')}
          </h2>
        );
      } else if (line.startsWith('# ')) {
        elements.push(
          <h1 key={i} className="text-3xl sm:text-4xl font-extrabold text-white mt-12 mb-6">
            {line.replace('# ', '')}
          </h1>
        );
      } else if (line.startsWith('> ')) {
        // Blockquote
        elements.push(
          <blockquote key={i} className="my-6 p-4 rounded-xl bg-[#151515] border-l-4 border-[#FF2B2B] text-[#E5E5E5] italic text-base leading-relaxed">
            {line.replace('> ', '')}
          </blockquote>
        );
      } else if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        // Bullet list
        elements.push(
          <li key={i} className="text-base text-[#E5E5E5] leading-relaxed ml-6 my-1.5 list-disc marker:text-[#FF7A00]">
            {line.trim().substring(2)}
          </li>
        );
      } else if (/^\d+\.\s/.test(line.trim())) {
        // Numbered list
        elements.push(
          <li key={i} className="text-base text-[#E5E5E5] leading-relaxed ml-6 my-1.5 list-decimal marker:text-[#FFD60A]">
            {line.trim().replace(/^\d+\.\s/, '')}
          </li>
        );
      } else if (line.trim().length === 0) {
        // Empty line spacer
        elements.push(<div key={i} className="h-4" />);
      } else {
        // Normal paragraph
        elements.push(
          <p key={i} className="text-base sm:text-lg text-[#E5E5E5] leading-relaxed my-3 font-normal">
            {line}
          </p>
        );
      }
    }

    return elements;
  };

  return (
    <div id="post-detail-page" className="min-h-screen pb-20">
      {/* Top Navigation Bar */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-4 flex items-center justify-between">
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#9CA3AF] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[#FF7A00]" /> Back to Articles
        </Link>

        <div className="flex items-center gap-3">
          <button
            id="btn-share-post"
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#151515] border border-[#292929] hover:border-[#FF7A00]/40 text-xs font-medium text-white transition-all"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-[#22C55E]" /> : <Share2 className="w-3.5 h-3.5 text-[#FF7A00]" />}
            {copiedLink ? 'Copied' : 'Share'}
          </button>

          {isAuthor && (
            <div className="flex items-center gap-2">
              <Link
                id="btn-edit-post"
                to={`/edit/${post._id}`}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FFD60A]/15 border border-[#FFD60A]/40 text-[#FFD60A] hover:bg-[#FFD60A]/25 text-xs font-semibold transition-all shadow-[0_0_12px_rgba(255,214,10,0.2)]"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit
              </Link>
              <button
                id="btn-delete-post"
                onClick={() => setIsDeleteModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FF2B2B]/15 border border-[#FF2B2B]/40 text-[#FF2B2B] hover:bg-[#FF2B2B]/25 text-xs font-semibold transition-all shadow-[0_0_12px_rgba(255,43,43,0.2)]"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Article Header */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6">
        <header className="mb-8">
          {/* Category Pill */}
          <div className="mb-4">
            <span
              className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.border} ${categoryStyle.glow}`}
            >
              <span className={`w-2 h-2 rounded-full ${categoryStyle.dot}`} />
              {post.category}
            </span>
          </div>

          {/* Article Title */}
          <h1
            id="article-title"
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.2] mb-6"
          >
            {post.title}
          </h1>

          {/* Author info & Metadata row */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#151515] border border-[#292929]">
            <div className="flex items-center gap-3.5">
              <img
                src={post.author.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(post.author.name)}`}
                alt={post.author.name}
                className="w-11 h-11 rounded-full border border-[#292929] object-cover"
                referrerPolicy="no-referrer"
              />
              <div>
                <p className="text-sm font-bold text-white flex items-center gap-2">
                  {post.author.name}
                  {post.author.bio && (
                    <span className="hidden sm:inline-block text-xs font-normal text-[#9CA3AF] border-l border-[#292929] pl-2">
                      {post.author.bio}
                    </span>
                  )}
                </p>
                <div className="flex items-center gap-3 text-xs text-[#9CA3AF] mt-0.5">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#FF7A00]" />
                    {formatDate(post.createdAt)}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#FFD60A]" />
                    {post.readTime || '5 min read'}
                  </span>
                  {post.views !== undefined && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-[#22C55E]" />
                        {post.views} views
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="mb-10 rounded-3xl overflow-hidden bg-[#0D0D0D] border border-[#292929] shadow-2xl relative">
          <img
            src={post.image}
            alt={post.title}
            className="w-full max-h-[500px] object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Article Body Content */}
        <div id="article-body" className="prose prose-invert max-w-none text-[#E5E5E5] leading-relaxed">
          {renderFormattedContent(post.content)}
        </div>

        {/* Tags Footer */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 pt-6 border-t border-[#292929] flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-[#9CA3AF] flex items-center gap-1.5 mr-2">
              <TagIcon className="w-4 h-4 text-[#FFD60A]" /> Tags:
            </span>
            {post.tags.map((tag, idx) => (
              <Link
                key={idx}
                to={`/explore?tag=${encodeURIComponent(tag)}`}
                className="text-xs font-mono text-[#E5E5E5] bg-[#151515] hover:bg-[#1E1E1E] hover:text-[#FF7A00] px-3 py-1.5 rounded-xl border border-[#292929] transition-all"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        {/* Author Bio Box */}
        <div className="mt-12 p-6 rounded-2xl bg-[#151515] border border-[#292929] flex items-start gap-4">
          <img
            src={post.author.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(post.author.name)}`}
            alt={post.author.name}
            className="w-14 h-14 rounded-full border border-[#292929] object-cover shrink-0"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-base font-bold text-white">Written by {post.author.name}</h3>
            </div>
            <p className="text-xs text-[#9CA3AF] leading-relaxed">
              {post.author.bio || 'Author on BLOGX. Building modern web experiences and writing about software architecture and systems.'}
            </p>
          </div>
        </div>

        {/* Comments Component */}
        <CommentSection
          postId={post._id}
          postAuthorId={post.author._id}
          onCommentCountChange={(count) => {
            setPost((prev) => (prev ? { ...prev, commentsCount: count } : prev));
          }}
        />

        {/* Related Articles Section */}
        {relatedPosts.length > 0 && (
          <section className="mt-16 pt-10 border-t border-[#292929]">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF7A00]" />
              More in {post.category}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((r) => (
                <BlogCard key={r._id} post={r} />
              ))}
            </div>
          </section>
        )}
      </article>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Article"
        message={`Are you sure you want to permanently delete "${post.title}"? All associated comments and statistics will also be deleted.`}
        confirmLabel="Delete Article"
        isDeleting={isDeleting}
        onConfirm={handleDeletePost}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};
