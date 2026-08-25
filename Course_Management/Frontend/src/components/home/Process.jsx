import useInView from "../../hooks/useInView";
import Section from "./Section";

const steps = [
  { icon: "📝", title: "Register", desc: "Create your free account in seconds" },
  { icon: "🎯", title: "Pick a Course", desc: "Choose a course that matches your goals" },
  { icon: "📚", title: "Start Learning", desc: "Dive into modules with interactive lessons" },
  { icon: "🤖", title: "Ask AI", desc: "Get help from your AI tutor anytime" },
  { icon: "✅", title: "Pass Quizzes", desc: "Test your knowledge and complete assignments" },
  { icon: "🎓", title: "Get Certified", desc: "Earn a shareable certificate and celebrate" },
];

function Process() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <Section
        eyebrow="How It Works"
        title="Your Learning Journey"
        subtitle="A simple, guided path from starting out to earning your certificate."
      />

      {/* Desktop horizontal timeline */}
      <div className="relative hidden md:block">
        <div className="absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400" />
        <div className="grid grid-cols-6 gap-4">
          {steps.map((s, i) => (
            <Step key={i} s={s} index={i} />
          ))}
        </div>
      </div>

      {/* Mobile vertical timeline */}
      <div className="md:hidden space-y-6">
        {steps.map((s, i) => (
          <MobileStep key={i} s={s} index={i} />
        ))}
      </div>
    </section>
  );
}

function Step({ s, index }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={`reveal ${inView ? "in-view" : ""} text-center`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="relative w-16 h-16 mx-auto bg-white dark:bg-gray-900 rounded-2xl border-2 border-indigo-200 dark:border-indigo-700 shadow-lg flex items-center justify-center text-3xl mb-3 animate-pulse-ring">
        {s.icon}
        <span className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full text-white text-xs font-bold flex items-center justify-center">
          {index + 1}
        </span>
      </div>
      <h3 className="font-bold text-gray-900 dark:text-white text-sm">{s.title}</h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 px-2">{s.desc}</p>
    </div>
  );
}

function MobileStep({ s, index }) {
  return (
    <div className="flex gap-4">
      <div className="relative w-12 h-12 shrink-0 bg-white dark:bg-gray-900 rounded-xl border-2 border-indigo-200 dark:border-indigo-700 flex items-center justify-center text-2xl">
        {s.icon}
        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full text-white text-[10px] font-bold flex items-center justify-center">
          {index + 1}
        </span>
      </div>
      <div>
        <h3 className="font-bold text-gray-900 dark:text-white">{s.title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{s.desc}</p>
      </div>
    </div>
  );
}

export default Process;
