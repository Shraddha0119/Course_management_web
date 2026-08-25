import express from "express";
import {
  enrollCourse,
  getMyCourses,
  getEnrollment,
  markLessonComplete,
  saveProgress,
  issueCertificate,
  getEnrolledStudents,
} from "../controllers/enrollController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Student enroll course
router.post("/:courseId", protect, authorize("student"), enrollCourse);

// Student's enrolled courses
router.get("/my-courses", protect, authorize("student"), getMyCourses);

// Enrollment detail for a course (learning page)
router.get("/my-courses/:courseId", protect, authorize("student"), getEnrollment);

// Mark lesson complete
router.put("/:courseId/lesson", protect, authorize("student"), markLessonComplete);

// Save watch progress
router.put("/:courseId/progress", protect, authorize("student"), saveProgress);

// Issue certificate
router.post("/:courseId/certificate", protect, authorize("student"), issueCertificate);

// Instructor/Admin - view enrolled students of a course
router.get("/:courseId/students", protect, authorize("admin", "instructor"), getEnrolledStudents);

export default router;
