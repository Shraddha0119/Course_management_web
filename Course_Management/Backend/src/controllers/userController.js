import User from "../models/User.js";

// Get all instructors (for admin course creation)
export const getInstructors = async (req, res) => {
  try {
    const instructors = await User.find({ role: "instructor" }).select(
      "_id name email"
    );
    res.status(200).json(instructors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all students (for admin dashboard)
export const getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).select(
      "_id name email enrolledCourses"
    );
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Award a badge to the logged-in user
export const awardBadge = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Badge name is required" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Avoid duplicate badges
    const hasBadge = user.badges.some((b) => b.name === name);
    if (!hasBadge) {
      user.badges.push({ name, earnedAt: new Date() });
      await user.save();
    }

    res.status(200).json({ message: "Badge awarded", badges: user.badges });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
