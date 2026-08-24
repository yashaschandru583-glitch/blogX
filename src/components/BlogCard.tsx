import React from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types';
import { CATEGORY_COLORS, formatDate } from '../utils/theme';
import { MessageSquare, Clock, ArrowRight, Eye } from 'lucide-react';

interface BlogCardProps {
  post: Post;
  featured?: boolean;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post, featured = false }) => {
  const categoryStyle = CATEGORY_COLORS[post.category] || CATEGORY_COLORS.Other;

  return (
    <div
      id={`blog-card-${post._id}`}
      className={`group relative rounded-3xl bg-[#121212] border border-[#262626] hover:border-[#FF2B2B]/60 hover:shadow-[0_0_30px_rgba(255,43,43,0.18)] transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-1 ${
        featured ? 'md:grid md:grid-cols-12 md:gap-6' : ''
      }`}
    >
      {/* Thumbnail Container */}
      <div className={`relative overflow-hidden bg-[#0A0A0A] ${featured ? 'md:col-span-6 h-64 md:h-full' : 'h-52 w-full'}`}>
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent opacity-80" />

        {/* Category Pill on Image */}
        <div className="absolute top-3.5 left-3.5">
          <span
            id={`badge-cat-${post._id}`}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-md border ${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.border} ${categoryStyle.glow}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${categoryStyle.dot}`} />
            {post.category}
          </span>
        </div>

        {/* Read Time & Views */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2 text-xs font-medium text-white/90 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/10">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#FFD60A]" />
            {post.readTime || '4 min'}
          </span>
          {post.views !== undefined && (
            <span className="flex items-center gap-1 border-l border-white/20 pl-2">
              <Eye className="w-3.5 h-3.5 text-[#22C55E]" />
              {post.views}
            </span>
          )}
        </div>
      </div>

      {/* Card Content Body */}
      <div className={`p-5 md:p-6 flex-1 flex flex-col justify-between ${featured ? 'md:col-span-6 md:p-8' : ''}`}>
        <div>
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {post.tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="text-[11px] font-mono text-[#9CA3AF] bg-[#0A0A0A] px-2.5 py-0.5 rounded-lg border border-[#222222]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <Link to={`/post/${post._id}`} className="block focus:outline-none">
            <h3
              id={`title-post-${post._id}`}
              className={`font-bold text-white group-hover:text-[#FF7A00] transition-colors line-clamp-2 leading-snug ${
                featured ? 'text-2xl md:text-3xl mb-3' : 'text-lg mb-2.5'
              }`}
            >
              {post.title}
            </h3>
          </Link>

          {/* Excerpt */}
          <p className="text-sm text-[#9CA3AF] line-clamp-2 leading-relaxed mb-5">
            {post.excerpt || post.content.replace(/[#*`_]/g, '').slice(0, 140)}
          </p>
        </div>

        {/* Footer info: Author & Actions */}
        <div className="pt-4 border-t border-[#222222] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src={post.author.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(post.author.name)}`}
              alt={post.author.name}
              className="w-8 h-8 rounded-full border border-[#292929] object-cover"
              referrerPolicy="no-referrer"
            />
            <div>
              <p className="text-xs font-semibold text-white truncate max-w-[110px]">
                {post.author.name}
              </p>
              <p className="text-[11px] text-[#9CA3AF]">
                {formatDate(post.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Comment Counter */}
            <div className="flex items-center gap-1 text-xs text-[#9CA3AF]">
              <MessageSquare className="w-3.5 h-3.5 text-[#FFD60A]" />
              <span>{post.commentsCount ?? 0}</span>
            </div>

            {/* Read More Link */}
            <Link
              id={`btn-read-more-${post._id}`}
              to={`/post/${post._id}`}
              className="flex items-center gap-1 text-xs font-bold text-white group-hover:text-[#FF2B2B] transition-colors"
            >
              Read
              <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform text-[#FF2B2B]" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
