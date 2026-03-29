import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * @typedef {'primary'|'secondary'|'outline'|'ghost'|'danger'} ButtonVariant
 * @typedef {'sm'|'md'|'lg'} ButtonSize
 *
 * @param {object} props
 * @param {ButtonVariant} [props.variant='primary']
 * @param {ButtonSize} [props.size='md']
 * @param {boolean} [props.isLoading=false]
 * @param {React.ReactNode} [props.leftIcon]
 * @param {React.ReactNode} [props.rightIcon]
 * @param {string} [props.className]
 * @param {React.ReactNode} props.children
 */

const variantStyles = {
  primary: [
    'bg-gradient-to-r from-deep-teal to-deep-teal-light text-white',
    'hover:shadow-teal hover:-translate-y-0.5',
    'active:translate-y-0 active:shadow-md',
    'disabled:from-deep-teal/50 disabled:to-deep-teal-light/50 disabled:shadow-none disabled:translate-y-0',
  ].join(' '),
  secondary: [
    'bg-white text-deep-teal border-[1.5px] border-deep-teal',
    'hover:bg-deep-teal/5 hover:-translate-y-0.5 hover:shadow-md',
    'active:translate-y-0 active:bg-deep-teal/10',
    'disabled:border-deep-teal/30 disabled:text-deep-teal/40 disabled:translate-y-0',
  ].join(' '),
  outline: [
    'bg-transparent text-text-primary border-[1.5px] border-border-strong',
    'hover:border-deep-teal hover:text-deep-teal hover:-translate-y-0.5',
    'active:translate-y-0',
    'disabled:border-border/50 disabled:text-text-muted disabled:translate-y-0',
  ].join(' '),
  ghost: [
    'bg-transparent text-text-secondary',
    'hover:bg-muted hover:text-text-primary',
    'active:bg-border',
    'disabled:text-text-muted',
  ].join(' '),
  danger: [
    'bg-coral text-white',
    'hover:bg-coral-dark hover:-translate-y-0.5 hover:shadow-md',
    'active:translate-y-0',
    'disabled:bg-coral/50 disabled:translate-y-0',
  ].join(' '),
};

const sizeStyles = {
  sm: 'h-8 px-3 text-sm gap-1.5 rounded-sm',
  md: 'h-10 px-5 text-base gap-2 rounded',
  lg: 'h-12 px-7 text-lg gap-2.5 rounded-md',
};

const Button = forwardRef(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      className,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center font-medium',
          'transition-all duration-200 ease-out',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-deep-teal',
          'cursor-pointer disabled:cursor-not-allowed',
          'select-none whitespace-nowrap',
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="animate-spin" size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  },
);

Button.displayName = 'Button';

export { Button };
export default Button;
