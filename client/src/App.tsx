import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { Route, Routes } from "react-router-dom";
import PostInternship from "./pages/PostInternship";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";
import CompanyDashboard from "./pages/CompanyDashboard";
import EditInternship from "./pages/EditInternship";
import CompanyViewStudentPosts from "./pages/CompanyViewStudentPosts";
import StudentBrowseInternships from "./pages/StudentBrowseInternships";
import StudentProfile from "./pages/StudentProfile";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<>Hello world</>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/company/post-internship"
          element={
            <PrivateRoute requiredRole="company">
              <PostInternship />
            </PrivateRoute>
          }
        />
        <Route
          path="/company/dashboard"
          element={
            <PrivateRoute requiredRole="company">
              <CompanyDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/company/edit-internship/:id"
          element={
            <PrivateRoute requiredRole="company">
              <EditInternship />
            </PrivateRoute>
          }
        />
        <Route
          path="/company/student-posts"
          element={
            <PrivateRoute requiredRole="company">
              <CompanyViewStudentPosts />
            </PrivateRoute>
          }
        />

        <Route
          path="/internships"
          element={
            <PrivateRoute requiredRole="student">
              <StudentBrowseInternships />
            </PrivateRoute>
          }
        />

        <Route
          path="/student/profile"
          element={
            <PrivateRoute requiredRole="student">
              <StudentProfile />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
