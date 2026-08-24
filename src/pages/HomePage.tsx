import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Post, CategoryType } from '../types';
import { api } from '../services/api';
import { BlogCard } from '../components/BlogCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { CATEGORY_COLORS } from '../utils/theme';
import { 
  PenSquare, 
  Compass, 
  Sparkles, 
  TrendingUp, 
  Flame, 
  BookOpen, 
  MessageSquare, 
  Users, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories: string[] = [
    'All',
    'Technology',
    'Programming',
    'Education',
    'Travel',
    'Lifestyle',
    'Business'
  ];

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const data = await api.getPosts();
        setPosts(data);
      } catch (err) {
        console.error('Failed to load home posts:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const filteredPosts = selectedCategory === 'All'
    ? posts
    : posts.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());

  const featuredPost = posts.length > 0 ? posts[0] : null;
  const recentPosts = posts.length > 1 ? filteredPosts.filter((p) => p._id !== featuredPost?._id) : filteredPosts;

  const totalComments = posts.reduce((sum, p) => sum + (p.commentsCount || 0), 0);
  const totalViews = posts.reduce((sum, p) => sum + (p.views || 0), 0);

  return (
    <div id="home-page" className="min-h-screen pb-16">
      {/* Hero Bento Grid Section */}
      <section
        id="hero-section"
        className="relative pt-8 pb-12 md:pt-12 md:pb-16 overflow-hidden border-b border-[#292929]/80 bg-gradient-to-b from-[#0D0D0D] via-[#050505] to-[#050505]"
      >
        {/* Abstract Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-[#FF2B2B]/15 via-[#FF7A00]/10 to-transparent blur-[130px] pointer-events-none -z-10" />
        <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-[#FFD60A]/5 blur-[120px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Bento Grid Header Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            
            {/* Bento Card 1: Main Hero Banner (spans 8 cols on lg) */}
            <div className="lg:col-span-8 rounded-3xl bg-[#121212]/90 border border-[#292929] p-7 md:p-10 flex flex-col justify-between relative overflow-hidden shadow-2xl backdrop-blur-sm group hover:border-[#FF2B2B]/40 transition-all duration-300">
              <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#FF2B2B]/10 rounded-full blur-3xl pointer-events-none" />
              
              <div>
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1A1A1A] border border-[#333333] mb-6 shadow-[0_0_15px_rgba(255,43,43,0.15)]">
                  <span className="w-2 h-2 rounded-full bg-[#FF2B2B] animate-ping" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#E5E5E5] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#FFD60A]" />
                    The Modern Engineering & Developer Blog
                  </span>
                </div>

                {/* Hero Headline */}
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] mb-5">
                  Share Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2B2B] via-[#FF7A00] to-[#FFD60A]">Engineering Ideas.</span>
                  <br />
                  Start <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF7A00] to-[#22C55E]">Conversations.</span>
                </h1>

                {/* Description */}
                <p className="text-sm sm:text-base text-[#9CA3AF] max-w-2xl leading-relaxed mb-8">
                  Publish deep technical insights, discover modern engineering workflows, and join a vibrant community of software builders, creators, and leaders.
                </p>
              </div>

              {/* Hero CTAs */}
              <div className="flex flex-col sm:flex-row items-center gap-3.5 pt-4 border-t border-[#222222]">
                <Link
                  id="btn-hero-start-writing"
                  to={isAuthenticated ? '/create' : '/register'}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-[#FF2B2B] to-[#FF7A00] hover:brightness-110 text-white font-bold text-sm shadow-[0_0_20px_rgba(255,43,43,0.35)] transition-all transform hover:-translate-y-0.5"
                >
                  <PenSquare className="w-4 h-4" />
                  Start Writing
                </Link>

                <Link
                  id="btn-hero-explore"
                  to="/explore"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-[#1A1A1A] border border-[#333333] hover:border-[#FF2B2B] text-white font-semibold text-sm shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:bg-[#222222] transition-all"
                >
                  <Compass className="w-4 h-4 text-[#FF7A00]" />
                  Explore Articles
                </Link>
              </div>
            </div>

            {/* Right Bento Column: Stats & Trending (spans 4 cols on lg) */}
            <div className="lg:col-span-4 flex flex-col gap-5">
              
              {/* Bento Card 2: Live Platform Stats Tile */}
              <div className="rounded-3xl bg-[#121212]/90 border border-[#292929] p-6 flex-1 flex flex-col justify-between shadow-xl hover:border-[#FFD60A]/40 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#FFD60A] flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-[#FFD60A]" /> Platform Activity
                  </span>
                  <span className="text-[11px] font-mono text-[#22C55E] bg-[#22C55E]/10 border border-[#22C55E]/20 px-2 py-0.5 rounded-full">
                    LIVE
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-[#0B0B0B] border border-[#222222]">
                    <div className="text-2xl font-extrabold text-[#FF2B2B]">{posts.length}</div>
                    <div className="text-[11px] text-[#9CA3AF] mt-0.5 flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-[#FF2B2B]" /> Articles
                    </div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#0B0B0B] border border-[#222222]">
                    <div className="text-2xl font-extrabold text-[#FFD60A]">{totalComments}</div>
                    <div className="text-[11px] text-[#9CA3AF] mt-0.5 flex items-center gap-1">
                      <MessageSquare className="w-3 h-3 text-[#FFD60A]" /> Comments
                    </div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#0B0B0B] border border-[#222222]">
                    <div className="text-2xl font-extrabold text-[#22C55E]">{totalViews.toLocaleString()}</div>
                    <div className="text-[11px] text-[#9CA3AF] mt-0.5 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-[#22C55E]" /> Views
                    </div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#0B0B0B] border border-[#222222]">
                    <div className="text-2xl font-extrabold text-[#FF7A00]">100%</div>
                    <div className="text-[11px] text-[#9CA3AF] mt-0.5 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-[#FF7A00]" /> Full-Stack
                    </div>
                  </div>
                </div>
              </div>

              {/* Bento Card 3: Quick Topic Explorer Tile */}
              <div className="rounded-3xl bg-gradient-to-br from-[#151515] to-[#111111] border border-[#292929] p-6 shadow-xl hover:border-[#FF7A00]/40 transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#FF7A00] flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5" /> Popular Categories
                  </span>
                  <Link to="/explore" className="text-[11px] text-[#9CA3AF] hover:text-white flex items-center gap-1">
                    All <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {['Technology', 'Programming', 'Education', 'Lifestyle', 'Business'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1 rounded-xl text-xs font-medium border transition-all ${
                        selectedCategory === cat
                          ? 'bg-[#FF2B2B] text-white border-[#FF2B2B]'
                          : 'bg-[#0B0B0B] text-[#9CA3AF] border-[#222222] hover:text-white hover:border-[#FF7A00]/40'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        {loading ? (
          <LoadingSpinner size="lg" label="Fetching latest stories..." />
        ) : (
          <>
            {/* Featured Post Spotlight Banner */}
            {featuredPost && selectedCategory === 'All' && (
              <section id="featured-post-section" className="mb-16">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FFD60A] animate-pulse" />
                    <h2 className="text-sm font-bold uppercase tracking-wider text-[#FFD60A] flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-[#FF2B2B]" /> Featured Story
                    </h2>
                  </div>
                  <Link
                    to="/explore"
                    className="text-xs font-semibold text-[#9CA3AF] hover:text-white flex items-center gap-1 transition-colors"
                  >
                    View All <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <BlogCard post={featuredPost} featured={true} />
              </section>
            )}

            {/* Category Filter Pills */}
            <section id="category-filter-section" className="mb-10">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-wide">
                    Recent Articles
                  </h2>
                  <p className="text-xs text-[#9CA3AF]">
                    Curated engineering, design, and architecture articles
                  </p>
                </div>

                <Link
                  id="link-explore-all-btn"
                  to="/explore"
                  className="px-4 py-2 rounded-xl bg-[#151515] border border-[#292929] text-xs font-semibold text-white hover:border-[#FF2B2B]/50 transition-all flex items-center gap-1.5"
                >
                  <Compass className="w-3.5 h-3.5 text-[#FF7A00]" />
                  Advanced Filter
                </Link>
              </div>

              {/* Pills Carousel */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  let styleClass = isSelected
                    ? 'bg-[#FF2B2B] text-white border-[#FF2B2B] shadow-[0_0_15px_rgba(255,43,43,0.35)]'
                    : 'bg-[#151515] text-[#9CA3AF] border-[#292929] hover:text-white hover:border-[#9CA3AF]/40';

                  return (
                    <button
                      key={cat}
                      id={`btn-cat-filter-${cat.toLowerCase()}`}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap border ${styleClass}`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Articles Grid */}
            <section id="articles-grid-section">
              {recentPosts.length === 0 ? (
                <div className="text-center py-16 px-4 rounded-2xl bg-[#151515] border border-[#292929]">
                  <BookOpen className="w-12 h-12 text-[#9CA3AF]/40 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-white mb-1">No posts found</h3>
                  <p className="text-xs text-[#9CA3AF] mb-6">
                    There are currently no articles in this category.
                  </p>
                  <button
                    onClick={() => setSelectedCategory('All')}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF2B2B] to-[#FF7A00] text-white text-xs font-semibold shadow-lg"
                  >
                    Reset Filter
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recentPosts.map((post) => (
                    <BlogCard key={post._id} post={post} />
                  ))}
                </div>
              )}
            </section>

            {/* Bottom Callout Banner */}
            <section className="mt-20 p-8 md:p-12 rounded-3xl bg-gradient-to-r from-[#151515] via-[#1A1A1A] to-[#151515] border border-[#FF2B2B]/30 relative overflow-hidden shadow-[0_0_30px_rgba(255,43,43,0.15)]">
              <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#FF7A00]/10 to-transparent pointer-events-none" />
              <div className="max-w-2xl relative z-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#22C55E]/15 border border-[#22C55E]/30 text-[#22C55E] text-xs font-semibold mb-3">
                  <Sparkles className="w-3.5 h-3.5" /> Start Your Writing Journey
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
                  Have insights or code patterns to share with the world?
                </h2>
                <p className="text-sm text-[#9CA3AF] mb-6 leading-relaxed">
                  Join thousands of software engineers, founders, and authors who publish their knowledge, write-ups, and architectural patterns on BLOGX.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    to={isAuthenticated ? '/create' : '/register'}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF2B2B] to-[#FF7A00] text-white text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(255,43,43,0.35)] hover:brightness-110 transition-all"
                  >
                    Write an Article Now
                  </Link>
                  <Link
                    to="/explore"
                    className="px-6 py-3 rounded-xl bg-[#0D0D0D] border border-[#292929] hover:border-white/30 text-white text-xs font-semibold transition-all"
                  >
                    Browse Community
                  </Link>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};
