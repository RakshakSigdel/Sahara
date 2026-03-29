import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * @param {object} props
 * @param {Array<{id: number, variant: string, title: string, description?: string}>} props.toasts
 * @param {function} props.onRemove - (id: number) => void
 */

const variantConfig = {
  success: {
    icon: CheckCircle,
    containerClass: 'border-success/30 bg-success/5',
    iconClass: 'text-success',
  },
  error: {
    icon: AlertCircle,
    containerClass: 'border-error/30 bg-error/5',
    iconClass: 'text-error',
  },
  warning: {
    icon: AlertTriangle,
    containerClass: 'border-warning/30 bg-warning/5',
    iconClass: 'text-warning',
  },
  info: {
    icon: Info,
    containerClass: 'border-info/30 bg-info/5',
    iconClass: 'text-info',
  },
};

const toastVariants = {
  initial: { opacity: 0, x: 80, scale: 0.95 },
  animate: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: 80, scale: 0.95, transition: { duration: 0.15 } },
};

function ToastContainer({ toasts = [], onRemove }) {
  return (
    <div
      className="fixed top-4 right-4 z-[100] flex flex-col gap-3 pointer-events-none"
      aria-live="polite"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({ toast, onRemove }) {
  const config = variantConfig[toast.variant] || variantConfig.info;
  const Icon = config.icon;

  return (
    <motion.div
      layout
      variants={toastVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className={cn(
        'pointer-events-auto',
        'flex items-start gap-3 w-80 max-w-[calc(100vw-2rem)]',
        'px-4 py-3 rounded-md border shadow-lg',
        'bg-surface',
        config.containerClass,
      )}
    >
      <Icon size={18} className={cn('shrink-0 mt-0.5', config.iconClass)} />

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-primary">{toast.title}</p>
        {toast.description && (
          <p className="mt-0.5 text-xs text-text-secondary">{toast.description}</p>
        )}
      </div>

      <button
        onClick={() => onRemove(toast.id)}
        className={cn(
          'shrink-0 flex items-center justify-center w-6 h-6 rounded-sm',
          'text-text-muted hover:text-text-primary hover:bg-muted/80',
          'transition-colors duration-150',
          'cursor-pointer',
        )}
        aria-label="Dismiss notification"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
}

ToastContainer.displayName = 'ToastContainer';
ToastItem.displayName = 'ToastItem';

export { ToastContainer, ToastItem };
export default ToastContainer;
