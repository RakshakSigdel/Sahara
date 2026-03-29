/* ═══════════════════════════════════════════
   Performance utilities
   ═══════════════════════════════════════════ */

/** Debounce — delays execution until idle for `wait` ms */
export function debounce(fn, wait = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}

/** Throttle — executes at most once per `limit` ms */
export function throttle(fn, limit = 200) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= limit) {
      last = now;
      fn(...args);
    }
  };
}

/** Check if reduced-motion is preferred */
export function prefersReducedMotion() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}
