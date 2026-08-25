import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/protected", protect, (req, res) => {
  res.json({
    message: "Access granted ✅",
    user: req.user,
  });
});

router.get(
  "/admin-only",
  protect,
  authorize("admin"),
  (req, res) => {
    res.json({ message: "Admin access granted ✅" });
  }
);

export default router;
