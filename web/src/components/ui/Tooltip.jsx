import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../../utils/cn';

/**
 * @param {object} props
 * @param {React.ReactNode} props.content
 * @param {'top'|'bottom'|'left'|'right'} [props.position='top']
 * @param {number} [props.delay=200] - ms delay before showing
 * @param {string} [props.className]
 * @param {React.ReactNode} props.children
 */

const positionStyles = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

const arrowStyles = {
  top: 'top-full left-1/2 -translate-x-1/2 border-t-navy border-x-transparent border-b-transparent',
  bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-navy border-x-transparent border-t-transparent',
  left: 'left-full top-1/2 -translate-y-1/2 border-l-navy border-y-transparent border-r-transparent',
  right: 'right-full top-1/2 -translate-y-1/2 border-r-navy border-y-transparent border-l-transparent',
};

const motionVariants = {
  top: { initial: { opacity: 0, y: 4 }, animate: { opacity: 1, y: 0 } },
  bottom: { initial: { opacity: 0, y: -4 }, animate: { opacity: 1, y: 0 } },
  left: { initial: { opacity: 0, x: 4 }, animate: { opacity: 1, x: 0 } },
  right: { initial: { opacity: 0, x: -4 }, animate: { opacity: 1, x: 0 } },
};

function Tooltip({ content, position = 'top', delay = 200, className, children }) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef(null);

  const show = () => {
    timeoutRef.current = setTimeout(() => setIsVisible(true), delay);
  };

  const hide = () => {
    clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  const variants = motionVariants[position];

  return (
    <div className="relative inline-flex" onMouseEnter={show} onMouseLeave={hide}>
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            role="tooltip"
            className={cn(
              'absolute z-50 pointer-events-none',
              positionStyles[position],
            )}
            initial={variants.initial}
            animate={variants.animate}
            exit={variants.initial}
            transition={{ duration: 0.15 }}
          >
            <div
              className={cn(
                'px-3 py-1.5 rounded text-xs font-medium',
                'bg-navy text-white shadow-lg',
                'whitespace-nowrap',
                className,
              )}
            >
              {content}
            </div>
            {/* Arrow */}
            <span
              className={cn(
                'absolute w-0 h-0 border-4',
                arrowStyles[position],
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

Tooltip.displayName = 'Tooltip';

export { Tooltip };
export default Tooltip;
