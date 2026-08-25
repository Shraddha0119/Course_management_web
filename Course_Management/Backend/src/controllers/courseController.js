import Course from "../models/Course.js";
import User from "../models/User.js";

// Create Course (Admin / Instructor)
// Rule: instructor must be a real instructor. Admin must specify a valid instructor.
export const createCourse = async (req, res) => {
  try {
    const { title, description, price, duration, thumbnail, category, instructor, sections } = req.body;

    if (!title || !description || !price || !duration) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let instructorId;
    if (req.user.role === "instructor") {
      instructorId = req.user.id;
    } else if (req.user.role === "admin") {
      // Admin MUST provide a valid instructor
      if (!instructor) {
        return res
          .status(400)
          .json({ message: "Admin must assign an instructor to create a course" });
      }
      const instructorUser = await User.findById(instructor);
      if (!instructorUser || instructorUser.role !== "instructor") {
        return res
          .status(400)
          .json({ message: "Invalid instructor. Please assign a user with the instructor role." });
      }
      instructorId = instructor;
    } else {
      return res.status(403).json({ message: "Only admin or instructor can create courses" });
    }

    const course = await Course.create({
      title,
      description,
      price,
      duration,
      thumbnail: thumbnail || "",
      category: category || "Programming",
      instructor: instructorId,
      sections: sections || [],
    });

    res.status(201).json({ message: "Course created successfully", course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Courses (Public) - support search & category filter
export const getAllCourses = async (req, res) => {
  try {
    const { search, category } = req.query;
    const filter = { status: "Active" };
    if (search) filter.title = { $regex: search, $options: "i" };
    if (category) filter.category = category;

    const courses = await Course.find(filter).populate("instructor", "name email");
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single course by ID
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      "instructor",
      "name email role"
    );
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Course (Admin / Instructor)
export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Only instructor of the course or admin can update
    if (req.user.role === "instructor" && course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    Object.assign(course, req.body);
    await course.save();

    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete course (Admin only)
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    await Course.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Instructor / Admin: View Students Enrolled in Course
export const getCourseStudents = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (req.user.role === "instructor" && course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    const students = await User.find({
      role: "student",
      enrolledCourses: id,
    }).select("name email");

    res.status(200).json({
      course: course.title,
      totalStudents: students.length,
      students,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add review to a course (student)
export const addReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Prevent duplicate review
    course.reviews = course.reviews.filter((r) => r.user.toString() !== userId);
    course.reviews.push({ user: userId, rating, comment });
    course.rating = Math.round(
      (course.reviews.reduce((a, r) => a + r.rating, 0) / course.reviews.length) * 10
    ) / 10;

    await course.save();
    res.status(200).json({ message: "Review submitted", rating: course.rating, reviews: course.reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
