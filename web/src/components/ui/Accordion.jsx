import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * @param {object} props
 * @param {Array<{title: string, content: React.ReactNode}>} props.items
 * @param {number|number[]} [props.defaultOpen] - Index(es) to open by default
 * @param {boolean} [props.allowMultiple=false]
 * @param {string} [props.className]
 */
function Accordion({ items = [], defaultOpen, allowMultiple = false, className }) {
  const [openItems, setOpenItems] = useState(() => {
    if (defaultOpen === undefined) return new Set();
    if (Array.isArray(defaultOpen)) return new Set(defaultOpen);
    return new Set([defaultOpen]);
  });

  const toggle = useCallback(
    (index) => {
      setOpenItems((prev) => {
        const next = new Set(allowMultiple ? prev : []);
        if (prev.has(index)) {
          next.delete(index);
        } else {
          next.add(index);
        }
        return next;
      });
    },
    [allowMultiple],
  );

  return (
    <div className={cn('divide-y divide-border rounded-md border border-border overflow-hidden', className)}>
      {items.map((item, index) => {
        const isOpen = openItems.has(index);

        return (
          <div key={index} className="bg-surface">
            {/* Trigger */}
            <button
              onClick={() => toggle(index)}
              className={cn(
                'flex items-center justify-between w-full px-5 py-4 text-left',
                'text-text-primary font-medium text-base',
                'hover:bg-muted/50 transition-colors duration-150',
                'cursor-pointer',
              )}
              aria-expanded={isOpen}
            >
              <span>{item.title}</span>
              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="shrink-0 ml-3 text-text-muted"
              >
                <ChevronDown size={18} />
              </motion.span>
            </button>

            {/* Content */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-4 text-text-secondary text-sm leading-relaxed">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

Accordion.displayName = 'Accordion';

export { Accordion };
export default Accordion;
