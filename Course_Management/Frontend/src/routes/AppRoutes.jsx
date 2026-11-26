import React, { Suspense, useLayoutEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import Loader from "../components/Loader";

// Lazy load all pages for code splitting
const Home = React.lazy(() => import("../pages/Home"));
const Login = React.lazy(() => import("../pages/Login"));
const Register = React.lazy(() => import("../pages/Register"));
const Courses = React.lazy(() => import("../pages/Courses"));
const CourseDetails = React.lazy(() => import("../pages/CourseDetails"));
const Dashboard = React.lazy(() => import("../pages/Dashboard"));
const StudentDashboard = React.lazy(() => import("../pages/StudentDashboard"));
const MyCourses = React.lazy(() => import("../pages/MyCourses"));
const Learning = React.lazy(() => import("../pages/Learning"));
const CreateCourse = React.lazy(() => import("../pages/CreateCourse"));
const EditCourse = React.lazy(() => import("../pages/EditCourse"));
const NotFound = React.lazy(() => import("../pages/NotFound"));

function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

function AppRoutes() {
  const fallback = <Loader label="Loading..." />;

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<MainLayout><Suspense fallback={fallback}><Home /></Suspense></MainLayout>} />
        <Route path="/login" element={<MainLayout><Suspense fallback={fallback}><Login /></Suspense></MainLayout>} />
        <Route path="/register" element={<MainLayout><Suspense fallback={fallback}><Register /></Suspense></MainLayout>} />
        <Route path="/courses" element={<MainLayout><Suspense fallback={fallback}><Courses /></Suspense></MainLayout>} />
        <Route path="/courses/:id" element={<MainLayout><Suspense fallback={fallback}><CourseDetails /></Suspense></MainLayout>} />

        {/* Protected - admin & instructor */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute roles={["admin", "instructor"]}>
              <MainLayout><Suspense fallback={fallback}><Dashboard /></Suspense></MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-course"
          element={
            <ProtectedRoute roles={["admin", "instructor"]}>
              <MainLayout><Suspense fallback={fallback}><CreateCourse /></Suspense></MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-course/:id"
          element={
            <ProtectedRoute roles={["admin", "instructor"]}>
              <MainLayout><Suspense fallback={fallback}><EditCourse /></Suspense></MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Protected - student */}
        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute roles={["student"]}>
              <MainLayout><Suspense fallback={fallback}><StudentDashboard /></Suspense></MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-courses"
          element={
            <ProtectedRoute roles={["student"]}>
              <MainLayout><Suspense fallback={fallback}><MyCourses /></Suspense></MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/learn/:courseId"
          element={
            <ProtectedRoute roles={["student"]}>
              <Suspense fallback={fallback}><Learning /></Suspense>
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<MainLayout><Suspense fallback={fallback}><NotFound /></Suspense></MainLayout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
