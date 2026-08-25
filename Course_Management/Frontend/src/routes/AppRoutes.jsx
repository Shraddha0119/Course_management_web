import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "../components/ProtectedRoute";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Courses from "../pages/Courses";
import CourseDetails from "../pages/CourseDetails";
import Dashboard from "../pages/Dashboard";
import StudentDashboard from "../pages/StudentDashboard";
import MyCourses from "../pages/MyCourses";
import Learning from "../pages/Learning";
import CreateCourse from "../pages/CreateCourse";
import EditCourse from "../pages/EditCourse";
import NotFound from "../pages/NotFound";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
        <Route path="/register" element={<MainLayout><Register /></MainLayout>} />
        <Route path="/courses" element={<MainLayout><Courses /></MainLayout>} />
        <Route path="/courses/:id" element={<MainLayout><CourseDetails /></MainLayout>} />

        {/* Protected - admin & instructor */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute roles={["admin", "instructor"]}>
              <MainLayout><Dashboard /></MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-course"
          element={
            <ProtectedRoute roles={["admin", "instructor"]}>
              <MainLayout><CreateCourse /></MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-course/:id"
          element={
            <ProtectedRoute roles={["admin", "instructor"]}>
              <MainLayout><EditCourse /></MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Protected - student */}
        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute roles={["student"]}>
              <MainLayout><StudentDashboard /></MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-courses"
          element={
            <ProtectedRoute roles={["student"]}>
              <MainLayout><MyCourses /></MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/learn/:courseId"
          element={
            <ProtectedRoute roles={["student"]}>
              <Learning />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
