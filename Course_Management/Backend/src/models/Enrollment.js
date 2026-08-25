import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    status: {
      type: String,
      enum: ["Not Started", "In Progress", "Completed"],
      default: "Not Started",
    },
    progress: { type: Number, default: 0 }, // 0-100
    completedLessons: [
      {
        sectionIndex: Number,
        lessonIndex: Number,
        lessonId: mongoose.Schema.Types.ObjectId,
        completedAt: Date,
      },
    ],
    lastOpenedLesson: {
      sectionIndex: Number,
      lessonIndex: Number,
      lessonId: mongoose.Schema.Types.ObjectId,
    },
    lastOpenedAt: Date,
    lastVideoTimestamp: { type: Number, default: 0 },
    quizResults: [
      {
        quizIndex: Number,
        score: Number,
        total: Number,
        passed: Boolean,
        answers: [Number],
        takenAt: Date,
      },
    ],
    certificate: {
      issued: { type: Boolean, default: false },
      certificateId: String,
      issuedAt: Date,
    },
  },
  { timestamps: true }
);

// Unique constraint: one enrollment per student per course
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

export default mongoose.model("Enrollment", enrollmentSchema);
