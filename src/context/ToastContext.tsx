import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Toast } from '../types';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

interface ToastContextType {
  toasts: Toast[];
  showToast: (type: Toast['type'], message: string, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((type: Toast['type'], message: string, duration = 4000) => {
    const id = 'toast_' + Math.random().toString(36).substring(2, 9) + Date.now();
    const newToast: Toast = { id, type, message, duration };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      
      {/* Toast Render Portal */}
      <div id="toast-portal" className="fixed top-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        <AnimatePresence>
          {toasts.map((toast) => {
            let borderClass = 'border-[#292929]';
            let bgClass = 'bg-[#151515]';
            let icon = <Info className="w-5 h-5 text-[#FF7A00] shrink-0" />;
            let glow = '';

            if (toast.type === 'success') {
              borderClass = 'border-[#22C55E]/40';
              glow = 'shadow-[0_0_20px_rgba(34,197,94,0.2)]';
              icon = <CheckCircle2 className="w-5 h-5 text-[#22C55E] shrink-0" />;
            } else if (toast.type === 'error') {
              borderClass = 'border-[#FF2B2B]/40';
              glow = 'shadow-[0_0_20px_rgba(255,43,43,0.25)]';
              icon = <AlertCircle className="w-5 h-5 text-[#FF2B2B] shrink-0" />;
            } else if (toast.type === 'warning') {
              borderClass = 'border-[#FFD60A]/40';
              glow = 'shadow-[0_0_20px_rgba(255,214,10,0.2)]';
              icon = <AlertTriangle className="w-5 h-5 text-[#FFD60A] shrink-0" />;
            } else {
              borderClass = 'border-[#FF7A00]/40';
              glow = 'shadow-[0_0_20px_rgba(255,122,0,0.2)]';
              icon = <Info className="w-5 h-5 text-[#FF7A00] shrink-0" />;
            }

            return (
              <motion.div
                key={toast.id}
                id={`toast-${toast.id}`}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border ${borderClass} ${bgClass} ${glow} text-white backdrop-blur-md`}
              >
                {icon}
                <div className="flex-1 text-sm font-medium text-[#E5E5E5] leading-snug">
                  {toast.message}
                </div>
                <button
                  id={`btn-close-toast-${toast.id}`}
                  onClick={() => removeToast(toast.id)}
                  className="text-[#9CA3AF] hover:text-white transition-colors p-0.5 rounded focus:outline-none"
                  aria-label="Close notification"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
