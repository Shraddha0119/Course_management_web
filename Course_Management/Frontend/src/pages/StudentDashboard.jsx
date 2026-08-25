import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import AIChatPanel from "../components/AIChatPanel";
import { getWeeklyActivity, getWeeklyTotal } from "../utils/weeklyActivity";
import { BADGE_DEFS, badgeByKey } from "../utils/badges";
import { toast } from "react-hot-toast";

function StudentDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [weekly, setWeekly] = useState([]);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [coursesRes, notifRes, profileRes] = await Promise.all([
        api.get("/enroll/my-courses"),
        api.get("/notifications"),
        api.get("/users/profile"),
      ]);
      setCourses(coursesRes.data.courses || []);
      setNotifications(notifRes.data || []);
      setProfile(profileRes.data);
      setWeekly(getWeeklyActivity());
    } catch (err) {
      console.error("Failed to load dashboard", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader label="Loading dashboard..." />;

  const completed = courses.filter((c) => c.status === "Completed");
  const inProgress = courses.filter((c) => c.status === "In Progress");
  const avgProgress = courses.length
    ? Math.round(courses.reduce((a, c) => a + (c.progress || 0), 0) / courses.length)
    : 0;

  // User's earned badges (from profile)
  const userBadges = profile?.badges || [];
  const earnedKeys = new Set(userBadges.map((b) => b.name));
  const allBadges = BADGE_DEFS;

  // Learning hours estimate (10 min per completed lesson)
  const totalLessonsComplete = courses.reduce((a, c) => a + (c.progress ? Math.round(c.progress / 100 * 20) : 0), 0);
  const learningMinutes = totalLessonsComplete * 10;
  const learningHours = (learningMinutes / 60).toFixed(1);

  // Quiz pass rate
  const quizResults = courses.flatMap((c) => c.quizResults || []);
  const quizzesPassed = quizResults.filter((q) => q.passed).length;
  const quizTotal = quizResults.length;

  // Assignments submitted
  const assignmentsSubmitted = courses.reduce((acc, c) => acc + (c.assignmentsSubmitted || 0), 0);

  const weeklyTotal = getWeeklyTotal();
  const maxWeekly = Math.max(...weekly.map((d) => d.count), 1);

  const stats = {
    lessonsCompleted: totalLessonsComplete,
    quizzesPassed,
    bestQuizScore: Math.max(0, ...quizResults.map((q) => q.percentage || 0)),
    assignmentsSubmitted,
    coursesCompleted: completed.length,
  };

  const earnedBadges = computeFromStats(stats);

  return (
    <div className="animate-fadeInUp">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Welcome, {user?.name?.split(" ")[0]}! 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Your AI-powered learning dashboard</p>
        </div>
        <Link
          to="/courses"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:shadow-lg transition-shadow"
        >
          + Browse Courses
        </Link>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <StatCard icon="📚" label="Enrolled" value={courses.length} color="from-blue-500 to-blue-600" />
        <StatCard icon="📖" label="In Progress" value={inProgress.length} color="from-yellow-500 to-amber-500" />
        <StatCard icon="🎓" label="Completed" value={completed.length} color="from-green-500 to-green-600" />
        <StatCard icon="⏱️" label="Learning Hrs" value={learningHours} color="from-purple-500 to-purple-600" />
        <StatCard icon="📝" label="Quizzes Passed" value={quizTotal ? `${quizzesPassed}/${quizTotal}` : "—"} color="from-pink-500 to-rose-500" />
        <StatCard icon="🏅" label="Badges" value={userBadges.length} color="from-indigo-500 to-indigo-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2/3 */}
        <div className="lg:col-span-2 space-y-8">
          {/* Progress overview with circular ring */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 border dark:border-gray-800">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">📊 Learning Progress</h2>
            <div className="flex flex-wrap items-center gap-8">
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                  <circle
                    cx="50" cy="50" r="42" fill="none"
                    stroke={avgProgress >= 70 ? "#22c55e" : avgProgress >= 40 ? "#f59e0b" : "#3b82f6"}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${avgProgress * 2.64} 264`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{avgProgress}%</p>
                    <p className="text-xs text-gray-500">Avg Progress</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-3 min-w-[200px]">
                <ProgressBar label="Active Courses" value={inProgress.length} max={Math.max(courses.length, 1)} color="bg-blue-500" />
                <ProgressBar label="Completed Courses" value={completed.length} max={Math.max(courses.length, 1)} color="bg-green-500" />
                <ProgressBar label="Quiz Pass Rate" value={quizTotal ? Math.round((quizzesPassed / quizTotal) * 100) : 0} max={100} color="bg-purple-500" />
                <ProgressBar label="Assignments" value={assignmentsSubmitted} max={1} color="bg-pink-500" />
              </div>
            </div>
          </div>

          {/* Weekly activity chart */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 border dark:border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">📈 Weekly Activity</h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">{weeklyTotal} actions this week</span>
            </div>
            <div className="flex items-end justify-between gap-2 h-32">
              {weekly.map((d, i) => (
                <div key={i} className="flex flex-col items-center flex-1">
                  <span className="text-xs text-gray-400 mb-1">{d.count || ""}</span>
                  <div
                    className={`w-full rounded-t-lg transition-all duration-500 ${
                      d.isToday ? "bg-gradient-to-t from-blue-600 to-indigo-400" : "bg-blue-200 dark:bg-blue-900"
                    }`}
                    style={{ height: `${(d.count / maxWeekly) * 100}%`, minHeight: d.count ? "8px" : "4px" }}
                  />
                  <span className={`text-xs mt-2 ${d.isToday ? "text-blue-600 font-bold" : "text-gray-400"}`}>{d.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* My courses */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">My Courses</h2>
            {courses.length === 0 ? (
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-8 text-center border dark:border-gray-800">
                <p className="text-4xl mb-3">📚</p>
                <p className="text-gray-500 dark:text-gray-400 mb-4">You haven't enrolled in any course yet</p>
                <Link to="/courses" className="inline-block bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700">
                  Browse Courses
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {courses.map((course) => (
                  <div key={course._id} className="bg-white dark:bg-gray-900 rounded-2xl shadow p-4 flex items-center gap-4 border dark:border-gray-800 hover:shadow-lg transition-shadow">
                    <div className="w-20 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shrink-0">
                      {course.thumbnail ? (
                        <img src={course.thumbnail} className="w-full h-full object-cover rounded-lg" alt="course" />
                      ) : (
                        course.title?.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 dark:text-gray-100">{course.title}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold mr-2 ${
                          course.status === "Completed" ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300" :
                          course.status === "In Progress" ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300" :
                          "bg-gray-100 dark:bg-gray-800 text-gray-500"
                        }`}>
                          {course.status}
                        </span>
                        {course.progress || 0}% complete
                      </p>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-2">
                        <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-500" style={{ width: `${course.progress || 0}%` }} />
                      </div>
                    </div>
                    <Link to={`/learn/${course._id}`} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 shrink-0">
                      Continue
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 1/3 */}
        <div className="space-y-8">
          {/* Badges */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 border dark:border-gray-800">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">🏅 Achievement Badges</h2>
            <div className="grid grid-cols-3 gap-3">
              {allBadges.map((b) => {
                const earned = earnedKeys.has(b.name);
                return (
                  <div
                    key={b.key}
                    title={b.desc}
                    className={`${earned ? b.color : "bg-gray-100 dark:bg-gray-800"} rounded-xl p-3 text-center transition-transform ${earned ? "hover:scale-105" : "opacity-40 grayscale"}`}
                  >
                    <span className="text-3xl block">{earned ? b.icon : "🔒"}</span>
                    <span className={`text-[10px] font-semibold mt-1 block leading-tight ${earned ? "text-white" : "text-gray-400 dark:text-gray-500"}`}>
                      {b.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 border dark:border-gray-800">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">🔔 Notifications</h2>
            <div className="space-y-3">
              {notifications.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">No notifications</p>
              ) : (
                notifications.slice(0, 6).map((n) => (
                  <div key={n._id} className={`p-3 rounded-lg border ${n.read ? "bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700" : "bg-blue-50 dark:bg-blue-900/30 border-blue-100 dark:border-blue-800"}`}>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{n.title}</p>
                    {n.message && <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{n.message}</p>}
                    <p className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
                  </div>
                ))
              )}
            </div>
          </div>

{/* AI Assistant - fully working embedded chat */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 border dark:border-gray-800">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">🤖 AI Assistant</h2>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent("open-ai-chat"))}
                className="text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1.5 rounded-lg hover:shadow-lg transition-shadow"
              >
                Open Full Chat ↗
              </button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              Ask CodeMentor AI about your courses, code, or concepts.
            </p>
            <div className="h-[380px] -mx-2">
              <AIChatPanel
                height="calc(100% - 40px)"
                compact
                suggestions={[
                  "Explain React useState with an example",
                  "What is the difference between props and state?",
                  "How do I fix a CORS error in Express?",
                  "Explain JWT authentication step by step",
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper to compute badges from stats (kept local to avoid import cycle)
function computeFromStats(stats) {
  const earned = [];
  const add = (key) => {
    if (!earned.some((b) => b.key === key)) earned.push(badgeByKey(key));
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

function StatCard({ icon, label, value, color }) {
  return (
    <div className={`bg-gradient-to-br ${color} text-white rounded-2xl p-5 shadow hover:shadow-lg transition-shadow animate-scaleIn`}>
      <span className="text-2xl">{icon}</span>
      <p className="text-2xl font-bold mt-2">{value}</p>
      <p className="text-xs mt-1 opacity-90">{label}</p>
    </div>
  );
}

function ProgressBar({ label, value, max, color }) {
  const pct = max ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600 dark:text-gray-300">{label}</span>
        <span className="text-gray-500 dark:text-gray-400">{value}{max > 1 ? `/${max}` : ""}</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div className={`${color} h-2 rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default StudentDashboard;
