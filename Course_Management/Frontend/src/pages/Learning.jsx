import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import CodeBlock from "../components/CodeBlock";
import Certificate from "../components/Certificate";
import generateLearningPath from "../utils/contentGenerator";
import generateQuiz from "../utils/quizGenerator";
import generateAssignments from "../utils/assignmentGenerator";
import { computeEarnedBadges, badgeByKey } from "../utils/badges";
import { recordActivity } from "../utils/weeklyActivity";
import { toast } from "react-hot-toast";

// Award a badge to the student (fire-and-forget)
const awardBadge = async (name) => {
  try {
    await api.post("/users/badges", { name });
  } catch (e) {
    // ignore
  }
};

function Learning() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [totals, setTotals] = useState({ total: 0, completed: 0, progress: 0 });
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(0);
  const [activeLesson, setActiveLesson] = useState(0);
  const [lockMap, setLockMap] = useState({});
  const [quizData, setQuizData] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [quizResult, setQuizResult] = useState(null);
  const [quizTimer, setQuizTimer] = useState(0);
  const [assignments, setAssignments] = useState([]);
  const [localAssignments, setLocalAssignments] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [activeTab, setActiveTab] = useState("learn");
  const [certificate, setCertificate] = useState(null);
  const [generated, setGenerated] = useState(false);
  const [earnedBadges, setEarnedBadges] = useState([]);
  const videoRef = useRef(null);

  const buildLockMap = useCallback((courseData) => {
    const map = {};
    let lessonCounter = 0;
    (courseData.sections || []).forEach((section, si) => {
      (section.lessons || []).forEach((lesson, li) => {
        const key = `${si}-${li}`;
        map[key] = !(lesson.isFree || lessonCounter === 0);
        lessonCounter++;
      });
    });
    return map;
  }, []);

  useEffect(() => {
    if (!user) {
      toast.error("Please login to continue learning");
      navigate("/login");
      return;
    }
    fetchData();
  }, [courseId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/enroll/my-courses/${courseId}`);
      let courseData = data.course;

      // STEP: Auto-generate learning content if the course has no sections/lessons
      if (!courseData.sections || courseData.sections.length === 0) {
        const path = generateLearningPath(courseData.title, courseData.category);
        courseData = { ...courseData, sections: path };
        // Count generated lessons for the lock map
        setGenerated(true);
        toast.success("✨ AI-generated learning path created for this course!");
      }

      setCourse(courseData);
      setEnrollment(data.enrollment);
      setTotals(data.totals);
      setLockMap(buildLockMap(courseData));

      if (data.enrollment?.lastOpenedLesson) {
        setActiveSection(data.enrollment.lastOpenedLesson.sectionIndex || 0);
        setActiveLesson(data.enrollment.lastOpenedLesson.lessonIndex || 0);
      }

      fetchQuiz(courseData);
      const assignRes = await fetchAssignments(courseData);
      fetchDiscussions(courseData);

      // Auto-generate local assignments if none exist in backend
      if (!assignRes || assignRes.length === 0) {
        const genAssignments = generateAssignments(courseData.title, courseData.category);
        setLocalAssignments(genAssignments);
      }

      if (data.totals.progress >= 100) setActiveTab("cert");
    } catch (err) {
      if (err.response?.status === 404) {
        toast.error("You are not enrolled in this course");
        navigate("/my-courses");
      } else {
        toast.error("Failed to load course");
        navigate("/my-courses");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchQuiz = async (courseData) => {
    // Try backend quiz first
    try {
      const si = activeSection || 0;
      const { data } = await api.get(`/quizzes/${courseData._id}/section/${si}`);
      setQuizData(data);
      setQuizAnswers(new Array(data.questions?.length || 0).fill(-1));
    } catch (e) {
      // Fallback: auto-generate quiz locally
      const gen = generateQuiz(courseData.title, courseData.category, activeSection || 0);
      setQuizData({
        _id: `local-${activeSection}`,
        title: gen.title,
        description: gen.description,
        timeLimit: gen.timeLimit,
        questions: gen.questions.map((q) => ({
          question: q.question,
          options: q.options,
          correctOption: q.answerIndex,
          explanation: q.explanation,
          difficulty: q.difficulty,
        })),
        isLocal: true,
      });
      setQuizAnswers(new Array(gen.questions.length).fill(-1));
    }
  };

  const fetchAssignments = async (courseData) => {
    try {
      const { data } = await api.get(`/assignments/course/${courseData._id}`);
      setAssignments(data);
      return data;
    } catch (e) {
      setAssignments([]);
      return [];
    }
  };

  const fetchDiscussions = async (courseData) => {
    try {
      const { data } = await api.get(`/discussions/${courseData._id}`);
      setDiscussions(data);
    } catch (e) {
      setDiscussions([]);
    }
  };

  const allLessons =
    course?.sections?.flatMap((s, si) =>
      s.lessons.map((l, li) => ({ ...l, sectionIndex: si, lessonIndex: li }))
    ) || [];

  const currentLesson = course?.sections?.[activeSection]?.lessons?.[activeLesson];

  const selectLesson = (si, li) => {
    if (lockMap[`${si}-${li}`]) {
      toast("🔒 Complete the previous lesson to unlock this one");
      return;
    }
    setActiveSection(si);
    setActiveLesson(li);
    setActiveTab("learn");
    setQuizResult(null);
    api
      .put(`/enroll/${courseId}/progress`, {
        sectionIndex: si,
        lessonIndex: li,
        lessonId: course.sections[si].lessons[li]._id,
        timestamp: 0,
      })
      .catch(() => {});
    fetchQuiz(course);
  };

  const isLessonCompleted = (si, li) =>
    enrollment?.completedLessons?.some(
      (l) => l.sectionIndex === si && l.lessonIndex === li
    );

  const markComplete = async () => {
    const lesson = currentLesson;
    if (!lesson) return;
    const wasCompleted = isLessonCompleted(activeSection, activeLesson);
    try {
      const { data } = await api.put(`/enroll/${courseId}/lesson`, {
        sectionIndex: activeSection,
        lessonIndex: activeLesson,
        lessonId: lesson._id,
      });
      setEnrollment(data.enrollment);
      setTotals((t) => ({
        ...t,
        completed: data.completedLength,
        progress: data.enrollment.progress,
      }));
      const key = `${activeSection}-${activeLesson}`;
      setLockMap((prev) => ({ ...prev, [key]: false }));

      if (!wasCompleted) {
        recordActivity(1);
        // Award First Lesson badge
        if (data.completedLength === 1) {
          setEarnedBadges((prev) => [...prev, badgeByKey("first_lesson")]);
          awardBadge("First Lesson Completed");
          toast.success("🏅 Badge earned: First Lesson Completed!");
        }
        if (data.completedLength === 3) {
          setEarnedBadges((prev) => [...prev, badgeByKey("fast_learner")]);
          awardBadge("Fast Learner");
          toast.success("⚡ Badge earned: Fast Learner!");
        }
        toast.success("Lesson completed! 🎉");
      } else {
        toast.success("Lesson marked incomplete");
      }

      const section = course.sections[activeSection];
      if (activeLesson < section.lessons.length - 1) {
        setActiveLesson(activeLesson + 1);
      } else if (activeSection < course.sections.length - 1) {
        setActiveSection(activeSection + 1);
        setActiveLesson(0);
      } else {
        if (data.enrollment.progress >= 100) {
          setEarnedBadges((prev) => [...prev, badgeByKey("course_completed")]);
          awardBadge("Course Completed");
          toast.success("🎓 Badge earned: Course Completed!");
        }
        toast.success("🎉 Course complete! Check the Certificate tab.");
        setActiveTab("cert");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update progress");
    }
  };

  const nextLesson = () => {
    const section = course.sections[activeSection];
    if (activeLesson < section.lessons.length - 1) {
      selectLesson(activeSection, activeLesson + 1);
    } else if (activeSection < course.sections.length - 1) {
      selectLesson(activeSection + 1, 0);
    } else {
      toast("You're at the last lesson 🎉");
    }
  };

  const prevLesson = () => {
    if (activeLesson > 0) {
      selectLesson(activeSection, activeLesson - 1);
    } else if (activeSection > 0) {
      const prevSection = course.sections[activeSection - 1];
      selectLesson(activeSection - 1, prevSection.lessons.length - 1);
    } else {
      toast("This is the first lesson");
    }
  };

  // Quiz helpers
  const startQuiz = () => {
    if (!quizData) return;
    setQuizResult(null);
    setQuizAnswers(new Array(quizData.questions.length).fill(-1));
    setQuizTimer(quizData.timeLimit * 60);
  };

  const submitQuiz = async () => {
    if (quizAnswers.some((a) => a === -1)) {
      toast.error("Please answer all questions");
      return;
    }
    // Local quiz: compute client side
    if (quizData.isLocal) {
      let score = 0;
      quizData.questions.forEach((q, i) => {
        if (quizAnswers[i] === q.correctOption) score++;
      });
      const total = quizData.questions.length;
      const percentage = Math.round((score / total) * 100);
      const passed = percentage >= quizData.passPercentage || percentage >= 60;
      setQuizResult({
        score,
        total,
        percentage,
        passed,
        correctAnswers: quizData.questions.map((q) => q.correctOption),
      });
      if (passed) awardBadge("First Quiz Passed");
      toast[passed ? "success" : "error"](passed ? "Quiz passed! 🎉" : "Quiz failed. Try again.");
      return;
    }
    try {
      const { data } = await api.post(`/quizzes/${courseId}/submit/${quizData._id}`, {
        answers: quizAnswers,
      });
      setQuizResult(data);
      if (data.passed) {
        awardBadge("First Quiz Passed");
        if (data.percentage >= 90) awardBadge("Top Performer");
        toast.success("🏅 Badge earned!");
      }
      toast[data.passed ? "success" : "error"](data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit quiz");
    }
  };

  const handleVideoTimeUpdate = (e) => {
    const t = Math.floor(e.target.currentTime);
    if (t > 0 && t % 15 === 0) {
      api
        .put(`/enroll/${courseId}/progress`, {
          sectionIndex: activeSection,
          lessonIndex: activeLesson,
          lessonId: currentLesson?._id,
          timestamp: t,
        })
        .catch(() => {});
    }
  };

  useEffect(() => {
    if (videoRef.current && enrollment?.lastVideoTimestamp) {
      videoRef.current.currentTime = enrollment.lastVideoTimestamp;
    }
  }, [currentLesson]);

  const getCertificate = async () => {
    try {
      const { data } = await api.post(`/enroll/${courseId}/certificate`);
      setCertificate(data.certificate);
      toast.success("🎓 Certificate issued!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Certificate not available yet");
    }
  };

  if (loading) return <Loader label="Loading course..." />;

  const completedLessonIds = new Set(
    enrollment?.completedLessons?.map((l) => l.lessonId?.toString()) || []
  );

  // Merge backend assignments + local generated ones
  const allAssignments = assignments.length > 0 ? assignments : localAssignments;
  const currentSectionAssignments = allAssignments.filter((a) => a.sectionIndex === activeSection);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      {/* Top bar */}
      <div className="bg-white dark:bg-gray-900 shadow-sm border-b dark:border-gray-800 px-6 py-4 flex items-center justify-between">
        <Link to="/my-courses" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">
          ← Back to My Courses
        </Link>
        <div className="text-right">
          <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100">{course?.title}</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {totals.completed}/{totals.total} lessons • {totals.progress}%
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="lg:w-80 bg-white dark:bg-gray-900 border-r dark:border-gray-800 overflow-y-auto lg:max-h-[calc(100vh-70px)] lg:sticky lg:top-16">
          <div className="p-4">
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 mb-4">
              <div className="flex justify-between text-sm font-semibold text-blue-700 dark:text-blue-300 mb-2">
                <span>Course Progress</span>
                <span>{totals.progress}%</span>
              </div>
              <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${totals.progress}%` }}
                />
              </div>
            </div>

            {course?.sections?.map((section, si) => (
              <div key={si} className="mb-3">
                <h3
                  className="font-semibold text-gray-800 dark:text-gray-200 text-sm px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg flex justify-between items-center cursor-pointer"
                  onClick={() => setActiveSection(si)}
                >
                  <span>Module {si + 1}: {section.title}</span>
                  <span className="text-xs text-gray-500">
                    {section.lessons.filter((_, li) => isLessonCompleted(si, li)).length}/{section.lessons.length}
                  </span>
                </h3>
                <ul className="mt-1 space-y-0.5">
                  {section.lessons.map((lesson, li) => {
                    const isActive = si === activeSection && li === activeLesson;
                    const done = isLessonCompleted(si, li);
                    const locked = lockMap[`${si}-${li}`];
                    return (
                      <li
                        key={li}
                        onClick={() => selectLesson(si, li)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors ${
                          isActive
                            ? "bg-blue-600 text-white"
                            : "text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800"
                        } ${locked ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        <span className="text-xs">
                          {locked ? "🔒" : done ? "✅" : "▶"}
                        </span>
                        <span className="truncate">{lesson.title}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}

            <div className="mt-4 border-t dark:border-gray-800 pt-4 space-y-1">
              {[
                { id: "learn", label: "📖 Learning" },
                { id: "quiz", label: "📝 Quiz" },
                { id: "assignments", label: "📋 Assignments" },
                { id: "discuss", label: "💬 Discussions" },
                { id: "cert", label: "🎓 Certificate" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6">
          {generated && (
            <div className="mb-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl p-4 flex items-center gap-3 shadow-lg">
              <span className="text-3xl">✨</span>
              <div>
                <p className="font-bold">AI-Generated Learning Path</p>
                <p className="text-sm text-purple-100">
                  This course was auto-built for you. {course?.sections?.length} modules • {allLessons.length} lessons
                </p>
              </div>
            </div>
          )}

          {activeTab === "learn" && currentLesson && (
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border dark:border-gray-800">
              {currentLesson.videoUrl ? (
                <video
                  ref={videoRef}
                  controls
                  className="w-full aspect-video bg-black"
                  src={currentLesson.videoUrl}
                  onTimeUpdate={handleVideoTimeUpdate}
                />
              ) : (
                <div className="w-full aspect-video bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-4xl">
                  🎬
                </div>
              )}

              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
                    Module {activeSection + 1}
                  </span>
                  <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">
                    Lesson {activeLesson + 1} of {course?.sections?.[activeSection]?.lessons?.length}
                  </span>
                  <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">
                    ⏱ {currentLesson.duration || "10 min"}
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{currentLesson.title}</h2>
                {currentLesson.description && (
                  <p className="text-gray-600 dark:text-gray-300 mt-3 leading-relaxed">{currentLesson.description}</p>
                )}

                {/* Learning objectives */}
                {currentLesson.objectives?.length > 0 && (
                  <div className="mt-6 bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">🎯 Learning Objectives</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                      {currentLesson.objectives.map((o, i) => (
                        <li key={i}>{o}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Key concepts */}
                {currentLesson.keyConcepts?.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {currentLesson.keyConcepts.map((c, i) => (
                      <span key={i} className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full">
                        {c}
                      </span>
                    ))}
                  </div>
                )}

                {/* Interactive code examples */}
                {currentLesson.codeExamples?.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">💻 Interactive Code Examples</h3>
                    <div className="space-y-4">
                      {currentLesson.codeExamples.map((ex, i) => (
                        <CodeBlock
                          key={i}
                          code={ex.code}
                          language={ex.language || "javascript"}
                          explanation={ex.explanation}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Practice task */}
                {currentLesson.practiceTask && (
                  <div className="mt-6 bg-amber-50 dark:bg-amber-900/30 border-l-4 border-amber-400 rounded-r-lg p-4">
                    <h3 className="font-semibold text-amber-700 dark:text-amber-300 mb-1">✏️ Practice Task</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{currentLesson.practiceTask}</p>
                  </div>
                )}

                {/* Notes */}
                {currentLesson.notes?.length > 0 && (
                  <div className="mt-4 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">📝 Key Notes</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-300">
                      {currentLesson.notes.map((n, i) => (
                        <li key={i}>{n}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Resources */}
                {(currentLesson.notesPdf || currentLesson.resources?.length > 0 || currentLesson.links?.length > 0) && (
                  <div className="mt-6 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-3">📎 Resources</h3>
                    <div className="flex flex-wrap gap-2">
                      {currentLesson.notesPdf && (
                        <a href={currentLesson.notesPdf} target="_blank" rel="noreferrer" className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-700">
                          📄 PDF Notes
                        </a>
                      )}
                      {currentLesson.resources?.map((r, i) => (
                        <a key={i} href={r} target="_blank" rel="noreferrer" className="bg-gray-200 dark:bg-gray-700 dark:text-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-sm hover:bg-gray-300">
                          📦 Resource {i + 1}
                        </a>
                      ))}
                      {currentLesson.links?.map((l, i) => (
                        <a key={i} href={l} target="_blank" rel="noreferrer" className="bg-purple-100 dark:bg-purple-900 dark:text-purple-200 text-purple-700 px-3 py-1.5 rounded-lg text-sm hover:bg-purple-200">
                          🔗 Link {i + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-8 flex items-center justify-between gap-4">
                  <button onClick={prevLesson} className="bg-gray-100 dark:bg-gray-800 dark:text-gray-300 text-gray-700 px-4 py-2.5 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    ← Previous
                  </button>
                  <button
                    onClick={markComplete}
                    className={`px-6 py-2.5 rounded-lg font-semibold transition-colors ${
                      isLessonCompleted(activeSection, activeLesson)
                        ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 hover:bg-green-200"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {isLessonCompleted(activeSection, activeLesson) ? "✓ Completed" : "Mark as Complete"}
                  </button>
                  <button onClick={nextLesson} className="bg-blue-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                    Next →
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "quiz" && (
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">📝 Quiz</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {quizData?.title} • {quizData?.questions?.length} questions • Difficulty: {quizData?.difficulty || "Mixed"}
              </p>

              {!quizData ? (
                <div className="text-center py-10 text-gray-500">
                  <p className="text-4xl mb-3">📭</p>
                  <p>No quiz available for this module.</p>
                </div>
              ) : quizResult ? (
                <div className={`text-center py-8 ${quizResult.passed ? "text-green-600" : "text-red-500"}`}>
                  <p className="text-5xl mb-4">{quizResult.passed ? "🎉" : "😅"}</p>
                  <h3 className="text-2xl font-bold mb-2">{quizResult.passed ? "Quiz Passed!" : "Quiz Failed"}</h3>

                  {/* Score ring */}
                  <div className="w-32 h-32 rounded-full mx-auto my-4 flex items-center justify-center border-8 relative" style={{ borderColor: quizResult.passed ? "#22c55e" : "#ef4444" }}>
                    <span className="text-3xl font-bold">{quizResult.percentage}%</span>
                  </div>

                  <p className="text-lg mb-2">Score: {quizResult.score}/{quizResult.total}</p>
                  <p className="text-sm text-gray-500 mb-4">
                    {quizResult.passed ? "Congratulations! You passed!" : "Keep practicing — you can do it!"}
                  </p>

                  {/* Review answers */}
                  {quizData.questions.map((q, qi) => (
                    <div key={qi} className="text-left mb-3 p-3 border dark:border-gray-700 rounded-lg">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {qi + 1}. {q.question}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Correct answer: <span className="text-green-600 font-semibold">{q.options[quizResult.correctAnswers[qi]]}</span>
                      </p>
                      {q.explanation && (
                        <p className="text-xs text-gray-400 mt-1">💡 {q.explanation}</p>
                      )}
                    </div>
                  ))}

                  <div className="flex gap-3 justify-center mt-4">
                    <button onClick={startQuiz} className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700">
                      Retake Quiz
                    </button>
                    <button onClick={() => setQuizResult(null)} className="bg-gray-100 dark:bg-gray-800 dark:text-gray-200 text-gray-700 px-5 py-2.5 rounded-lg font-semibold hover:bg-gray-200">
                      View Questions
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  {quizTimer > 0 && (
                    <div className="text-right text-sm text-gray-500 mb-4">
                      ⏱ Time left: {Math.floor(quizTimer / 60)}:{String(quizTimer % 60).padStart(2, "0")}
                    </div>
                  )}

                  {quizData.questions.map((q, qi) => (
                    <div key={qi} className="mb-6 p-4 border dark:border-gray-700 rounded-lg">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-gray-800 dark:text-gray-100 mb-3">
                          {qi + 1}. {q.question}
                        </p>
                        {q.difficulty && (
                          <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase ${
                            q.difficulty === "easy" ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300" :
                            q.difficulty === "hard" ? "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300" :
                            "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300"
                          }`}>
                            {q.difficulty}
                          </span>
                        )}
                      </div>
                      <div className="space-y-2">
                        {q.options.map((opt, oi) => (
                          <label
                            key={oi}
                            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition-colors ${
                              quizAnswers[qi] === oi
                                ? "border-blue-600 bg-blue-50 dark:bg-blue-900/30"
                                : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                            }`}
                          >
                            <input type="radio" name={`q-${qi}`} checked={quizAnswers[qi] === oi} onChange={() => setQuizAnswers((prev) => { const next = [...prev]; next[qi] = oi; return next; })} />
                            <span className="text-gray-800 dark:text-gray-200">{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}

                  <button onClick={submitQuiz} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                    Submit Quiz
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "assignments" && (
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">📋 Assignments</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Module {activeSection + 1} • {allAssignments.length} total assignments
              </p>

              {allAssignments.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  <p className="text-4xl mb-3">📭</p>
                  <p>No assignments for this course.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {allAssignments.map((a) => {
                    const mySubmission = a.submissions?.find(
                      (s) => s.student?.toString() === user._id?.toString() || s.student?.toString() === user.id?.toString()
                    );
                    return (
                      <div key={a._id || a.title} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">📝</span>
                            <h3 className="font-bold text-gray-800 dark:text-gray-100">{a.title}</h3>
                          </div>
                          <div className="flex gap-2">
                            {a.difficulty && (
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                a.difficulty === "Easy" ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300" :
                                a.difficulty === "Hard" ? "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300" :
                                "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300"
                              }`}>
                                {a.difficulty}
                              </span>
                            )}
                            <span className="text-xs text-gray-500">Module {a.sectionIndex + 1}</span>
                          </div>
                        </div>

                        {a.description && <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">{a.description}</p>}

                        {/* Requirements */}
                        {a.requirements?.length > 0 && (
                          <div className="mt-3 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Requirements</p>
                            <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-0.5">
                              {a.requirements.map((r, i) => <li key={i}>{r}</li>)}
                            </ul>
                          </div>
                        )}

                        {/* Expected output */}
                        {a.expectedOutput && (
                          <div className="mt-3 bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                            <p className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase mb-1">Expected Output</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">{a.expectedOutput}</p>
                          </div>
                        )}

                        {/* Bonus */}
                        {a.bonusChallenge && (
                          <div className="mt-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                            <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase mb-1">⭐ Bonus Challenge</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">{a.bonusChallenge}</p>
                          </div>
                        )}

                        {a.deadline && <p className="text-xs text-red-500 mt-1">Due: {new Date(a.deadline).toLocaleDateString()}</p>}
                        {a.pdfUrl && <a href={a.pdfUrl} target="_blank" rel="noreferrer" className="inline-block mt-2 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm">📄 Download Assignment</a>}

{mySubmission ? (
                          <div className="mt-3 bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                            <p className="text-sm text-green-700 dark:text-green-300 font-medium">Status: {mySubmission.status}</p>
                            {mySubmission.submittedAt && <p className="text-xs text-gray-500 mt-1">Submitted on {new Date(mySubmission.submittedAt).toLocaleDateString()}</p>}
                            {mySubmission.feedback && <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Feedback: {mySubmission.feedback}</p>}
                            {mySubmission.score !== undefined && <p className="text-sm font-bold text-green-600 mt-1">Score: {mySubmission.score}</p>}
                          </div>
                        ) : (
                          <AssignmentForm
                            assignmentId={a._id}
                            isLocal={!a._id}
                            assignmentTitle={a.title}
                            sectionIndex={a.sectionIndex}
                            onSubmitted={() => awardBadge("First Assignment Submitted")}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === "discuss" && (
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">💬 Discussions</h2>
              <QuestionForm courseId={courseId} onPost={() => fetchDiscussions(course)} />
              <div className="mt-6 space-y-4">
                {discussions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-4xl mb-3">💬</p>
                    <p>No questions yet. Be the first to ask!</p>
                  </div>
                ) : (
                  discussions.map((d) => (
                    <div key={d._id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                          {d.user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm">{d.user?.name}</p>
                          <p className="text-xs text-gray-400">{new Date(d.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{d.question}</p>
                      <div className="mt-3 space-y-2">
                        {d.replies?.map((r, ri) => (
                          <div key={ri} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 ml-6">
                            <p className="text-sm text-gray-800 dark:text-gray-200">
                              <span className="font-semibold">{r.user?.name}:</span> {r.text}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">👍 {r.likes?.length || 0} likes</p>
                          </div>
                        ))}
                      </div>
                      <ReplyForm discussionId={d._id} onReply={() => fetchDiscussions(course)} />
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "cert" && (
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 text-center border dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">🎓 Certificate</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Complete all lessons and pass all quizzes to earn your certificate
              </p>

              <div className="mb-6">
                <p className="text-4xl font-bold text-blue-600">{totals.progress}%</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Overall Progress</p>
              </div>

              {enrollment?.certificate?.issued || certificate ? (
                <Certificate
                  studentName={user?.name}
                  courseName={course?.title}
                  instructorName={course?.instructor?.name || "Course Instructor"}
                  completionDate={new Date(enrollment?.certificate?.issuedAt || certificate?.issuedAt || Date.now()).toLocaleDateString()}
                  certificateId={enrollment?.certificate?.certificateId || certificate?.certificateId}
                  progress={totals.progress}
                />
              ) : (
                <div>
                  <button
                    onClick={getCertificate}
                    disabled={totals.progress < 100}
                    className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                      totals.progress >= 100
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-200 dark:bg-gray-800 dark:text-gray-500 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {totals.progress >= 100 ? "Generate Certificate" : "Complete all lessons first"}
                  </button>
                </div>
              )}

              {/* Earned badges during this session */}
              {earnedBadges.length > 0 && (
                <div className="mt-8">
                  <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-3">🏅 Badges Earned</h3>
                  <div className="flex flex-wrap justify-center gap-3">
                    {earnedBadges.map((b, i) => (
                      <div key={i} className={`${b.color} text-white rounded-xl p-3 w-24 text-center animate-scaleIn`}>
                        <span className="text-3xl block">{b.icon}</span>
                        <span className="text-[10px] font-semibold mt-1 block leading-tight">{b.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// ===== Sub-components =====

function AssignmentForm({ assignmentId, isLocal = false, assignmentTitle = "", onSubmitted }) {
  const [url, setUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!url) {
      toast.error("Please paste your solution link");
      return;
    }
    try {
      setSubmitting(true);
      if (isLocal) {
        // Store local assignment submission in localStorage (no backend _id)
        const key = `assignments_${assignmentTitle}`;
        const existing = JSON.parse(localStorage.getItem(key) || "[]");
        existing.push({ url, submittedAt: new Date().toISOString() });
        localStorage.setItem(key, JSON.stringify(existing));
        toast.success("Assignment submitted (saved locally)!");
        onSubmitted?.();
        setUrl("");
        window.location.reload();
      } else {
        await api.post(`/assignments/${assignmentId}/submit`, { solutionUrl: url });
        toast.success("Assignment submitted!");
        onSubmitted?.();
        setUrl("");
        window.location.reload();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="mt-3 flex gap-2">
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Paste your solution link (Google Drive, GitHub, etc.)"
        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button type="submit" disabled={submitting} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50">
        {submitting ? "..." : "Submit"}
      </button>
    </form>
  );
}

function QuestionForm({ courseId, onPost }) {
  const [question, setQuestion] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const post = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    try {
      setSubmitting(true);
      await api.post(`/discussions/${courseId}`, { question });
      toast.success("Question posted!");
      setQuestion("");
      onPost();
    } catch (err) {
      toast.error("Failed to post question");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={post} className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask a question about this course..."
        rows="2"
        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
      />
      <button type="submit" disabled={submitting} className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50">
        {submitting ? "Posting..." : "Ask Question"}
      </button>
    </form>
  );
}

function ReplyForm({ discussionId, onReply }) {
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const reply = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      setSubmitting(true);
      await api.post(`/discussions/${discussionId}/reply`, { text });
      toast.success("Reply posted!");
      setText("");
      onReply();
    } catch (err) {
      toast.error("Failed to post reply");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={reply} className="mt-3 flex gap-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a reply..."
        className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button type="submit" disabled={submitting} className="bg-gray-700 dark:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 disabled:opacity-50">
        Reply
      </button>
    </form>
  );
}

export default Learning;
