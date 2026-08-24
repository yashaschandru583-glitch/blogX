import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, Github, Twitter, Linkedin, Terminal, Sparkles, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const categories = ['Technology', 'Programming', 'Education', 'Travel', 'Lifestyle', 'Business'];

  return (
    <footer id="main-footer" className="mt-20 border-t border-[#292929] bg-[#050505] text-[#9CA3AF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF2B2B] to-[#FF7A00] flex items-center justify-center text-white shadow-[0_0_15px_rgba(255,43,43,0.4)]">
                <Flame className="w-5 h-5 fill-white text-transparent" />
              </div>
              <span className="text-2xl font-extrabold tracking-wider text-white">
                BLOG<span className="text-[#FF2B2B]">X</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-[#9CA3AF]">
              A high-performance modern developer and blogging platform. Engineered for deep technical articles, knowledge sharing, and live developer discussions.
            </p>
            <div className="flex items-center gap-3 text-white">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-[#151515] border border-[#292929] flex items-center justify-center hover:text-[#FF7A00] hover:border-[#FF7A00]/40 transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-[#151515] border border-[#292929] flex items-center justify-center hover:text-[#FFD60A] hover:border-[#FFD60A]/40 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-[#151515] border border-[#292929] flex items-center justify-center hover:text-[#22C55E] hover:border-[#22C55E]/40 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A00]" />
              Categories
            </h4>
            <ul className="space-y-2 text-xs">
              {categories.map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/explore?category=${cat}`}
                    className="hover:text-white hover:underline transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFD60A]" />
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Featured Stories</Link>
              </li>
              <li>
                <Link to="/explore" className="hover:text-white transition-colors">Explore All Articles</Link>
              </li>
              <li>
                <Link to="/create" className="hover:text-white transition-colors">Write on BLOGX</Link>
              </li>
              <li>
                <Link to="/my-posts" className="hover:text-white transition-colors">Author Dashboard</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform Highlights */}
          <div className="p-4 rounded-2xl bg-[#0D0D0D] border border-[#292929] space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Terminal className="w-4 h-4 text-[#22C55E]" />
              <span>Full-Stack Architecture</span>
            </div>
            <p className="text-[11px] text-[#9CA3AF] leading-relaxed">
              Powered by Node.js, Express REST APIs, JWT authentication, and high-performance persistence.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-[#22C55E]">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
              API Services Operational
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#292929] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} BLOGX Platform. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[#9CA3AF]">
            <span className="flex items-center gap-1">
              Built with <Heart className="w-3 h-3 text-[#FF2B2B] fill-[#FF2B2B]" /> for Developers & Creators
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
