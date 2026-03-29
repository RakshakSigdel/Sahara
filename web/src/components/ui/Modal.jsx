import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * @param {object} props
 * @param {boolean} props.isOpen
 * @param {function} props.onClose
 * @param {string} [props.title]
 * @param {'sm'|'md'|'lg'|'xl'|'full'} [props.size='md']
 * @param {string} [props.className]
 * @param {React.ReactNode} props.children
 */

const sizeStyles = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-[calc(100vw-2rem)]',
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const contentVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', damping: 25, stiffness: 350 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: { duration: 0.15 },
  },
};

function Modal({ isOpen, onClose, title, size = 'md', className, children }) {
  const handleEscape = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleEscape]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-navy/40 backdrop-blur-sm"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
          />

          {/* Content */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className={cn(
              'relative z-10 w-full',
              'bg-surface rounded-md shadow-xl',
              'max-h-[85vh] flex flex-col',
              sizeStyles[size],
              className,
            )}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border">
                <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
                <button
                  onClick={onClose}
                  className={cn(
                    'flex items-center justify-center w-8 h-8 rounded-sm',
                    'text-text-muted hover:text-text-primary hover:bg-muted',
                    'transition-colors duration-150',
                    'cursor-pointer',
                  )}
                  aria-label="Close dialog"
                >
                  <X size={18} />
                </button>
              </div>
            )}

            {/* Body */}
            <div className={cn('flex-1 overflow-y-auto px-6 py-5', !title && 'pt-6')}>
              {/* Close button when no title */}
              {!title && (
                <button
                  onClick={onClose}
                  className={cn(
                    'absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-sm',
                    'text-text-muted hover:text-text-primary hover:bg-muted',
                    'transition-colors duration-150',
                    'cursor-pointer',
                  )}
                  aria-label="Close dialog"
                >
                  <X size={18} />
                </button>
              )}
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

Modal.displayName = 'Modal';

export { Modal };
export default Modal;
