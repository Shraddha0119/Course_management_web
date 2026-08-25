import useInView from "../../hooks/useInView";

/**
 * Section - reusable section header with eyebrow label, title, subtitle,
 * and optional right-side action link. Scroll-reveal animated.
 */
function Section({ eyebrow, title, subtitle, action, actionLink, center = true }) {
  const [ref, inView] = useInView();

  return (
    <div
      ref={ref}
      className={`reveal ${inView ? "in-view" : ""} mb-10 ${
        center ? "text-center" : "text-left"
      }`}
    >
      {eyebrow && (
        <span className="inline-block px-4 py-1.5 rounded-full glass text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-300 mb-4">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
        {title}
      </h2>
      {subtitle && (
        <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
      {action && actionLink && (
        <div className={`mt-6 ${center ? "text-center" : ""}`}>
          <a
            href={actionLink}
            className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold hover:gap-3 transition-all"
          >
            {action}
            <span>→</span>
          </a>
        </div>
      )}
    </div>
  );
}

export default Section;
