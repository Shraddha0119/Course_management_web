import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctOption: { type: Number, required: true }, // index of correct option
});

const quizSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    sectionIndex: { type: Number, required: true },
    title: { type: String, required: true },
    questions: [questionSchema],
    passPercentage: { type: Number, default: 60 },
    timeLimit: { type: Number, default: 10 }, // minutes
  },
  { timestamps: true }
);

export default mongoose.model("Quiz", quizSchema);
