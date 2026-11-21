import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";
import CourseCard from "../components/CourseCard";
import { CourseGridSkeleton } from "../components/Loader";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") || "";

  // Fetch courses when the page loads
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const { data } = await api.getCached("/courses", {
        params: { limit: 50 },
      });
      const courseList = Array.isArray(data) ? data : data?.courses;
      if (!Array.isArray(courseList)) {
        throw new Error("Unexpected response from the courses service");
      }
      setCourses(courseList);
      setError(null);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to load courses"
      );
    } finally {
      setLoading(false);
    }
  };

  // Filter courses by search AND category (from footer link query param)
  const filtered = useMemo(() => {
    return courses.filter((c) => {
      const title = c.title || "";
      const description = c.description || "";
      const matchesSearch =
        title.toLowerCase().includes(search.toLowerCase()) ||
        description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        !category ||
        (c.category || "").toLowerCase() === category.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [courses, search, category]);

  const categoryCount = useMemo(() => {
    if (category) {
      return courses.filter(
        (c) => (c.category || "").toLowerCase() === category.toLowerCase()
      ).length;
    }
    return courses.length;
  }, [courses, category]);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            {category ? `${category} Courses` : "All Courses"}
          </h1>
          <p className="text-gray-500 mt-1">
            {categoryCount} course{categoryCount !== 1 ? "s" : ""} available
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses..."
            className="w-full sm:w-64 px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>
      </div>

      {loading ? (
        <CourseGridSkeleton count={6} />
      ) : error ? (
        <div className="text-center py-16">
          <p className="text-red-500">{error}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-4xl mb-3">📭</p>
          <p>No courses found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Courses;
