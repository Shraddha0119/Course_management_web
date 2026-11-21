import { useState } from "react";
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

export default function AssignmentsTab({ course, courseId, activeSection, assignments, user, enrollment, onAssignmentsLoad }) {
  const allAssignments = assignments || [];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border dark:border-gray-800 animate-fadeInUp">
      <div className="bg-gradient-to-r from-orange-500 to-amber-600 px-6 py-4">
        <h2 className="text-xl font-bold text-white">📋 Assignments</h2>
        <p className="text-orange-100 text-sm">Module {activeSection + 1} • {allAssignments.length} total assignments</p>
      </div>

      {allAssignments.length === 0 ? (
        <div className="p-12 text-center">
          <div className="text-5xl mb-3">📝</div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">No assignments for this course.</h3>
        </div>
      ) : (
        <div className="p-6 divide-y dark:divide-gray-800 space-y-4">
          {allAssignments.map((a) => {
            const mySubmission = a.submissions?.find(
              (s) => s.student?.toString() === user._id?.toString() || s.student?.toString() === user.id?.toString()
            );
            const isLocal = !a._id || a._id.startsWith("local-");

            return (
              <div key={a._id || a.title} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 animate-slideDown">
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
                    isLocal={isLocal}
                    assignmentTitle={a.title}
                    onSubmitted={() => awardBadge("First Assignment Submitted")}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}