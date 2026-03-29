import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

/**
 * @param {object} props
 * @param {number} props.value - 0 to 100
 * @param {'circular'|'linear'} [props.variant='linear']
 * @param {'sm'|'md'|'lg'} [props.size='md']
 * @param {boolean} [props.showLabel=false]
 * @param {string} [props.color] - Tailwind color class for the fill
 * @param {string} [props.className]
 */

const linearSizeStyles = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

const circularSizes = {
  sm: { size: 48, stroke: 4 },
  md: { size: 80, stroke: 6 },
  lg: { size: 120, stroke: 8 },
};

function Progress({
  value = 0,
  variant = 'linear',
  size = 'md',
  showLabel = false,
  color,
  className,
  ...props
}) {
  const clampedValue = Math.min(100, Math.max(0, value));

  if (variant === 'circular') {
    return (
      <CircularProgress
        value={clampedValue}
        size={size}
        showLabel={showLabel}
        color={color}
        className={className}
        {...props}
      />
    );
  }

  return (
    <div
      role="progressbar"
      aria-valuenow={clampedValue}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn('w-full bg-muted rounded-full overflow-hidden', linearSizeStyles[size], className)}
      {...props}
    >
      <motion.div
        className={cn('h-full rounded-full', color || 'bg-gradient-to-r from-deep-teal to-deep-teal-light')}
        initial={{ width: 0 }}
        animate={{ width: `${clampedValue}%` }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />
      {showLabel && size === 'lg' && (
        <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">
          {clampedValue}%
        </span>
      )}
    </div>
  );
}

function CircularProgress({ value, size = 'md', showLabel, color, className, ...props }) {
  const { size: svgSize, stroke } = circularSizes[size];
  const radius = (svgSize - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  const strokeDashoffset = useMemo(
    () => circumference - (value / 100) * circumference,
    [value, circumference],
  );

  // Determine fill color for the stroke
  const strokeColor = color || 'var(--color-deep-teal)';

  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: svgSize, height: svgSize }}
      {...props}
    >
      <svg
        width={svgSize}
        height={svgSize}
        viewBox={`0 0 ${svgSize} ${svgSize}`}
        className="-rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={svgSize / 2}
          cy={svgSize / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-muted"
        />
        {/* Progress circle */}
        <motion.circle
          cx={svgSize / 2}
          cy={svgSize / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </svg>

      {showLabel && (
        <span
          className={cn(
            'absolute font-bold text-text-primary',
            size === 'sm' && 'text-xs',
            size === 'md' && 'text-base',
            size === 'lg' && 'text-xl',
          )}
        >
          {value}%
        </span>
      )}
    </div>
  );
}

Progress.displayName = 'Progress';

export { Progress };
export default Progress;
