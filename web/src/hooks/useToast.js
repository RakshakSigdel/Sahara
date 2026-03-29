import { useState, useCallback, useRef } from 'react';

let toastIdCounter = 0;

/**
 * Hook for managing toast notifications.
 *
 * @returns {{
 *   toasts: Array<{id: number, variant: string, title: string, description?: string}>,
 *   addToast: (options: {variant?: string, title: string, description?: string, duration?: number}) => number,
 *   removeToast: (id: number) => void,
 *   clearAll: () => void,
 * }}
 *
 * @example
 * const { toasts, addToast, removeToast } = useToast();
 * addToast({ variant: 'success', title: 'Saved!', description: 'Your changes were saved.' });
 */
export function useToast() {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef(new Map());

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const addToast = useCallback(
    ({ variant = 'info', title, description, duration = 5000 }) => {
      const id = ++toastIdCounter;
      const toast = { id, variant, title, description };

      setToasts((prev) => [...prev, toast]);

      if (duration > 0) {
        const timer = setTimeout(() => removeToast(id), duration);
        timersRef.current.set(id, timer);
      }

      return id;
    },
    [removeToast],
  );

  const clearAll = useCallback(() => {
    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current.clear();
    setToasts([]);
  }, []);

  return { toasts, addToast, removeToast, clearAll };
}

export default useToast;
