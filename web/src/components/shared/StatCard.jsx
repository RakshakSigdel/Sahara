import { cn } from '../../utils/cn';

/**
 * Reusable stat display card with icon, value, label, and optional trend.
 *
 * @param {object} props
 * @param {React.ReactNode} props.icon
 * @param {string|number} props.value
 * @param {string} props.label
 * @param {'up'|'down'} [props.trend]
 * @param {string} [props.change] - e.g. "+12%"
 * @param {string} [props.color='deep-teal'] - Theme color name
 * @param {'default'|'featured'} [props.variant='default']
 * @param {string} [props.className]
 */
function SharedStatCard({
  icon,
  value,
  label,
  trend,
  change,
  color = 'deep-teal',
  variant = 'default',
  className,
  ...props
}) {
  const colorMap = {
    'deep-teal': { bg: 'bg-deep-teal/10', text: 'text-deep-teal' },
    sage: { bg: 'bg-sage/20', text: 'text-deep-teal-dark' },
    navy: { bg: 'bg-navy/10', text: 'text-navy' },
    coral: { bg: 'bg-coral/10', text: 'text-coral' },
    info: { bg: 'bg-info/10', text: 'text-info' },
  };

  const colors = colorMap[color] || colorMap['deep-teal'];

  return (
    <div
      className={cn(
        'rounded-md p-6 transition-all duration-200',
        variant === 'featured'
          ? 'bg-gradient-to-br from-deep-teal/5 to-sage/10 border border-sage/30 shadow-md'
          : 'bg-surface border border-border',
        className,
      )}
      {...props}
    >
      {/* Icon circle */}
      {icon && (
        <div
          className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center mb-4',
            colors.bg,
            colors.text,
          )}
        >
          {icon}
        </div>
      )}

      {/* Value */}
      <p
        className="text-3xl font-bold text-text-primary leading-none"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        {value}
      </p>

      {/* Label */}
      <p className="mt-2 text-sm text-text-secondary leading-snug">{label}</p>

      {/* Trend */}
      {change && (
        <p
          className={cn(
            'mt-2 text-xs font-medium',
            trend === 'up' ? 'text-success' : trend === 'down' ? 'text-coral' : 'text-text-muted',
          )}
        >
          {trend === 'up' ? '↑' : trend === 'down' ? '↓' : ''} {change}
        </p>
      )}
    </div>
  );
}

SharedStatCard.displayName = 'SharedStatCard';

export { SharedStatCard };
export default SharedStatCard;
