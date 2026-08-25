import { Link } from "react-router-dom";
import useInView from "../../hooks/useInView";
import Section from "./Section";

const categories = [
  { name: "Web Development", icon: "💻", count: 120, color: "from-blue-500 to-indigo-600" },
  { name: "Data Science", icon: "📊", count: 85, color: "from-green-500 to-emerald-600" },
  { name: "Mobile Development", icon: "📱", count: 60, color: "from-purple-500 to-fuchsia-600" },
  { name: "Artificial Intelligence", icon: "🤖", count: 75, color: "from-pink-500 to-rose-600" },
  { name: "Cloud Computing", icon: "☁️", count: 40, color: "from-sky-500 to-cyan-600" },
  { name: "Cybersecurity", icon: "🔐", count: 30, color: "from-red-500 to-orange-600" },
  { name: "UI/UX Design", icon: "🎨", count: 55, color: "from-amber-500 to-yellow-600" },
  { name: "DevOps", icon: "🚀", count: 45, color: "from-teal-500 to-cyan-600" },
  { name: "Game Development", icon: "🎮", count: 35, color: "from-indigo-500 to-violet-600" },
  { name: "Programming", icon: "⌨️", count: 150, color: "from-gray-600 to-gray-800" },
];


function Categories() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <Section
        eyebrow="Categories"
        title="Explore Top Categories"
        subtitle="Choose from a wide range of in-demand skills and start learning today."
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {categories.map((cat, i) => (
          <CategoryCard key={i} cat={cat} index={i} />
        ))}
      </div>
    </section>
  );
}

function CategoryCard({ cat, index }) {
  const [ref, inView] = useInView();
  return (
    <Link
      to="/courses"
      ref={ref}
      className={`reveal reveal-scale ${inView ? "in-view" : ""} group bg-white dark:bg-gray-900 rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-800 p-5 text-center transition-all duration-300 hover:-translate-y-1`}
      style={{ transitionDelay: `${(index % 5) * 60}ms` }}
    >
      <div
        className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform`}
      >
        {cat.icon}
      </div>
      <p className="font-bold text-gray-800 dark:text-gray-100 text-sm">
        {cat.name}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        {cat.count} courses
      </p>
    </Link>
  );
}

export default Categories;
