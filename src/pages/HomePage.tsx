import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types';
import { api } from '../services/api';
import { BlogCard } from '../components/BlogCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import {
  PenSquare,
  Compass,
  Sparkles,
  TrendingUp,
  Flame,
  BookOpen,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All',
    'Technology',
    'Programming',
    'Education',
    'Travel',
    'Lifestyle',
    'Business',
  ];

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);

      try {
        const data = await api.getPosts();
        setPosts(data);
      } catch (error) {
        console.error('Failed to load home posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const filteredPosts =
    selectedCategory === 'All'
      ? posts
      : posts.filter(
          (post) =>
            post.category?.toLowerCase() ===
            selectedCategory.toLowerCase()
        );

  const featuredPost =
    selectedCategory === 'All' && posts.length > 0 ? posts[0] : null;

  const recentPosts = featuredPost
    ? filteredPosts.filter((post) => post._id !== featuredPost._id)
    : filteredPosts;

  const totalComments = posts.reduce(
    (sum, post) => sum + (post.commentsCount || 0),
    0
  );

  const totalViews = posts.reduce(
    (sum, post) => sum + (post.views || 0),
    0
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white">

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden border-b border-[#222]">
        
        {/* Background glow */}
        <div className="pointer-events-none absolute left-1/3 top-0 h-[350px] w-[500px] rounded-full bg-[#FF2B2B]/10 blur-[120px]" />
        <div className="pointer-events-none absolute right-0 top-20 h-[300px] w-[300px] rounded-full bg-[#FF7A00]/10 blur-[110px]" />

        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">

          <div className="grid gap-5 lg:grid-cols-12">

            {/* MAIN HERO */}
            <div className="relative overflow-hidden rounded-2xl border border-[#292929] bg-[#101010] p-6 shadow-2xl sm:p-8 lg:col-span-8">

              <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#FF2B2B]/10 blur-3xl" />

              {/* Badge */}
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#333] bg-[#171717] px-3 py-1.5">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#22C55E]" />

                <Sparkles className="h-3.5 w-3.5 text-[#FFD60A]" />

                <span className="text-[11px] font-bold uppercase tracking-wider text-[#D4D4D4]">
                  Modern Engineering & Developer Blog
                </span>
              </div>

              {/* Heading */}
              <h1 className="max-w-4xl text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-[54px]">
                Share Your{' '}
                <span className="bg-gradient-to-r from-[#FF2B2B] via-[#FF7A00] to-[#FFD60A] bg-clip-text text-transparent">
                  Engineering Ideas.
                </span>

                <br />

                Start{' '}
                <span className="bg-gradient-to-r from-[#FF7A00] to-[#22C55E] bg-clip-text text-transparent">
                  Conversations.
                </span>
              </h1>

              {/* Description */}
              <p className="mt-5 max-w-2xl text-sm leading-6 text-[#9CA3AF] sm:text-base">
                Publish technical insights, discover modern engineering
                workflows, and connect with software builders, creators,
                and technology enthusiasts.
              </p>

              {/* Buttons */}
              <div className="mt-7 flex flex-wrap gap-3 border-t border-[#242424] pt-6">

                <Link
                  to={isAuthenticated ? '/create' : '/register'}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF2B2B] to-[#FF7A00] px-5 py-2.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(255,43,43,0.25)] transition hover:-translate-y-0.5 hover:brightness-110"
                >
                  <PenSquare className="h-4 w-4" />
                  Start Writing
                </Link>

                <Link
                  to="/explore"
                  className="inline-flex items-center gap-2 rounded-xl border border-[#333] bg-[#171717] px-5 py-2.5 text-sm font-semibold text-white transition hover:border-[#FF7A00] hover:bg-[#1D1D1D]"
                >
                  <Compass className="h-4 w-4 text-[#FF7A00]" />
                  Explore Articles
                </Link>

              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex flex-col gap-5 lg:col-span-4">

              {/* PLATFORM ACTIVITY */}
              <div className="rounded-2xl border border-[#292929] bg-[#101010] p-5">

                <div className="mb-4 flex items-center justify-between">

                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FFD60A]">
                    <TrendingUp className="h-4 w-4" />
                    Platform Activity
                  </div>

                  <span className="rounded-full border border-[#22C55E]/30 bg-[#22C55E]/10 px-2 py-0.5 text-[10px] font-bold text-[#22C55E]">
                    LIVE
                  </span>

                </div>

                <div className="grid grid-cols-2 gap-3">

                  <StatCard
                    value={posts.length}
                    label="Articles"
                    icon={<BookOpen className="h-3.5 w-3.5" />}
                    color="red"
                  />

                  <StatCard
                    value={totalComments}
                    label="Comments"
                    icon={<MessageSquare className="h-3.5 w-3.5" />}
                    color="yellow"
                  />

                  <StatCard
                    value={totalViews.toLocaleString()}
                    label="Views"
                    icon={<TrendingUp className="h-3.5 w-3.5" />}
                    color="green"
                  />

                  <StatCard
                    value="100%"
                    label="Full-Stack"
                    icon={<ShieldCheck className="h-3.5 w-3.5" />}
                    color="orange"
                  />

                </div>
              </div>

              {/* CATEGORIES */}
              <div className="rounded-2xl border border-[#292929] bg-[#101010] p-5">

                <div className="mb-4 flex items-center justify-between">

                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF7A00]">
                    <Flame className="h-4 w-4" />
                    Popular Categories
                  </div>

                  <Link
                    to="/explore"
                    className="flex items-center gap-1 text-xs text-[#888] hover:text-white"
                  >
                    All
                    <ArrowRight className="h-3 w-3" />
                  </Link>

                </div>

                <div className="flex flex-wrap gap-2">

                  {categories
                    .filter((category) => category !== 'All')
                    .map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                          selectedCategory === category
                            ? 'border-[#FF2B2B] bg-[#FF2B2B] text-white'
                            : 'border-[#292929] bg-[#0B0B0B] text-[#9CA3AF] hover:border-[#FF7A00] hover:text-white'
                        }`}
                      >
                        {category}
                      </button>
                    ))}

                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {loading ? (
          <LoadingSpinner
            size="lg"
            label="Fetching latest stories..."
          />
        ) : (
          <>
            {/* FEATURED */}
            {featuredPost && (
              <section className="mb-12">

                <div className="mb-4 flex items-center justify-between">

                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#FFD60A]" />

                    <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#FFD60A]">
                      <Flame className="h-4 w-4 text-[#FF2B2B]" />
                      Featured Story
                    </h2>
                  </div>

                  <Link
                    to="/explore"
                    className="flex items-center gap-1 text-xs font-semibold text-[#888] hover:text-white"
                  >
                    View All
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>

                </div>

                <BlogCard
                  post={featuredPost}
                  featured={true}
                />

              </section>
            )}

            {/* ARTICLES HEADER */}
            <section className="mb-7">

              <div className="flex flex-wrap items-end justify-between gap-4">

                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-white">
                    Recent Articles
                  </h2>

                  <p className="mt-1 text-sm text-[#777]">
                    Curated engineering, design, and architecture articles
                  </p>
                </div>

                <Link
                  to="/explore"
                  className="inline-flex items-center gap-2 rounded-lg border border-[#292929] bg-[#111] px-4 py-2 text-xs font-semibold text-white transition hover:border-[#FF7A00]"
                >
                  <Compass className="h-3.5 w-3.5 text-[#FF7A00]" />
                  Advanced Filter
                </Link>

              </div>

              {/* FILTERS */}
              <div className="mt-5 flex gap-2 overflow-x-auto pb-1">

                {categories.map((category) => {

                  const active =
                    selectedCategory === category;

                  return (
                    <button
                      key={category}
                      onClick={() =>
                        setSelectedCategory(category)
                      }
                      className={`whitespace-nowrap rounded-lg border px-3.5 py-2 text-xs font-semibold transition ${
                        active
                          ? 'border-[#FF2B2B] bg-[#FF2B2B] text-white shadow-[0_0_12px_rgba(255,43,43,0.2)]'
                          : 'border-[#292929] bg-[#111] text-[#999] hover:border-[#FF7A00] hover:text-white'
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}

              </div>
            </section>

            {/* POSTS */}
            {recentPosts.length === 0 ? (
              <div className="rounded-2xl border border-[#292929] bg-[#101010] px-6 py-16 text-center">

                <BookOpen className="mx-auto mb-4 h-10 w-10 text-[#555]" />

                <h3 className="text-lg font-bold text-white">
                  No posts found
                </h3>

                <p className="mt-2 text-sm text-[#777]">
                  There are currently no articles in this category.
                </p>

                <button
                  onClick={() => setSelectedCategory('All')}
                  className="mt-5 rounded-lg bg-gradient-to-r from-[#FF2B2B] to-[#FF7A00] px-5 py-2.5 text-xs font-bold text-white"
                >
                  Reset Filter
                </button>

              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {recentPosts.map((post) => (
                  <BlogCard
                    key={post._id}
                    post={post}
                  />
                ))}
              </div>
            )}

            {/* CTA */}
            <section className="relative mt-14 overflow-hidden rounded-2xl border border-[#FF2B2B]/25 bg-[#111] p-7 sm:p-9">

              <div className="pointer-events-none absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-[#FF7A00]/10 to-transparent" />

              <div className="relative max-w-2xl">

                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#22C55E]/30 bg-[#22C55E]/10 px-3 py-1 text-xs font-semibold text-[#22C55E]">
                  <Sparkles className="h-3.5 w-3.5" />
                  Start Your Writing Journey
                </div>

                <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                  Have insights or code patterns to share?
                </h2>

                <p className="mt-3 text-sm leading-6 text-[#888]">
                  Publish your knowledge, technical write-ups,
                  tutorials, and engineering ideas on BLOGX.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">

                  <Link
                    to={isAuthenticated ? '/create' : '/register'}
                    className="rounded-lg bg-gradient-to-r from-[#FF2B2B] to-[#FF7A00] px-5 py-2.5 text-xs font-bold text-white shadow-[0_0_15px_rgba(255,43,43,0.25)] transition hover:brightness-110"
                  >
                    Write an Article
                  </Link>

                  <Link
                    to="/explore"
                    className="rounded-lg border border-[#292929] bg-[#0B0B0B] px-5 py-2.5 text-xs font-semibold text-white transition hover:border-[#FFD60A]"
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


/* ================= STAT CARD ================= */

interface StatCardProps {
  value: string | number;
  label: string;
  icon: React.ReactNode;
  color: 'red' | 'yellow' | 'green' | 'orange';
}

const StatCard: React.FC<StatCardProps> = ({
  value,
  label,
  icon,
  color,
}) => {

  const colors = {
    red: 'text-[#FF2B2B]',
    yellow: 'text-[#FFD60A]',
    green: 'text-[#22C55E]',
    orange: 'text-[#FF7A00]',
  };

  return (
    <div className="rounded-xl border border-[#222] bg-[#0B0B0B] p-3.5 transition hover:border-[#333]">

      <div
        className={`text-xl font-extrabold ${colors[color]}`}
      >
        {value}
      </div>

      <div className="mt-1 flex items-center gap-1.5 text-[11px] text-[#777]">
        <span className={colors[color]}>
          {icon}
        </span>

        {label}
      </div>

    </div>
  );
};
