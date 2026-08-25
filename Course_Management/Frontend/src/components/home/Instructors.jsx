import useInView from "../../hooks/useInView";
import Section from "./Section";

const instructors = [
  {
    name: "Dr. Ananya Iyer",
    role: "AI & Machine Learning",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    courses: 25,
    rating: 4.9,
    students: 12000,
  },
  {
    name: "Vikram Singh",
    role: "Full Stack Development",
    avatar: "https://randomuser.me/api/portraits/men/36.jpg",
    courses: 18,
    rating: 4.8,
    students: 9800,
  },
  {
    name: "Meera Nair",
    role: "UI/UX & Product Design",
    avatar: "https://randomuser.me/api/portraits/women/50.jpg",
    courses: 12,
    rating: 4.9,
    students: 7500,
  },
  {
    name: "Arjun Mehta",
    role: "Cloud & DevOps",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    courses: 15,
    rating: 4.7,
    students: 6400,
  },
];

function Instructors() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16 bg-gray-50 dark:bg-gray-900/40">
      <Section
        eyebrow="Expert Instructors"
        title="Learn From The Best"
        subtitle="Our instructors are industry leaders with years of real-world experience."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {instructors.map((inst, i) => (
          <InstructorCard key={i} inst={inst} index={i} />
        ))}
      </div>
    </section>
  );
}

function InstructorCard({ inst, index }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={`reveal ${inView ? "in-view" : ""} group bg-white dark:bg-gray-900 rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-800 p-6 text-center transition-all duration-300 hover:-translate-y-1`}
      style={{ transitionDelay: `${(index % 4) * 80}ms` }}
    >
      <div className="relative w-24 h-24 mx-auto mb-4">
        <img
          src={inst.avatar}
          alt={inst.name}
          loading="lazy"
          className="w-24 h-24 rounded-full object-cover border-4 border-indigo-200 dark:border-indigo-700 group-hover:scale-105 transition-transform"
        />
        <span className="absolute bottom-0 right-0 bg-green-500 w-5 h-5 rounded-full border-2 border-white dark:border-gray-900" />
      </div>

      <h3 className="font-bold text-gray-900 dark:text-white">{inst.name}</h3>
      <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-1">
        {inst.role}
      </p>

      <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-500 dark:text-gray-400">
        <span>📚 {inst.courses} courses</span>
        <span>⭐ {inst.rating}</span>
      </div>
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
        👥 {inst.students.toLocaleString()} students
      </p>

      <div className="flex justify-center gap-2 mt-4">
        {["𝕏", "in", "▶"].map((icon, i) => (
          <span
            key={i}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-sm text-gray-600 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 cursor-pointer transition-colors"
          >
            {icon}
          </span>
        ))}
      </div>
    </div>
  );
}

export default Instructors;
