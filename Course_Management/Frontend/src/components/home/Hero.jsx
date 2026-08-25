import { Link } from "react-router-dom";
import useInView from "../../hooks/useInView";

const stats = [
  { value: "10,000+", label: "Students" },
  { value: "500+", label: "Courses" },
  { value: "100+", label: "Instructors" },
  { value: "50,000+", label: "Certificates" },
];

const companies = ["Google", "Microsoft", "Amazon", "Meta", "Netflix", "Adobe"];

function Hero() {
  const [leftRef, leftIn] = useInView();
  const [rightRef, rightIn] = useInView();

  return (
    <section className="relative overflow-hidden">
      {/* Animated gradient blobs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-indigo-500/30 blur-3xl animate-float-slow" />
      <div className="absolute top-40 -right-24 w-80 h-80 rounded-full bg-purple-500/30 blur-3xl animate-float" />
      <div className="absolute bottom-0 left-1/3 w-72 h-72 rounded-full bg-pink-500/20 blur-3xl animate-float-slow" />

      {/* Floating geometric shapes */}
      <div className="absolute top-24 left-10 w-10 h-10 rounded-xl bg-indigo-400/40 animate-spin-slow hidden md:block" />
      <div className="absolute top-1/2 -left-4 w-6 h-6 rounded-full bg-purple-400/40 animate-float hidden md:block" />
      <div className="absolute bottom-32 right-16 w-8 h-8 rounded-full bg-pink-400/40 animate-float hidden md:block" />

      <div className="relative max-w-7xl mx-auto px-6 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left column */}
        <div
          ref={leftRef}
          className={`reveal reveal-left ${leftIn ? "in-view" : ""}`}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm font-semibold text-indigo-700 dark:text-indigo-300 mb-6">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            AI-Powered Learning Platform
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-gray-900 dark:text-white">
            Master New Skills With{" "}
            <span className="text-gradient">AI-Powered</span> Learning
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-300 mt-6 max-w-xl leading-relaxed">
            Learn from industry experts, get an AI co-pilot for coding,
            complete real-world projects, and earn certificates that matter.
            Your path to a tech career starts here.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-4 mt-8">
            <Link
              to="/courses"
              className="btn-ripple bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-7 py-3.5 rounded-xl font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all"
            >
              🚀 Explore Courses
            </Link>
            <Link
              to="/register"
              className="btn-ripple glass text-indigo-700 dark:text-indigo-200 px-7 py-3.5 rounded-xl font-semibold hover:-translate-y-0.5 transition-all hover:bg-white/80 dark:hover:bg-gray-800"
            >
              ▶ Start Learning
            </Link>
          </div>

          {/* Animated statistics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10">
            {stats.map((s, i) => (
              <div
                key={i}
                className="glass rounded-2xl p-4 text-center hover:-translate-y-1 transition-transform"
              >
                <p className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-300">
                  {s.value}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          {/* Trusted companies */}
          <div className="mt-10">
            <p className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-4 text-center sm:text-left">
              Trusted by teams at
            </p>
            <div className="overflow-hidden">
              <div className="flex gap-8 animate-marquee w-max">
                {[...companies, ...companies].map((c, i) => (
                  <span
                    key={i}
                    className="text-lg font-bold text-gray-400 dark:text-gray-600 whitespace-nowrap"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right column - hero visual */}
        <div
          ref={rightRef}
          className={`reveal reveal-right ${rightIn ? "in-view" : ""} relative`}
        >
          <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-indigo-500/20">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"
              alt="Students learning online"
              loading="lazy"
              className="w-full h-[420px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/40 to-transparent" />
          </div>

          {/* Floating cards */}
          <div className="absolute -left-4 top-8 glass rounded-2xl p-4 shadow-xl animate-float">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📈</span>
              <div>
                <p className="text-sm font-bold text-gray-800 dark:text-white">
                  Progress 85%
                </p>
                <div className="w-24 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mt-1">
                  <div className="w-[85%] h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -right-2 top-1/3 glass rounded-2xl p-4 shadow-xl animate-float-slow">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🤖</span>
              <div>
                <p className="text-sm font-bold text-gray-800 dark:text-white">
                  AI Assistant
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Explaining closures...
                </p>
              </div>
            </div>
          </div>

          <div className="absolute -left-2 bottom-16 glass rounded-2xl p-4 shadow-xl animate-float">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🏆</span>
              <div>
                <p className="text-sm font-bold text-gray-800 dark:text-white">
                  Certificate Earned
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Full Stack Developer
                </p>
              </div>
            </div>
          </div>

          <div className="absolute -right-4 bottom-4 glass rounded-2xl p-4 shadow-xl animate-float-slow">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <p className="text-sm font-bold text-gray-800 dark:text-white">
                  Quiz Completed
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  Passed 95%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
