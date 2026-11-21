import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    message: String,
    type: {
      type: String,
      enum: ["enrollment", "lesson", "quiz", "assignment", "certificate", "course"],
      default: "enrollment",
    },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Add indexes for better query performance
notificationSchema.index({ user: 1, read: 1, createdAt: -1 });
notificationSchema.index({ user: 1, type: 1 });

export default mongoose.model("Notification", notificationSchema);
