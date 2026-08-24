import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Post } from '../types';
import { api } from '../services/api';
import { BlogCard } from '../components/BlogCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { PhotoUpload } from '../components/PhotoUpload';
import { SaveProfilePicModal } from '../components/SaveProfilePicModal';
import { formatDate } from '../utils/theme';
import { 
  User as UserIcon, 
  Mail, 
  Calendar, 
  Edit3, 
  BookOpen, 
  MessageSquare, 
  Activity, 
  Check, 
  X, 
  Sparkles,
  Shield,
  Eye,
  Camera,
  Download
} from 'lucide-react';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80'
];

export const ProfilePage: React.FC = () => {
  const { user, isAuthenticated, loading: authLoading, updateProfile, refreshUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSavePicModalOpen, setIsSavePicModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        showToast('warning', 'Please sign in to view your profile.');
        navigate('/login');
      } else if (user) {
        setName(user.name);
        setBio(user.bio || '');
        setAvatar(user.avatar || '');
        
        // Fetch user posts
        api.getMyPosts()
          .then((res) => setPosts(res.posts || []))
          .catch((err) => console.error(err))
          .finally(() => setLoadingPosts(false));
      }
    }
  }, [isAuthenticated, authLoading, user]);

  const handleSaveAvatar = async (newAvatarUrl: string) => {
    await updateProfile({
      avatar: newAvatarUrl
    });
    setAvatar(newAvatarUrl);
    await refreshUser();
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('warning', 'Name cannot be empty.');
      return;
    }

    setSaving(true);
    try {
      await updateProfile({
        name: name.trim(),
        bio: bio.trim(),
        avatar: avatar.trim()
      });
      await refreshUser();
      showToast('success', 'Profile updated successfully!');
      setIsEditingProfile(false);
    } catch (err: any) {
      showToast('error', err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner size="lg" label="Loading author profile..." />
      </div>
    );
  }

  const stats = user.stats || {
    totalPosts: posts.length,
    totalCommentsReceived: posts.reduce((sum, p) => sum + (p.commentsCount || 0), 0),
    totalViews: posts.reduce((sum, p) => sum + (p.views || 0), 0),
    publishedPosts: posts.length,
    drafts: 0
  };

  return (
    <div id="profile-page" className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Profile Header Banner */}
      <div className="bg-[#151515] border border-[#292929] rounded-3xl p-6 sm:p-8 shadow-2xl mb-8 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#FF2B2B]/10 via-[#FF7A00]/5 to-transparent blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          {/* Avatar and Details */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Interactive Avatar with Quick Change Overlay */}
            <div className="relative group">
              <div 
                id="btn-profile-avatar-trigger"
                onClick={() => setIsSavePicModalOpen(true)}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden border-2 border-[#FF2B2B]/50 shadow-[0_0_25px_rgba(255,43,43,0.25)] relative cursor-pointer group-hover:border-[#FF7A00] transition-all"
                title="Click to change and save profile picture"
              >
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.name)}`}
                  alt={user.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                
                {/* Hover overlay with camera icon */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                  <Camera className="w-6 h-6 text-[#FFD60A] mb-1" />
                  <span className="text-[10px] font-bold tracking-wider uppercase">Save Photo</span>
                </div>
              </div>

              {/* Online status indicator */}
              <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-[#22C55E] border-2 border-[#151515]" />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {user.name}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FFD60A]/15 text-[#FFD60A] border border-[#FFD60A]/30">
                  <Shield className="w-3 h-3" /> Author
                </span>
              </div>

              <p className="text-xs text-[#9CA3AF] flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#FF7A00]" /> {user.email}
              </p>

              <p className="text-xs text-[#9CA3AF] flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-[#FFD60A]" /> Joined {formatDate(user.createdAt)}
              </p>

              <p className="text-sm text-[#E5E5E5] leading-relaxed pt-2 max-w-xl">
                {user.bio || 'Passionate software developer and writer. Sharing architectural patterns and engineering lessons on BLOGX.'}
              </p>
            </div>
          </div>

          {/* Action Triggers: Save Photo & Edit Profile */}
          <div className="flex items-center gap-2.5 flex-wrap self-start md:self-auto">
            <button
              id="btn-trigger-save-photo"
              onClick={() => setIsSavePicModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1A1A1A] border border-[#333333] hover:border-[#FF2B2B] text-white text-xs font-semibold shadow-md hover:bg-[#222222] transition-all"
            >
              <Camera className="w-4 h-4 text-[#FFD60A]" /> Update Photo
            </button>

            <button
              id="btn-trigger-edit-profile"
              onClick={() => setIsEditingProfile(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1E1E1E] border border-[#292929] hover:border-[#FF7A00] text-white text-xs font-semibold shadow-md hover:bg-[#252525] transition-all"
            >
              <Edit3 className="w-4 h-4 text-[#FF7A00]" /> Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* 4 Colored Statistic Cards as Requested */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {/* Red -> Posts */}
        <div
          id="profile-stat-posts"
          className="p-5 rounded-2xl bg-[#151515] border border-[#FF2B2B]/30 shadow-[0_0_20px_rgba(255,43,43,0.12)] flex flex-col justify-between"
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
            <p className="text-[11px] text-[#FF2B2B] font-semibold mt-1">Articles published</p>
          </div>
        </div>

        {/* Yellow -> Comments */}
        <div
          id="profile-stat-comments"
          className="p-5 rounded-2xl bg-[#151515] border border-[#FFD60A]/30 shadow-[0_0_20px_rgba(255,214,10,0.12)] flex flex-col justify-between"
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
              {stats.totalCommentsReceived}
            </div>
            <p className="text-[11px] text-[#FFD60A] font-semibold mt-1">Community reactions</p>
          </div>
        </div>

        {/* Green -> Activity / Views */}
        <div
          id="profile-stat-activity"
          className="p-5 rounded-2xl bg-[#151515] border border-[#22C55E]/30 shadow-[0_0_20px_rgba(34,197,94,0.12)] flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF]">
              Total Views
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#22C55E]/15 border border-[#22C55E]/30 flex items-center justify-center text-[#22C55E]">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-white">
              {(stats.totalViews || 0).toLocaleString()}
            </div>
            <p className="text-[11px] text-[#22C55E] font-semibold mt-1">Article readers reached</p>
          </div>
        </div>

        {/* Orange -> Joined */}
        <div
          id="profile-stat-joined"
          className="p-5 rounded-2xl bg-[#151515] border border-[#FF7A00]/30 shadow-[0_0_20px_rgba(255,122,0,0.12)] flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF]">
              Member Since
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#FF7A00]/15 border border-[#FF7A00]/30 flex items-center justify-center text-[#FF7A00]">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-lg sm:text-xl font-bold text-white truncate">
              {formatDate(user.createdAt)}
            </div>
            <p className="text-[11px] text-[#FF7A00] font-semibold mt-1">Verified Member</p>
          </div>
        </div>
      </div>

      {/* User's Authored Articles Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-wide">
              Published Articles ({posts.length})
            </h2>
            <p className="text-xs text-[#9CA3AF]">Public stories authored by this profile</p>
          </div>
        </div>

        {loadingPosts ? (
          <LoadingSpinner size="md" label="Loading articles..." />
        ) : posts.length === 0 ? (
          <div className="text-center py-12 rounded-2xl bg-[#151515] border border-[#292929]">
            <BookOpen className="w-10 h-10 text-[#9CA3AF]/40 mx-auto mb-2" />
            <p className="text-sm text-white font-medium">No published stories yet</p>
            <p className="text-xs text-[#9CA3AF] mt-1">Write your first post to have it appear on your public profile.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#151515] border border-[#292929] rounded-2xl p-6 shadow-2xl text-white relative">
            <button
              onClick={() => setIsEditingProfile(false)}
              className="absolute top-4 right-4 text-[#9CA3AF] hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#FF7A00]/15 border border-[#FF7A00]/30 flex items-center justify-center text-[#FF7A00]">
                <Edit3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Edit Author Profile</h3>
                <p className="text-xs text-[#9CA3AF]">Customize your identity across the platform</p>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white mb-1.5">
                  Full Name <span className="text-[#FF2B2B]">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#0D0D0D] border border-[#292929] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF2B2B]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white mb-1.5">
                  Author Bio
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share a short summary about your engineering focus or background..."
                  className="w-full bg-[#0D0D0D] border border-[#292929] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF2B2B] resize-none"
                />
              </div>

              {/* Avatar Photo Upload (Upload, Presets, URL) */}
              <div>
                <PhotoUpload
                  value={avatar}
                  onChange={(newAvatar) => setAvatar(newAvatar)}
                  label="Profile Picture / Avatar"
                  mode="avatar"
                  idPrefix="profile-avatar-upload"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#292929]">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 rounded-xl bg-[#0D0D0D] border border-[#292929] text-xs font-semibold text-[#9CA3AF] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF2B2B] to-[#FF7A00] text-white text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(255,43,43,0.35)] disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dedicated Save Profile Picture Modal */}
      <SaveProfilePicModal
        isOpen={isSavePicModalOpen}
        onClose={() => setIsSavePicModalOpen(false)}
        currentAvatar={user.avatar || avatar}
        userName={user.name}
        onSave={handleSaveAvatar}
      />
    </div>
  );
};
