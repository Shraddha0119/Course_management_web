import useInView from "../../hooks/useInView";
import useCountUp from "../../hooks/useCountUp";

const stats = [
  { value: 10000, suffix: "+", label: "Active Students", icon: "👨‍🎓", color: "from-blue-500 to-indigo-600" },
  { value: 500, suffix: "+", label: "Expert Courses", icon: "📚", color: "from-purple-500 to-fuchsia-600" },
  { value: 100, suffix: "+", label: "Instructors", icon: "👨‍🏫", color: "from-green-500 to-emerald-600" },
  { value: 50000, suffix: "+", label: "Certificates", icon: "🎓", color: "from-pink-500 to-rose-600" },
];

function Stats() {
  const [ref, inView] = useInView();

  return (
    <section className="relative overflow-hidden py-16">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 animate-gradient" />
      <div className="absolute inset-0 bg-black/10" />

      <div
        ref={ref}
        className="relative max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((s, i) => (
          <StatCard key={i} s={s} start={inView} />
        ))}
      </div>
    </section>
  );
}

function StatCard({ s, start }) {
  const value = useCountUp(s.value, { start, duration: 2000 });
  return (
    <div className="text-center text-white p-6 rounded-2xl backdrop-blur bg-white/10 hover:bg-white/20 transition-colors">
      <div className="text-4xl mb-3">{s.icon}</div>
      <p className="text-4xl font-extrabold">
        {value}
        <span>{s.suffix}</span>
      </p>
      <p className="text-sm text-white/80 mt-2">{s.label}</p>
    </div>
  );
}

export default Stats;
