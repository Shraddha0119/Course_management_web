import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import Sidebar from "../components/Sidebar";
import CourseCard from "../components/CourseCard";

function Dashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/courses");
      setCourses(data);
    } catch (err) {
      console.error("Failed to load courses", err);
    } finally {
      setLoading(false);
    }
  };

  // For instructors: show their own courses. For admin: show all.
  const myCourses =
    user?.role === "instructor"
      ? courses.filter((c) => c.instructor?._id === user.id || c.instructor?._id === user._id)
      : courses;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <Sidebar />
      <div className="lg:col-span-3">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-500 mb-8">
          Welcome back, {user?.name}! Manage your courses here.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-600 text-white rounded-xl p-5">
            <p className="text-4xl font-bold">{myCourses.length}</p>
            <p className="mt-1 text-blue-100">My Courses</p>
          </div>
          <div className="bg-green-600 text-white rounded-xl p-5">
            <p className="text-4xl font-bold">{courses.length}</p>
            <p className="mt-1 text-green-100">Total Courses</p>
          </div>
          <div className="bg-purple-600 text-white rounded-xl p-5">
            <p className="text-4xl font-bold capitalize">{user?.role}</p>
            <p className="mt-1 text-purple-100">Role</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Link
            to="/create-course"
            className="bg-yellow-400 text-blue-900 px-5 py-2.5 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
          >
            ➕ Create New Course
          </Link>
          <Link
            to="/courses"
            className="bg-gray-100 text-gray-700 px-5 py-2.5 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            📚 View All Courses
          </Link>
        </div>

        {/* My Courses */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {user?.role === "admin" ? "All Courses" : "My Courses"}
        </h2>

        {loading ? (
          <Loader label="Loading..." />
        ) : myCourses.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-gray-500">No courses yet.</p>
            <Link
              to="/create-course"
              className="text-blue-600 hover:underline mt-2 inline-block"
            >
              Create your first course
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {myCourses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
