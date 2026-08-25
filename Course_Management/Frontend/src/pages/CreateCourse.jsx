import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";

function CreateCourse() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [instructors, setInstructors] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    duration: "",
    category: "Programming",
    thumbnail: "",
    instructor: "",
  });
  const [sections, setSections] = useState([
    { title: "Introduction", lessons: [{ title: "", description: "", videoUrl: "" }] },
  ]);
  const [submitting, setSubmitting] = useState(false);

  // For admin: fetch instructors list
  useEffect(() => {
    if (user?.role === "admin") {
      fetchInstructors();
    }
  }, [user]);

const fetchInstructors = async () => {
    try {
      const { data } = await api.get("/users/instructors");
      setInstructors(data);
    } catch (e) {
      setInstructors([]);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSectionChange = (si, field, value) => {
    const updated = [...sections];
    updated[si][field] = value;
    setSections(updated);
  };

  const handleLessonChange = (si, li, field, value) => {
    const updated = [...sections];
    updated[si].lessons[li][field] = value;
    setSections(updated);
  };

  const addSection = () => {
    setSections([...sections, { title: "", lessons: [{ title: "", description: "", videoUrl: "" }] }]);
  };

  const removeSection = (si) => {
    setSections(sections.filter((_, i) => i !== si));
  };

  const addLesson = (si) => {
    const updated = [...sections];
    updated[si].lessons.push({ title: "", description: "", videoUrl: "" });
    setSections(updated);
  };

  const removeLesson = (si, li) => {
    const updated = [...sections];
    updated[si].lessons = updated[si].lessons.filter((_, i) => i !== li);
    setSections(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Validate sections have titles and lessons
    const cleanSections = sections
      .filter((s) => s.title.trim())
      .map((s) => ({
        title: s.title,
        lessons: s.lessons
          .filter((l) => l.title.trim())
          .map((l) => ({
            title: l.title,
            description: l.description,
            videoUrl: l.videoUrl,
          })),
      }));

    try {
      const payload = {
        ...form,
        price: Number(form.price),
        thumbnail: form.thumbnail || "",
        category: form.category || "Programming",
        sections: cleanSections,
      };

      // Admin must provide instructor
      if (user?.role === "admin" && !form.instructor) {
        toast.error("Admin must assign an instructor to this course");
        setSubmitting(false);
        return;
      }

      const { data } = await api.post("/courses", payload);
      toast.success("Course created successfully! 🎉");
      navigate(`/courses/${data.course._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create course");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-xl rounded-2xl p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Create Course</h1>
          <p className="text-gray-500 mt-2">
            {user?.role === "admin"
              ? "As admin, you must assign an instructor to the course"
              : "Fill in the details to create a new course"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Course Title *
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="e.g. React for Beginners"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Category
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                <option value="Programming">Programming</option>
                <option value="Web Development">Web Development</option>
                <option value="Data Science">Data Science</option>
                <option value="Design">Design</option>
                <option value="Business">Business</option>
                <option value="Marketing">Marketing</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Description *
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows="4"
              placeholder="Describe what students will learn..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-y"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Price (₹) *
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
                min="0"
                placeholder="e.g. 500"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Duration *
              </label>
              <input
                type="text"
                name="duration"
                value={form.duration}
                onChange={handleChange}
                required
                placeholder="e.g. 6 weeks"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Thumbnail URL
              </label>
              <input
                type="url"
                name="thumbnail"
                value={form.thumbnail}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
          </div>

          {/* Admin assigns instructor */}
          {user?.role === "admin" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Assign Instructor (enter instructor email) *
              </label>
              <input
                type="text"
                name="instructor"
                value={form.instructor}
                onChange={handleChange}
                placeholder="Instructor ID (ObjectId)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <p className="text-xs text-gray-400 mt-1">
                Paste the instructor's user ID (ObjectId). You can copy it from the instructor's login response or register an instructor first.
              </p>
            </div>
          )}

          {/* Sections & Lessons */}
          <div className="border-t border-gray-100 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Course Curriculum</h2>
              <button
                type="button"
                onClick={addSection}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700"
              >
                + Add Section
              </button>
            </div>

            {sections.map((section, si) => (
              <div key={si} className="border border-gray-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) => handleSectionChange(si, "title", e.target.value)}
                    placeholder={`Section ${si + 1} title (e.g. Introduction)`}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeSection(si)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-2">
                  {section.lessons.map((lesson, li) => (
                    <div key={li} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <input
                          type="text"
                          value={lesson.title}
                          onChange={(e) => handleLessonChange(si, li, "title", e.target.value)}
                          placeholder={`Lesson ${li + 1} title`}
                          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => removeLesson(si, li)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          ✕
                        </button>
                      </div>
                      <input
                        type="text"
                        value={lesson.description}
                        onChange={(e) => handleLessonChange(si, li, "description", e.target.value)}
                        placeholder="Lesson description (optional)"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="url"
                        value={lesson.videoUrl}
                        onChange={(e) => handleLessonChange(si, li, "videoUrl", e.target.value)}
                        placeholder="Video URL (YouTube, MP4, etc.)"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => addLesson(si)}
                  className="mt-2 text-blue-600 text-sm font-medium hover:underline"
                >
                  + Add Lesson
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {submitting ? "Creating..." : "Create Course"}
            </button>
            <Link
              to="/dashboard"
              className="px-6 py-3 rounded-lg font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateCourse;
