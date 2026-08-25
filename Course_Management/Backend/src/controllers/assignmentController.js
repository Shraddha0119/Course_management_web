import Assignment from "../models/Assignment.js";
import Notification from "../models/Notification.js";

// Instructor: create assignment
export const createAssignment = async (req, res) => {
  try {
    const { courseId } = req.params;
    const assignment = await Assignment.create({ ...req.body, course: courseId });
    res.status(201).json({ message: "Assignment created", assignment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get assignments for a course
export const getAssignments = async (req, res) => {
  try {
    const { courseId } = req.params;
    const assignments = await Assignment.find({ course: courseId });
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Student: submit assignment
export const submitAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { solutionUrl } = req.body;
    const studentId = req.user.id;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });

    // Find existing submission
    const existing = assignment.submissions.find(
      (s) => s.student.toString() === studentId
    );
    if (existing) {
      existing.solutionUrl = solutionUrl;
      existing.submittedAt = new Date();
      existing.status = "Submitted";
      existing.feedback = null;
    } else {
      assignment.submissions.push({
        student: studentId,
        solutionUrl,
        submittedAt: new Date(),
        status: "Submitted",
      });
    }
    await assignment.save();

    await Notification.create({
      user: studentId,
      title: "Assignment Submitted",
      message: `Your assignment "${assignment.title}" has been submitted.`,
      type: "assignment",
    });

    res.status(200).json({ message: "Assignment submitted", assignment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Instructor: grade assignment
export const gradeAssignment = async (req, res) => {
  try {
    const { assignmentId, submissionId } = req.params;
    const { feedback, score } = req.body;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });

    const submission = assignment.submissions.id(submissionId);
    if (!submission) return res.status(404).json({ message: "Submission not found" });

    submission.feedback = feedback;
    submission.score = score;
    submission.status = "Graded";
    await assignment.save();

    // Notify student
    await Notification.create({
      user: submission.student,
      title: "Assignment Graded ✅",
      message: `Your assignment "${assignment.title}" was graded with ${score} points. ${
        feedback ? `Feedback: ${feedback}` : ""
      }`,
      type: "assignment",
    });

    res.status(200).json({ message: "Assignment graded", submission });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
