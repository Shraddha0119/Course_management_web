import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className="bg-white shadow-md rounded-xl p-6 h-fit sticky top-20">
      {/* User profile */}
      <div className="text-center border-b border-gray-100 pb-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold mx-auto">
          {user?.name?.charAt(0).toUpperCase() || "U"}
        </div>
        <h3 className="mt-3 font-bold text-gray-800">{user?.name}</h3>
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded mt-1 inline-block">
          {user?.role}
        </span>
      </div>

      {/* Navigation */}
      <nav className="space-y-1">
        <Link
          to="/courses"
          className="block px-4 py-2.5 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
        >
          📚 All Courses
        </Link>

        {(user?.role === "admin" || user?.role === "instructor") && (
          <>
            <Link
              to="/create-course"
              className="block px-4 py-2.5 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              ➕ Create Course
            </Link>
            <Link
              to="/dashboard"
              className="block px-4 py-2.5 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              📊 Dashboard
            </Link>
          </>
        )}

        {user?.role === "student" && (
          <Link
            to="/my-courses"
            className="block px-4 py-2.5 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            🎓 My Courses
          </Link>
        )}

        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
        >
          🚪 Logout
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;
