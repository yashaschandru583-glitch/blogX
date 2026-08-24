import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  PenSquare, 
  Compass, 
  Home, 
  BookOpen, 
  User as UserIcon, 
  LogOut, 
  LogIn, 
  UserPlus, 
  Menu, 
  X, 
  Flame,
  LayoutDashboard,
  Camera
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    showToast('info', 'You have been logged out successfully.');
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Explore', path: '/explore', icon: Compass },
    ...(isAuthenticated
      ? [
          { name: 'My Posts', path: '/my-posts', icon: BookOpen },
          { name: 'Create Post', path: '/create', icon: PenSquare },
          { name: 'Profile', path: '/profile', icon: UserIcon }
        ]
      : [])
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav
      id="main-navbar"
      className="sticky top-0 z-40 w-full bg-[#050505]/90 backdrop-blur-md border-b border-[#292929] transition-all"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center gap-8">
            <Link
              id="brand-logo"
              to="/"
              className="flex items-center gap-2 group focus:outline-none"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF2B2B] to-[#FF7A00] flex items-center justify-center text-white shadow-[0_0_15px_rgba(255,43,43,0.4)] group-hover:scale-105 transition-transform">
                <Flame className="w-5 h-5 fill-white text-transparent" />
              </div>
              <span className="text-2xl font-extrabold tracking-wider text-white">
                BLOG<span className="text-[#FF2B2B] drop-shadow-[0_0_12px_rgba(255,43,43,0.8)]">X</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    id={`nav-link-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                    to={link.path}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all relative ${
                      active
                        ? 'text-white bg-[#151515] border border-[#292929] shadow-[0_0_12px_rgba(255,43,43,0.15)]'
                        : 'text-[#9CA3AF] hover:text-white hover:bg-[#0D0D0D]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-[#FF2B2B]' : 'text-[#9CA3AF]'}`} />
                    {link.name}
                    {active && (
                      <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#FF2B2B] rounded-full shadow-[0_0_8px_#FF2B2B]" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Side User / Auth Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  id="btn-user-menu"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-3 p-1.5 pl-2 rounded-full border border-[#292929] bg-[#151515] hover:border-[#FF2B2B]/50 transition-all focus:outline-none"
                >
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.name)}`}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover border border-[#292929]"
                    referrerPolicy="no-referrer"
                  />
                  <span className="text-sm font-medium text-white max-w-[120px] truncate pr-2">
                    {user.name}
                  </span>
                </button>

                {/* User Dropdown Menu */}
                {userDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-20"
                      onClick={() => setUserDropdownOpen(false)}
                    />
                    <div
                      id="user-dropdown-menu"
                      className="absolute right-0 mt-2 w-56 bg-[#151515] border border-[#292929] rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] py-2 z-30 divide-y divide-[#292929]"
                    >
                      <div className="px-4 py-3">
                        <p className="text-xs font-semibold text-[#9CA3AF]">Signed in as</p>
                        <p className="text-sm font-bold text-white truncate">{user.name}</p>
                        <p className="text-xs text-[#9CA3AF] truncate mt-0.5">{user.email}</p>
                      </div>

                      <div className="py-1">
                        <Link
                          id="dropdown-link-create"
                          to="/create"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#E5E5E5] hover:bg-[#1E1E1E] hover:text-[#FF7A00] transition-colors"
                        >
                          <PenSquare className="w-4 h-4 text-[#FF7A00]" />
                          Write Article
                        </Link>
                        <Link
                          id="dropdown-link-myposts"
                          to="/my-posts"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#E5E5E5] hover:bg-[#1E1E1E] hover:text-[#FFD60A] transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-[#FFD60A]" />
                          My Dashboard
                        </Link>
                        <Link
                          id="dropdown-link-profile"
                          to="/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#E5E5E5] hover:bg-[#1E1E1E] hover:text-white transition-colors"
                        >
                          <UserIcon className="w-4 h-4 text-[#22C55E]" />
                          View Profile
                        </Link>
                        <Link
                          id="dropdown-link-profile-photo"
                          to="/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#E5E5E5] hover:bg-[#1E1E1E] hover:text-[#FF2B2B] transition-colors"
                        >
                          <Camera className="w-4 h-4 text-[#FF2B2B]" />
                          Change Profile Photo
                        </Link>
                      </div>

                      <div className="py-1">
                        <button
                          id="btn-dropdown-logout"
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-[#FF2B2B] hover:bg-[#FF2B2B]/10 transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  id="btn-nav-login"
                  to="/login"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-[#E5E5E5] hover:text-white bg-[#151515] border border-[#292929] hover:border-[#FF2B2B]/40 transition-all"
                >
                  <LogIn className="w-4 h-4 text-[#9CA3AF]" />
                  Login
                </Link>
                <Link
                  id="btn-nav-register"
                  to="/register"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#FF2B2B] to-[#FF7A00] hover:brightness-110 shadow-[0_0_15px_rgba(255,43,43,0.35)] transition-all"
                >
                  <UserPlus className="w-4 h-4" />
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              id="btn-mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#9CA3AF] hover:text-white bg-[#151515] border border-[#292929] focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#FF2B2B]" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div id="mobile-menu-drawer" className="md:hidden border-b border-[#292929] bg-[#0D0D0D] px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                id={`mobile-nav-link-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-base font-medium transition-all ${
                  active
                    ? 'bg-[#151515] text-[#FF2B2B] border border-[#FF2B2B]/30'
                    : 'text-[#9CA3AF] hover:text-white hover:bg-[#151515]'
                }`}
              >
                <Icon className="w-5 h-5" />
                {link.name}
              </Link>
            );
          })}

          <div className="pt-4 border-t border-[#292929] flex flex-col gap-2">
            {isAuthenticated && user ? (
              <>
                <div className="flex items-center gap-3 px-3 py-2">
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.name)}`}
                    alt={user.name}
                    className="w-9 h-9 rounded-full border border-[#292929]"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <p className="text-sm font-bold text-white">{user.name}</p>
                    <p className="text-xs text-[#9CA3AF]">{user.email}</p>
                  </div>
                </div>
                <button
                  id="btn-mobile-logout"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-[#FF2B2B]/15 border border-[#FF2B2B]/40 text-[#FF2B2B]"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  id="btn-mobile-login"
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium bg-[#151515] border border-[#292929] text-white"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
                <Link
                  id="btn-mobile-register"
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#FF2B2B] to-[#FF7A00] text-white shadow-[0_0_12px_rgba(255,43,43,0.3)]"
                >
                  <UserPlus className="w-4 h-4" />
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
