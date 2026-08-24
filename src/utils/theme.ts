import { CategoryType } from '../types';

export const CATEGORY_COLORS: Record<CategoryType, { bg: string; text: string; border: string; glow: string; dot: string }> = {
  Technology: {
    bg: 'bg-[#FF7A00]/15',
    text: 'text-[#FF7A00]',
    border: 'border-[#FF7A00]/30',
    glow: 'shadow-[0_0_12px_rgba(255,122,0,0.25)]',
    dot: 'bg-[#FF7A00]'
  },
  Programming: {
    bg: 'bg-[#FFD60A]/15',
    text: 'text-[#FFD60A]',
    border: 'border-[#FFD60A]/30',
    glow: 'shadow-[0_0_12px_rgba(255,214,10,0.25)]',
    dot: 'bg-[#FFD60A]'
  },
  Education: {
    bg: 'bg-[#22C55E]/15',
    text: 'text-[#22C55E]',
    border: 'border-[#22C55E]/30',
    glow: 'shadow-[0_0_12px_rgba(34,197,94,0.25)]',
    dot: 'bg-[#22C55E]'
  },
  Travel: {
    bg: 'bg-[#FF2B2B]/15',
    text: 'text-[#FF2B2B]',
    border: 'border-[#FF2B2B]/30',
    glow: 'shadow-[0_0_12px_rgba(255,43,43,0.25)]',
    dot: 'bg-[#FF2B2B]'
  },
  Lifestyle: {
    bg: 'bg-[#FF7A00]/15',
    text: 'text-[#FF7A00]',
    border: 'border-[#FF7A00]/30',
    glow: 'shadow-[0_0_12px_rgba(255,122,0,0.25)]',
    dot: 'bg-[#FF7A00]'
  },
  Business: {
    bg: 'bg-[#FFD60A]/15',
    text: 'text-[#FFD60A]',
    border: 'border-[#FFD60A]/30',
    glow: 'shadow-[0_0_12px_rgba(255,214,10,0.25)]',
    dot: 'bg-[#FFD60A]'
  },
  Other: {
    bg: 'bg-[#22C55E]/15',
    text: 'text-[#22C55E]',
    border: 'border-[#22C55E]/30',
    glow: 'shadow-[0_0_12px_rgba(34,197,94,0.25)]',
    dot: 'bg-[#22C55E]'
  }
};

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  } catch {
    return 'Recent';
  }
}

export function formatTimeAgo(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return formatDate(dateString);
  } catch {
    return 'Recently';
  }
}
