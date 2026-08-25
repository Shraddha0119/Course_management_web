// badges.js
// Achievement system definitions and helper functions.

export const BADGE_DEFS = [
  { key: "first_lesson", name: "First Lesson Completed", icon: "🚀", color: "bg-blue-500", desc: "Completed your very first lesson" },
  { key: "first_quiz", name: "First Quiz Passed", icon: "🧠", color: "bg-purple-500", desc: "Passed your first quiz" },
  { key: "first_assignment", name: "First Assignment Submitted", icon: "📝", color: "bg-pink-500", desc: "Submitted your first assignment" },
  { key: "fast_learner", name: "Fast Learner", icon: "⚡", color: "bg-yellow-500", desc: "Completed 3 lessons in one day" },
  { key: "quiz_master", name: "Quiz Master", icon: "🏆", color: "bg-indigo-500", desc: "Passed 3 quizzes" },
  { key: "top_performer", name: "Top Performer", icon: "🥇", color: "bg-amber-500", desc: "Scored 90%+ on a quiz" },
  { key: "course_completed", name: "Course Completed", icon: "🎓", color: "bg-green-500", desc: "Completed an entire course" },
];

export function badgeByKey(key) {
  return BADGE_DEFS.find((b) => b.key === key);
}

// Compute which badges a user should have based on stats
export function computeEarnedBadges(stats = {}) {
  const earned = [];
  const add = (key) => {
    if (!earned.some((b) => b.key === key)) earned.push({ key, ...badgeByKey(key) });
  };

  if ((stats.lessonsCompleted || 0) >= 1) add("first_lesson");
  if ((stats.lessonsCompleted || 0) >= 3) add("fast_learner");
  if ((stats.quizzesPassed || 0) >= 1) add("first_quiz");
  if ((stats.quizzesPassed || 0) >= 3) add("quiz_master");
  if ((stats.bestQuizScore || 0) >= 90) add("top_performer");
  if ((stats.assignmentsSubmitted || 0) >= 1) add("first_assignment");
  if ((stats.coursesCompleted || 0) >= 1) add("course_completed");

  return earned;
}

export default BADGE_DEFS;
