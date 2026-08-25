import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import useInView from "../../hooks/useInView";
import Section from "./Section";

function PopularCourses({ limit = 6 }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await api.get("/courses");
        setCourses(data.slice(0, limit));
      } catch (err) {
        console.error("Failed to load courses", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [limit]);

  return (
    <section className="max-w-7xl mx-auto px-6 py-16 bg-gray-50 dark:bg-gray-900/40">
      <Section
        eyebrow="Top Rated"
        title="Popular Courses"
        subtitle="Hand-picked courses loved by our students. Start your journey today."
      />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: limit }).map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800"
            >
              <div className="h-40 skeleton" />
              <div className="p-5 space-y-3">
                <div className="h-4 w-2/3 skeleton rounded" />
                <div className="h-3 w-full skeleton rounded" />
                <div className="h-3 w-4/5 skeleton rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, i) => (
              <CourseCard key={course._id} course={course} index={i} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/courses"
              className="btn-ripple inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-7 py-3 rounded-xl font-semibold shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5 transition-all"
            >
              View All Courses
              <span>→</span>
            </Link>
          </div>
        </>
      )}
    </section>
  );
}

function CourseCard({ course, index }) {
  const [ref, inView] = useInView();
  const rating = 4.5;
  const students = 1200 + (index * 137) % 3000;

  return (
    <Link
      to={`/courses/${course._id}`}
      ref={ref}
      className={`reveal ${inView ? "in-view" : ""} group bg-white dark:bg-gray-900 rounded-2xl shadow-sm hover:shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden transition-all duration-300 hover:-translate-y-1.5`}
      style={{ transitionDelay: `${(index % 3) * 80}ms` }}
    >
      {/* Thumbnail */}
      <div className="h-44 bg-gradient-to-br from-indigo-500 to-purple-600 relative overflow-hidden">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white text-5xl font-bold">
            {course.title?.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/50 text-white text-xs font-semibold backdrop-blur">
          {course.category || "General"}
        </span>
        {/* Wishlist */}
        <button
          onClick={(e) => e.preventDefault()}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur flex items-center justify-center hover:bg-white transition-colors"
          aria-label="Save course"
        >
          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold px-2 py-1 rounded bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300">
            {course.level || "All Levels"}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            ⏱ {course.duration || "Self-paced"}
          </span>
        </div>

        <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
          {course.title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
          {course.description}
        </p>

        {/* Instructor */}
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
          by {course.instructor?.name || "Expert Instructor"}
        </p>

        {/* Rating + students */}
        <div className="flex items-center gap-2 mt-2">
          <span className="flex items-center gap-1 text-sm font-bold text-gray-800 dark:text-gray-100">
            {rating}
            <span className="text-amber-400">★</span>
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            ({students.toLocaleString()} students)
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
          <p className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">
            ₹{course.price}
            <span className="text-xs font-normal text-gray-400 line-through ml-2">
              ₹{Math.round(course.price * 2.2)}
            </span>
          </p>
          <span className="text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 px-3 py-1.5 rounded-lg group-hover:scale-105 transition-transform">
            Enroll →
          </span>
        </div>
      </div>
    </Link>
  );
}

export default PopularCourses;
