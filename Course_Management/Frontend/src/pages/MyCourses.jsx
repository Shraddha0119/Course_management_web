import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Loader from "../components/Loader";

function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/enroll/my-courses");
      setCourses(data.courses || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load your courses");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    if (status === "Completed") return "bg-green-100 text-green-700";
    if (status === "In Progress") return "bg-blue-100 text-blue-700";
    return "bg-gray-100 text-gray-600";
  };

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString() : "—";

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">My Courses 🎓</h1>
      <p className="text-gray-500 mb-8">Continue learning where you left off</p>

      {loading ? (
        <Loader label="Loading your courses..." />
      ) : error ? (
        <div className="text-center py-16"><p className="text-red-500">{error}</p></div>
      ) : courses.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow">
          <p className="text-5xl mb-4">🎒</p>
          <h2 className="text-xl font-bold text-gray-800 mb-2">No enrolled courses yet</h2>
          <p className="text-gray-500 mb-6">Explore courses and start learning!</p>
          <Link to="/courses" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all">
              {/* Thumbnail */}
              <div className="h-40 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold">
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                ) : (
                  <span>{course.title?.charAt(0).toUpperCase()}</span>
                )}
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${getStatusColor(course.status)}`}>
                    {course.status || "Not Started"}
                  </span>
                  <span className="text-xs text-gray-400">Last opened: {formatDate(course.lastOpenedAt)}</span>
                </div>

                <h3 className="text-lg font-bold text-gray-800">{course.title}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Instructor: {course.instructor?.name || "N/A"}
                </p>
                <p className="text-xs text-gray-400 mt-1">Category: {course.category || "General"}</p>

                {/* Progress */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span className="font-semibold">{course.progress || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full transition-all"
                      style={{ width: `${course.progress || 0}%` }}
                    />
                  </div>
                </div>

                {/* Continue button */}
                <Link
                  to={`/learn/${course._id}`}
                  className="mt-4 w-full block text-center bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  {course.progress > 0 ? "▶ Continue Learning" : "Start Learning"}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyCourses;
