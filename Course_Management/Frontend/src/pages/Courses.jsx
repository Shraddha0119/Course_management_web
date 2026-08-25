import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";
import CourseCard from "../components/CourseCard";
import Loader from "../components/Loader";

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
      const { data } = await api.get("/courses");
      setCourses(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

// Filter courses by search AND category (from footer link query param)
  const filtered = courses.filter((c) => {
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

  const categoryCount = category
    ? courses.filter(
        (c) => (c.category || "").toLowerCase() === category.toLowerCase()
      ).length
    : courses.length;

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
        <Loader label="Loading courses..." />
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
