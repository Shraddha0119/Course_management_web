import express from "express";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getCourseStudents,
  addReview,
} from "../controllers/courseController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Public
router.get("/", getAllCourses);
router.get("/:id", getCourseById);

// Admin / Instructor
router.post("/", protect, authorize("admin", "instructor"), createCourse);
router.put("/:id", protect, authorize("admin", "instructor"), updateCourse);

// Admin only
router.delete("/:id", protect, authorize("admin"), deleteCourse);

// Instructor/Admin - view students
router.get(
  "/:id/students",
  protect,
  authorize("admin", "instructor"),
  getCourseStudents
);

// Student - add review
router.post("/:id/review", protect, authorize("student"), addReview);

export default router;
