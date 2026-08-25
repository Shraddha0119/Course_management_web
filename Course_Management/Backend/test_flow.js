// One-off test script to verify register + login + AI chat + protected course creation
(async () => {
  const BASE = "http://localhost:5000/api";
  const email = `instructor_${Date.now()}@test.com`;

  // 1. Register a fresh instructor (to test POST /api/courses auth + role)
  const regRes = await fetch(`${BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Test Instructor", email, password: "password123", role: "instructor" }),
  });
  const regData = await regRes.json();
  console.log("REGISTER STATUS:", regRes.status, regData.message || JSON.stringify(regData));

  // 2. Login
  const loginRes = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: "password123" }),
  });
  const loginData = await loginRes.json();
  console.log("LOGIN STATUS:", loginRes.status, "role:", loginData.user?.role);
  const token = loginData.token;
  if (!token) {
    console.log("NO TOKEN:", JSON.stringify(loginData));
    return;
  }

  // 3. Test protected course creation (original "Not authorized" bug)
  const courseRes = await fetch(`${BASE}/courses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: "Advanced JavaScript",
      description: "Learn closures, promises, async/await",
      price: 25,
      duration: "6 hours",
    }),
  });
  const courseData = await courseRes.json();
  console.log(
    "COURSE CREATE STATUS:",
    courseRes.status,
    courseRes.status === 201 ? "✅ Course Created (auth+role works!)" : JSON.stringify(courseData)
  );

  // 4. Test AI chat
  const aiRes = await fetch(`${BASE}/ai/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ message: "what is a closure in javascript?" }),
  });
  const aiText = await aiRes.text();
  console.log("AI STATUS:", aiRes.status);
  console.log("AI REPLY:", aiText.slice(0, 400));
})().catch((e) => console.log("ERR", e.message));
