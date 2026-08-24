import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { CategoryType, Post } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { PhotoUpload } from '../components/PhotoUpload';
import { InlinePhotoInserter } from '../components/InlinePhotoInserter';
import { CATEGORY_COLORS } from '../utils/theme';
import { 
  PenSquare, 
  Image as ImageIcon, 
  Tag as TagIcon, 
  Layers, 
  Eye, 
  ArrowLeft, 
  Sparkles, 
  Check, 
  Code,
  FileText
} from 'lucide-react';

const PRESET_IMAGES = [
  { label: 'Cloud & Servers', url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Coding & React', url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&auto=format&fit=crop&q=80' },
  { label: 'AI & Neural Nets', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Modern Office / SaaS', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Nomad / Travel', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Dark UI Design', url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200&auto=format&fit=crop&q=80' }
];

export const CreateEditPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [image, setImage] = useState(PRESET_IMAGES[0].url);
  const [category, setCategory] = useState<CategoryType>('Technology');
  const [tagsInput, setTagsInput] = useState('');
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [submitting, setSubmitting] = useState(false);
  const [fetchingPost, setFetchingPost] = useState(isEditing);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  const categories: CategoryType[] = [
    'Technology',
    'Programming',
    'Education',
    'Travel',
    'Lifestyle',
    'Business',
    'Other'
  ];

  // If editing, load post
  useEffect(() => {
    if (!isEditing || !id) return;
    const loadPost = async () => {
      setFetchingPost(true);
      try {
        const data = await api.getPostById(id);
        const p = data.post;
        
        // Ensure ownership
        if (user && p.author._id !== user._id) {
          showToast('error', 'Unauthorized. You can only edit your own posts.');
          navigate('/my-posts');
          return;
        }

        setTitle(p.title);
        setContent(p.content);
        setExcerpt(p.excerpt || '');
        setImage(p.image);
        setCategory(p.category);
        setTagsInput(p.tags.join(', '));
        setStatus(p.status || 'published');
      } catch (err: any) {
        showToast('error', 'Failed to load post for editing.');
        navigate('/my-posts');
      } finally {
        setFetchingPost(false);
      }
    };

    if (!authLoading) {
      if (!isAuthenticated) {
        showToast('warning', 'Please log in to write or edit articles.');
        navigate('/login');
      } else {
        loadPost();
      }
    }
  }, [id, isEditing, isAuthenticated, authLoading, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      showToast('warning', 'Please enter a post title.');
      return;
    }

    if (!content.trim()) {
      showToast('warning', 'Please provide article content.');
      return;
    }

    setSubmitting(true);
    try {
      const tagList = tagsInput
        .split(',')
        .map((t) => t.trim().replace(/^#/, ''))
        .filter(Boolean);

      if (isEditing && id) {
        const updated = await api.updatePost(id, {
          title: title.trim(),
          content: content.trim(),
          excerpt: excerpt.trim() || undefined,
          image: image.trim(),
          category,
          tags: tagList.length > 0 ? tagList : [category],
          status
        });
        showToast('success', 'Post updated successfully!');
        navigate(`/post/${updated._id}`);
      } else {
        const created = await api.createPost({
          title: title.trim(),
          content: content.trim(),
          excerpt: excerpt.trim() || undefined,
          image: image.trim(),
          category,
          tags: tagList.length > 0 ? tagList : [category],
          status
        });
        showToast('success', 'Post published successfully!');
        navigate(`/post/${created._id}`);
      }
    } catch (err: any) {
      showToast('error', err.message || 'Failed to save post.');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || fetchingPost) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner size="lg" label={isEditing ? 'Loading editor...' : 'Checking credentials...'} />
      </div>
    );
  }

  const categoryStyle = CATEGORY_COLORS[category] || CATEGORY_COLORS.Other;

  return (
    <div id="create-edit-post-page" className="min-h-screen max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link
            to="/my-posts"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9CA3AF] hover:text-white mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#FF7A00]" /> Back to My Dashboard
          </Link>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span className="w-3 h-8 bg-gradient-to-b from-[#FF2B2B] to-[#FF7A00] rounded-full" />
            {isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}
          </h1>
          <p className="text-xs text-[#9CA3AF] mt-1">
            Write, format with Markdown code fences, choose categories, and broadcast to the community.
          </p>
        </div>

        {/* Edit / Preview Tabs */}
        <div className="flex items-center gap-1 bg-[#151515] p-1 rounded-xl border border-[#292929]">
          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'edit'
                ? 'bg-[#FF2B2B] text-white shadow-[0_0_10px_rgba(255,43,43,0.3)]'
                : 'text-[#9CA3AF] hover:text-white'
            }`}
          >
            <PenSquare className="w-3.5 h-3.5" /> Editor
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'preview'
                ? 'bg-[#FF7A00] text-white shadow-[0_0_10px_rgba(255,122,0,0.3)]'
                : 'text-[#9CA3AF] hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> Preview
          </button>
        </div>
      </div>

      {activeTab === 'preview' ? (
        /* Live Article Preview */
        <div className="bg-[#151515] border border-[#292929] rounded-3xl p-6 sm:p-10 shadow-2xl mb-8 space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border bg-[#FF7A00]/15 text-[#FF7A00] border-[#FF7A00]/30">
            Preview Mode
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            {title || 'Untitled Post'}
          </h1>
          {image && (
            <img
              src={image}
              alt="Cover Preview"
              className="w-full max-h-96 object-cover rounded-2xl border border-[#292929]"
            />
          )}
          <div className="prose prose-invert max-w-none text-[#E5E5E5] whitespace-pre-wrap leading-relaxed">
            {content || 'Start typing in the editor to see your rendered preview here...'}
          </div>
        </div>
      ) : (
        /* Editor Form */
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Card */}
          <div className="bg-[#151515] border border-[#292929] rounded-2xl p-6 shadow-lg space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="post-title" className="block text-xs font-bold uppercase tracking-wider text-white mb-2">
                Post Title <span className="text-[#FF2B2B]">*</span>
              </label>
              <input
                id="post-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Deep Dive into High-Performance Vector Databases with Rust"
                className="w-full bg-[#0D0D0D] border border-[#292929] rounded-xl px-4 py-3 text-base font-semibold text-white placeholder-[#9CA3AF] focus:outline-none focus:border-[#FF2B2B] focus:ring-1 focus:ring-[#FF2B2B] transition-all"
                required
              />
            </div>

            {/* Category & Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white mb-2 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#FF7A00]" />
                  Category <span className="text-[#FF2B2B]">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {categories.map((cat) => {
                    const isSelected = category === cat;
                    const cStyle = CATEGORY_COLORS[cat] || CATEGORY_COLORS.Other;
                    return (
                      <button
                        key={cat}
                        type="button"
                        id={`btn-select-category-${cat.toLowerCase()}`}
                        onClick={() => setCategory(cat)}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                          isSelected
                            ? `${cStyle.bg} ${cStyle.text} ${cStyle.border} ${cStyle.glow} ring-1 ring-white/20`
                            : 'bg-[#0D0D0D] text-[#9CA3AF] border-[#292929] hover:text-white'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${cStyle.dot}`} />
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white mb-2 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#22C55E]" />
                  Publication Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setStatus('published')}
                    className={`px-4 py-2.5 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all ${
                      status === 'published'
                        ? 'bg-[#22C55E]/15 text-[#22C55E] border-[#22C55E]/40 shadow-[0_0_12px_rgba(34,197,94,0.25)]'
                        : 'bg-[#0D0D0D] text-[#9CA3AF] border-[#292929]'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                    Published (Live)
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('draft')}
                    className={`px-4 py-2.5 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all ${
                      status === 'draft'
                        ? 'bg-[#FF7A00]/15 text-[#FF7A00] border-[#FF7A00]/40 shadow-[0_0_12px_rgba(255,122,0,0.25)]'
                        : 'bg-[#0D0D0D] text-[#9CA3AF] border-[#292929]'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-[#FF7A00]" />
                    Draft (Private)
                  </button>
                </div>
              </div>
            </div>

            {/* Featured Photo Upload (Drag & Drop, File Picker, Presets, URL) */}
            <div className="pt-2">
              <PhotoUpload
                value={image}
                onChange={(newUrl) => setImage(newUrl)}
                label="Featured Cover Photo"
                required
                mode="cover"
                idPrefix="post-cover-upload"
              />
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="post-tags" className="block text-xs font-bold uppercase tracking-wider text-white mb-2 flex items-center gap-1.5">
                <TagIcon className="w-3.5 h-3.5 text-[#FF7A00]" />
                Tags (Comma separated)
              </label>
              <input
                id="post-tags"
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g. React, TypeScript, Performance, Backend"
                className="w-full bg-[#0D0D0D] border border-[#292929] rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#9CA3AF] focus:outline-none focus:border-[#FF2B2B] transition-all"
              />
            </div>

            {/* Excerpt / Summary */}
            <div>
              <label htmlFor="post-excerpt" className="block text-xs font-bold uppercase tracking-wider text-white mb-2">
                Short Excerpt (Optional)
              </label>
              <input
                id="post-excerpt"
                type="text"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="A brief 1-2 sentence overview for the card summary..."
                className="w-full bg-[#0D0D0D] border border-[#292929] rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#9CA3AF] focus:outline-none focus:border-[#FF2B2B] transition-all"
              />
            </div>

            {/* Content Textarea with Inline Photo Insertion */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <label htmlFor="post-content" className="block text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-[#22C55E]" />
                  Article Content (Markdown supported) <span className="text-[#FF2B2B]">*</span>
                </label>
                
                {/* Inline Photo Inserter Tool */}
                <div className="flex items-center gap-2">
                  <InlinePhotoInserter
                    onInsert={(mdSnippet) => {
                      setContent((prev) => prev + mdSnippet);
                    }}
                  />
                  <span className="hidden sm:inline text-[11px] text-[#9CA3AF]">
                    ## Headers, &gt; Quotes, ```code
                  </span>
                </div>
              </div>
              <textarea
                id="post-content"
                rows={14}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="## Introduction&#10;&#10;Write your deep technical or creative article here...&#10;&#10;```typescript&#10;console.log('Hello BLOGX');&#10;```"
                className="w-full bg-[#0D0D0D] border border-[#292929] rounded-xl p-4 text-sm font-mono text-white placeholder-[#9CA3AF] focus:outline-none focus:border-[#FF2B2B] focus:ring-1 focus:ring-[#FF2B2B] transition-all"
                required
              />
            </div>
          </div>

          {/* Form Action Buttons */}
          <div className="flex items-center justify-between pt-4">
            <Link
              id="btn-cancel-post"
              to="/my-posts"
              className="px-6 py-3 rounded-xl bg-[#151515] border border-[#292929] hover:border-[#9CA3AF] text-[#E5E5E5] text-xs font-bold uppercase tracking-wider transition-all"
            >
              Cancel
            </Link>

            <button
              id="btn-publish-post"
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#FF2B2B] to-[#FF7A00] hover:brightness-110 text-white text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(255,43,43,0.4)] transition-all disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              {submitting ? 'Saving...' : isEditing ? 'Update Post' : 'Publish Post'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
