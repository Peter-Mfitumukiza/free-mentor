import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth, UserRole } from "./contexts/AuthContext";

// Auth Components
import { AuthLayout } from "./components/organisms/AuthLayout";
import { LoginForm } from "./components/organisms/auth/LoginForm";

// Protected Route
import ProtectedRoute from "./components/routing/ProtectedRoute";

// Pages
import Dashboard from "./pages/Dashboard/Dashboard";
import MentorsList from "./pages/Dashboard/MentorsList";
import UserProfile from "./pages/Dashboard/UserProfile";
import AdminPanel from "./pages/Dashboard/AdminPanel";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import NotFoundPage from "./pages/NotFoundPage";
import { MentorProfile } from "./components/organisms/mentors/MentorsProfile";

const AppRouter: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  console.log("Am I really autheticated", isAuthenticated);
  console.log("Who am I ?", user);

  const getHomeRedirect = () => {
    if (!isAuthenticated) return "/auth";

    console.log("the role of the user being logged in", user);

    if (user?.email === "admin@example.com") return "/admin";

    switch (user?.role) {
      case UserRole.ADMIN:
        return "/admin";
      case UserRole.MENTOR:
        return "/dashboard";
      default:
        return "/dashboard";
    }
  };

  return (
    <Routes>
      {/* Authentication Route */}
      <Route
        path="/auth"
        element={
          isAuthenticated ? (
            <Navigate to={getHomeRedirect()} replace />
          ) : (
            <AuthLayout>
              <LoginForm updateRightContent={() => {}} />
            </AuthLayout>
          )
        }
      />

      {/* Dashboard - Available to all logged-in users */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Mentors List - Available to all logged-in users */}
      <Route
        path="/mentors"
        element={
          <ProtectedRoute>
            <MentorsList />
          </ProtectedRoute>
        }
      />

      {/* Mentor Profile */}

      <Route path="/mentorProfile" element={
        <ProtectedRoute>
          <MentorProfile />
        </ProtectedRoute>
      } />

      {/* User Profile */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        }
      />

      {/* Admin Panel - Only for Admin */}
      <Route
        path="/admin"
        element={
          // <ProtectedRoute requiredRoles={[UserRole.ADMIN]}>
            <AdminPanel />
          // </ProtectedRoute>
        }
      />

      {/* Unauthorized Access Page */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Home Redirect */}
      <Route path="/" element={<Navigate to={getHomeRedirect()} replace />} />

      {/* 404 Not Found */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRouter;