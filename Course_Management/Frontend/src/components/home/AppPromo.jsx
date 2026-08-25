import useInView from "../../hooks/useInView";

function AppPromo() {
  const [ref, inView] = useInView();

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div
        ref={ref}
        className={`reveal ${inView ? "in-view" : ""} relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 to-indigo-950 p-8 md:p-14`}
      >
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-purple-500/20 blur-3xl" />

        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left phone mockup */}
          <div className="relative flex justify-center">
            <div className="w-56 h-[420px] bg-gray-900 rounded-[2.5rem] border-4 border-gray-700 p-3 shadow-2xl">
              <div className="w-full h-full bg-gradient-to-b from-indigo-600 to-purple-700 rounded-[1.8rem] overflow-hidden relative">
                {/* Notch */}
                <div className="w-20 h-5 bg-gray-900 rounded-b-xl absolute top-0 left-1/2 -translate-x-1/2" />
                <div className="p-4 pt-10 text-white">
                  <p className="text-xs text-indigo-200">MY COURSES</p>
                  <p className="text-lg font-bold mt-1">JavaScript Basics</p>
                  <div className="w-full h-2 bg-white/20 rounded-full mt-3">
                    <div className="w-3/4 h-2 bg-green-400 rounded-full" />
                  </div>
                  <p className="text-xs mt-1">75% complete</p>

                  <div className="mt-4 space-y-2">
                    {["Variables & Data Types", "Functions & Scope", "Arrays & Objects"].map((l, i) => (
                      <div key={i} className="bg-white/10 rounded-lg px-3 py-2 text-xs flex items-center gap-2">
                        <span className={i < 2 ? "text-green-400" : "text-white/50"}>
                          {i < 2 ? "✓" : "▸"}
                        </span>
                        {l}
                      </div>
                    ))}
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 bg-white/15 rounded-xl p-3 flex items-center gap-2">
                    <span className="text-xl">🤖</span>
                    <div>
                      <p className="text-xs font-bold">AI Tutor</p>
                      <p className="text-[10px] text-indigo-200">Ready to help</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -right-4 top-10 glass rounded-2xl p-3 shadow-xl animate-float">
              <p className="text-xs text-gray-500 dark:text-gray-400">Weekly Streak</p>
              <p className="text-lg font-bold text-indigo-600 dark:text-indigo-300">🔥 12 days</p>
            </div>
          </div>

          {/* Right text */}
          <div className="text-white">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-sm font-semibold mb-6">
              📱 Learn On The Go
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">
              Your Courses, In Your Pocket
            </h2>
            <p className="mt-4 text-indigo-200 leading-relaxed max-w-lg">
              Download the app and continue learning anywhere. Track your
              progress, take quizzes, and chat with your AI tutor from your
              phone.
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <a
                href="#"
                className="flex items-center gap-3 bg-white text-gray-900 px-5 py-3 rounded-xl font-semibold hover:-translate-y-0.5 transition-all shadow-lg"
              >
                <span className="text-2xl">🍎</span>
                <span>
                  <span className="block text-[10px] text-gray-500">Download on the</span>
                  App Store
                </span>
              </a>
              <a
                href="#"
                className="flex items-center gap-3 bg-white text-gray-900 px-5 py-3 rounded-xl font-semibold hover:-translate-y-0.5 transition-all shadow-lg"
              >
                <span className="text-2xl">▶️</span>
                <span>
                  <span className="block text-[10px] text-gray-500">Get it on</span>
                  Google Play
                </span>
              </a>
            </div>

            <div className="flex gap-6 mt-8">
              <div>
                <p className="text-2xl font-extrabold">4.8★</p>
                <p className="text-xs text-indigo-200">App Rating</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold">1M+</p>
                <p className="text-xs text-indigo-200">Downloads</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold">200K+</p>
                <p className="text-xs text-indigo-200">Daily Learners</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AppPromo;
