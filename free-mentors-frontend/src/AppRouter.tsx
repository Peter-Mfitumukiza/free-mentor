import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth, UserRole } from "./contexts/AuthContext";

import { AuthLayout } from "./components/organisms/AuthLayout";
import { LoginForm } from "./components/organisms/auth/LoginForm";

import ProtectedRoute from "./components/routing/ProtectedRoute";

import Dashboard from "./pages/Dashboard/Dashboard";
import MentorsList from "./pages/Dashboard/MentorsList";
import UserProfile from "./pages/Dashboard/UserProfile";
import AdminPanel from "./pages/Dashboard/AdminPanel";
import MentorshipRequests from "./pages/Dashboard/MentorshipRequests";
import MyMentorshipSessions from "./pages/Dashboard/MyMentorshipSessions";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import NotFoundPage from "./pages/NotFoundPage";

const AppRouter: React.FC = () => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const userHasValidRole = user && Object.values(UserRole).includes(user.role as UserRole);

  const getHomeRedirect = () => {
    if (!isAuthenticated) return "/auth";
    if (!userHasValidRole) return "/unauthorized";
  
    const currentPath = location.pathname;
    
    switch (user?.role) {
      case UserRole.ADMIN:
        if (
          currentPath === '/admin' ||
          currentPath === '/dashboard' ||
          currentPath === '/mentors' ||
          currentPath === '/profile'
        ) {
          return currentPath;
        }
        return "/admin";
        
      case UserRole.MENTOR:
        if (
          currentPath === '/dashboard' ||
          currentPath === '/mentors' ||
          currentPath === '/mentorship-requests' ||
          currentPath === '/profile'
        ) {
          return currentPath;
        }
        return "/dashboard";
        
      case UserRole.USER:
        if (
          currentPath === '/dashboard' ||
          currentPath === '/mentors' ||
          currentPath === '/my-sessions' ||
          currentPath === '/profile'
        ) {
          return currentPath;
        }
        return "/dashboard";
        
      default:
        return "/dashboard";
    }
  };

  return (
    <Routes>
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

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute requiredRoles={[UserRole.USER, UserRole.MENTOR, UserRole.ADMIN]}>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/mentors"
        element={
          <ProtectedRoute requiredRoles={[UserRole.USER, UserRole.MENTOR, UserRole.ADMIN]}>
            <MentorsList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-sessions"
        element={
          <ProtectedRoute requiredRoles={[UserRole.USER]}>
            <MyMentorshipSessions />
          </ProtectedRoute>
        }
      />

      <Route
        path="/mentorship-requests"
        element={
          <ProtectedRoute requiredRoles={[UserRole.MENTOR]}>
          <MentorshipRequests />
        </ProtectedRoute>
      }
    />

    <Route
      path="/profile"
      element={
        <ProtectedRoute requiredRoles={[UserRole.USER, UserRole.MENTOR, UserRole.ADMIN]}>
          <UserProfile />
        </ProtectedRoute>
      }
    />

    <Route
      path="/admin/*"
      element={
        <ProtectedRoute requiredRoles={[UserRole.ADMIN]}>
          <AdminPanel />
        </ProtectedRoute>
      }
    />

    <Route path="/unauthorized" element={<UnauthorizedPage />} />

    <Route path="/" element={<Navigate to={getHomeRedirect()} replace />} />

    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);
};

export default AppRouter;