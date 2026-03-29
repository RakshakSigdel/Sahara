import { cn } from '../../utils/cn';

/**
 * @typedef {'text'|'card'|'avatar'|'stat'} SkeletonVariant
 *
 * @param {object} props
 * @param {SkeletonVariant} [props.variant='text']
 * @param {string|number} [props.width]
 * @param {string|number} [props.height]
 * @param {number} [props.count=1]
 * @param {string} [props.className]
 */
function Skeleton({ variant = 'text', width, height, count = 1, className }) {
  const items = Array.from({ length: count }, (_, i) => i);

  if (variant === 'card') {
    return (
      <div className={cn('animate-pulse-soft space-y-4 p-6 bg-surface border border-border rounded-md', className)}>
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-full" />
        <div className="h-3 bg-muted rounded w-5/6" />
        <div className="flex gap-2 pt-2">
          <div className="h-8 bg-muted rounded w-20" />
          <div className="h-8 bg-muted rounded w-16" />
        </div>
      </div>
    );
  }

  if (variant === 'avatar') {
    const size = width || height || 40;
    return (
      <div
        className={cn('animate-pulse-soft bg-muted rounded-full shrink-0', className)}
        style={{ width: size, height: size }}
      />
    );
  }

  if (variant === 'stat') {
    return (
      <div className={cn('animate-pulse-soft flex items-start gap-4 p-5 bg-surface border border-border rounded-md', className)}>
        <div className="w-10 h-10 bg-muted rounded shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-6 bg-muted rounded w-16" />
          <div className="h-3 bg-muted rounded w-24" />
        </div>
      </div>
    );
  }

  // text variant
  return (
    <div className={cn('space-y-2.5', className)}>
      {items.map((i) => (
        <div
          key={i}
          className="animate-pulse-soft bg-muted rounded"
          style={{
            width: width || (i === items.length - 1 && count > 1 ? '60%' : '100%'),
            height: height || 14,
          }}
        />
      ))}
    </div>
  );
}

Skeleton.displayName = 'Skeleton';

export { Skeleton };
export default Skeleton;
