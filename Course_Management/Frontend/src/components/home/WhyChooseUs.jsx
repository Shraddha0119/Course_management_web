import useInView from "../../hooks/useInView";
import Section from "./Section";

const features = [
  {
    icon: "🤖",
    title: "AI-Powered Tutoring",
    desc: "Get instant help from our AI co-pilot for coding, debugging, and concepts 24/7.",
    color: "from-indigo-500 to-purple-600",
  },
  {
    icon: "📚",
    title: "Structured Curriculum",
    desc: "Learn with modules, lessons, and hands-on projects designed by experts.",
    color: "from-blue-500 to-cyan-600",
  },
  {
    icon: "💻",
    title: "Interactive Code Editor",
    desc: "Run and practice code directly in your browser with instant feedback.",
    color: "from-green-500 to-emerald-600",
  },
  {
    icon: "📝",
    title: "Auto-Generated Quizzes",
    desc: "Test your knowledge with adaptive quizzes for every module with instant grading.",
    color: "from-pink-500 to-rose-600",
  },
  {
    icon: "🏆",
    title: "Verified Certificates",
    desc: "Earn shareable, university-style certificates you can showcase on LinkedIn.",
    color: "from-amber-500 to-orange-600",
  },
  {
    icon: "📈",
    title: "Progress Tracking",
    desc: "Track your learning journey with dashboards, badges, and weekly insights.",
    color: "from-purple-500 to-fuchsia-600",
  },
];

function WhyChooseUs() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <Section
        eyebrow="Why Choose Us"
        title="Everything You Need to Succeed"
        subtitle="We combine world-class content with AI to make learning faster, smarter, and more engaging."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <FeatureCard key={i} f={f} index={i} />
        ))}
      </div>
    </section>
  );
}

function FeatureCard({ f, index }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={`reveal ${inView ? "in-view" : ""} group bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:-translate-y-1`}
      style={{ transitionDelay: `${(index % 3) * 80}ms` }}
    >
      <div
        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform`}
      >
        {f.icon}
      </div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
        {f.title}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
        {f.desc}
      </p>
    </div>
  );
}

export default WhyChooseUs;
