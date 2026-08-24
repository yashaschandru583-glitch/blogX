import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  isDeleting?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Delete',
  isDeleting = false,
  onConfirm,
  onCancel
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div id="delete-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            id="delete-modal-card"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="w-full max-w-md bg-[#151515] border border-[#FF2B2B]/40 rounded-2xl p-6 shadow-[0_0_30px_rgba(255,43,43,0.25)] text-white relative"
          >
            <button
              id="btn-close-delete-modal"
              onClick={onCancel}
              className="absolute top-4 right-4 text-[#9CA3AF] hover:text-white transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-11 h-11 rounded-xl bg-[#FF2B2B]/15 border border-[#FF2B2B]/30 flex items-center justify-center text-[#FF2B2B]">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{title}</h3>
                <p className="text-xs text-[#9CA3AF]">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-sm text-[#E5E5E5] leading-relaxed mb-6 bg-[#0D0D0D] p-3.5 rounded-xl border border-[#292929]">
              {message}
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                id="btn-cancel-delete"
                type="button"
                onClick={onCancel}
                disabled={isDeleting}
                className="px-4 py-2.5 rounded-xl border border-[#292929] bg-[#0D0D0D] text-[#E5E5E5] text-sm font-medium hover:border-[#9CA3AF] hover:text-white transition-all"
              >
                Cancel
              </button>
              <button
                id="btn-confirm-delete"
                type="button"
                onClick={onConfirm}
                disabled={isDeleting}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF2B2B] hover:bg-[#B91C1C] text-white text-sm font-semibold shadow-[0_0_15px_rgba(255,43,43,0.4)] transition-all disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                {isDeleting ? 'Deleting...' : confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
