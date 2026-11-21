import mongoose from "mongoose";

const replySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    text: String,
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const discussionSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    lessonId: mongoose.Schema.Types.ObjectId,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    question: { type: String, required: true },
    replies: [replySchema],
  },
  { timestamps: true }
);

// Add indexes for better query performance
discussionSchema.index({ course: 1, createdAt: -1 });
discussionSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("Discussion", discussionSchema);
