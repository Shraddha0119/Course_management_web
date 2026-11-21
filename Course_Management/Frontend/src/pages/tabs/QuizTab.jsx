import { useState, useEffect, useRef } from "react";
import api from "../../services/api";
import { toast } from "react-hot-toast";
import { recordActivity } from "../../utils/weeklyActivity";

// Award a badge to the student (fire-and-forget)
const awardBadge = async (name) => {
  try {
    await api.post("/users/badges", { name });
  } catch (e) {
    // ignore
  }
};

export default function QuizTab({ 
  course, 
  courseId, 
  activeSection, 
  quizData: initialQuizData, 
  onQuizLoad 
}) {
  const [quizData, setQuizData] = useState(initialQuizData);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [quizResult, setQuizResult] = useState(null);
  const [quizTimer, setQuizTimer] = useState(0);
  const timerRef = useRef(null);

  // Sync with parent's quizData when it changes
  useEffect(() => {
    if (initialQuizData) {
      setQuizData(initialQuizData);
      setQuizAnswers(new Array(initialQuizData.questions?.length || 0).fill(-1));
      setQuizResult(null);
      setQuizTimer(initialQuizData.timeLimit * 60);
    }
  }, [initialQuizData]);

  // Timer countdown
  useEffect(() => {
    if (!quizData || !quizData.timeLimit || quizResult) return;
    
    timerRef.current = setInterval(() => {
      setQuizTimer((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleSubmit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [quizData, quizResult]);

  const handleAnswer = (qIndex, optionIndex) => {
    if (quizResult) return;
    setQuizAnswers((prev) => {
      const next = [...prev];
      next[qIndex] = optionIndex;
      return next;
    });
  };

  const startQuiz = () => {
    if (!quizData) return;
    setQuizResult(null);
    setQuizAnswers(new Array(quizData.questions.length).fill(-1));
    setQuizTimer(quizData.timeLimit * 60);
  };

  const handleSubmit = async () => {
    if (!quizData) return;
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
      const passed = percentage >= (quizData.passPercentage || 60);
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

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (!quizData) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 border dark:border-gray-800 text-center">
        <div className="text-4xl mb-3">📝</div>
        <p className="text-gray-500 dark:text-gray-400">Loading quiz...</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border dark:border-gray-800 animate-fadeInUp">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">{quizData.title}</h2>
          <p className="text-purple-100 text-sm">{quizData.description}</p>
        </div>
        {quizData.timeLimit && !quizResult && (
          <div className="bg-white/20 px-4 py-1 rounded-full text-white font-mono text-lg">
            ⏱ {formatTime(quizTimer)} / {quizData.timeLimit}:00
          </div>
        )}
      </div>

      {quizResult && (
        <div className={`p-6 border-b dark:border-gray-800 ${quizResult.passed ? "bg-green-50 dark:bg-green-900/30" : "bg-red-50 dark:bg-red-900/30"}`}>
          <div className="flex items-center justify-center gap-4">
            <div className="text-4xl">{quizResult.passed ? "🎉" : "😔"}</div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                {quizResult.passed ? "Quiz Passed!" : "Quiz Failed"}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Score: {quizResult.percentage}% ({quizResult.score}/{quizResult.total} correct)
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="p-6 max-h-[70vh] overflow-y-auto">
        {quizData.questions?.map((q, i) => (
          <div key={q._id || i} className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-start gap-3 mb-3">
              <span className="bg-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              <p className="font-medium text-gray-800 dark:text-gray-100 flex-1">{q.question}</p>
            </div>
            {q.explanation && !quizResult && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">💡 {q.explanation}</p>
            )}
            <div className="space-y-2">
              {q.options?.map((opt, oi) => (
                <button
                  key={oi}
                  onClick={() => handleAnswer(i, oi)}
                  disabled={quizResult}
                  className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-colors ${
                    quizResult
                      ? oi === q.correctOption
                        ? "bg-green-100 dark:bg-green-900 border-green-400 text-green-700 dark:text-green-300"
                        : oi === quizAnswers[i]
                        ? "bg-red-100 dark:bg-red-900 border-red-400 text-red-700 dark:text-red-300"
                        : "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300"
                      : oi === quizAnswers[i]
                      ? "bg-purple-100 dark:bg-purple-900 border-purple-400 text-purple-700 dark:text-purple-300"
                      : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-purple-300"
                  }`}
                >
                  <span className="font-mono text-sm mr-2">{String.fromCharCode(65 + oi)}.</span>
                  {opt}
                </button>
              ))}
            </div>
            {quizResult && q.explanation && (
              <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-sm text-blue-700 dark:text-blue-300">
                💡 <strong>Explanation:</strong> {q.explanation}
              </div>
            )}
          </div>
        ))}

        {!quizResult && quizData.questions?.length > 0 && (
          <button
            onClick={handleSubmit}
            disabled={quizAnswers.some((a) => a === -1)}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Submit Quiz
          </button>
        )}

        {quizResult && (
          <div className="flex gap-3 justify-center mt-4">
            <button onClick={startQuiz} className="bg-purple-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-purple-700">
              Retake Quiz
            </button>
            <button onClick={() => setQuizResult(null)} className="bg-gray-100 dark:bg-gray-800 dark:text-gray-200 text-gray-700 px-5 py-2.5 rounded-lg font-semibold hover:bg-gray-200">
              View Questions
            </button>
          </div>
        )}
      </div>
    </div>
  );
}