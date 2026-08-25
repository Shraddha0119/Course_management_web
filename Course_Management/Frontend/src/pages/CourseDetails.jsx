import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import { toast } from "react-hot-toast";

function CourseDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/courses/${id}`);
      setCourse(data);
    } catch (err) {
      setError(err.response?.data?.message || "Course not found");
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      toast.error("Please login to enroll");
      navigate("/login");
      return;
    }
    try {
      setEnrolling(true);
      const { data } = await api.post(`/enroll/${id}`);
      toast.success(data.message || "Enrolled successfully! 🎉");
      // Redirect to My Courses as per the spec
      navigate("/my-courses");
    } catch (err) {
      toast.error(err.response?.data?.message || "Enrollment failed");
    } finally {
      setEnrolling(false);
    }
  };

  const totalLessons = course?.sections?.reduce(
    (a, s) => a + s.lessons.length,
    0
  );

  if (loading) return <Loader label="Loading course..." />;
  if (error)
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">{error}</p>
        <Link to="/courses" className="text-blue-600 hover:underline mt-4 inline-block">
          ← Back to courses
        </Link>
      </div>
    );

  const isOwner =
    user &&
    (user._id === course.instructor?._id || user.id === course.instructor?._id);
  const canManage =
    user && (user.role === "admin" || (user.role === "instructor" && isOwner));

  return (
    <div>
      <Link to="/courses" className="text-blue-600 hover:underline inline-block mb-4">
        ← Back to courses
      </Link>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Banner with thumbnail */}
        <div className="h-64 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
          {course.thumbnail ? (
            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white">
              <span className="text-8xl font-bold">{course.title?.charAt(0).toUpperCase()}</span>
            </div>
          )}
          <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-6">
            <h1 className="text-3xl font-bold text-white drop-shadow">{course.title}</h1>
          </div>
        </div>

        <div className="p-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-xs font-semibold px-2 py-1 rounded bg-green-100 text-green-700">
              {course.status || "Active"}
            </span>
            <span className="text-sm text-gray-500">⏱ {course.duration}</span>
            <span className="text-sm text-gray-500">📂 {course.category || "General"}</span>
            <span className="text-sm text-gray-500">📚 {totalLessons || 0} lessons</span>
            <span className="text-sm text-gray-500">👥 {course.enrollmentCount || 0} enrolled</span>
            {course.rating > 0 && (
              <span className="text-sm text-yellow-500">⭐ {course.rating}</span>
            )}
          </div>

          <div className="mt-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
              {course.instructor?.name?.charAt(0).toUpperCase() || "A"}
            </div>
            <div>
              <p className="text-sm text-gray-500">Instructor</p>
              <p className="font-medium text-gray-800">
                {course.instructor?.name || "N/A"}{" "}
                {course.instructor?.role === "instructor" && (
                  <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded ml-1">
                    Instructor
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="mt-6 border-t border-gray-100 pt-6">
            <h2 className="text-xl font-bold text-gray-800 mb-3">About this course</h2>
            <p className="text-gray-600 leading-relaxed">{course.description}</p>
          </div>

          {/* Course curriculum */}
          {course.sections?.length > 0 && (
            <div className="mt-6 border-t border-gray-100 pt-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Course Curriculum</h2>
              <div className="space-y-3">
                {course.sections.map((section, si) => (
                  <div key={si} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
                      <p className="font-semibold text-gray-800">
                        Section {si + 1}: {section.title}
                      </p>
                      <p className="text-xs text-gray-500">{section.lessons.length} lessons</p>
                    </div>
                    <ul className="divide-y divide-gray-100">
                      {section.lessons.map((lesson, li) => (
                        <li key={li} className="px-4 py-2.5 flex items-center gap-2 text-sm text-gray-600">
                          <span>▶</span> {lesson.title}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          {course.reviews?.length > 0 && (
            <div className="mt-6 border-t border-gray-100 pt-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Reviews ({course.reviews.length})
              </h2>
              <div className="space-y-3">
                {course.reviews.map((r, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-1 text-yellow-500 text-sm">
                      {"⭐".repeat(r.rating)}
                    </div>
                    {r.comment && <p className="text-sm text-gray-600 mt-1">{r.comment}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-6">
            <div>
              <p className="text-sm text-gray-500">Course Price</p>
              <p className="text-3xl font-bold text-blue-600">₹{course.price}</p>
            </div>

            <div className="flex gap-3">
              {canManage && (
                <Link
                  to={`/edit-course/${course._id}`}
                  className="bg-gray-100 text-gray-700 px-5 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  ✏️ Edit Course
                </Link>
              )}

              {user?.role === "student" && (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {enrolling ? "Enrolling..." : "🎓 Enroll Now"}
                </button>
              )}

              {!user && (
                <Link
                  to="/login"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Login to Enroll
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetails;
