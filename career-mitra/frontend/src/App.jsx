import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import AdminLayout from './layouts/AdminLayout';
import ToastContainer from './components/common/ToastContainer';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import StudentDashboard from './pages/student/StudentDashboard';
import MentorListing from './pages/student/MentorListing';
import MentorProfileView from './pages/student/MentorProfile';
import BookingPage from './pages/student/BookingPage';
import MyBookings from './pages/student/MyBookings';
import MentorDashboard from './pages/mentor/MentorDashboard';
import MentorProfileEdit from './pages/mentor/MentorProfile';
import BookingRequests from './pages/mentor/BookingRequests';
import MentorEarnings from './pages/mentor/MentorEarnings';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageMentors from './pages/admin/ManageMentors';
import ManageBookings from './pages/admin/ManageBookings';
import ViewPayments from './pages/admin/ViewPayments';
import VideoRoom from './pages/VideoRoom';
import NotFound from './pages/NotFound';
import WebinarExplorer from './pages/student/WebinarExplorer';
import WebinarManager from './pages/mentor/WebinarManager';
import WebinarRoom from './pages/WebinarRoom';

// Protected Route Component
const ProtectedRoute = ({ element, role }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-surface-50">
        <div className="w-8 h-8 border-2 border-surface-200 border-t-brand-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" />;
  }

  return element;
};

const App = () => {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-surface-50">
        <div className="w-8 h-8 border-2 border-surface-200 border-t-brand-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Router>
      <ToastContainer />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainLayout><LandingPage /></MainLayout>} />
        <Route path="/login" element={<AuthLayout><LoginPage /></AuthLayout>} />
        <Route path="/signup" element={<AuthLayout><SignupPage /></AuthLayout>} />
        <Route path="/forgot-password" element={<AuthLayout><ForgotPasswordPage /></AuthLayout>} />
        <Route path="/reset-password" element={<AuthLayout><ResetPasswordPage /></AuthLayout>} />

        {/* Student Routes */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute
              element={<MainLayout><StudentDashboard /></MainLayout>}
              role="STUDENT"
            />
          }
        />
        <Route
          path="/mentors"
          element={
            <ProtectedRoute element={<MainLayout><MentorListing /></MainLayout>} role="STUDENT" />
          }
        />
        <Route
          path="/mentors/:id"
          element={
            <ProtectedRoute element={<MainLayout><MentorProfileView /></MainLayout>} role="STUDENT" />
          }
        />
        <Route
          path="/bookings/new/:mentorId"
          element={
            <ProtectedRoute element={<MainLayout><BookingPage /></MainLayout>} role="STUDENT" />
          }
        />
        <Route
          path="/student/bookings"
          element={
            <ProtectedRoute element={<MainLayout><MyBookings /></MainLayout>} role="STUDENT" />
          }
        />
        <Route
          path="/student/book/:mentorId"
          element={
            <ProtectedRoute element={<MainLayout><BookingPage /></MainLayout>} role="STUDENT" />
          }
        />
        <Route
          path="/student/webinars"
          element={
            <ProtectedRoute element={<MainLayout><WebinarExplorer /></MainLayout>} role="STUDENT" />
          }
        />

        {/* Mentor Routes */}
        <Route
          path="/mentor/dashboard"
          element={
            <ProtectedRoute
              element={<MainLayout><MentorDashboard /></MainLayout>}
              role="MENTOR"
            />
          }
        />
        <Route
          path="/mentor/profile"
          element={
            <ProtectedRoute
              element={<MainLayout><MentorProfileEdit /></MainLayout>}
              role="MENTOR"
            />
          }
        />
        <Route
          path="/mentor/bookings"
          element={
            <ProtectedRoute
              element={<MainLayout><BookingRequests /></MainLayout>}
              role="MENTOR"
            />
          }
        />
        <Route
          path="/mentor/earnings"
          element={
            <ProtectedRoute element={<MainLayout><MentorEarnings /></MainLayout>} role="MENTOR" />
          }
        />
        <Route
          path="/mentor/webinars"
          element={
            <ProtectedRoute element={<MainLayout><WebinarManager /></MainLayout>} role="MENTOR" />
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute
              element={<AdminLayout><AdminDashboard /></AdminLayout>}
              role="ADMIN"
            />
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute element={<AdminLayout><ManageUsers /></AdminLayout>} role="ADMIN" />
          }
        />
        <Route
          path="/admin/mentors"
          element={
            <ProtectedRoute element={<AdminLayout><ManageMentors /></AdminLayout>} role="ADMIN" />
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <ProtectedRoute element={<AdminLayout><ManageBookings /></AdminLayout>} role="ADMIN" />
          }
        />
        <Route
          path="/admin/payments"
          element={
            <ProtectedRoute element={<AdminLayout><ViewPayments /></AdminLayout>} role="ADMIN" />
          }
        />

        {/* Video Call Room Route */}
        <Route
          path="/video-room/:bookingId"
          element={<ProtectedRoute element={<VideoRoom />} />}
        />
        {/* Webinar Room Route */}
        <Route
          path="/webinar-room/:webinarId"
          element={<ProtectedRoute element={<WebinarRoom />} />}
        />

        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
