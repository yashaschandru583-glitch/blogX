import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', label = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-9 h-9 border-3',
    lg: 'w-14 h-14 border-4'
  };

  return (
    <div id="loading-spinner-container" className="flex flex-col items-center justify-center p-8 gap-3">
      <div className="relative">
        <div
          className={`${sizeClasses[size]} rounded-full border-t-[#FF2B2B] border-r-[#FF7A00] border-b-transparent border-l-transparent animate-spin`}
          style={{ filter: 'drop-shadow(0 0 8px rgba(255, 43, 43, 0.5))' }}
        />
        <div
          className={`absolute inset-0 ${sizeClasses[size]} rounded-full border-b-[#FFD60A] border-l-[#22C55E] border-t-transparent border-r-transparent animate-spin`}
          style={{ animationDirection: 'reverse', animationDuration: '1.2s' }}
        />
      </div>
      {label && <p className="text-xs uppercase tracking-widest text-[#9CA3AF] font-semibold">{label}</p>}
    </div>
  );
};

export const SkeletonCard: React.FC = () => {
  return (
    <div id="skeleton-card" className="card-dark rounded-2xl overflow-hidden animate-pulse flex flex-col h-full border border-[#292929]">
      <div className="h-48 bg-[#1E1E1E] w-full" />
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          <div className="w-20 h-5 bg-[#252525] rounded-full" />
          <div className="w-full h-6 bg-[#252525] rounded-md" />
          <div className="w-4/5 h-6 bg-[#252525] rounded-md" />
          <div className="w-full h-4 bg-[#1E1E1E] rounded-md mt-2" />
        </div>
        <div className="pt-4 border-t border-[#252525] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#252525]" />
            <div className="w-24 h-3.5 bg-[#252525] rounded" />
          </div>
          <div className="w-12 h-3.5 bg-[#252525] rounded" />
        </div>
      </div>
    </div>
  );
};
