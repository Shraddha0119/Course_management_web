import { Link } from "react-router-dom";
import useInView from "../../hooks/useInView";
import Section from "./Section";

function CertificatePreview() {
  const [ref, inView] = useInView();

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <Section
        eyebrow="Certificates"
        title="Get Recognized For Your Skills"
        subtitle="Earn beautiful, verifiable certificates and showcase them on LinkedIn, your resume, or your portfolio."
      />

      <div
        ref={ref}
        className={`reveal reveal-scale ${inView ? "in-view" : ""} relative max-w-3xl mx-auto`}
      >
        {/* Certificate card */}
        <div className="relative rounded-2xl border-4 border-amber-400/70 bg-gradient-to-br from-white to-amber-50 dark:from-gray-800 dark:to-gray-900 p-8 shadow-2xl overflow-hidden">
          {/* Decorative border */}
          <div className="absolute inset-3 rounded-xl border-2 border-dashed border-amber-300/50 pointer-events-none" />

          {/* Gold seal */}
          <div className="absolute bottom-6 right-6 w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center shadow-lg opacity-90">
            <div className="w-16 h-16 rounded-full border-2 border-amber-200 flex items-center justify-center">
              <span className="text-2xl">🎓</span>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-6">
            <p className="text-sm uppercase tracking-widest text-amber-600 font-semibold">
              Certificate of Completion
            </p>
            <h3 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mt-1">
              Course Management Academy
            </h3>
          </div>

          {/* Body */}
          <div className="text-center space-y-3">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              This is to certify that
            </p>
            <p className="text-2xl font-serif italic text-gray-900 dark:text-white">
              Student Name
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md mx-auto">
              has successfully completed the course
            </p>
            <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
              Full Stack Web Development
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              with an overall score of 92% • Issued on January 15, 2025
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-8">
            <div className="text-center">
              <div className="w-24 h-px bg-gray-300 dark:bg-gray-600 mb-1" />
              <p className="text-xs text-gray-500 dark:text-gray-400">Signature</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-lg">
                ▦
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">QR Code</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-px bg-gray-300 dark:bg-gray-600 mb-1" />
              <p className="text-xs text-gray-500 dark:text-gray-400">Director</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <Link
            to={"/courses"}
            className="btn-ripple inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-7 py-3 rounded-xl font-semibold shadow-lg shadow-amber-500/30 hover:-translate-y-0.5 transition-all"
          >
            🎓 Start Earning Yours
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CertificatePreview;
