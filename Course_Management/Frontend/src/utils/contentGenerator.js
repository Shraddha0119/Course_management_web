// contentGenerator.js
// Automatically generates a complete learning path (modules + lessons)
// based on a course title & category. Creates rich lessons with
// descriptions, objectives, key concepts, code examples, practice tasks,
// notes and resources.

const genericoCode =
  "// Welcome to the lesson!\n// Follow along with the example below.\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n\nconsole.log(greet('Student'));";

function buildLesson(title, description, code, objectives, keyConcepts, task, notes, resources) {
  return {
    title,
    description,
    videoUrl: "",
    duration: "10 min",
    objectives: objectives || ["Understand the core concept", "Apply it in a small example"],
    keyConcepts: keyConcepts || ["Core concept", "Practical usage"],
    codeExamples: [
      {
        language: "javascript",
        code: code || genericoCode,
        explanation: "Read through the example carefully, then run it to see the output.",
      },
    ],
    practiceTask: task || "Create a small example and experiment with variations.",
    notes: notes || ["Revisit this lesson after completing the section exercises."],
    resources: [],
    links: [],
  };
}

// React curriculum
function reactModules() {
  return [
    {
      moduleTitle: "React Fundamentals",
      lessons: [
        buildLesson(
          "Introduction to React",
          "What is React, why it's popular, and how it powers modern UIs.",
          "// React is a library for building user interfaces\n// 'Componentized' architecture\nconsole.log('React rules 😎');",
          ["Understand what React is", "Know why companies use it"],
          ["Components", "Virtual DOM", "Declarative UI"],
          "Write a one-line explanation of React to a friend.",
          ["React is declarative", "Components are the heart of React"]
        ),
        buildLesson(
          "Environment Setup & Vite",
          "Set up a React project using Vite and understand the folder structure.",
          "npm create vite@latest my-app -- --template react",
          ["Create a React app with Vite", "Understand the project structure"],
          ["Vite", "package.json", "JSX files"],
          "Create a new Vite React project and run it on port 5173."
        ),
        buildLesson(
          "JSX & Rendering",
          "JSX syntax and how React renders elements to the DOM.",
          "const element = <h1>Hello, JSX!</h1>;\n\n// React renders it:\n// document.getElementById('root').appendChild(element);",
          ["Understand JSX syntax", "Know how React DOM rendering works"],
          ["JSX", "Expressions {}", "createRoot"],
          "Render your name inside a JSX <h1>."
        ),
        buildLesson(
          "Components & Props",
          "Create reusable components and pass data with props.",
          "function Greeting(props) {\n  return <h1>Hello, {props.name}!</h1>;\n}\n\n<Greeting name=\"Alice\" />",
          ["Create function components", "Pass data via props"],
          ["Components", "Props", "Composition"],
          "Build a Card component that accepts a title prop."
        ),
      ],
    },
    {
      moduleTitle: "State & Events",
      lessons: [
        buildLesson(
          "useState Hook",
          "Manage state in functional components with useState.",
          "const [count, setCount] = useState(0);\n\n<button onClick={() => setCount(count + 1)}>\n  Count: {count}\n</button>",
          ["Understand state", "Use useState correctly"],
          ["useState", "State immutability"],
          "Build a counter with increment/decrement buttons."
        ),
        buildLesson(
          "useEffect Hook",
          "Run side effects: fetching data, timers, subscriptions.",
          "useEffect(() => {\n  fetch('/api/data')\n    .then(r => r.json())\n    .then(setData);\n}, []); // runs once",
          ["Understand side effects", "Use dependency arrays"],
          ["useEffect", "Dependencies", "Cleanup"],
          "Fetch a list of users from an API and display them."
        ),
        buildLesson(
          "Events & Forms",
          "Handle events and controlled form inputs in React.",
          "const [name, setName] = useState('');\n\n<input\n  value={name}\n  onChange={(e) => setName(e.target.value)}\n/>",
          ["Handle user events", "Create controlled inputs"],
          ["onChange", "Controlled forms"],
          "Create a login form with name and email inputs."
        ),
        buildLesson(
          "Lists & Conditional Rendering",
          "Render arrays of data and conditionally show content.",
          "const items = ['React', 'Vue', 'Angular'];\n\n<ul>\n  {items.map((item, i) => (\n    <li key={i}>{item}</li>\n  ))}\n</ul>",
          ["Map over arrays", "Use conditional rendering"],
          ["keys", "Ternary", "&& pattern"],
          "Render a todo list with a done/undone toggle."
        ),
      ],
    },
    {
      moduleTitle: "Advanced React Hooks",
      lessons: [
        buildLesson(
          "useContext & Global State",
          "Share state across the app without prop drilling.",
          "const ThemeContext = createContext('light');\n\nfunction App() {\n  return (\n    <ThemeContext.Provider value=\"dark\">\n      <Toolbar />\n    </ThemeContext.Provider>\n  );\n}",
          ["Understand the Context API", "Create a provider/consumer"],
          ["Context", "Provider", "useContext"],
          "Build a theme toggle using Context."
        ),
        buildLesson(
          "useReducer",
          "Manage complex state with a reducer function.",
          "function reducer(state, action) {\n  switch (action.type) {\n    case 'INCREMENT': return { count: state.count + 1 };\n    default: return state;\n  }\n}\n\nconst [state, dispatch] = useReducer(reducer, { count: 0 });",
          ["Understand reducers", "Dispatch actions"],
          ["useReducer", "Actions", "Reducers"],
          "Rewrite your counter using useReducer."
        ),
        buildLesson(
          "Custom Hooks",
          "Extract reusable logic into custom hooks.",
          "function useLocalStorage(key, initial) {\n  const [value, setValue] = useState(() => {\n    return JSON.parse(localStorage.getItem(key)) || initial;\n  });\n  useEffect(() => {\n    localStorage.setItem(key, JSON.stringify(value));\n  }, [value]);\n  return [value, setValue];\n}",
          ["Create custom hooks", "Reuse logic cleanly"],
          ["Custom hooks", "Encapsulation"],
          "Create a useFetch hook for API calls."
        ),
        buildLesson(
          "React Router",
          "Add multi-page navigation to your React app.",
          "import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';\n\n<BrowserRouter>\n  <Link to=\"/\">Home</Link>\n  <Routes>\n    <Route path=\"/\" element={<Home />} />\n    <Route path=\"/about\" element={<About />} />\n  </Routes>\n</BrowserRouter>",
          ["Set up React Router", "Create nested routes"],
          ["Routes", "Route", "Link", "useParams"],
          "Create a mini site with Home, About, and Contact pages."
        ),
      ],
    },
    {
      moduleTitle: "Data & APIs",
      lessons: [
        buildLesson(
          "Fetching Data with Axios",
          "Make HTTP requests to REST APIs using Axios.",
          "import axios from 'axios';\n\nconst { data } = await axios.get('/api/courses');\n\n// POST\nawait axios.post('/api/courses', { title: 'React' });",
          ["Use Axios for GET/POST", "Handle loading/errors"],
          ["Axios", "Async/await", "Error handling"],
          "Fetch and display a list of courses."
        ),
        buildLesson(
          "POST & Forms",
          "Submit form data to a backend API.",
          "const handleSubmit = async (e) => {\n  e.preventDefault();\n  await axios.post('/api/users', { name, email });\n};",
          ["Submit forms to APIs", "Validate input"],
          ["FormData", "onSubmit", "PreventDefault"],
          "Build a registration form that posts to a backend."
        ),
        buildLesson(
          "React + Express Integration",
          "Connect your React frontend to an Express backend.",
          "// Frontend\nfetch('http://localhost:5000/api/courses')\n\n// Backend\napp.get('/api/courses', (req, res) => {\n  res.json(courses);\n});",
          ["Understand CORS", "Connect frontend to backend"],
          ["CORS", "REST", "Proxy"],
          "Connect your courses page to the backend API."
        ),
        buildLesson(
          "CRUD in Fullstack",
          "Build a complete Create-Read-Update-Delete feature.",
          "// GET\nconst { data } = await api.get('/items');\n// POST\nawait api.post('/items', item);\n// PUT\nawait api.put(`/items/${id}`, item);\n// DELETE\nawait api.delete(`/items/${id}`);",
          ["Implement full CRUD", "Understand API design"],
          ["REST methods", "MVC", "Async flows"],
          "Build a complete todo app with CRUD."
        ),
      ],
    },
    {
      moduleTitle: "Project & Deployment",
      lessons: [
        buildLesson(
          "Building a Project from Scratch",
          "Plan and build a complete React application.",
          "// Steps: plan → design → build → test\n// 1. Wireframe the UI\n// 2. Set up components\n// 3. Connect APIs\n// 4. Test & polish",
          ["Plan a project", "Structure an app"],
          ["Project management", "Component architecture"],
          "Start building a course management dashboard."
        ),
        buildLesson(
          "Testing React",
          "Test components with Vitest / React Testing Library.",
          "import { render, screen } from '@testing-library/react';\n\nrender(<Hello name=\"World\" />);\nexpect(screen.getByText('Hello, World!')).toBeTruthy();",
          ["Write unit tests", "Test components"],
          ["Vitest", "Testing Library"],
          "Write a test for your counter component."
        ),
        buildLesson(
          "Optimization & Best Practices",
          "Optimize performance and follow React best practices.",
          "// React.memo prevents unnecessary re-renders\nconst MemoizedCard = React.memo(Card);\n\n// useMemo for expensive calculations\nconst total = useMemo(() => heavyCalc(items), [items]);",
          ["Optimize re-renders", "Lazy load routes"],
          ["React.memo", "useMemo", "useCallback", "Code splitting"],
          "Optimize your course list with memoization."
        ),
        buildLesson(
          "Deployment (Vercel/Netlify)",
          "Deploy your React app to the cloud.",
          "# Build your app\nnpm run build\n\n# Preview locally\nnpm run preview\n\n# Deploy to Vercel\nvercel deploy",
          ["Build for production", "Deploy to Vercel"],
          ["npm run build", "Vercel", "Netlify"],
          "Deploy your project to Vercel and share the URL."
        ),
      ],
    },
  ];
}

// Node.js curriculum
function nodeModules() {
  return [
    {
      moduleTitle: "Node.js Basics",
      lessons: [
        buildLesson(
          "Introduction to Node.js",
          "What Node.js is, the event loop, and why it's used for backends.",
          "// Hello Node!\nconsole.log('Hello from Node.js');\n\n// File system\nconst fs = require('fs');",
          ["Understand Node.js and the event loop"],
          ["Event loop", "npm", "Modules"],
          "Run your first Node.js script."
        ),
        buildLesson(
          "Modules & npm",
          "Import/export modules and use npm packages.",
          "import express from 'express';\nconst app = express();",
          ["Understand CommonJS vs ESM", "Use npm"],
          ["require", "import", "package.json"],
          "Create a package.json with npm init."
        ),
        buildLesson(
          "File System & OS",
          "Work with files and the operating system in Node.",
          "import fs from 'fs';\n\n// Write to a file\nfs.writeFileSync('notes.txt', 'Hello file!');\n\n// Read a file\nconst data = fs.readFileSync('notes.txt', 'utf8');",
          ["Read/write files", "Use fs module"],
          ["fs", "Buffers", "Streams"],
          "Create a command-line note-taking app."
        ),
        buildLesson(
          "Events & Streams",
          "The EventEmitter pattern and data streams.",
          "import { EventEmitter } from 'events';\n\nconst emitter = new EventEmitter();\nemitter.on('message', (msg) => console.log(msg));\nemitter.emit('message', 'Hello!');",
          ["Use EventEmitter", "Understand streams"],
          ["EventEmitter", "Streams", "buffers"],
          "Build a simple event-driven logger."
        ),
      ],
    },
    {
      moduleTitle: "Express.js",
      lessons: [
        buildLesson(
          "Setting Up Express",
          "Create a basic Express server with routes.",
          "import express from 'express';\nconst app = express();\napp.use(express.json());\n\napp.get('/', (req, res) => res.send('Hello'));\napp.listen(5000);",
          ["Set up Express", "Define routes"],
          ["Express", "Routes", "Middleware"],
          "Create a server with a few basic routes."
        ),
        buildLesson(
          "Routing & Middleware",
          "Route parameters, query strings, and custom middleware.",
          "app.get('/users/:id', (req, res) => {\n  res.json({ id: req.params.id });\n});\n\n// Custom middleware\napp.use((req, res, next) => {\n  console.log(req.method, req.url);\n  next();\n});",
          ["Use route params", "Write middleware"],
          ["req.params", "Middleware", "next()"],
          "Add URL parameter routes and logging middleware."
        ),
        buildLesson(
          "RESTful API Design",
          "Design clean REST endpoints for CRUD operations.",
          "app.get('/api/courses')\napp.post('/api/courses')\napp.put('/api/courses/:id')\napp.delete('/api/courses/:id')",
          ["Design REST APIs", "Use proper status codes"],
          ["REST", "Status codes", "JSON"],
          "Build CRUD routes for a courses resource."
        ),
        buildLesson(
          "Error Handling",
          "Centralized error handling in Express.",
          "app.use((err, req, res, next) => {\n  console.error(err);\n  res.status(err.status || 500).json({ message: err.message });\n});",
          ["Handle async errors", "Create error middleware"],
          ["Error middleware", "try/catch", "next(err)"],
          "Add proper error handling to your API."
        ),
      ],
    },
    {
      moduleTitle: "MongoDB & Mongoose",
      lessons: [
        buildLesson(
          "Introduction to MongoDB",
          "Documents, collections, and MongoDB Atlas setup.",
          "// Data lives in documents → collections\nconst course = {\n  title: 'Node.js',\n  price: 499,\n  instructor: new ObjectId(),\n};",
          ["Understand document model", "Set up Atlas"],
          ["Documents", "Collections", "Atlas"],
          "Create a free MongoDB Atlas cluster."
        ),
        buildLesson(
          "Mongoose Schemas & Models",
          "Define data structure with Mongoose.",
          "const courseSchema = new mongoose.Schema({\n  title: { type: String, required: true },\n  price: Number,\n  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },\n});\nexport default mongoose.model('Course', courseSchema);",
          ["Define schemas", "Create models"],
          ["Schema", "Model", "Types"],
          "Create a User and Course model."
        ),
        buildLesson(
          "CRUD with Mongoose",
          "Create, read, update, and delete documents.",
          "const course = await Course.create(data);\nconst courses = await Course.find().populate('instructor');\nawait Course.findByIdAndUpdate(id, updates);\nawait Course.findByIdAndDelete(id);",
          ["Perfrom CRUD with Mongoose", "Use populate"],
          ["create", "find", "populate"],
          "Build a courses API with all CRUD operations."
        ),
        buildLesson(
          "Aggregation & Indexing",
          "Powerful queries with the aggregation pipeline.",
          "const result = await Course.aggregate([\n  { $match: { price: { $gte: 100 } } },\n  { $group: { _id: '$category', count: { $sum: 1 } } },\n]);",
          ["Use aggregation pipelines", "Understand indexing"],
          ["$match", "$group", "$sort"],
          "Write an aggregation to count courses by category."
        ),
      ],
    },
    {
      moduleTitle: "Authentication & Security",
      lessons: [
        buildLesson(
          "JWT Authentication",
          "Issue and verify JSON Web Tokens.",
          "import jwt from 'jsonwebtoken';\nconst token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });\nconst decoded = jwt.verify(token, process.env.JWT_SECRET);",
          ["Understand JWT flow", "Sign & verify tokens"],
          ["JWT", "Tokens", "Secrets"],
          "Implement login that returns a JWT."
        ),
        buildLesson(
          "Password Hashing with bcrypt",
          "Securely hash passwords using bcrypt.",
          "const hashed = await bcrypt.hash(password, 10);\nconst isMatch = await bcrypt.compare(password, user.password);",
          ["Hash passwords", "Verify logins"],
          ["bcrypt", "Salting", "Hashing"],
          "Update your register to hash passwords."
        ),
        buildLesson(
          "Role-Based Authorization",
          "Restrict routes by user role (admin/instructor/student).",
          "const authorize = (...roles) => (req, res, next) => {\n  if (!roles.includes(req.user.role)) {\n    return res.status(403).json({ message: 'Access denied' });\n  }\n  next();\n};\n\nrouter.post('/', protect, authorize('admin', 'instructor'), createCourse);",
          ["Protect routes", "Check roles"],
          ["Middleware", "Protect", "RBAC"],
          "Add role guards to your course routes."
        ),
        buildLesson(
          "Security Best Practices",
          "Prevent common attacks and secure your API.",
          "app.use(cors({ origin: 'http://localhost:5173' }));\napp.use(express.json({ limit: '10mb' }));\n// Validate input, sanitize, use helmet\nimport helmet from 'helmet';\napp.use(helmet());",
          ["Prevent injection attacks", "Use security headers"],
          ["helmet", "CORS", "Validation"],
          "Harden your Express API with security packages."
        ),
      ],
    },
    {
      moduleTitle: "Advanced & Deployment",
      lessons: [
        buildLesson(
          "Environment Variables",
          "Manage configuration with dotenv.",
          "import dotenv from 'dotenv';\ndotenv.config();\nconsole.log(process.env.JWT_SECRET);",
          ["Use .env files", "Protect secrets"],
          ["dotenv", "process.env"],
          "Move secrets to a .env file."
        ),
        buildLesson(
          "File Uploads",
          "Accept and store file uploads with multer.",
          "import multer from 'multer';\nconst upload = multer({ dest: 'uploads/' });\napp.post('/upload', upload.single('file'), (req, res) => {\n  res.json({ file: req.file });\n});",
          ["Implement multipart uploads", "Validate file types"],
          ["multer", "multipart", "storage"],
          "Add file upload support to your API."
        ),
        buildLesson(
          "Testing & Error Logging",
          "Write tests and log errors in production.",
          "// morgan for HTTP logging\nimport morgan from 'morgan';\napp.use(morgan('combined'));\n\n// Simple test with supertest + jest",
          ["Log requests", "Write API tests"],
          ["morgan", "jest", "supertest"],
          "Add request logging and a basic test."
        ),
        buildLesson(
          "Deploying Node Apps",
          "Deploy to Render, Railway, or a VPS.",
          "# Deploy to Render\n# 1. Push to GitHub\n# 2. Create a Render Web Service\n# 3. Set env vars (MONGO_URL, JWT_SECRET)\n# 4. Build: npm install\n# 5. Start: npm start",
          ["Deploy to the cloud", "Set environment variables"],
          ["Render", "Deploy", "Scaling"],
          "Deploy your backend and test live."
        ),
      ],
    },
  ];
}

// MongoDB-only curriculum (for DB-focused courses)
function mongodbModules() {
  return [
    {
      moduleTitle: "MongoDB Foundations",
      lessons: [
        buildLesson(
          "What is MongoDB?",
          "NoSQL document store — collections, documents, flexible schema.",
          "const course = {\n  title: 'MongoDB',\n  price: 399,\n  tags: ['database', 'nosql'],\n};",
          ["Understand NoSQL", "Know document vs relational"],
          ["NoSQL", "BSON", "Documents"],
          "Compare a MongoDB document with a SQL row."
        ),
        buildLesson(
          "Installing & Setup",
          "Install MongoDB locally or use Atlas.",
          "brew install mongodb-community  # macOS\n# or use Atlas cloud: mongodb+srv://<user>:<pass>@cluster.mongodb.net",
          ["Set up MongoDB locally or Atlas"],
          ["Atlas", "mongod", "Compass"],
          "Connect to a database with MongoDB Compass."
        ),
        buildLesson(
          "CRUD Operations",
          "insertOne, find, updateOne, deleteOne.",
          "db.courses.insertOne({ title: 'MongoDB', price: 399 });\ndb.courses.find({ price: { $gte: 100 } });\ndb.courses.updateOne({ title: 'MongoDB' }, { $set: { price: 499 } });\ndb.courses.deleteOne({ title: 'MongoDB' });",
          ["Run CRUD in the shell", "Use query operators"],
          ["insert", "find", "update", "delete"],
          "Practice CRUD on a sample collection."
        ),
        buildLesson(
          "Query Operators",
          "Comparison, logical, and element operators.",
          "db.courses.find({ price: { $gte: 100, $lte: 500 } });\ndb.courses.find({ $or: [{ category: 'React' }, { category: 'Node' }] });",
          ["Use comparison operators", "Combine queries"],
          ["$gte", "$lte", "$in", "$or"],
          "Write 3 queries with different operators."
        ),
      ],
    },
    {
      moduleTitle: "Schema Design",
      lessons: [
        buildLesson(
          "Data Modeling Basics",
          "Embedding vs referencing, one-to-many and many-to-many.",
          "// Embedding: sections inside a course\nconst course = { title: 'React', sections: [/* ... */] };\n\n// Referencing: instructor by ObjectId\nconst course2 = { title: 'React', instructor: ObjectId('...') };",
          ["Choose embedding vs referencing"],
          ["Embedding", "References", "Relationships"],
          "Model users, courses, and enrollments."
        ),
        buildLesson(
          "Schema Validation",
          "Enforce structure with JSON schema validation.",
          "db.createCollection('courses', {\n  validator: {\n    $jsonSchema: {\n      bsonType: 'object',\n      required: ['title', 'price'],\n      properties: { price: { bsonType: 'number', minimum: 0 } }\n    }\n  }\n})",
          ["Use JSON schema validation"],
          ["$jsonSchema", "Validation levels"],
          "Add validation to your collections."
        ),
      ],
    },
    {
      moduleTitle: "Aggregation",
      lessons: [
        buildLesson(
          "Aggregation Pipeline",
          "Chain stages to transform and analyze data.",
          "db.courses.aggregate([\n  { $match: { price: { $gte: 100 } } },\n  { $group: { _id: '$category', avgPrice: { $avg: '$price' } } },\n  { $sort: { avgPrice: -1 } },\n])",
          ["Build aggregation pipelines", "Use common stages"],
          ["$match", "$group", "$sort", "$project"],
          "Compute average course price by category."
        ),
      ],
    },
  ];
}

// HTML/CSS curriculum
function htmlCssModules() {
  return [
    {
      moduleTitle: "HTML Foundations",
      lessons: [
        buildLesson(
          "HTML Basics & Structure",
          "The skeleton of every webpage.",
          "<!DOCTYPE html>\n<html>\n<head>\n  <title>My Page</title>\n</head>\n<body>\n  <h1>Hello World</h1>\n  <p>This is a paragraph.</p>\n</body>\n</html>",
          ["Build a basic HTML document"],
          ["Doctype", "Head/body", "Semantic tags"],
          "Create a personal profile page."
        ),
        buildLesson(
          "Forms & Inputs",
          "Gather user input with HTML forms.",
          "<form>\n  <input type=\"text\" placeholder=\"Name\" />\n  <input type=\"email\" placeholder=\"Email\" />\n  <input type=\"password\" placeholder=\"Password\" />\n  <button type=\"submit\">Sign Up</button>\n</form>",
          ["Build forms", "Use input types"],
          ["form", "input", "labels"],
          "Create a signup form."
        ),
        buildLesson(
          "Tables & Lists",
          "Present structured data.",
          "<ul>\n  <li>JavaScript</li>\n  <li>React</li>\n  <li>Node</li>\n</ul>\n\n<table>\n  <tr><th>Name</th><th>Role</th></tr>\n  <tr><td>Alice</td><td>Student</td></tr>\n</table>",
          ["Use lists and tables"],
          ["ul", "ol", "table"],
          "Build a course schedule table."
        ),
      ],
    },
    {
      moduleTitle: "CSS Styling",
      lessons: [
        buildLesson(
          "CSS Selectors & Properties",
          "Style elements with selectors and properties.",
          ".card {\n  background: #fff;\n  border-radius: 12px;\n  padding: 24px;\n  box-shadow: 0 4px 12px rgba(0,0,0,0.1);\n}",
          ["Use classes/IDs", "Apply common properties"],
          ["Selectors", "Box model"],
          "Style a profile card."
        ),
        buildLesson(
          "Flexbox & Grid",
          "Modern layout systems.",
          ".container {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n\n.grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 16px;\n}",
          ["Use flexbox and grid layouts"],
          ["flex", "grid", "responsive"],
          "Build a responsive navbar."
        ),
        buildLesson(
          "CSS Animations & Transitions",
          "Bring your UI to life.",
          ".btn {\n  transition: transform 0.2s, background 0.3s;\n}\n.btn:hover {\n  transform: scale(1.05);\n  background: #2563eb;\n}\n\n@keyframes fadeIn {\n  from { opacity: 0; }\n  to { opacity: 1; }\n}",
          ["Create transitions", "Write keyframes"],
          ["transition", "@keyframes", "hover"],
          "Animate a button hover."
        ),
      ],
    },
    {
      moduleTitle: "Responsive Design",
      lessons: [
        buildLesson(
          "Media Queries & Responsive Layouts",
          "Make sites look great on all devices.",
          "@media (max-width: 768px) {\n  .container {\n    flex-direction: column;\n  }\n}",
          ["Use media queries"],
          ["Media queries", "Mobile-first"],
          "Make your navbar mobile-friendly."
        ),
      ],
    },
  ];
}

// Generic curriculum for any other tech
function genericModules(courseTitle) {
  return [
    {
      moduleTitle: "Getting Started",
      lessons: [
        buildLesson(
          `Introduction to ${courseTitle}`,
          `An overview of ${courseTitle} — what it is, why it matters, and what you'll build.`,
          "// Welcome to the course!\nconsole.log('Let's learn " + courseTitle + "!');",
          [`Understand ${courseTitle} basics`, "Set expectations for the course"],
          ["Overview", "Use cases", "Roadmap"],
          `Write a short paragraph about why you want to learn ${courseTitle}.`
        ),
        buildLesson(
          "Environment Setup",
          "Set up your development environment and tooling.",
          "# Install dependencies\nuuid=$(./setup.sh)\n\n# Verify\nyourCommand --version",
          ["Install required tools", "Verify setup"],
          ["Tooling", "CLI", "Versioning"],
          "Install and verify all required tools."
        ),
        buildLesson(
          "Core Concepts",
          "The everyday concepts you'll use constantly.",
          "// Core building blocks\nconst concept = 'practice makes progress';\nfunction learn(topic) {\n  return `Mastering ${topic} step by step`;\n}",
          ["Understand core vocabulary", "See a working example"],
          ["Syntax", "Core APIs"],
          "Write 3 uses of a core concept."
        ),
        buildLesson(
          "First Practice Project",
          "Apply what you learned in a small project.",
          "// Your first mini-project\n// Start small, iterate fast, then expand",
          ["Build a small project", "Gain confidence"],
          ["Project structure", "Iteration"],
          "Build a tiny project and share it."
        ),
      ],
    },
    {
      moduleTitle: "Intermediate Skills",
      lessons: [
        buildLesson(
          "Advanced Features",
          "Deeper features that unlock real power.",
          "// Example of an advanced feature\n// Use it to solve a real problem",
          ["Use advanced features"],
          ["Advanced APIs", "Patterns"],
          "Refactor your first project with an advanced feature."
        ),
        buildLesson(
          "Working with Data",
          "Handle data and persistence.",
          "// Load, display, and save data\nconst data = await loadData();\nsaveData(transform(data));",
          ["Manage data in your app"],
          ["Data persistence", "JSON"],
          "Add data loading to your project."
        ),
        buildLesson(
          "Common Patterns & Practices",
          "Best practices used in real projects.",
          "// Readable, maintainable, testable code\n// Single responsibility, separation of concerns",
          ["Apply best practices"],
          ["Clean code", "Patterns"],
          "Refactor code to follow best practices."
        ),
      ],
    },
    {
      moduleTitle: "Mastery & Project",
      lessons: [
        buildLesson(
          "Performance & Optimization",
          "Make your application fast and efficient.",
          "// Measure, then optimize\n// Avoid premature optimization",
          ["Profile and optimize"],
          ["Performance", "Profiling"],
          "Optimize one slow operation."
        ),
        buildLesson(
          "Final Capstone Project",
          "Combine everything into a portfolio-worthy project.",
          "// Capstone: bring it all together\n// Plan → build → test → deploy → share",
          ["Complete a capstone project", "Showcase your skills"],
          ["Capstone", "Portfolio"],
          "Build and deploy your capstone project."
        ),
      ],
    },
  ];
}

// Main entry: generate modules based on course title & category
export function generateLearningPath(courseTitle = "", category = "") {
  const t = (courseTitle + " " + category).toLowerCase();

  if (t.includes("react")) return reactModules();
  if (t.includes("node")) return nodeModules();
  if (t.includes("mongo")) return mongodbModules();
  if (t.includes("html") || t.includes("css")) return htmlCssModules();
  if (t.includes("javascript") || t.includes("js")) return nodeModules(); // JS-heavy: reuse Node's JS lessons feel
  if (t.includes("mern")) {
    // MERN = front + back combined (Pad with React + Node)
    return [
      ...reactModules().slice(0, 3),
      ...nodeModules().slice(1, 4),
      {
        moduleTitle: "MERN Integration",
        lessons: [
          buildLesson(
            "Connecting React to Express",
            "Build a full MERN feature end to end.",
            "// React calls your API\nconst { data } = await axios.get('/api/items');\n\n// Express serves it\napp.get('/api/items', async (req, res) => {\n  const items = await Item.find();\n  res.json(items);\n});",
            ["Connect React and Express", "Run a full MERN stack"],
            ["REST", "CORS", "Mongoose"],
            "Build a full-stack todo with MERN."
          ),
          buildLesson(
            "MERN Authentication",
            "JWT auth from MongoDB to React.",
            "// Backend: sign JWT\nconst token = jwt.sign({ id }, SECRET);\n// Frontend: store & send\nlocalStorage.setItem('token', token);\n// api interceptor attaches it",
            ["Implement MERN auth", "Protect frontend routes"],
            ["JWT", "Context", "Interceptors"],
            "Add login/register to your MERN app."
          ),
          buildLesson(
            "Deploying a MERN App",
            "Deploy frontend + backend together.",
            "# Deploy backend to Render, frontend to Vercel\n# Set CORS and API URLs\n# Add production .env values",
            ["Deploy full stack"],
            ["Vercel", "Render", "Env vars"],
            "Deploy your MERN app."
          ),
        ],
      },
    ];
  }
  return genericModules(courseTitle || "the Topic");
}

export default generateLearningPath;
