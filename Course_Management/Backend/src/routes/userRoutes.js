import express from "express";
import { getInstructors, getStudents, getProfile, awardBadge } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Logged-in user profile
router.get("/profile", protect, getProfile);

// Award a badge (any logged-in user)
router.post("/badges", protect, awardBadge);

// Admin: list instructors & students
router.get("/instructors", protect, authorize("admin"), getInstructors);
router.get("/students", protect, authorize("admin"), getStudents);

export default router;
