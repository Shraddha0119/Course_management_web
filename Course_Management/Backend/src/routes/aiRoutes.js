import express from "express";
import { aiChat } from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// AI chat (protected - any logged-in user)
router.post("/chat", protect, aiChat);

export default router;
