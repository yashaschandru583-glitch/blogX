import React, { useState } from 'react';
import { PhotoUpload } from './PhotoUpload';
import { ImagePlus, X, Check, Copy } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface InlinePhotoInserterProps {
  onInsert: (markdownImage: string) => void;
}

export const InlinePhotoInserter: React.FC<InlinePhotoInserterProps> = ({ onInsert }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [altText, setAltText] = useState('');
  const { showToast } = useToast();

  const handleInsert = () => {
    if (!imageUrl.trim()) {
      showToast('warning', 'Please upload or provide a photo first.');
      return;
    }

    const caption = altText.trim() || 'Article illustration';
    const markdown = `\n\n![${caption}](${imageUrl.trim()})\n*${caption}*\n\n`;
    onInsert(markdown);
    showToast('success', 'Photo inserted into article content!');
    setImageUrl('');
    setAltText('');
    setIsOpen(false);
  };

  return (
    <div>
      <button
        type="button"
        id="btn-open-inline-photo-inserter"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1F1F1F] hover:bg-[#2A2A2A] border border-[#333333] hover:border-[#FF7A00]/50 text-xs font-semibold text-[#E5E5E5] transition-all shadow-sm"
      >
        <ImagePlus className="w-3.5 h-3.5 text-[#FF7A00]" />
        Insert Photo in Content
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div
            id="modal-inline-photo-inserter"
            className="w-full max-w-xl bg-[#121212] border border-[#2D2D2D] rounded-3xl p-6 shadow-2xl space-y-5 relative"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#222222]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#FF7A00]/15 text-[#FF7A00] flex items-center justify-center border border-[#FF7A00]/30">
                  <ImagePlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Insert Photo into Article</h3>
                  <p className="text-[11px] text-[#9CA3AF]">Upload a photo or choose preset to embed in Markdown</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg bg-[#1F1F1F] hover:bg-[#2A2A2A] text-[#9CA3AF] hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Photo Upload Zone */}
            <PhotoUpload
              value={imageUrl}
              onChange={(url) => setImageUrl(url)}
              label="Article Illustration Photo"
              idPrefix="inline-photo-upload"
            />

            {/* Caption / Alt Text Input */}
            <div>
              <label className="block text-xs font-semibold text-[#E5E5E5] mb-1.5">
                Photo Caption / Alt Text
              </label>
              <input
                type="text"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="e.g. Microservices Architecture Diagram"
                className="w-full bg-[#0B0B0B] border border-[#262626] rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#9CA3AF] focus:outline-none focus:border-[#FF7A00]"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#1A1A1A] hover:bg-[#222222] border border-[#2D2D2D] text-xs font-semibold text-[#9CA3AF] hover:text-white transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                id="btn-confirm-insert-photo"
                onClick={handleInsert}
                disabled={!imageUrl}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF2B2B] hover:brightness-110 text-white text-xs font-bold shadow-[0_0_15px_rgba(255,122,0,0.3)] transition-all disabled:opacity-40"
              >
                <Check className="w-3.5 h-3.5" />
                Insert Markdown Photo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
