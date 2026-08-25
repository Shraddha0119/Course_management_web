import { useRef } from "react";
import useAIChat from "../hooks/useAIChat";
import { useAuth } from "../context/AuthContext";

/**
 * AIChatPanel - reusable AI chat UI. Used inside the dashboard (inline)
 * and as the body of the floating chatbot. Keeps the chat logic in the
 * useAIChat hook so both surfaces stay in sync and work the same way.
 *
 * @param {Object} props
 * @param {string} props.height - CSS height for the scrollable message area
 * @param {boolean} props.persist - whether to persist history to localStorage
 * @param {Array}  props.suggestions - quick suggestion chips
 * @param {boolean} props.compact - smaller padding for tight layouts
 */
function AIChatPanel({
  height = "calc(100% - 120px)",
  persist = true,
  suggestions = [],
  compact = false,
}) {
  const { user } = useAuth();
  const {
    messages,
    typing,
    input,
    setInput,
    sendMessage,
    clearChat,
    handleKeyDown,
    endRef,
  } = useAIChat({ persist });

  const inputRef = useRef(null);

  const defaultSuggestions = [
    "Explain React useState with an example",
    "What is the difference between props and state?",
    "How do I fix a CORS error in Express?",
    "Explain JWT authentication step by step",
  ];

  const chips = suggestions.length ? suggestions : defaultSuggestions;

  const renderText = (text) => {
    if (!text) return null;
    const parts = text.split(/```(\w*)\n([\s\S]*?)```/g);
    return parts.map((part, i) => {
      if (i % 3 === 1) return null; // language
      if (i % 3 === 2) {
        // code block
        return (
          <pre
            key={i}
            className="bg-gray-900 text-green-300 text-xs p-2 rounded my-1 overflow-x-auto font-mono whitespace-pre-wrap"
          >
            {part}
          </pre>
        );
      }
      // text with bold
      const withBold = part.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      return (
        <div
          key={i}
          className="whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: withBold }}
        />
      );
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50 dark:bg-gray-900"
        style={{ height }}
      >
        {messages.length === 0 && (
          <div className="text-center py-4">
            <p className="text-3xl mb-2">👋</p>
            <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
              Hi {user?.name?.split(" ")[0] || "there"}! I'm CodeMentor, your AI
              programming tutor.
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-3">
              Ask me anything about your courses, code, or concepts.
            </p>
            <div className="space-y-2">
              {chips.map((s, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(s)}
                  className="block w-full text-left text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200"
                >
                  💬 {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm ${
                m.role === "user"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-sm"
                  : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-100 rounded-bl-sm"
              }`}
            >
              {renderText(m.text)}
            </div>
          </div>
        ))}

        {typing && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className={`p-${compact ? 2 : 3} border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800`}>
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything..."
            rows={1}
            className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-gray-800 dark:text-gray-100"
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || typing}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white px-4 rounded-xl font-bold transition-colors"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}

export default AIChatPanel;
