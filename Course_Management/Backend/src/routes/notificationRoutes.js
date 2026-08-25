import express from "express";
import { getNotifications, markRead, deleteNotification } from "../controllers/notificationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getNotifications);
router.put("/:id/read", protect, markRead);
router.delete("/:id", protect, deleteNotification);

export default router;
