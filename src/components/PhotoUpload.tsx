import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Upload, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Sparkles, 
  Trash2, 
  RefreshCw, 
  Check, 
  FileImage, 
  AlertCircle,
  Camera,
  Maximize2
} from 'lucide-react';
import { optimizeImage, formatFileSize } from '../utils/imageOptimizer';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';

export interface PresetPhoto {
  label: string;
  url: string;
  category?: string;
}

export const DEFAULT_POST_PRESETS: PresetPhoto[] = [
  { label: 'Cloud Infrastructure', category: 'Tech', url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Full-Stack React Code', category: 'Coding', url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Neural Intelligence', category: 'AI', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Modern Developer Studio', category: 'Workspace', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80' },
  { label: 'High-Tech Circuitry', category: 'Tech', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Dark Minimalist Abstract', category: 'Design', url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Alpine Creative Travel', category: 'Nature', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Cyberpunk Neon Matrix', category: 'Design', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80' }
];

export const DEFAULT_AVATAR_PRESETS: PresetPhoto[] = [
  { label: 'Avatar 1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80' },
  { label: 'Avatar 2', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80' },
  { label: 'Avatar 3', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80' },
  { label: 'Avatar 4', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80' },
  { label: 'Avatar 5', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80' }
];

interface PhotoUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  required?: boolean;
  mode?: 'cover' | 'avatar';
  presets?: PresetPhoto[];
  idPrefix?: string;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  value,
  onChange,
  label = 'Featured Photo',
  required = false,
  mode = 'cover',
  presets = mode === 'avatar' ? DEFAULT_AVATAR_PRESETS : DEFAULT_POST_PRESETS,
  idPrefix = 'photo-upload'
}) => {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [activeSourceTab, setActiveSourceTab] = useState<'upload' | 'url' | 'presets'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [inputUrl, setInputUrl] = useState('');
  const [fileDetails, setFileDetails] = useState<{ name: string; size: number; dimensions?: string } | null>(null);

  // Sync initial state if value exists
  useEffect(() => {
    if (value && value.startsWith('http')) {
      setInputUrl(value);
    }
  }, [value]);

  const processFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('error', 'Please upload a valid image file (PNG, JPG, WEBP, GIF, SVG).');
      return;
    }

    // Limit maximum raw file size to 15MB
    if (file.size > 15 * 1024 * 1024) {
      showToast('error', 'File size exceeds 15MB. Please choose a smaller photo.');
      return;
    }

    setProcessing(true);
    try {
      // Optimize image on client side (scales down huge 4K camera photos cleanly)
      const options = mode === 'avatar' 
        ? { maxWidth: 600, maxHeight: 600, quality: 0.88, format: 'image/webp' as const }
        : { maxWidth: 1600, maxHeight: 1100, quality: 0.85, format: 'image/webp' as const };
      
      const optimized = await optimizeImage(file, options);
      
      // Upload/Process via API endpoint
      try {
        const uploadResult = await api.uploadPhoto(optimized.dataUrl, file.name);
        onChange(uploadResult.url);
        setFileDetails({
          name: file.name,
          size: uploadResult.size || optimized.sizeBytes,
          dimensions: `${optimized.width}×${optimized.height}`
        });
      } catch (err) {
        // Fallback to data URL directly if server route has issue
        onChange(optimized.dataUrl);
        setFileDetails({
          name: file.name,
          size: optimized.sizeBytes,
          dimensions: `${optimized.width}×${optimized.height}`
        });
      }

      showToast('success', `Photo uploaded successfully (${formatFileSize(optimized.sizeBytes)})!`);
    } catch (err: any) {
      showToast('error', err.message || 'Failed to process photo.');
    } finally {
      setProcessing(false);
    }
  }, [mode, onChange, showToast]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  // Clipboard Paste Support (Ctrl+V / Cmd+V)
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          processFile(file);
          break;
        }
      }
    }
  }, [processFile]);

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) {
      showToast('warning', 'Please enter a valid image URL.');
      return;
    }
    onChange(inputUrl.trim());
    setFileDetails(null);
    showToast('success', 'Image URL applied!');
  };

  const handleClear = () => {
    onChange('');
    setFileDetails(null);
    setInputUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div id={`${idPrefix}-container`} className="space-y-3" onPaste={handlePaste}>
      {/* Label and Source Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-[#FFD60A]" />
          {label} {required && <span className="text-[#FF2B2B]">*</span>}
        </label>

        {/* Source Mode Switcher */}
        <div className="flex items-center gap-1 bg-[#0A0A0A] p-1 rounded-xl border border-[#262626] self-start sm:self-auto">
          <button
            type="button"
            id={`${idPrefix}-tab-upload`}
            onClick={() => setActiveSourceTab('upload')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              activeSourceTab === 'upload'
                ? 'bg-[#FF2B2B] text-white shadow-[0_0_10px_rgba(255,43,43,0.3)]'
                : 'text-[#9CA3AF] hover:text-white'
            }`}
          >
            <Upload className="w-3 h-3" /> Upload File
          </button>
          <button
            type="button"
            id={`${idPrefix}-tab-presets`}
            onClick={() => setActiveSourceTab('presets')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              activeSourceTab === 'presets'
                ? 'bg-[#FF7A00] text-white shadow-[0_0_10px_rgba(255,122,0,0.3)]'
                : 'text-[#9CA3AF] hover:text-white'
            }`}
          >
            <Sparkles className="w-3 h-3" /> Presets
          </button>
          <button
            type="button"
            id={`${idPrefix}-tab-url`}
            onClick={() => setActiveSourceTab('url')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              activeSourceTab === 'url'
                ? 'bg-[#FFD60A] text-black shadow-[0_0_10px_rgba(255,214,10,0.3)]'
                : 'text-[#9CA3AF] hover:text-white'
            }`}
          >
            <LinkIcon className="w-3 h-3" /> Image URL
          </button>
        </div>
      </div>

      {/* Hidden Native File Input */}
      <input
        ref={fileInputRef}
        id={`${idPrefix}-file-input`}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp,image/gif,image/svg+xml"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Current Image Preview (if present) */}
      {value ? (
        <div
          id={`${idPrefix}-preview-card`}
          className={`relative rounded-2xl bg-[#0D0D0D] border border-[#292929] overflow-hidden group shadow-lg transition-all ${
            mode === 'avatar' ? 'max-w-xs' : 'w-full'
          }`}
        >
          <div className={`relative ${mode === 'avatar' ? 'h-48 w-48 mx-auto p-4' : 'h-64 sm:h-72 w-full'}`}>
            <img
              src={value}
              alt="Selected Preview"
              className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02] ${
                mode === 'avatar' ? 'rounded-2xl border border-[#333333]' : ''
              }`}
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4" />
          </div>

          {/* Overlay Actions / Badge */}
          <div className="p-3.5 bg-[#121212] border-t border-[#222222] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-7 h-7 rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/30 flex items-center justify-center text-[#22C55E] shrink-0">
                <Check className="w-4 h-4" />
              </div>
              <div className="truncate text-left">
                <p className="text-xs font-semibold text-white truncate">
                  {fileDetails?.name || 'Photo Ready'}
                </p>
                <p className="text-[11px] text-[#9CA3AF] font-mono flex items-center gap-1.5">
                  {fileDetails?.size ? formatFileSize(fileDetails.size) : 'External / Ready'}
                  {fileDetails?.dimensions && (
                    <span className="text-[#FFD60A]">• {fileDetails.dimensions}</span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                id={`${idPrefix}-btn-change`}
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#1F1F1F] hover:bg-[#2A2A2A] border border-[#333333] text-xs font-medium text-white transition-all"
                title="Choose different photo"
              >
                <RefreshCw className="w-3 h-3 text-[#FF7A00]" />
                Change
              </button>
              <button
                type="button"
                id={`${idPrefix}-btn-remove`}
                onClick={handleClear}
                className="p-1.5 rounded-lg bg-[#FF2B2B]/15 hover:bg-[#FF2B2B]/25 border border-[#FF2B2B]/30 text-[#FF2B2B] transition-all"
                title="Remove photo"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State / Dropzone / Controls */
        <div>
          {activeSourceTab === 'upload' && (
            <div
              id={`${idPrefix}-dropzone`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
                isDragging
                  ? 'border-[#FF2B2B] bg-[#FF2B2B]/10 shadow-[0_0_25px_rgba(255,43,43,0.3)] scale-[1.01]'
                  : 'border-[#2D2D2D] hover:border-[#FF2B2B]/50 bg-[#0B0B0B]/80 hover:bg-[#121212]'
              }`}
            >
              {processing ? (
                <div className="flex flex-col items-center justify-center py-6 space-y-3">
                  <RefreshCw className="w-8 h-8 text-[#FF2B2B] animate-spin" />
                  <p className="text-sm font-semibold text-white">Compressing & Uploading Photo...</p>
                  <p className="text-xs text-[#9CA3AF]">Optimizing resolution and performance</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF2B2B]/20 to-[#FF7A00]/20 border border-[#FF2B2B]/30 flex items-center justify-center text-[#FF2B2B] shadow-inner group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6 animate-bounce" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white mb-1">
                      Drag & Drop photo here, or <span className="text-[#FF7A00] underline">browse files</span>
                    </p>
                    <p className="text-xs text-[#9CA3AF]">
                      Supports PNG, JPG, WEBP, GIF, SVG up to 15MB • Paste via Ctrl+V supported
                    </p>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-mono bg-[#1A1A1A] text-[#E5E5E5] border border-[#2D2D2D]">
                      <FileImage className="w-3 h-3 text-[#22C55E]" /> Auto-Compressed
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-mono bg-[#1A1A1A] text-[#E5E5E5] border border-[#2D2D2D]">
                      <Camera className="w-3 h-3 text-[#FFD60A]" /> High Resolution
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeSourceTab === 'presets' && (
            <div id={`${idPrefix}-presets-container`} className="bg-[#0B0B0B] border border-[#262626] rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#E5E5E5] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF7A00]" /> Select Curated Wallpaper
                </span>
                <span className="text-[11px] text-[#9CA3AF]">Click any image to apply instantly</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {presets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    id={`${idPrefix}-preset-${idx}`}
                    onClick={() => {
                      onChange(preset.url);
                      setFileDetails({ name: preset.label, size: 0 });
                      showToast('success', `Applied "${preset.label}"!`);
                    }}
                    className="group relative h-24 rounded-xl overflow-hidden border border-[#2D2D2D] hover:border-[#FF2B2B] transition-all text-left"
                  >
                    <img
                      src={preset.url}
                      alt={preset.label}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-2 flex flex-col justify-end">
                      <span className="text-[11px] font-bold text-white line-clamp-1">
                        {preset.label}
                      </span>
                      {preset.category && (
                        <span className="text-[9px] uppercase font-mono text-[#FFD60A]">
                          {preset.category}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeSourceTab === 'url' && (
            <div id={`${idPrefix}-url-container`} className="bg-[#0B0B0B] border border-[#262626] rounded-2xl p-4 space-y-3">
              <form onSubmit={handleUrlSubmit} className="space-y-3">
                <div>
                  <label htmlFor={`${idPrefix}-url-input`} className="block text-xs font-semibold text-[#E5E5E5] mb-1.5">
                    Direct Image URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      id={`${idPrefix}-url-input`}
                      type="url"
                      value={inputUrl}
                      onChange={(e) => setInputUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="flex-1 bg-[#141414] border border-[#292929] rounded-xl px-4 py-2 text-xs font-mono text-white placeholder-[#9CA3AF] focus:outline-none focus:border-[#FF2B2B]"
                    />
                    <button
                      type="submit"
                      id={`${idPrefix}-btn-apply-url`}
                      className="px-4 py-2 rounded-xl bg-[#FF2B2B] hover:bg-[#E02424] text-white text-xs font-bold transition-all shadow-[0_0_15px_rgba(255,43,43,0.3)]"
                    >
                      Apply
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-[#9CA3AF] flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 text-[#FFD60A]" /> Paste any public image link from Unsplash, Pexels, Imgur, or CDN.
                </p>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
