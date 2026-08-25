import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    videoUrl: String,
    videoDuration: { type: Number, default: 0 }, // seconds
    notesPdf: String,
    resources: [String],
    links: [String],
    isFree: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const sectionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    lessons: [lessonSchema],
  },
  { timestamps: true }
);

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: String,
  },
  { timestamps: true }
);

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String, required: true },
    category: { type: String, default: "Programming" },
    thumbnail: { type: String, default: "" },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    sections: [sectionSchema],
    enrollmentCount: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    reviews: [reviewSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);
