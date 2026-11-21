import { useState, useEffect } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";

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

export default function DiscussionsTab({ course, courseId, discussions, user, onDiscussionsLoad }) {
  const [threads, setThreads] = useState(discussions || []);

  useEffect(() => {
    if (discussions) {
      setThreads(discussions);
    }
  }, [discussions]);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border dark:border-gray-800 animate-fadeInUp">
      <div className="bg-gradient-to-r from-pink-500 to-rose-600 px-6 py-4">
        <h2 className="text-xl font-bold text-white">💬 Discussions</h2>
        <p className="text-pink-100 text-sm">Ask questions, share insights</p>
      </div>

      {/* New Post Form */}
      <div className="p-4 border-b dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
        <QuestionForm courseId={courseId} onPost={onDiscussionsLoad} />
      </div>

      {/* Threads List */}
      <div className="divide-y dark:divide-gray-800">
        {threads.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-5xl mb-3">💬</div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">No questions yet. Be the first to ask!</h3>
          </div>
        ) : (
          threads.map((d) => (
            <div key={d._id} className="p-4 animate-slideDown">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                  {d.user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm">{d.user?.name}</p>
                  <p className="text-xs text-gray-400">{formatTime(d.createdAt)}</p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300">{d.question}</p>
              <div className="mt-3 space-y-2">
                {d.replies?.map((r, ri) => (
                  <div key={ri} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 ml-6 animate-slideDown">
                    <p className="text-sm text-gray-800 dark:text-gray-200">
                      <span className="font-semibold">{r.user?.name}:</span> {r.text}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">👍 {r.likes?.length || 0} likes</p>
                  </div>
                ))}
              </div>
              <ReplyForm discussionId={d._id} onReply={onDiscussionsLoad} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}