// Local fallback answers when Gemini is unavailable/unconfigured
const localTutor = (message) => {
  const m = message.toLowerCase();
  const answers = {
    function: "In JavaScript, a **function** is a reusable block of code.\n```js\nfunction add(a, b) {\n  return a + b;\n}\n```\n- Functions take parameters and return values.\n- Arrow functions `() => {}` are a shorter syntax.\n- Use them to keep code DRY.",
    react: "**React** builds UIs with components, props, and state.\n```jsx\nexport function Counter() {\n  const [count, setCount] = React.useState(0);\n  return <button onClick={() => setCount(count+1)}>{count}</button>;\n}\n```\nKey concepts: components, JSX, props, state, hooks, virtual DOM.",
    promise:
      "A **Promise** represents a future value.\n```js\nconst p = new Promise((resolve, reject) => {\n  setTimeout(() => resolve('done!'), 1000);\n});\np.then(console.log);\n```\nStates: pending → fulfilled / rejected. Prefer `async/await` for readability.",
    express:
      "**Express** is a Node.js web framework.\n```js\nimport express from 'express';\nconst app = express();\napp.use(express.json());\napp.get('/api', (req, res) => res.json({ ok: true }));\napp.listen(5000);\n```",
    mongodb:
      "**MongoDB** is a NoSQL document database.\n```js\nconst user = await User.create({ name: 'Ada', role: 'student' });\nconst all = await User.find();\n```\nWith Mongoose you define Schemas then call CRUD methods.",
    javascript:
      "**JavaScript** is the language of the web — runs in browsers and Node.js.\nIt supports functions, closures, promises, async/await, ES modules, and more.",
    node: "**Node.js** runs JavaScript on the server using the V8 engine. It has a non-blocking, event-driven I/O model and a huge npm ecosystem.",
    jwt: "**JWT** authenticates API users.\nFlow: login → server signs a token → client sends `Authorization: Bearer <token>` → server verifies on protected routes.",
    "api": "An **API** lets apps talk to each other via HTTP.\n- GET = read, POST = create, PUT = update, DELETE = remove.\n- JSON is the common payload format.",
  };
  for (const [key, reply] of Object.entries(answers)) {
    if (m.includes(key)) return reply + "\n\n_(Local tutor response — configure a valid GEMINI_API_KEY for richer AI answers.)_";
  }
  return "I'm CodeMentor, your programming tutor! 🎓 I can help with JavaScript, React, Node.js, Express, MongoDB, HTML/CSS, APIs, debugging, assignments, and quizzes. Try asking me about **functions**, **React state**, **promises**, or **the MERN stack**.\n\n_(Local tutor response — configure a valid GEMINI_API_KEY in backend .env for AI-powered answers.)_";
};

// AI Chatbot - proxies to Gemini API (keeps API key server-side)
export const aiChat = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      // No key configured → use local tutor fallback so chatbot still works
      return res.status(200).json({ reply: localTutor(message), fallback: true });
    }

    // System prompt: programming tutor persona
    const systemPrompt = `You are CodeMentor, an expert programming tutor inside a Course Management System (LMS).
Your job is to help students learn software development step by step.
Topics you excel at: JavaScript, React, Node.js, Express, MongoDB, HTML, CSS, the MERN stack, databases, APIs, debugging, assignments, quizzes, and best practices.

Rules:
- Explain concepts step by step, like a friendly teacher.
- When asked about code, include clear, concise, correct code examples with brief explanations.
- Keep answers focused and educational.
- If the student asks something completely unrelated to programming/web development/software learning, politely reply that you are designed to help them learn software development and gently steer them back to course topics.
- Be encouraging and concise (aim for under 250 words unless a detailed walkthrough is requested).

Conversation history:
${history
  .map((h) => `${h.role === "user" ? "Student" : "Tutor"}: ${h.text}`)
  .join("\n")}

Student's latest message: ${message}`;

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: systemPrompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800,
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini API error:", response.status, errText);
      // Fall back to local tutor so the chatbot always responds
      return res.status(200).json({
        reply: localTutor(message),
        fallback: true,
        detail: errText,
      });
    }

    const data = await response.json();
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I'm sorry, I couldn't generate a response. Please try again.";

    res.status(200).json({ reply });
  } catch (error) {
    console.error("AI chat error:", error.message);
    res.status(500).json({ message: error.message });
  }
};
