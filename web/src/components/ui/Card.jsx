import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

/**
 * @typedef {'default'|'featured'|'interactive'|'stat'} CardVariant
 *
 * @param {object} props
 * @param {CardVariant} [props.variant='default']
 * @param {boolean} [props.hover=false]
 * @param {string} [props.className]
 * @param {React.ReactNode} props.children
 */

const variantStyles = {
  default: 'bg-surface border border-border rounded-md p-6',
  featured: [
    'bg-gradient-to-br from-surface to-sage-light/10',
    'border border-sage/30 rounded-md p-6',
    'shadow-lg',
  ].join(' '),
  interactive: [
    'bg-surface border border-border rounded-md p-6',
    'cursor-pointer',
    'hover:-translate-y-1 hover:shadow-lg hover:border-deep-teal/20',
    'active:translate-y-0 active:shadow-md',
  ].join(' '),
  stat: 'bg-surface border border-border rounded-md p-5',
};

const Card = forwardRef(
  ({ variant = 'default', hover = false, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'transition-all duration-200 ease-out',
          variantStyles[variant],
          hover && variant !== 'interactive' && 'hover:-translate-y-0.5 hover:shadow-md',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = 'Card';

/**
 * Stat card sub-component with icon, value, and label slots.
 *
 * @param {object} props
 * @param {React.ReactNode} [props.icon]
 * @param {string|number} props.value
 * @param {string} props.label
 * @param {string} [props.change] - e.g. "+12%"
 * @param {'up'|'down'} [props.trend]
 * @param {string} [props.className]
 */
function StatCard({ icon, value, label, change, trend, className, ...props }) {
  return (
    <Card variant="stat" className={cn('flex items-start gap-4', className)} {...props}>
      {icon && (
        <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded bg-deep-teal/10 text-deep-teal">
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-2xl font-bold text-text-primary leading-tight">{value}</p>
        <p className="text-sm text-text-muted mt-0.5">{label}</p>
        {change && (
          <p
            className={cn(
              'text-xs font-medium mt-1',
              trend === 'up' ? 'text-success' : trend === 'down' ? 'text-coral' : 'text-text-muted',
            )}
          >
            {change}
          </p>
        )}
      </div>
    </Card>
  );
}

StatCard.displayName = 'StatCard';

export { Card, StatCard };
export default Card;
