import Quiz from "../models/Quiz.js";
import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";
import Notification from "../models/Notification.js";

// Instructor: create quiz for a section
export const createQuiz = async (req, res) => {
  try {
    const { courseId } = req.params;
    const quiz = await Quiz.create({ ...req.body, course: courseId });
    res.status(201).json({ message: "Quiz created", quiz });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get quiz for a section (instructor/student)
export const getQuiz = async (req, res) => {
  try {
    const { courseId, sectionIndex } = req.params;
    const quiz = await Quiz.findOne({ course: courseId, sectionIndex });
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Submit quiz
export const submitQuiz = async (req, res) => {
  try {
    const { courseId, quizId } = req.params;
    const { answers } = req.body; // array of chosen option indices
    const studentId = req.user.id;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    const enrollment = await Enrollment.findOne({ student: studentId, course: courseId });
    if (!enrollment) return res.status(404).json({ message: "Not enrolled" });

    let score = 0;
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctOption) score++;
    });
    const total = quiz.questions.length;
    const percentage = total === 0 ? 0 : Math.round((score / total) * 100);
    const passed = percentage >= quiz.passPercentage;

    // Save result (prevent duplicates for same quiz)
    enrollment.quizResults = enrollment.quizResults.filter(
      (r) => r.quizIndex !== quiz.sectionIndex
    );
    enrollment.quizResults.push({
      quizIndex: quiz.sectionIndex,
      score,
      total,
      passed,
      answers,
      takenAt: new Date(),
    });
    await enrollment.save();

    // Recompute progress for course (quizzes also count?)
    const course = await Course.findById(courseId);
    const lessonTotal = course.sections.reduce((a, s) => a + s.lessons.length, 0);
    const lessonCompleted = enrollment.completedLessons.length;
    const quizCount = course.sections.length;

    // Progress = 60% lessons + 40% quizzes; simpler: lessons only but quizzes gate certificate
    const progress = lessonTotal === 0 ? 0 : Math.round((lessonCompleted / lessonTotal) * 100);
    enrollment.progress = progress;
    if (progress >= 100) enrollment.status = "Completed";
    else if (progress > 0) enrollment.status = "In Progress";
    await enrollment.save();

    if (passed) {
      await Notification.create({
        user: studentId,
        title: "Quiz Passed 🎉",
        message: `You scored ${score}/${total} in "${quiz.title}"`,
        type: "quiz",
      });
    }

    res.status(200).json({
      message: passed ? "Quiz passed! 🎉" : "Quiz failed. Try again.",
      score,
      total,
      percentage,
      passed,
      correctAnswers: quiz.questions.map((q) => q.correctOption),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
