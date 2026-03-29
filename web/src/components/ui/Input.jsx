import { forwardRef, useState, useId } from 'react';
import { cn } from '../../utils/cn';

/**
 * @param {object} props
 * @param {string} [props.label]
 * @param {string} [props.error]
 * @param {string} [props.helpText]
 * @param {React.ReactNode} [props.leftIcon]
 * @param {React.ReactNode} [props.rightIcon]
 * @param {string} [props.className]
 * @param {string} [props.containerClassName]
 */
const Input = forwardRef(
  (
    {
      label,
      error,
      helpText,
      leftIcon,
      rightIcon,
      className,
      containerClassName,
      type = 'text',
      id: propId,
      ...props
    },
    ref,
  ) => {
    const autoId = useId();
    const id = propId || autoId;
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(!!props.value || !!props.defaultValue);

    const handleFocus = (e) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };

    const handleBlur = (e) => {
      setIsFocused(false);
      setHasValue(!!e.target.value);
      props.onBlur?.(e);
    };

    const handleChange = (e) => {
      setHasValue(!!e.target.value);
      props.onChange?.(e);
    };

    const isFloating = isFocused || hasValue;

    return (
      <div className={cn('relative w-full', containerClassName)}>
        {/* Input wrapper */}
        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted z-10">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={id}
            type={type}
            className={cn(
              'peer w-full',
              'h-12 md:h-[52px]',
              'px-4 pt-5 pb-1',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              'border-[1.5px] rounded',
              'text-text-primary text-base bg-transparent',
              'transition-all duration-200',
              'placeholder:text-transparent',
              error
                ? 'border-error focus:border-error focus:ring-2 focus:ring-error/20'
                : [
                    'border-border-strong',
                    'focus:border-deep-teal focus:ring-2 focus:ring-deep-teal/15',
                  ].join(' '),
              'outline-none',
              'disabled:bg-muted disabled:text-text-muted disabled:cursor-not-allowed',
              className,
            )}
            placeholder={label || ' '}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            {...props}
          />

          {/* Floating label */}
          {label && (
            <label
              htmlFor={id}
              className={cn(
                'absolute left-4 transition-all duration-200 pointer-events-none',
                leftIcon && 'left-10',
                isFloating
                  ? 'top-1.5 text-xs font-medium'
                  : 'top-1/2 -translate-y-1/2 text-base',
                error
                  ? 'text-error'
                  : isFloating
                    ? 'text-deep-teal'
                    : 'text-text-muted',
              )}
            >
              {label}
            </label>
          )}

          {rightIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
              {rightIcon}
            </span>
          )}
        </div>

        {/* Help text / Error message */}
        {(error || helpText) && (
          <p
            className={cn(
              'mt-1.5 text-xs',
              error ? 'text-error' : 'text-text-muted',
            )}
          >
            {error || helpText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export { Input };
export default Input;
