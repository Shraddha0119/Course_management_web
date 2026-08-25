import { Link } from "react-router-dom";

function CourseCard({ course }) {
  return (
    <Link
      to={`/courses/${course._id}`}
      className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-1"
    >
      {/* Thumbnail */}
      <div className="h-40 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{course.title?.charAt(0).toUpperCase()}</span>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span
            className={`text-xs font-semibold px-2 py-1 rounded ${
              course.status === "Active"
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {course.status || "Active"}
          </span>
          <span className="text-sm text-gray-500">{course.duration}</span>
        </div>

        <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
          {course.title}
        </h3>
        <p className="text-gray-500 text-sm mt-1 line-clamp-2">
          {course.description}
        </p>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="text-left">
            <p className="text-xs text-gray-400">Instructor</p>
            <p className="text-sm font-medium text-gray-700">
              {course.instructor?.name || "Admin"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Price</p>
            <p className="text-lg font-bold text-blue-600">₹{course.price}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default CourseCard;

