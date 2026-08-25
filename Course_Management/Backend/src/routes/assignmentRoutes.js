import express from "express";
import {
  createAssignment,
  getAssignments,
  submitAssignment,
  gradeAssignment,
} from "../controllers/assignmentController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Instructor: create assignment
router.post("/:courseId", protect, authorize("admin", "instructor"), createAssignment);

// Get assignments for a course
router.get("/course/:courseId", protect, getAssignments);

// Student: submit assignment
router.post("/:assignmentId/submit", protect, authorize("student"), submitAssignment);

// Instructor: grade assignment
router.put(
  "/:assignmentId/grade/:submissionId",
  protect,
  authorize("admin", "instructor"),
  gradeAssignment
);

export default router;
