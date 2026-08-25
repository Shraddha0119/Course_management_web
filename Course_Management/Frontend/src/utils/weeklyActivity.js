// weeklyActivity.js
// Tracks per-day learning activity (for the student dashboard charts).
// Uses localStorage so no backend changes needed.

const KEY = "learning_activity";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Get the current week's activity: [{ label, date, count }]
export function getWeeklyActivity() {
  const data = JSON.parse(localStorage.getItem(KEY) || "{}");
  const today = new Date();
  const day = today.getDay(); // 0=Sun
  const week = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - ((day + 7 - i) % 7));
    const key = d.toISOString().slice(0, 10);
    week.push({
      label: DAYS[i],
      date: key,
      count: data[key] || 0,
      isToday: d.toDateString() === today.toDateString(),
    });
  }
  return week;
}

// Increment today's activity count by `n` (default 1)
export function recordActivity(n = 1) {
  const data = JSON.parse(localStorage.getItem(KEY) || "{}");
  const today = new Date().toISOString().slice(0, 10);
  data[today] = (data[today] || 0) + n;
  localStorage.setItem(KEY, JSON.stringify(data));
}

// Total activities in the last 7 days
export function getWeeklyTotal() {
  return getWeeklyActivity().reduce((acc, d) => acc + d.count, 0);
}

export default getWeeklyActivity;

