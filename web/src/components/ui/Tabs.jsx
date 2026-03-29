import { useRef, useLayoutEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

/**
 * @param {object} props
 * @param {Array<{value: string, label: string, icon?: React.ReactNode}>} props.tabs
 * @param {string} props.activeTab
 * @param {function} props.onChange - (value: string) => void
 * @param {'line'|'pills'} [props.variant='line']
 * @param {string} [props.className]
 */
function Tabs({ tabs = [], activeTab, onChange, variant = 'line', className }) {
  const containerRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  useLayoutEffect(() => {
    if (!containerRef.current || variant !== 'line') return;
    const activeEl = containerRef.current.querySelector(`[data-tab-value="${activeTab}"]`);
    if (activeEl) {
      setIndicatorStyle({
        left: activeEl.offsetLeft,
        width: activeEl.offsetWidth,
      });
    }
  }, [activeTab, tabs, variant]);

  if (variant === 'pills') {
    return (
      <div className={cn('flex gap-1 p-1 bg-muted rounded-md', className)} role="tablist">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.value;
          return (
            <button
              key={tab.value}
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(tab.value)}
              className={cn(
                'relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-sm',
                'transition-colors duration-150',
                'cursor-pointer',
                isActive ? 'text-text-primary' : 'text-text-muted hover:text-text-secondary',
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="pills-indicator"
                  className="absolute inset-0 bg-surface rounded-sm shadow-sm"
                  transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                {tab.icon}
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn('relative', className)}>
      <div
        ref={containerRef}
        className="flex gap-1 border-b border-border"
        role="tablist"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.value;
          return (
            <button
              key={tab.value}
              role="tab"
              aria-selected={isActive}
              data-tab-value={tab.value}
              onClick={() => onChange(tab.value)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 text-sm font-medium',
                'transition-colors duration-150 -mb-px',
                'cursor-pointer',
                isActive ? 'text-deep-teal' : 'text-text-muted hover:text-text-secondary',
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Sliding underline indicator */}
      <motion.div
        className="absolute bottom-0 h-[2px] bg-deep-teal rounded-full"
        animate={indicatorStyle}
        transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
      />
    </div>
  );
}

Tabs.displayName = 'Tabs';

export { Tabs };
export default Tabs;
