// quizGenerator.js
// Generates MCQs automatically based on the course topic/module.
// Each question: 4 options, one correct, explanation, difficulty.
// Returns 10-15 questions, shuffled.

function q(question, options, answerIndex, explanation, difficulty = "medium") {
  return { question, options, answerIndex, explanation, difficulty };
}

// React question bank
const reactQuestions = [
  q("What is React mainly used for?", ["Backend development", "Building user interfaces", "Database management", "Server-side scripting"], 1, "React is a JS library for building user interfaces.", "easy"),
  q("Which hook is used to add state to a functional component?", ["useEffect", "useState", "useReducer", "useContext"], 1, "useState lets you add state to functional components.", "easy"),
  q("What is the Virtual DOM?", ["A real browser DOM", "A lightweight copy of the DOM kept in memory", "A database", "A CSS framework"], 1, "The Virtual DOM is a lightweight in-memory representation of the real DOM.", "medium"),
  q("How do you pass data from a parent to a child component?", ["Using state", "Using props", "Using events", "Using refs"], 1, "Props are the mechanism to pass data from parent to child.", "easy"),
  q("What does the useEffect hook do?", ["Adds state", "Runs side effects", "Handles routing", "Styles the component"], 1, "useEffect runs side effects like data fetching and subscriptions.", "easy"),
  q("Which of the following is a valid React component?", ["function App()", "const App = () =>", "class App", "All of the above"], 3, "All three are valid ways to create a React component.", "medium"),
  q("What does 'props' stand for?", ["Properties", "Processors", "Prototypes", "Purposes"], 0, "Props is short for properties.", "easy"),
  q("When is the useEffect cleanup function called?", ["Before every render", "On component unmount", "Never", "Only on state change"], 1, "The cleanup runs before the component unmounts / before the next effect.", "hard"),
  q("What is the purpose of keys in React lists?", ["To style items", "To help React identify items", "To add events", "To load data"], 1, "Keys help React efficiently update and identify list items.", "medium"),
  q("Which method is used to render a React app to the DOM?", ["render()", "mount()", "createRoot().render()", "display()"], 2, "createRoot().render() mounts the app in React 18+.", "medium"),
  q("What is lifting state up?", ["Moving state to a child", "Moving shared state to a common ancestor", "Deleting state", "Creating global state"], 1, "Lifting state up means moving it to a common parent component.", "hard"),
  q("What is JSX?", ["A database query language", "A JavaScript syntax extension for HTML-like markup", "A styling language", "A transpiler"], 1, "JSX is a syntax extension that lets you write HTML-like code in JavaScript.", "easy"),
  q("What does React.memo do?", ["Memoizes entire components", "Adds state", "Creates routes", "Handles forms"], 0, "React.memo prevents unnecessary re-renders of a component.", "hard"),
  q("Which hook is used for complex state logic?", ["useState", "useMemo", "useReducer", "useLayoutEffect"], 2, "useReducer is suited for complex state logic with actions.", "hard"),
  q("What is context used for?", ["Styling", "Sharing data across the component tree", "Routing", "Fetching APIs"], 1, "Context provides a way to share data across the component tree.", "medium"),
];

// Node/Express question bank
const nodeQuestions = [
  q("What is Node.js?", ["A browser", "A runtime for running JavaScript on the server", "A database", "A CSS framework"], 1, "Node.js is a runtime that runs JavaScript on the server.", "easy"),
  q("Which statement is used to import modules in ESM?", ["require()", "import", "include", "load"], 1, "ESM uses the import statement.", "easy"),
  q("What package is used to hash passwords?", ["jsonwebtoken", "bcrypt", "cors", "dotenv"], 1, "bcrypt hashes passwords securely.", "medium"),
  q("What does Express.js provide?", ["A UI framework", "A web framework for Node", "A database", "A testing tool"], 1, "Express is a minimal web framework for Node.js.", "easy"),
  q("What does the 'next' function do in middleware?", ["Stops the server", "Passes control to the next middleware", "Returns a response", "Logs errors"], 1, "next() passes control to the next middleware in the stack.", "medium"),
  q("What is the default port for a typical Express dev server?", ["3000", "5000", "8080", "80"], 1, "5000 is commonly used for Express dev servers (as in this project).", "easy"),
  q("How do you parse JSON request bodies in Express?", ["express.json()", "express.urlencoded()", "express.parse()", "bodyParser.parse()"], 0, "express.json() middleware parses incoming JSON bodies.", "medium"),
  q("What is JWT used for?", ["Styling", "Authentication", "Database queries", "File uploads"], 1, "JWT (JSON Web Token) is used for authentication.", "easy"),
  q("Which method is used to verify a JWT?", ["jwt.sign()", "jwt.verify()", "jwt.decode()", "jwt.hash()"], 1, "jwt.verify() verifies a token's signature and expiration.", "medium"),
  q("What is the event loop?", ["A CSS feature", "The mechanism that handles async operations", "A database", "A package"], 1, "The event loop handles asynchronous, non-blocking operations in Node.", "hard"),
  q("What does CORS allow?", ["Cross-origin requests", "Database connections", "File compression", "Logging"], 0, "CORS (Cross-Origin Resource Sharing) allows requests from different origins.", "medium"),
  q("What is a middleware function?", ["A function that runs between request and response", "A database model", "A React component", "A CSS class"], 0, "Middleware functions run between the request and the final route handler.", "medium"),
  q("Which status code means 'Not Found'?", ["200", "404", "500", "301"], 1, "404 means the requested resource was not found.", "easy"),
  q("What is process.env used for?", ["Environment variables", "File system", "Database", "Routing"], 0, "process.env accesses environment variables (e.g., secrets).", "medium"),
  q("What does cluster/PM2 help with?", ["Styling", "Scaling Node apps", "Routing", "Hashing"], 1, "PM2/cluster help scale Node applications across CPU cores.", "hard"),
];

// MongoDB question bank
const mongoQuestions = [
  q("What type of database is MongoDB?", ["Relational", "NoSQL document", "Graph", "Key-value only"], 1, "MongoDB is a NoSQL document database.", "easy"),
  q("What is a document in MongoDB?", ["A file", "A row in a table", "A record stored as BSON", "A query"], 2, "A document is a record stored as BSON (binary JSON).", "medium"),
  q("Which command creates a new document?", ["insertOne", "create", "add", "push"], 0, "insertOne inserts a single document.", "easy"),
  q("What is Mongoose?", ["A database", "An ODM for MongoDB", "A web framework", "A CSS library"], 1, "Mongoose is an ODM (Object Document Mapper) for MongoDB.", "medium"),
  q("How do you define a schema in Mongoose?", ["mongoose.Schema()", "mongoose.Model()", "mongoose.Type()", "mongoose.Field()"], 0, "mongoose.Schema() defines the structure of documents.", "medium"),
  q("What does populate() do in Mongoose?", ["Adds data", "Fetches referenced documents", "Deletes documents", "Creates indexes"], 1, "populate() replaces ObjectIds with the actual referenced documents.", "hard"),
  q("Which operator selects documents where a field is >= a value?", ["$gt", "$gte", "$lt", "$eq"], 1, "$gte matches values greater than or equal to the given value.", "medium"),
  q("What is the aggregation pipeline?", ["A series of documents", "A chain of stages to process data", "A type of index", "A backup"], 1, "The aggregation pipeline applies stages to transform and analyze data.", "hard"),
  q("What is an index used for?", ["Styling", "Speeding up queries", "Deleting data", "Logging"], 1, "Indexes make queries faster.", "medium"),
  q("Which mongoose method finds all matching documents?", ["findOne", "find", "findById", "all"], 1, "find() returns all matching documents.", "easy"),
  q("What does $match do in aggregation?", ["Groups data", "Filters documents", "Sorts data", "Projects fields"], 1, "$match filters documents by criteria.", "medium"),
  q("What is a primary key called in MongoDB?", ["_id", "id", "key", "PK"], 0, "Every document has a unique _id field.", "easy"),
  q("Which method updates a single document?", ["updateOne", "updateMany", "save", "modify"], 0, "updateOne updates the first matching document.", "medium"),
  q("What does $group do in aggregation?", ["Sorts", "Groups documents by a field", "Filters", "Creates indexes"], 1, "$group groups documents by a specified field for summary calculations.", "hard"),
  q("What is the max document size in MongoDB?", ["1MB", "16MB", "16GB", "100MB"], 1, "Documents are limited to 16MB.", "hard"),
];

// HTML/CSS question bank
const htmlCssQuestions = [
  q("What does HTML stand for?", ["HyperText Transfer Markup", "HyperText Markup Language", "HighText Markup Language", "Hyperlink Text Markup"], 1, "HTML = HyperText Markup Language.", "easy"),
  q("Which HTML tag creates a heading?", ["<heading>", "<h1>", "<head>", "<title>"], 1, "<h1> to <h6> create headings.", "easy"),
  q("What does CSS stand for?", ["Cascading Style Sheets", "Computer Style Sheets", "Creative Style Sheets", "Colorful Style Sheets"], 0, "CSS = Cascading Style Sheets.", "easy"),
  q("Which property changes text color?", ["font-color", "color", "text-color", "text-style"], 1, "The color property changes text color.", "easy"),
  q("What does 'display: flex' do?", ["Makes an element a flex container", "Hides an element", "Makes text bold", "Adds padding"], 0, "display: flex creates a flex container enabling flexible layouts.", "medium"),
  q("Which selector targets an element with id 'main'?", [".main", "#main", "*main", "@main"], 1, "#main targets an element with id='main'.", "medium"),
  q("What is the box model made of?", ["content, padding, border, margin", "width, height, color, font", "margin, padding, text, image", "content, style, layout, color"], 0, "The box model = content, padding, border, margin.", "medium"),
  q("Which unit is relative to the parent font-size?", ["px", "em", "vh", "cm"], 1, "em is relative to the parent element's font size.", "medium"),
  q("What does justify-content: center do in flex?","Centers items along the main axis","Centers items vertically","Adds space","Hides items",0, "justify-content aligns items along the main (horizontal) axis.","medium"),
  q("Which HTML tag is used for a line break?", ["<br>", "<lb>", "<newline>", "<break>"], 0, "<br> inserts a line break.", "easy"),
  q("What does the viewport meta tag do?", ["Adds a view", "Controls responsive scaling on mobile", "Adds an image", "Creates a grid"], 1, "The viewport meta tag controls responsive layout on mobile devices.", "hard"),
  q("Which property adds a shadow to an element?", ["box-shadow", "text-shadow", "shadow", "both A and B"], 3, "box-shadow and text-shadow add shadows to boxes and text.", "medium"),
  q("What is a media query used for?", ["Responsive design", "Fetching data", "Styling text", "Creating forms"], 0, "Media queries enable responsive designs based on screen size.", "medium"),
  q("Which CSS property makes a layout responsive?", ["flex", "grid", "media queries", "All of the above"], 3, "Flex, grid, and media queries all support responsive layouts.", "hard"),
  q("What does the <a> tag do?", ["Creates a link", "Adds an image", "Creates a table", "Adds audio"], 0, "The <a> tag creates hyperlinks.", "easy"),
];

// General programming questions
const generalQuestions = [
  q("What is a variable?", ["A named container for storing data", "A function", "A loop", "A class"], 0, "A variable is a named container that stores data.", "easy"),
  q("What does DRY stand for?", ["Don't Repeat Yourself", "Do Run Yesterday", "Don't Restart Yet", "Delete Repeated Yields"], 0, "DRY = Don't Repeat Yourself.", "easy"),
  q("What is an array?", ["A named constant", "An ordered list of values", "A type of loop", "A CSS class"], 1, "An array is an ordered collection of values.", "easy"),
  q("What does API stand for?", ["Application Programming Interface", "Advanced Programming Input", "Automated Program Interface", "Application Process Integration"], 0, "API = Application Programming Interface.", "easy"),
  q("What is debugging?", ["Designing", "Finding and fixing errors", "Writing documentation", "Deploying"], 1, "Debugging is the process of finding and fixing bugs.", "easy"),
  q("What is a framework?", ["A set of tools/libraries to build apps", "A programming language", "A database", "An operating system"], 0, "A framework provides a structure and tools to build applications.", "medium"),
  q("What does 'async' mean?", ["Run synchronously", "Run concurrently without blocking", "Run in a database", "Run in CSS"], 1, "Async operations run concurrently without blocking the main thread.", "medium"),
  q("What is a git commit?", ["A snapshot of changes in the repo", "A type of error", "A branch", "A merge"], 0, "A commit records a snapshot of changes in the repository.", "medium"),
  q("What is a RESTful service?", ["A CSS framework", "An API following REST principles", "A database", "A web browser"], 1, "RESTful services follow REST architectural principles.", "medium"),
  q("What is the purpose of a package manager?", ["Managing dependencies", "Styling", "Routing", "Debugging"], 0, "Package managers install and manage project dependencies.", "easy"),
  q("What is a version control system?", ["Git", "React", "Node", "MongoDB"], 0, "Git is a version control system.", "easy"),
  q("What is a function?", ["A reusable block of code", "A data type", "A loop", "A conditional"], 0, "A function is a reusable block of code that performs a task.", "easy"),
  q("What is a boolean?", ["A true/false value", "A number", "A string", "An object"], 0, "A boolean represents true or false.", "easy"),
  q("What is a loop used for?", ["Repeating code", "Storing data", "Defining types", "Styling"], 0, "Loops repeat a block of code multiple times.", "easy"),
  q("What does MVC stand for?", ["Model-View-Controller", "Module-View-Config", "Main-View-Component", "Model-Value-Config"], 0, "MVC = Model-View-Controller.", "medium"),
];

// Pick a question bank based on course topic
function pickBank(courseTitle = "", category = "") {
  const t = (courseTitle + " " + category).toLowerCase();
  if (t.includes("react")) return reactQuestions;
  if (t.includes("mongo")) return mongoQuestions;
  if (t.includes("html") || t.includes("css")) return htmlCssQuestions;
  if (t.includes("node") || t.includes("express") || t.includes("javascript") || t.includes("js")) return nodeQuestions;
  // MERN: mix react + node
  if (t.includes("mern")) return [...reactQuestions, ...nodeQuestions];
  return generalQuestions;
}

// Shuffle an array (Fisher-Yates)
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Generate a quiz (returns full quiz object)
export function generateQuiz(courseTitle = "", category = "", moduleIndex = 0) {
  const bank = pickBank(courseTitle, category);
  // Select 10-15 random questions
  const count = Math.min(12, bank.length);
  const selected = shuffle(bank).slice(0, count);

  // Shuffle options within each question + track correct index
  const questions = selected.map((item) => {
    const options = item.options.map((opt, idx) => ({ text: opt, origIdx: idx }));
    const shuffledOptions = shuffle(options);
    const newAnswerIndex = shuffledOptions.findIndex((o) => o.origIdx === item.answerIndex);
    return {
      question: item.question,
      options: shuffledOptions.map((o) => o.text),
      answerIndex: newAnswerIndex,
      explanation: item.explanation,
      difficulty: item.difficulty,
    };
  });

  return {
    title: `Module ${moduleIndex + 1} Quiz`,
    description: `Test your knowledge of ${courseTitle || "this module"}`,
    timeLimit: 10, // minutes
    questions,
  };
}

export default generateQuiz;
