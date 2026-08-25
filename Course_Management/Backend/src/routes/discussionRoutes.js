import express from "express";
import {
  askQuestion,
  getDiscussions,
  replyToDiscussion,
  toggleLike,
} from "../controllers/discussionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:courseId", protect, getDiscussions);
router.post("/:courseId", protect, askQuestion);
router.post("/:discussionId/reply", protect, replyToDiscussion);
router.put("/:discussionId/reply/:replyId/like", protect, toggleLike);

export default router;
