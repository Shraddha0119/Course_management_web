import express from "express";
import { createQuiz, getQuiz, submitQuiz } from "../controllers/quizController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Instructor: create quiz
router.post("/:courseId", protect, authorize("admin", "instructor"), createQuiz);

// Get quiz for a section
router.get("/:courseId/section/:sectionIndex", protect, getQuiz);

// Submit quiz
router.post("/:courseId/submit/:quizId", protect, authorize("student"), submitQuiz);

export default router;
