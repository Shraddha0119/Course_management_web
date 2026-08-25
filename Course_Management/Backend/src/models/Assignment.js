import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    sectionIndex: { type: Number, required: true },
    title: { type: String, required: true },
    description: String,
    pdfUrl: String,
    deadline: Date,
    submissions: [
      {
        student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        solutionUrl: String,
        submittedAt: Date,
        status: {
          type: String,
          enum: ["Submitted", "Graded"],
          default: "Submitted",
        },
        feedback: String,
        score: Number,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Assignment", assignmentSchema);
