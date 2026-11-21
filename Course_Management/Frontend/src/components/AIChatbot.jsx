import { useState, useEffect } from "react";
import AIChatPanel from "./AIChatPanel";

/**
 * AIChatbot - floating AI assistant button (bottom-right) available on
 * every page after login. Renders a reusable AIChatPanel inside a
 * floating window. Listens for the global "open-ai-chat" CustomEvent so
 * that any page (e.g. the dashboard) can open the bot programmatically.
 */
function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);

  // Allow opening the chatbot from anywhere via a global event
  useEffect(() => {
    const handleOpen = () => {
      setOpen(true);
      setMinimized(false);
    };
    window.addEventListener("open-ai-chat", handleOpen);
    return () => window.removeEventListener("open-ai-chat", handleOpen);
  }, []);

  const toggle = () => {
    setOpen(!open);
    setMinimized(false);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={toggle}
        className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"
        aria-label="AI Assistant"
      >
        {open ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div
          className={`fixed right-5 bottom-24 z-50 w-[92vw] max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all ${
            minimized ? "h-14" : "h-[520px]"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                🤖
              </div>
              <div>
                <p className="font-bold text-sm">CodeMentor AI</p>
                <p className="text-[10px] text-indigo-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-pulse" />
                  Online • Programming Tutor
                </p>
              </div>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setMinimized(!minimized)}
                className="p-1 hover:bg-white/20 rounded"
                aria-label="Minimize"
              >
                {minimized ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                )}
              </button>
              <button
                onClick={() => setOpen(false)}
                className="p-1 hover:bg-white/20 rounded"
                aria-label="Close"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>

          {!minimized && <AIChatPanel height="calc(100% - 56px)" />}
        </div>
      )}
    </>
  );
}

export default AIChatbot;
