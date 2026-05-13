import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { USER_ROLES } from './config/constants';
import { initializeEnvironmentValidation } from './utils/envValidation';
import { queryClient } from './hooks/useQueryConfig';

import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/Common/ProtectedRoute';
import LoadingSpinner from './components/Common/LoadingSpinner';
import PatientCaseForm from './components/Patient/PatientCaseForm';
import DoctorOpinionDashboard from './components/Doctor/DoctorOpinionDashboard';

// Lazy load pages for better performance
const Landing = React.lazy(() => import('./pages/Landing'));
const Login = React.lazy(() => import('./pages/Login'));
const ForgotPassword = React.lazy(() => import('./pages/ForgotPassword'));
const Contact = React.lazy(() => import('./pages/Contact'));
const PatientRegister = React.lazy(() => import('./pages/PatientRegister'));
const DoctorRegister = React.lazy(() => import('./pages/DoctorRegister'));

// Public pages
const About = React.lazy(() => import('./pages/About'));
const HowItWorks = React.lazy(() => import('./pages/HowItWorks'));
const FAQ = React.lazy(() => import('./pages/FAQ'));
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy'));
const Terms = React.lazy(() => import('./pages/Terms'));

// Admin Pages
const AdminDashboard = React.lazy(() => import('./pages/Admin/AdminDashboard'));
const AdminNotifications = React.lazy(() =>
  import('./pages/Admin/AdminNotifications')
);
const UserManagement = React.lazy(() => import('./pages/Admin/UserManagement'));
const AdminProfile = React.lazy(() => import('./pages/Admin/AdminProfile'));
const AdminAnalytics = React.lazy(() => import('./pages/Admin/AdminAnalytics'));

// Patient Pages
const PatientDashboard = React.lazy(() => import('./pages/Patient/PatientDashboard'));
const PatientApplications = React.lazy(() =>
  import('./pages/Patient/PatientApplications')
);
const PatientProfile = React.lazy(() => import('./pages/Patient/PatientProfile'));
const PatientNotifications = React.lazy(() =>
  import('./pages/Patient/PatientNotifications')
);
const PaymentHistory = React.lazy(() => import('./pages/Patient/PaymentHistory'));
const DoctorsList = React.lazy(() => import('./pages/DoctorsList'));

// Doctor Pages
const DoctorDashboard = React.lazy(() => import('./pages/Doctor/DoctorDashboard'));
const DoctorProfile = React.lazy(() => import('./pages/Doctor/DoctorProfile'));
const DoctorAvailability = React.lazy(() =>
  import('./pages/Doctor/DoctorAvailability')
);
const DoctorEarnings = React.lazy(() => import('./pages/Doctor/DoctorEarnings'));
const DoctorNotifications = React.lazy(() =>
  import('./pages/Doctor/DoctorNotifications')
);
const DoctorApplicationReview = React.lazy(() => import('./pages/Doctor/DoctorApplicationReview'));

// Notification Management
const NotificationManagement = React.lazy(() => import('./pages/NotificationManagement'));

const App = () => {
  // Initialize environment validation on app start
  useEffect(() => {
    initializeEnvironmentValidation();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="App">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/register/patient" element={<PatientRegister />} />
                <Route path="/register/doctor" element={<DoctorRegister />} />

                {/* Public Information Pages */}
                <Route path="/about" element={<About />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<Terms />} />

                {/* Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
                      <UserManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/notifications"
                  element={
                    <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
                      <AdminNotifications />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/profile"
                  element={
                    <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
                      <AdminProfile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/analytics"
                  element={
                    <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
                      <AdminAnalytics />
                    </ProtectedRoute>
                  }
                />

                {/* Patient Routes */}
                <Route
                  path="/patient"
                  element={
                    <ProtectedRoute allowedRoles={[USER_ROLES.PATIENT]}>
                      <PatientDashboard />
                    </ProtectedRoute>
                  }
                />

                <Route path="/patient/case-form" element={<PatientCaseForm />} />
                <Route
                  path="/patient/applications"
                  element={
                    <ProtectedRoute allowedRoles={[USER_ROLES.PATIENT]}>
                      <PatientApplications />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/patient/profile"
                  element={
                    <ProtectedRoute allowedRoles={[USER_ROLES.PATIENT]}>
                      <PatientProfile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/patient/notifications"
                  element={
                    <ProtectedRoute allowedRoles={[USER_ROLES.PATIENT]}>
                      <PatientNotifications />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/patient/payments"
                  element={
                    <ProtectedRoute allowedRoles={[USER_ROLES.PATIENT]}>
                      <PaymentHistory />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/patient/doctors"
                  element={
                    <ProtectedRoute allowedRoles={[USER_ROLES.PATIENT]}>
                      <DoctorsList />
                    </ProtectedRoute>
                  }
                />

                {/* Doctor Routes */}

<Route path="/doctor/dashboard" element={<DoctorOpinionDashboard />} />

<Route
    path="/doctor"
    element={
        <ProtectedRoute allowedRoles={[USER_ROLES.DOCTOR]}>
            <DoctorDashboard />
        </ProtectedRoute>
    }
/>
                <Route
                  path="/doctor/profile"
                  element={
                    <ProtectedRoute allowedRoles={[USER_ROLES.DOCTOR]}>
                      <DoctorProfile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/doctor/availability"
                  element={
                    <ProtectedRoute allowedRoles={[USER_ROLES.DOCTOR]}>
                      <DoctorAvailability />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/doctor/earnings"
                  element={
                    <ProtectedRoute allowedRoles={[USER_ROLES.DOCTOR]}>
                      <DoctorEarnings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/doctor/notifications"
                  element={
                    <ProtectedRoute allowedRoles={[USER_ROLES.DOCTOR]}>
                      <DoctorNotifications />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/doctor/application-review/:applicationId"
                  element={
                    <ProtectedRoute allowedRoles={[USER_ROLES.DOCTOR]}>
                      <DoctorApplicationReview />
                    </ProtectedRoute>
                  }
                />

                {/* Notification Management */}
                <Route
                  path="/notification-management"
                  element={
                    <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.DOCTOR, USER_ROLES.PATIENT]}>
                      <NotificationManagement />
                    </ProtectedRoute>
                  }
                />

                {/* Default redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>

          </div>
        </Router>
      </AuthProvider>

      {/* React Query Devtools - Only in development */}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
};

export default App;
