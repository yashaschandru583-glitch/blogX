import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Post, CategoryType } from '../types';
import { api } from '../services/api';
import { BlogCard } from '../components/BlogCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { CATEGORY_COLORS } from '../utils/theme';
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  Sparkles, 
  BookOpen, 
  Layers, 
  Clock, 
  TrendingUp, 
  MessageSquare,
  Tag as TagIcon
} from 'lucide-react';

export const ExplorePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';
  const initialTag = searchParams.get('tag') || '';
  const initialSort = searchParams.get('sort') || 'latest';

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedTag, setSelectedTag] = useState<string>(initialTag);
  const [selectedSort, setSelectedSort] = useState<string>(initialSort);

  const categories: string[] = [
    'All',
    'Technology',
    'Programming',
    'Education',
    'Travel',
    'Lifestyle',
    'Business',
    'Other'
  ];

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await api.getPosts({
        search: searchQuery.trim() || undefined,
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        tag: selectedTag || undefined,
        sort: selectedSort
      });
      setPosts(data);
    } catch (err) {
      console.error('Failed to search posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Update URL parameters
    const params: Record<string, string> = {};
    if (searchQuery.trim()) params.search = searchQuery.trim();
    if (selectedCategory && selectedCategory !== 'All') params.category = selectedCategory;
    if (selectedTag) params.tag = selectedTag;
    if (selectedSort !== 'latest') params.sort = selectedSort;
    setSearchParams(params);

    fetchPosts();
  }, [selectedCategory, selectedTag, selectedSort]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPosts();
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedTag('');
    setSelectedSort('latest');
    setSearchParams({});
  };

  // Collect all unique tags from currently loaded or all posts
  const availableTags: string[] = Array.from(
    new Set<string>(posts.flatMap((p) => p.tags || []))
  ).slice(0, 10);

  return (
    <div id="explore-page" className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-[#FF7A00]" />
          <p className="text-xs uppercase font-bold tracking-widest text-[#FF7A00]">
            Knowledge Directory
          </p>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Explore Articles & Discussions
        </h1>
        <p className="text-sm text-[#9CA3AF] mt-1">
          Search across titles, content, categories, author profiles, and specialized topics.
        </p>
      </div>

      {/* Search Bar & Filter Controls */}
      <div className="bg-[#151515] border border-[#292929] rounded-2xl p-5 mb-8 shadow-lg space-y-4">
        {/* Search Input Form */}
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
            <input
              id="input-explore-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, keywords, authors, or topics..."
              className="w-full bg-[#050505] border border-[#292929] rounded-xl pl-12 pr-10 py-3 text-sm text-white placeholder-[#9CA3AF] focus:outline-none focus:border-[#FF2B2B] focus:ring-1 focus:ring-[#FF2B2B] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            id="btn-submit-search"
            type="submit"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF2B2B] to-[#FF7A00] hover:brightness-110 text-white text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(255,43,43,0.35)] transition-all flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            Search
          </button>
        </form>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            let styleClass = isSelected
              ? 'bg-[#FF2B2B] text-white border-[#FF2B2B] shadow-[0_0_12px_rgba(255,43,43,0.35)]'
              : 'bg-[#0D0D0D] text-[#9CA3AF] border-[#292929] hover:text-white hover:border-[#9CA3AF]/40';

            return (
              <button
                key={cat}
                id={`btn-explore-cat-${cat.toLowerCase()}`}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${styleClass}`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Secondary Filters (Tags, Sort, Reset) */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#292929]/80 text-xs">
          {/* Tag filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[#9CA3AF] flex items-center gap-1 font-medium">
              <TagIcon className="w-3.5 h-3.5 text-[#FFD60A]" /> Popular tags:
            </span>
            {availableTags.map((t) => {
              const active = selectedTag.toLowerCase() === t.toLowerCase();
              return (
                <button
                  key={t}
                  onClick={() => setSelectedTag(active ? '' : t)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors border ${
                    active
                      ? 'bg-[#FFD60A]/20 text-[#FFD60A] border-[#FFD60A]/50'
                      : 'bg-[#0D0D0D] text-[#9CA3AF] border-[#292929] hover:text-white hover:border-[#9CA3AF]'
                  }`}
                >
                  #{t}
                </button>
              );
            })}
          </div>

          {/* Sort Selector & Clear */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#0D0D0D] border border-[#292929] rounded-xl px-3 py-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#FF7A00]" />
              <select
                id="select-explore-sort"
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="bg-transparent text-xs text-white focus:outline-none cursor-pointer"
              >
                <option value="latest" className="bg-[#151515] text-white">Latest First</option>
                <option value="popular" className="bg-[#151515] text-white">Most Viewed</option>
                <option value="comments" className="bg-[#151515] text-white">Most Comments</option>
              </select>
            </div>

            {(selectedCategory !== 'All' || searchQuery || selectedTag || selectedSort !== 'latest') && (
              <button
                id="btn-clear-filters"
                onClick={handleClearFilters}
                className="text-xs text-[#FF2B2B] hover:underline flex items-center gap-1 font-semibold"
              >
                <X className="w-3.5 h-3.5" /> Clear filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm font-semibold text-[#E5E5E5]">
          Showing <span className="text-[#FF2B2B]">{posts.length}</span> {posts.length === 1 ? 'article' : 'articles'}
        </p>
      </div>

      {/* Results Grid / Loading / Empty */}
      {loading ? (
        <LoadingSpinner size="lg" label="Searching articles..." />
      ) : posts.length === 0 ? (
        <div id="no-posts-found" className="text-center py-20 px-4 rounded-3xl bg-[#151515] border border-dashed border-[#292929] max-w-xl mx-auto">
          <BookOpen className="w-14 h-14 text-[#9CA3AF]/30 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">No posts found</h2>
          <p className="text-xs text-[#9CA3AF] leading-relaxed mb-6">
            We couldn't find any articles matching your search or filters. Try adjusting your search keywords or removing selected filters.
          </p>
          <button
            id="btn-reset-explore-search"
            onClick={handleClearFilters}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF2B2B] to-[#FF7A00] text-white text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(255,43,43,0.35)]"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};
