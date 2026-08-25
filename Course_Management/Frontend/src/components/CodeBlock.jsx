import { useState } from "react";

// Minimal syntax highlighter without external deps
function highlight(code, language) {
  // Escape HTML first
  const escaped = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "<")
    .replace(/>/g, ">");

  // Keywords & comments highlighting (simple tokenizer)
  const keywords =
    "const|let|var|function|return|if|else|for|while|import|from|export|default|class|new|async|await|try|catch|throw|switch|case|break|continue|typeof|instanceof|this|null|undefined|true|false|require|module|useState|useEffect|useRef|useContext|useReducer|useMemo|useCallback|React|express|app|router";

  let html = escaped;

  // Highlight strings
  html = html.replace(
    /("([^"\\]|\\.)*"|'([^'\\]|\\.)*'|`([^`\\]|\\.)*`)/g,
    '<span class="text-amber-300">$1</span>'
  );
  // Highlight comments
  html = html.replace(
    /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/g,
    '<span class="text-gray-500 italic">$1</span>'
  );
  // Highlight keywords
  html = html.replace(
    new RegExp(`\\b(${keywords})\\b`, "g"),
    '<span class="text-blue-400">$1</span>'
  );
  // Highlight numbers
  html = html.replace(/\b(\d+)\b/g, '<span class="text-green-400">$1</span>');

  return html;
}

function CodeBlock({ code = "", language = "javascript", explanation = "" }) {
  const [copied, setCopied] = useState(false);
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const run = () => {
    setRunning(true);
    setOutput("");
    try {
      const logs = [];
      const originalLog = console.log;
      console.log = (...args) => logs.push(args.map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" "));
      // eslint-disable-next-line no-new-func
      const fn = new Function(code);
      fn();
      console.log = originalLog;
      setOutput(logs.join("\n") || "✅ Code ran successfully (no console output).");
    } catch (err) {
      setOutput("❌ Error: " + err.message);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="my-3 rounded-xl overflow-hidden border border-gray-700 bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500" />
          <span className="w-3 h-3 rounded-full bg-yellow-500" />
          <span className="w-3 h-3 rounded-full bg-green-500" />
          <span className="ml-2 text-xs text-gray-400 uppercase">{language}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={run}
            className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded font-semibold transition-colors"
          >
            ▶ Run
          </button>
          <button
            onClick={copy}
            className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded font-semibold transition-colors"
          >
            {copied ? "✓ Copied" : "Copy Code"}
          </button>
        </div>
      </div>

      {/* Code */}
      <pre className="p-4 overflow-x-auto text-sm leading-relaxed font-mono text-gray-100 whitespace-pre">
        <code dangerouslySetInnerHTML={{ __html: highlight(code, language) }} />
      </pre>

      {/* Output */}
      {output && (
        <div className="px-4 py-3 bg-black border-t border-gray-700">
          <p className="text-xs text-gray-500 mb-1">Output:</p>
          <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">{output}</pre>
        </div>
      )}

      {/* Explanation */}
      {explanation && (
        <div className="px-4 py-3 bg-gray-800 border-t border-gray-700 text-sm text-gray-300">
          💡 {explanation}
        </div>
      )}
    </div>
  );
}

export default CodeBlock;
