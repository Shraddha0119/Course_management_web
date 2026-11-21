import { useState, useRef, useEffect } from "react";

const DEFAULT_CODE = {
  javascript: `// Try it yourself! Write your JavaScript code here
console.log("Hello, World!");

function greet(name) {
  return "Hello, " + name + "!";
}

console.log(greet("Learner"));`,
  python: `# Try it yourself! Write your Python code here
print("Hello, World!")

def greet(name):
    return f"Hello, {name}!"

print(greet("Learner"))`,
  html: `<!DOCTYPE html>
<html>
<head>
  <title>Try It Yourself</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    .output { color: green; margin-top: 10px; }
  </style>
</head>
<body>
  <h1>Hello, World!</h1>
  <p id="output"></p>
  <script>
    document.getElementById("output").innerText = "Hello from JavaScript!";
  </script>
</body>
</html>`,
  css: `/* Try it yourself! Write your CSS here */
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: system-ui, sans-serif;
}

.card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

.button {
  background: white;
  color: #667eea;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.button:hover {
  transform: translateY(-2px);
}`,
};

const LANGUAGE_EXTENSIONS = {
  javascript: "js",
  python: "py",
  html: "html",
  css: "css",
};

function TryItEditor({ initialCode = "", language = "javascript", onCodeChange, lessonId }) {
  const [code, setCode] = useState(initialCode || DEFAULT_CODE[language] || DEFAULT_CODE.javascript);
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);
  const [error, setError] = useState(null);
  const [showOutput, setShowOutput] = useState(true);
  const editorRef = useRef(null);
  const outputRef = useRef(null);
  const [theme, setTheme] = useState("dark");

  // Persist code to localStorage per lesson
  useEffect(() => {
    if (lessonId) {
      const saved = localStorage.getItem(`tryit_${lessonId}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.code) setCode(parsed.code);
        } catch (e) {
          // ignore parse errors
        }
      }
    }
  }, [lessonId]);

  useEffect(() => {
    if (lessonId && code) {
      localStorage.setItem(`tryit_${lessonId}`, JSON.stringify({ code, language }));
    }
    onCodeChange?.(code);
  }, [code, lessonId, language, onCodeChange]);

  const runCode = async () => {
    setRunning(true);
    setError(null);
    setOutput("");

    try {
      if (language === "html") {
        // For HTML, we create a blob URL and open in iframe
        runHTML(code);
      } else if (language === "javascript") {
        runJavaScript(code);
      } else if (language === "python") {
        await runPython(code);
      } else if (language === "css") {
        runCSS(code);
      }
    } catch (err) {
      setError("Error: " + err.message);
      setOutput("❌ " + err.message);
    } finally {
      setRunning(false);
    }
  };

  const runJavaScript = (code) => {
    const logs = [];
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    console.log = (...args) => logs.push(args.map(formatValue).join(" "));
    console.error = (...args) => logs.push("❌ " + args.map(formatValue).join(" "));
    console.warn = (...args) => logs.push("⚠️ " + args.map(formatValue).join(" "));

    try {
      // eslint-disable-next-line no-new-func
      const fn = new Function(`
        "use strict";
        ${code}
      `);
      fn();
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;

      const result = logs.join("\n") || "✅ Code executed successfully (no console output).";
      setOutput(result);
    } catch (err) {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
      throw err;
    }
  };

  const runHTML = (code) => {
    // Create an iframe to run HTML
    const iframe = document.createElement("iframe");
    iframe.style.width = "100%";
    iframe.style.height = "300px";
    iframe.style.border = "1px solid #374151";
    iframe.style.borderRadius = "0.5rem";
    iframe.style.background = "white";
    iframe.sandbox = "allow-scripts allow-same-origin allow-forms allow-pointer-lock";

    const blob = new Blob([code], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    iframe.src = url;

    // Replace output area with iframe
    if (outputRef.current) {
      outputRef.current.innerHTML = "";
      outputRef.current.appendChild(iframe);
      setOutput(""); // Clear text output
    }

    // Cleanup
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const runCSS = (code) => {
    // Create a preview with the CSS applied
    const previewHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          * { box-sizing: border-box; }
          body { margin: 0; padding: 20px; font-family: system-ui, sans-serif; background: #f9fafb; }
          ${code}
        </style>
      </head>
      <body>
        <div class="container">
          <div class="card">
            <h2>CSS Preview</h2>
            <p>This is a preview of your CSS styles.</p>
            <button class="button">Styled Button</button>
          </div>
          <div style="margin-top: 1rem; padding: 1rem; background: white; border-radius: 0.5rem; border: 1px solid #e5e7eb;">
            <h3>Test Elements</h3>
            <p>Paragraph text</p>
            <a href="#">Link</a>
            <ul><li>List item 1</li><li>List item 2</li></ul>
            <button>Button</button>
            <input placeholder="Input field" style="margin-top: 0.5rem; padding: 0.5rem; width: 100%; border: 1px solid #ddd; border-radius: 0.25rem;">
          </div>
        </div>
      </body>
      </html>
    `;

    const iframe = document.createElement("iframe");
    iframe.style.width = "100%";
    iframe.style.height = "400px";
    iframe.style.border = "1px solid #374151";
    iframe.style.borderRadius = "0.5rem";
    iframe.sandbox = "allow-scripts allow-same-origin";

    const blob = new Blob([previewHTML], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    iframe.src = url;

    if (outputRef.current) {
      outputRef.current.innerHTML = "";
      outputRef.current.appendChild(iframe);
      setOutput("");
    }

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const runPython = async (code) => {
    // Use a simple Python interpreter simulation (since we can't run real Python in browser)
    // For a real implementation, you'd use Pyodide or a backend service
    setOutput("🐍 Python execution requires a backend service or Pyodide.\n\nFor now, here's what your code would do:\n\n" + code.split("\n").map((line, i) => `${i + 1}: ${line}`).join("\n"));
  };

  const formatValue = (val) => {
    if (typeof val === "object") {
      try {
        return JSON.stringify(val, null, 2);
      } catch {
        return String(val);
      }
    }
    return String(val);
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      return true;
    } catch (e) {
      const ta = document.createElement("textarea");
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      return true;
    }
  };

  const downloadCode = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tryit_${lessonId || "code"}.${LANGUAGE_EXTENSIONS[language] || "txt"}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetCode = () => {
    setCode(DEFAULT_CODE[language] || DEFAULT_CODE.javascript);
  };

  const handleKeyDown = (e) => {
    // Tab support
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newCode = code.substring(0, start) + "  " + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 2;
      }, 0);
    }

    // Cmd/Ctrl + Enter to run
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      runCode();
    }
  };

  return (
    <div className="w-full rounded-xl overflow-hidden border border-gray-700 bg-gray-900">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-xs text-gray-400 uppercase font-mono">{language}</span>
          <span className="text-xs text-gray-500 px-2 py-0.5 bg-gray-700 rounded">Try It Yourself</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={runCode}
            disabled={running}
            className="text-xs bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-3 py-1.5 rounded font-semibold transition-colors flex items-center gap-1"
          >
            {running ? (
              <>
                <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Running...
              </>
            ) : (
              "▶ Run"
            )}
          </button>
          <button
            onClick={copyCode}
            className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded font-semibold transition-colors"
          >
            📋 Copy
          </button>
          <button
            onClick={downloadCode}
            className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded font-semibold transition-colors"
          >
            💾 Download
          </button>
          <button
            onClick={resetCode}
            className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded font-semibold transition-colors"
          >
            ↻ Reset
          </button>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded font-semibold transition-colors"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </div>
      </div>

      {/* Editor & Output */}
      <div className="flex flex-col lg:flex-row min-h-[500px]">
        {/* Editor Panel */}
        <div className="flex-1 flex flex-col min-w-0 border-r border-gray-700 lg:border-r">
          <div className="px-3 py-2 bg-gray-850 border-b border-gray-700 flex items-center justify-between text-xs text-gray-400">
            <span>Editor (Ctrl+Enter to run)</span>
            <span className="font-mono">{code.split("\n").length} lines</span>
          </div>
          <textarea
            ref={editorRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            className={`flex-1 p-4 font-mono text-sm leading-relaxed resize-none border-0 outline-none ${
              theme === "dark"
                ? "bg-gray-900 text-gray-100 caret-green-400"
                : "bg-white text-gray-900 caret-blue-600"
            }`}
            placeholder={`Write your ${language} code here...`}
            style={{
              fontFamily: "'Fira Code', 'Monaco', 'Consolas', monospace",
              fontSize: "13px",
              lineHeight: "1.6",
              tabSize: 2,
            }}
          />
        </div>

        {/* Output Panel */}
        <div className={`flex-1 flex flex-col min-w-0 ${showOutput ? "" : "hidden lg:flex"}`}>
          <div className="px-3 py-2 bg-gray-850 border-b border-gray-700 flex items-center justify-between text-xs text-gray-400">
            <span>Output</span>
            <button
              onClick={() => setShowOutput(!showOutput)}
              className="text-xs text-gray-500 hover:text-white transition-colors"
            >
              {showOutput ? "Hide" : "Show"} Output
            </button>
          </div>
          <div
            ref={outputRef}
            className={`flex-1 p-4 overflow-auto font-mono text-sm ${
              theme === "dark"
                ? "bg-black text-green-400"
                : "bg-gray-50 text-gray-800"
            }`}
            style={{ fontFamily: "'Fira Code', 'Monaco', 'Consolas', monospace", fontSize: "13px", lineHeight: "1.6" }}
          >
            {error && (
              <pre className="text-red-400 whitespace-pre-wrap">{error}</pre>
            )}
            {output && !output.startsWith("🐍") && (
              <pre className="whitespace-pre-wrap">{output}</pre>
            )}
            {!output && !error && (
              <p className="text-gray-500 text-center mt-8">Click "Run" to see output...</p>
            )}
            {output && output.startsWith("🐍") && (
              <pre className="text-yellow-400 whitespace-pre-wrap">{output}</pre>
            )}
          </div>
        </div>
      </div>

      {/* Mobile output toggle */}
      <div className="lg:hidden px-4 py-2 bg-gray-800 border-t border-gray-700">
        <button
          onClick={() => setShowOutput(!showOutput)}
          className={`w-full text-center py-2 rounded-lg text-sm font-medium transition-colors ${
            showOutput
              ? "bg-green-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          {showOutput ? "📊 Hide Output" : "📊 Show Output"}
        </button>
      </div>
    </div>
  );
}

export default TryItEditor;