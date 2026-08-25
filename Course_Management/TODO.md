# Footer Functionality Task

## Steps
- [x] Read Footer.jsx and related files (AppRoutes, Courses, CourseCard, MainLayout, AuthContext)
- [x] Create plan and get user approval
- [x] Rewrite Footer.jsx with functional links:
  - [x] Courses column → `/courses?category=...`
  - [x] Company column → home page + mailto: contact
  - [x] Support column → home page links
  - [x] Social icons → real external platform links
  - [x] Newsletter form → working email subscription with validation + success message
- [x] Update Courses.jsx to filter by category from URL query param
- [x] Verify build (run frontend build) - SUCCESS ✓
- [x] Investigate Courses page "fetching forever" issue
  - [x] Confirmed root cause: backend wasn't running during test
  - [x] Confirmed backend runs on port 5000 (api.js baseURL correct)
  - [x] Verified backend returns courses data (HTTP 200)
  - [x] Reverted unnecessary vite proxy / api.js / Courses.jsx changes
  - [x] Final state: api.js → http://localhost:5000/api (working)
