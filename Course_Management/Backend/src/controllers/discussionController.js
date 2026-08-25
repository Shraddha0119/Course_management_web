import Discussion from "../models/Discussion.js";

// Ask a question
export const askQuestion = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { question, lessonId } = req.body;
    const userId = req.user.id;

    const discussion = await Discussion.create({
      course: courseId,
      lessonId,
      user: userId,
      question,
    });
    await discussion.populate("user", "name");
    res.status(201).json({ message: "Question posted", discussion });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get discussions for a course
export const getDiscussions = async (req, res) => {
  try {
    const { courseId } = req.params;
    const discussions = await Discussion.find({ course: courseId })
      .populate("user", "name")
      .populate("replies.user", "name")
      .sort("-createdAt");
    res.status(200).json(discussions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reply to a question
export const replyToDiscussion = async (req, res) => {
  try {
    const { discussionId } = req.params;
    const { text } = req.body;
    const userId = req.user.id;

    const discussion = await Discussion.findById(discussionId);
    if (!discussion) return res.status(404).json({ message: "Discussion not found" });

    discussion.replies.push({ user: userId, text, likes: [] });
    await discussion.save();
    await discussion.populate([
      { path: "user", select: "name" },
      { path: "replies.user", select: "name" },
    ]);

    res.status(200).json({ message: "Reply added", discussion });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Like a reply
export const toggleLike = async (req, res) => {
  try {
    const { discussionId, replyId } = req.params;
    const userId = req.user.id;

    const discussion = await Discussion.findById(discussionId);
    if (!discussion) return res.status(404).json({ message: "Discussion not found" });

    const reply = discussion.replies.id(replyId);
    if (!reply) return res.status(404).json({ message: "Reply not found" });

    const idx = reply.likes.indexOf(userId);
    if (idx > -1) reply.likes.splice(idx, 1);
    else reply.likes.push(userId);
    await discussion.save();

    res.status(200).json({ message: "Like toggled", likes: reply.likes.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
