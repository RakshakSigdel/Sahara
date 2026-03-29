import { cn } from '../../utils/cn';

/**
 * @typedef {'success'|'warning'|'error'|'info'|'default'} BadgeVariant
 * @typedef {'sm'|'md'|'lg'} BadgeSize
 *
 * @param {object} props
 * @param {BadgeVariant} [props.variant='default']
 * @param {BadgeSize} [props.size='md']
 * @param {string} [props.className]
 * @param {React.ReactNode} props.children
 */

const variantStyles = {
  default: 'bg-muted text-text-secondary',
  success: 'bg-success/15 text-success',
  warning: 'bg-warning/15 text-amber-700',
  error: 'bg-error/15 text-error',
  info: 'bg-info/15 text-info',
};

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1 text-sm',
};

function Badge({ variant = 'default', size = 'md', className, children, ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full whitespace-nowrap',
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

Badge.displayName = 'Badge';

export { Badge };
export default Badge;
