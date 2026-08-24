import React, { useState, useEffect } from 'react';
import { PhotoUpload, DEFAULT_AVATAR_PRESETS } from './PhotoUpload';
import { useToast } from '../context/ToastContext';
import { 
  Camera, 
  X, 
  Check, 
  Download, 
  RefreshCcw, 
  User as UserIcon, 
  Sparkles,
  ShieldCheck,
  Image as ImageIcon
} from 'lucide-react';

interface SaveProfilePicModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatar: string;
  userName: string;
  onSave: (newAvatarUrl: string) => Promise<void>;
}

export const SaveProfilePicModal: React.FC<SaveProfilePicModalProps> = ({
  isOpen,
  onClose,
  currentAvatar,
  userName,
  onSave
}) => {
  const { showToast } = useToast();
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedAvatar(currentAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userName)}`);
    }
  }, [isOpen, currentAvatar, userName]);

  if (!isOpen) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(selectedAvatar.trim());
      showToast('success', 'Profile picture saved successfully!');
      onClose();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to save profile picture.');
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPic = async () => {
    try {
      if (!selectedAvatar) return;
      
      // If it's a data URL, download directly via a tag
      if (selectedAvatar.startsWith('data:')) {
        const link = document.createElement('a');
        link.href = selectedAvatar;
        link.download = `${userName.toLowerCase().replace(/\s+/g, '-')}-avatar.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('success', 'Profile picture downloaded!');
        return;
      }

      // If it's an external URL, fetch blob
      const res = await fetch(selectedAvatar);
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${userName.toLowerCase().replace(/\s+/g, '-')}-avatar.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      showToast('success', 'Profile picture downloaded!');
    } catch (err) {
      // Fallback: open in new tab for direct save
      window.open(selectedAvatar, '_blank');
      showToast('info', 'Opening image in new tab to save');
    }
  };

  const handleResetToDefault = () => {
    const defaultDicebear = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userName)}`;
    setSelectedAvatar(defaultDicebear);
    showToast('info', 'Reset to generated default avatar. Click "Save Profile Picture" to apply.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        id="modal-save-profile-pic"
        className="w-full max-w-lg bg-[#121212] border border-[#2D2D2D] rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6 relative overflow-hidden"
      >
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#FF2B2B]/15 via-[#FF7A00]/10 to-transparent blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#222222] relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FF2B2B]/20 to-[#FF7A00]/20 border border-[#FF2B2B]/30 flex items-center justify-center text-[#FF2B2B] shadow-[0_0_15px_rgba(255,43,43,0.2)]">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Save Profile Picture
              </h3>
              <p className="text-xs text-[#9CA3AF]">
                Upload, customize, and save your public avatar
              </p>
            </div>
          </div>

          <button
            id="btn-close-save-pic-modal"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#1A1A1A] hover:bg-[#262626] text-[#9CA3AF] hover:text-white transition-all border border-[#2D2D2D]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Avatar Preview Circle + Quick Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-[#0A0A0A] border border-[#222222]">
          <div className="relative group shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden border-2 border-[#FF2B2B]/60 shadow-[0_0_25px_rgba(255,43,43,0.3)] bg-[#141414]">
              <img
                src={selectedAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userName)}`}
                alt="Avatar Preview"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#22C55E] border-2 border-[#0A0A0A] flex items-center justify-center text-black">
              <ShieldCheck className="w-3.5 h-3.5 text-white" />
            </div>
          </div>

          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="text-sm font-bold text-white">{userName}</span>
              <span className="text-[10px] font-mono uppercase bg-[#FFD60A]/15 text-[#FFD60A] border border-[#FFD60A]/30 px-2 py-0.5 rounded-full">
                Active Preview
              </span>
            </div>
            <p className="text-xs text-[#9CA3AF]">
              This photo will be displayed across your articles, author badge, and comment responses.
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <button
                type="button"
                id="btn-download-profile-pic"
                onClick={handleDownloadPic}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1A1A1A] hover:bg-[#262626] border border-[#333333] text-xs font-semibold text-[#E5E5E5] transition-all"
                title="Save/Download image file"
              >
                <Download className="w-3.5 h-3.5 text-[#22C55E]" />
                Download Photo
              </button>

              <button
                type="button"
                id="btn-reset-profile-pic"
                onClick={handleResetToDefault}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1A1A1A] hover:bg-[#262626] border border-[#333333] text-xs font-semibold text-[#9CA3AF] hover:text-white transition-all"
                title="Reset to generated avatar"
              >
                <RefreshCcw className="w-3 h-3 text-[#FF7A00]" />
                Reset Default
              </button>
            </div>
          </div>
        </div>

        {/* Photo Upload Component (Files, Presets, URL) */}
        <div className="space-y-4">
          <PhotoUpload
            value={selectedAvatar}
            onChange={(newUrl) => setSelectedAvatar(newUrl)}
            label="Upload New Photo or Choose Preset"
            mode="avatar"
            presets={DEFAULT_AVATAR_PRESETS}
            idPrefix="save-pic-modal-upload"
          />
        </div>

        {/* Modal Actions Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#222222] relative z-10">
          <button
            type="button"
            id="btn-cancel-save-profile-pic"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#1A1A1A] hover:bg-[#242424] border border-[#2D2D2D] text-xs font-semibold text-[#9CA3AF] hover:text-white transition-all"
          >
            Cancel
          </button>

          <button
            type="button"
            id="btn-confirm-save-profile-pic"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF2B2B] to-[#FF7A00] hover:brightness-110 text-white text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(255,43,43,0.35)] transition-all disabled:opacity-50"
          >
            {saving ? (
              <>
                <RefreshCcw className="w-3.5 h-3.5 animate-spin" />
                Saving Photo...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Save Profile Picture
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
