// assignmentGenerator.js
// Generates contextual assignments per module based on course topic.
// Each assignment: problem statement, requirements, difficulty,
// expected output, bonus challenge, submission info.

function buildAssignment(sectionIndex, title, problemStatement, requirements, difficulty, expectedOutput, bonusChallenge) {
  return {
    title,
    description: problemStatement,
    sectionIndex,
    difficulty,
    requirements,
    expectedOutput,
    bonusChallenge,
    deadline: "", // optional
    pdfUrl: "",
  };
}

export function generateAssignments(courseTitle = "", category = "") {
  const t = (courseTitle + " " + category).toLowerCase();

  if (t.includes("react") || t.includes("mern") || t.includes("javascript") || t.includes("js")) {
    return [
      buildAssignment(
        0,
        "Build a Todo App using useState",
        "Create a functional todo application in React that lets users add, mark complete, and delete tasks.",
        [
          "Use functional components",
          "Manage tasks with useState",
          "Allow adding and deleting todos",
          "Toggle completed state",
          "Clean, responsive styling",
        ],
        "Medium",
        "A working todo list where users can add tasks, toggle completion, and delete items.",
        "Add localStorage persistence so todos survive page refresh."
      ),
      buildAssignment(
        1,
        "Build a Weather App using an API",
        "Create a weather application that fetches live weather data for a city using a free weather API.",
        [
          "Use fetch/axios to call a weather API",
          "Handle loading and error states",
          "Display temperature, conditions, and location",
          "Add a search input for cities",
          "Show a loading skeleton while fetching",
        ],
        "Hard",
        "A weather dashboard showing current conditions for a searched city.",
        "Add a 5-day forecast view and a theme that changes with weather conditions."
      ),
      buildAssignment(
        2,
        "React Router Multi-Page Site",
        "Build a multi-page React application using React Router with Home, About, and Detail pages.",
        [
          "Set up BrowserRouter and Routes",
          "Create at least 3 pages",
          "Use Link for navigation",
          "Add a dynamic route with useParams",
          "404 not-found page",
        ],
        "Medium",
        "A navigable multi-page site with nested views and a 404 page.",
        "Add a protected route that redirects unauthenticated users to login."
      ),
      buildAssignment(
        3,
        "Full CRUD with Express + MongoDB",
        "Build a REST API for a blog or course resource with full CRUD and Mongoose.",
        [
          "Create a Mongoose model",
          "Implement GET, POST, PUT, DELETE routes",
          "Add validation",
          "Wire to a MongoDB database",
          "Return proper status codes",
        ],
        "Hard",
        "A working REST API you can test with Postman/Thunder Client.",
        "Add JWT authentication and role-based access."
      ),
    ];
  }

  if (t.includes("node") || t.includes("express")) {
    return [
      buildAssignment(
        0,
        "Create Basic REST APIs",
        "Build a set of RESTful endpoints for a simple resource (e.g., tasks) using Express.",
        [
          "Set up an Express server",
          "Create GET, POST, PUT, DELETE routes",
          "Use express.json()",
          "Return JSON responses",
          "Test with Postman",
        ],
        "Medium",
        "A running Express API with working CRUD endpoints.",
        "Add request validation and centralized error handling."
      ),
      buildAssignment(
        1,
        "Implement JWT Authentication",
        "Add JWT-based authentication with register, login, and protected routes.",
        [
          "Hash passwords with bcrypt",
          "Sign JWTs on login",
          "Create a protect middleware",
          "Protect at least one route",
          "Return the token to the client",
        ],
        "Hard",
        "A login endpoint that issues a JWT and a protected route that requires it.",
        "Add role-based authorization (admin/instructor/student)."
      ),
      buildAssignment(
        2,
        "Build a File Upload API",
        "Accept and store file uploads using multer, with size and type validation.",
        [
          "Set up multer storage",
          "Validate file type and size",
          "Serve uploaded files",
          "Return file metadata",
        ],
        "Medium",
        "An endpoint that accepts an upload and returns file info.",
        "Store uploaded files in cloud storage (e.g., S3)."
      ),
      buildAssignment(
        3,
        "MongoDB Aggregation Report",
        "Write aggregation queries to generate reports (e.g., courses by category, average price).",
        [
          "Use the aggregation pipeline",
          "Apply $match, $group, $sort",
          "Return a meaningful report",
          "Expose as an API endpoint",
        ],
        "Hard",
        "An API endpoint returning an aggregated report.",
        "Add pagination and filtering to the report."
      ),
    ];
  }

  if (t.includes("mongo")) {
    return [
      buildAssignment(
        0,
        "MongoDB CRUD Operations",
        "Practice CRUD using the MongoDB shell or Mongoose.",
        [
          "Insert sample documents",
          "Query with filters",
          "Update documents",
          "Delete documents",
          "Show the results",
        ],
        "Easy",
        "Evidence of all four CRUD operations executed successfully.",
        "Add indexes and compare query performance."
      ),
      buildAssignment(
        1,
        "Implement Aggregation Queries",
        "Use the aggregation pipeline to analyze a dataset.",
        [
          "Use $match to filter",
          "Use $group to summarize",
          "Use $sort and $limit",
          "Present insights",
        ],
        "Medium",
        "A summary report of the dataset (e.g., counts by category).",
        "Add $lookup to join collections."
      ),
    ];
  }

  if (t.includes("html") || t.includes("css")) {
    return [
      buildAssignment(
        0,
        "Build a Responsive Landing Page",
        "Create a fully responsive landing page for a product using HTML and CSS.",
        [
          "Semantic HTML structure",
          "Flexbox/Grid layout",
          "Media queries for responsiveness",
          "CSS animations",
          "Mobile-first approach",
        ],
        "Medium",
        "A polished landing page that looks great on desktop and mobile.",
        "Add a dark/light theme toggle with CSS variables."
      ),
      buildAssignment(
        1,
        "Build a CSS Dashboard",
        "Create a dashboard layout with cards, charts placeholders, and a sidebar.",
        [
          "CSS Grid for the main layout",
          "Styled cards and widgets",
          "Responsive sidebar",
          "Hover effects and transitions",
        ],
        "Hard",
        "A professional-looking dashboard layout.",
        "Add interactive charts using a library like Chart.js."
      ),
    ];
  }

  // Generic assignments
  return [
    buildAssignment(
      0,
      "Introduction Mini-Project",
      "Build a small project that demonstrates the core concepts you learned in this module.",
      [
        "Apply the core concepts",
        "Write clean, organized code",
        "Add comments",
        "Test your work",
      ],
      "Easy",
      "A working mini-project demonstrating the module's concepts.",
      "Add extra features beyond the requirements."
    ),
    buildAssignment(
      1,
      "Intermediate Challenge",
      "Build a slightly more advanced project incorporating the module's intermediate topics.",
      [
        "Use advanced features",
        "Handle errors",
        "Structure code well",
      ],
      "Medium",
      "A functioning project using intermediate concepts.",
      "Integrate a third-party tool or library."
    ),
    buildAssignment(
      2,
      "Capstone Project",
      "Combine everything you've learned into a complete, polished project.",
      [
        "Plan the project",
        "Implement all core features",
        "Handle edge cases",
        "Deploy or showcase",
      ],
      "Hard",
      "A complete, portfolio-ready project.",
      "Add documentation and a live demo link."
    ),
  ];
}

export default generateAssignments;
