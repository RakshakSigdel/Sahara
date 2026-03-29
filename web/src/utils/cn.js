import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines clsx and tailwind-merge for optimal className management.
 * Handles conditional classes, arrays, and resolves Tailwind conflicts.
 *
 * @param {...(string|object|array)} inputs - Class names, objects, or arrays
 * @returns {string} Merged and deduplicated className string
 *
 * @example
 * cn('px-4 py-2', isActive && 'bg-deep-teal text-white', className)
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
