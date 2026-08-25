import { useEffect, useRef, useState } from "react";

/**
 * useInView - scroll-reveal hook using IntersectionObserver.
 * Returns a ref to attach to an element and a boolean `inView`.
 * Used to trigger fade/slide-up animations when an element enters the viewport.
 *
 * @param {Object} options - { threshold, once }
 * @returns {[React.RefObject, boolean]} [ref, inView]
 */
export default function useInView({ threshold = 0.15, once = true } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Fallback for older browsers
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setInView(false);
          }
        });
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  return [ref, inView];
}
