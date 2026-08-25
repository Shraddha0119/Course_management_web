// AIEngine.js
// Local knowledge base used by the AI chatbot as a smart fallback and
// for quick tutor-style answers. The primary AI is the Gemini API via
// the backend proxy (/api/ai/chat). This engine provides rich offline
// answers and course-aware content generation.

export const programmingTopics = [
  "javascript",
  "js",
  "react",
  "node",
  "node.js",
  "express",
  "mongodb",
  "html",
  "css",
  "mern",
  "database",
  "sql",
  "api",
  "rest",
  "assignment",
  "quiz",
  "error",
  "bug",
  "debug",
  "best practice",
  "function",
  "component",
  "state",
  "hook",
  "array",
  "object",
  "callback",
  "promise",
  "async",
  "await",
  "variable",
  "loop",
  "dom",
  "fetch",
  "axios",
  "jwt",
  "authentication",
  "crud",
  "java",
  "python",
  "c++",
  "c",
  "typescript",
];

// Detect if a message relates to programming/learning
export function isProgrammingRelated(message) {
  const lower = message.toLowerCase();
  return programmingTopics.some((t) => lower.includes(t));
}

// Polite refusal for non-programming topics
export function getNonProgrammingReply() {
  return `I'm CodeMentor, your programming tutor for this course platform! 🤖

I'm designed specifically to help you learn **software development** — JavaScript, React, Node.js, Express, MongoDB, HTML, CSS, the MERN stack, and more.

I can help you with:
- 📖 Course concepts & lessons
- 💻 Code examples & debugging
- 📝 Assignments & quizzes
- 🚀 Best practices & project guidance

Could you ask me something related to programming or your course? I'd love to help! 😊`;
}

// Quick local answers for common topics (used when Gemini is unavailable)
export function getLocalAnswer(message) {
  const m = message.toLowerCase();
  const answers = {
    function:
      "**Functions in JavaScript** are reusable blocks of code.\n\n```js\n// Function declaration\nfunction add(a, b) {\n  return a + b;\n}\n\n// Arrow function\nconst add = (a, b) => a + b;\n```\n\n**Key points:**\n- Functions can take parameters and return values.\n- Arrow functions are shorter and don't bind their own `this`.\n- Use them to keep code DRY (Don't Repeat Yourself).",
    promise:
      "**Promises** handle asynchronous operations in JavaScript.\n\n```js\nconst fetchData = () => {\n  return new Promise((resolve, reject) => {\n    setTimeout(() => resolve(\"Data loaded!\"), 1000);\n  });\n};\n\nfetchData()\n  .then(data => console.log(data))\n  .catch(err => console.error(err));\n```\n\n**With async/await (cleaner):**\n```js\nasync function load() {\n  try {\n    const data = await fetchData();\n    console.log(data);\n  } catch (err) {\n    console.error(err);\n  }\n}\n```\n\nA **Promise** has 3 states: pending, fulfilled, rejected.",
    react:
      "**React** is a JavaScript library for building user interfaces.\n\n**Core ideas:**\n- **Components** — reusable UI pieces.\n- **Props** — data passed from parent to child.\n- **State** — data that changes over time.\n- **Hooks** — functions like `useState`, `useEffect`.\n\n```jsx\nimport { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <button onClick={() => setCount(count + 1)}>\n      Clicked {count} times\n    </button>\n  );\n}\n```\n\nReact uses a **virtual DOM** to efficiently update the real DOM.",
    state:
      "**State** in React holds data that can change over time and triggers re-renders.\n\n```jsx\nconst [count, setCount] = useState(0);\n\n// Update state (triggers re-render)\nsetCount(count + 1);\n```\n\n**Rules:**\n- Never mutate state directly — always use the setter.\n- State updates are asynchronous.\n- Call hooks at the top level of your component.",
    "usestate": "`useState` is a React Hook that adds state to functional components.\n\n```jsx\nconst [value, setValue] = useState(initialValue);\n```\n\nIt returns an **array** with two items:\n1. The current state value.\n2. A function to update it.\n\n```jsx\nimport { useState } from 'react';\n\nfunction Toggle() {\n  const [on, setOn] = useState(false);\n  return <button onClick={() => setOn(!on)}>{on ? 'ON' : 'OFF'}</button>;\n}\n```",
    "useeffect": "`useEffect` runs side effects in React components (data fetching, timers, subscriptions).\n\n```jsx\nimport { useEffect, useState } from 'react';\n\nfunction Users() {\n  const [users, setUsers] = useState([]);\n\n  useEffect(() => {\n    fetch('/api/users')\n      .then(r => r.json())\n      .then(setUsers);\n  }, []); // empty deps = run once on mount\n\n  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;\n}\n```\n\nThe second argument (dependency array) controls when it re-runs.",
    express:
      "**Express.js** is a minimal Node.js web framework.\n\n**Basic server:**\n```js\nimport express from 'express';\nconst app = express();\napp.use(express.json());\n\napp.get('/api/hello', (req, res) => {\n  res.json({ message: 'Hello World' });\n});\n\napp.listen(5000, () => console.log('Server running'));\n```\n\n**Middleware** runs between request and response. Route handlers receive `req` and `res`.",
    mongodb:
      "**MongoDB** is a NoSQL document database that stores data in BSON documents.\n\n**With Mongoose (Node.js):**\n```js\nimport mongoose from 'mongoose';\n\nconst userSchema = new mongoose.Schema({\n  name: String,\n  email: String,\n  role: { type: String, default: 'student' }\n});\n\nexport default mongoose.model('User', userSchema);\n```\n\n**Key concepts:** Collections (tables), Documents (rows), Schemas (structure).",
    "node":
      "**Node.js** lets you run JavaScript on the server using the V8 engine.\n\n**Key features:**\n- Non-blocking, event-driven I/O.\n- npm for package management.\n- Modules via `import`/`require`.\n\n```js\nimport http from 'http';\nconst server = http.createServer((req, res) => {\n  res.end('Hello from Node!');\n});\nserver.listen(3000);\n```",
    api:
      "**APIs** (Application Programming Interfaces) let different software communicate.\n\n**REST API methods:**\n- **GET** — read data\n- **POST** — create data\n- **PUT** — update data\n- **DELETE** — remove data\n\n**Example with fetch:**\n```js\nconst res = await fetch('/api/courses');\nconst courses = await res.json();\n```\n\nAPIs are stateless and use HTTP status codes (200 OK, 404 Not Found, 500 Error).",
    "jwt":
      "**JWT (JSON Web Token)** is used for secure authentication.\n\n**Flow:**\n1. User logs in → server creates a token.\n2. Server sends token to client.\n3. Client sends token in `Authorization: Bearer <token>` header.\n4. Server verifies the token on protected routes.\n\n```js\nimport jwt from 'jsonwebtoken';\nconst token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });\nconst decoded = jwt.verify(token, process.env.JWT_SECRET);\n```",
    "crud":
      "**CRUD** = Create, Read, Update, Delete.\n\n**MongoDB/Mongoose example:**\n```js\n// CREATE\nawait Course.create({ title: 'React' });\n// READ\nconst courses = await Course.find();\n// UPDATE\nawait Course.findByIdAndUpdate(id, { title: 'New' });\n// DELETE\nawait Course.findByIdAndDelete(id);\n```",
    "html":
      "**HTML** (HyperText Markup Language) structures web pages.\n\n```html\n<!DOCTYPE html>\n<html>\n<head><title>My Page</title></head>\n<body>\n  <h1>Hello World</h1>\n  <p>This is a paragraph.</p>\n</body>\n</html>\n```\n\nUse semantic tags: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`.",
    "css":
      "**CSS** styles HTML elements.\n\n```css\n.card {\n  background: white;\n  border-radius: 12px;\n  padding: 20px;\n  box-shadow: 0 4px 6px rgba(0,0,0,0.1);\n}\n.card:hover {\n  transform: translateY(-4px);\n}\n```\n\n**Flexbox & Grid** handle layout. CSS variables (`--color`) make themes easy.",
    "array":
      "**Arrays** in JavaScript store ordered lists.\n\n```js\nconst fruits = ['apple', 'banana', 'cherry'];\n\n// Common methods\nfruits.push('date');       // add to end\nfruits.map(f => f.toUpperCase()); // transform\nfruits.filter(f => f.startsWith('b')); // filter\nfruits.reduce((sum, f) => sum + f.length, 0);\n```",
    "object":
      "**Objects** in JavaScript store key-value pairs.\n\n```js\nconst user = {\n  name: 'Alice',\n  age: 25,\n  greet() { console.log(`Hi, I'm ${this.name}`); }\n};\n\nconsole.log(user.name);  // 'Alice'\nconsole.log(user['age']); // 25\n```",
    "callback":
      "A **callback** is a function passed as an argument to another function, executed later.\n\n```js\nfunction fetchData(callback) {\n  setTimeout(() => callback('data'), 1000);\n}\n\nfetchData((data) => console.log(data));\n```\n\nCallbacks can cause 'callback hell' — use **Promises** or **async/await** instead.",
    "async":
      "**async/await** makes asynchronous code look synchronous.\n\n```js\nasync function getUsers() {\n  try {\n    const res = await fetch('/api/users');\n    const data = await res.json();\n    return data;\n  } catch (err) {\n    console.error('Failed:', err);\n  }\n}\n```\n\n- `async` marks a function as returning a Promise.\n- `await` pauses until a Promise resolves.",
    variable:
      "**Variables** in JavaScript:\n- `let` — mutable, block-scoped.\n- `const` — immutable reference, block-scoped.\n- `var` — function-scoped (avoid).\n\n```js\nlet count = 5;\nconst name = 'React';\n```",
  };
  for (const key of Object.keys(answers)) {
    if (m.includes(key)) return answers[key];
  }
  return null;
}
