import { useEffect, useRef, useState } from "react";

/**
 * useCountUp - animates a number from `start` to `target` when the element
 * scrolls into view. Uses requestAnimationFrame for smooth easing.
 *
 * @param {number} target - final value
 * @param {Object} options - { duration, start, decimals, active }
 * @returns {number} current animated value
 */
export default function useCountUp(
  target,
  { duration = 2000, start = false, decimals = 0 } = {}
) {
  const [value, setValue] = useState(0);
  const previous = useRef(0);

  useEffect(() => {
    if (!start) return;

    let raf;
    const startTime = performance.now();

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic for a smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      const next = start + (target - start) * eased;
      setValue(next);

      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setValue(target);
      }
    };

    // Reset before starting (handle target changes)
    previous.current = 0;
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, start, duration, decimals]);

  // Format with decimals
  const formatted =
    decimals > 0
      ? value.toFixed(decimals)
      : Math.round(value).toLocaleString();

  return formatted;
}
