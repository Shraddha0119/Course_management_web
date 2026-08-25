import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import useInView from "../../hooks/useInView";

const sampleChats = [
  { role: "user", text: "Explain closures in JavaScript with an example" },
  { role: "ai", text: "A closure is a function that remembers its outer variables even after the outer function returns." },
  { role: "user", text: "How do I fix this CORS error?" },
  { role: "ai", text: "Add the cors middleware in Express and configure origin + credentials." },
];

function AISection() {
  const { user } = useAuth();
  const [ref, inView] = useInView();

  const openChat = () => {
    window.dispatchEvent(new CustomEvent("open-ai-chat"));
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div
        ref={ref}
        className={`reveal ${inView ? "in-view" : ""} relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 md:p-14`}
      >
        {/* Decorative */}
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-16 w-64 h-64 rounded-full bg-white/10 blur-3xl" />

        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left text */}
          <div className="text-white">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 text-sm font-semibold mb-6">
              🤖 Meet CodeMentor AI
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">
              Your Personal AI Programming Tutor
            </h2>
            <p className="mt-4 text-indigo-100 leading-relaxed max-w-lg">
              Stuck on a bug? Need a concept explained? Ask CodeMentor AI
              anything — it explains code, suggests fixes, and helps you
              learn anytime, anywhere.
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <button
                onClick={openChat}
                className="btn-ripple bg-white text-indigo-700 px-6 py-3 rounded-xl font-bold shadow-lg hover:-translate-y-0.5 transition-all"
              >
                💬 Ask AI Assistant
              </button>
              {!user && (
                <Link
                  to="/register"
                  className="btn-ripple bg-white/15 text-white border border-white/30 px-6 py-3 rounded-xl font-bold hover:bg-white/25 transition-all"
                >
                  Get Started Free
                </Link>
              )}
            </div>

            {/* Feature chips */}
            <div className="flex flex-wrap gap-2 mt-8">
              {["Code Explanations", "Debugging Help", "Concept Clarification", "Syntax Examples"].map((chip, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full bg-white/15 text-sm text-white/90"
                >
                  ✓ {chip}
                </span>
              ))}
            </div>
          </div>

          {/* Right chat preview */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                🤖
              </div>
              <div>
                <p className="text-white font-bold text-sm">CodeMentor AI</p>
                <p className="text-indigo-200 text-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  Online
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {sampleChats.map((c, i) => (
                <div
                  key={i}
                  className={`flex ${c.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm ${
                      c.role === "user"
                        ? "bg-white/25 text-white rounded-br-sm"
                        : "bg-white/85 text-gray-800 rounded-bl-sm"
                    }`}
                  >
                    {c.text}
                  </div>
                </div>
              ))}
              <div className="flex justify-start">
                <div className="bg-white/85 rounded-2xl rounded-bl-sm px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AISection;
