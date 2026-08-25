import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";

// Helper: calculate total lessons in a course
const totalLessons = (course) =>
  course.sections.reduce((acc, s) => acc + s.lessons.length, 0);

// ENROLL in a course
export const enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Prevent duplicate enrollment (unique index also guards)
    const existing = await Enrollment.findOne({ student: studentId, course: courseId });
    if (existing) {
      return res.status(400).json({ message: "Already enrolled in this course" });
    }

    const enrollment = await Enrollment.create({
      student: studentId,
      course: courseId,
      status: "Not Started",
      progress: 0,
    });

    // Update user's enrolledCourses
    await User.findByIdAndUpdate(studentId, {
      $push: { enrolledCourses: courseId },
    });

    // Increment course enrollment count
    await Course.findByIdAndUpdate(courseId, { $inc: { enrollmentCount: 1 } });

    // Create notification
    await Notification.create({
      user: studentId,
      title: "Enrollment Successful",
      message: `You have enrolled in "${course.title}"`,
      type: "enrollment",
    });

    res.status(201).json({
      message: "Enrollment successful",
      enrollment,
    });
  } catch (error) {
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ message: "Already enrolled in this course" });
    }
    res.status(500).json({ message: error.message });
  }
};

// GET student's enrolled courses (with progress)
export const getMyCourses = async (req, res) => {
  try {
    const studentId = req.user.id;

    const enrollments = await Enrollment.find({ student: studentId })
      .populate({
        path: "course",
        populate: { path: "instructor", select: "name email" },
      })
      .sort("-createdAt");

    const courses = enrollments.map((e) => ({
      enrollmentId: e._id,
      status: e.status,
      progress: e.progress,
      lastOpenedAt: e.lastOpenedAt,
      lastVideoTimestamp: e.lastVideoTimestamp,
      certificate: e.certificate,
      ...(e.course?._doc || e.course || {}),
    }));

    res.status(200).json({ count: courses.length, courses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET enrollment detail for a course (for learning page)
export const getEnrollment = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;

    const enrollment = await Enrollment.findOne({ student: studentId, course: courseId });
    if (!enrollment) {
      return res.status(404).json({ message: "Not enrolled in this course" });
    }

    const course = await Course.findById(courseId).populate("instructor", "name email");

    // Compute progress
    const total = totalLessons(course);
    const completed = enrollment.completedLessons.length;
    const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

    res.status(200).json({ enrollment, course, totals: { total, completed, progress } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// MARK a lesson as complete / toggle
export const markLessonComplete = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { sectionIndex, lessonIndex, lessonId } = req.body;
    const studentId = req.user.id;

    const enrollment = await Enrollment.findOne({ student: studentId, course: courseId });
    if (!enrollment) return res.status(404).json({ message: "Not enrolled" });

    const course = await Course.findById(courseId);
    const total = totalLessons(course);

    const already = enrollment.completedLessons.find(
      (l) => l.sectionIndex === sectionIndex && l.lessonIndex === lessonIndex
    );

    let status;
    if (already) {
      // Unmark
      enrollment.completedLessons = enrollment.completedLessons.filter(
        (l) => !(l.sectionIndex === sectionIndex && l.lessonIndex === lessonIndex)
      );
      status = "unmarked";
    } else {
      enrollment.completedLessons.push({
        sectionIndex,
        lessonIndex,
        lessonId,
        completedAt: new Date(),
      });
      status = "completed";
    }

    const completed = enrollment.completedLessons.length;
    enrollment.progress = total === 0 ? 0 : Math.round((completed / total) * 100);
    enrollment.lastOpenedLesson = { sectionIndex, lessonIndex, lessonId };
    enrollment.lastOpenedAt = new Date();

    // Determine status
    if (enrollment.progress === 0) enrollment.status = "Not Started";
    else if (enrollment.progress >= 100) enrollment.status = "Completed";
    else enrollment.status = "In Progress";

    await enrollment.save();

    res.status(200).json({ message: "Progress updated", enrollment, total, completedLength: completed });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// SAVE last watched position
export const saveProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { sectionIndex, lessonIndex, lessonId, timestamp } = req.body;
    const studentId = req.user.id;

    const enrollment = await Enrollment.findOneAndUpdate(
      { student: studentId, course: courseId },
      {
        lastOpenedLesson: { sectionIndex, lessonIndex, lessonId },
        lastOpenedAt: new Date(),
        lastVideoTimestamp: timestamp || 0,
      },
      { new: true }
    );

    if (!enrollment) return res.status(404).json({ message: "Not enrolled" });
    res.status(200).json({ message: "Progress saved", enrollment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ISSUE certificate when 100% complete (checks quizzes passed if any)
export const issueCertificate = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;

    const enrollment = await Enrollment.findOne({ student: studentId, course: courseId });
    if (!enrollment) return res.status(404).json({ message: "Not enrolled" });

    const course = await Course.findById(courseId);
    const total = totalLessons(course);
    const completed = enrollment.completedLessons.length;
    const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

    // Require quizzes passed - fetch required quizzes
    const Quiz = (await import("../models/Quiz.js")).default;
    const quizzes = await Quiz.find({ course: courseId });
    const allPassed = quizzes.every((q) =>
      enrollment.quizResults.some(
        (r) => r.quizIndex === q.sectionIndex && r.passed
      )
    );

    if (progress < 100) {
      return res.status(400).json({ message: "Complete all lessons to earn certificate" });
    }
    if (quizzes.length > 0 && !allPassed) {
      return res.status(400).json({ message: "Pass all quizzes to earn certificate" });
    }

    if (!enrollment.certificate.issued) {
      enrollment.certificate = {
        issued: true,
        certificateId: `CERT-${Date.now()}-${studentId.toString().slice(-4)}`,
        issuedAt: new Date(),
      };
      enrollment.status = "Completed";
      await enrollment.save();

      await Notification.create({
        user: studentId,
        title: "Certificate Ready 🎓",
        message: `Congratulations! Your certificate for "${course.title}" is ready.`,
        type: "certificate",
      });
    }

    res.status(200).json({ message: "Certificate issued", certificate: enrollment.certificate });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET total enrolled students for a course (instructor/admin)
export const getEnrolledStudents = async (req, res) => {
  try {
    const { courseId } = req.params;
    const enrollments = await Enrollment.find({ course: courseId }).populate(
      "student",
      "name email"
    );
    res.status(200).json({ total: enrollments.length, enrollments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
