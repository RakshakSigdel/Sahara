import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import MobileTabBar from './components/layout/MobileTabBar';
import DoctorDashboardLayout from './components/layout/DoctorDashboardLayout';
import { useDoctor } from './contexts/DoctorContext';

/* ── Lazy pages ── */
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LearnHubPage = lazy(() => import('./pages/learn/LearnHubPage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const SignupPage = lazy(() => import('./pages/auth/SignupPage'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/auth/ResetPasswordPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const PatientsListPage = lazy(() => import('./pages/patients/PatientsListPage'));
const AddPatientPage = lazy(() => import('./pages/patients/AddPatientPage'));
const PatientDetailPage = lazy(() => import('./pages/patients/PatientDetailPage'));
const SessionSetupPage = lazy(() => import('./pages/session/SessionSetupPage'));
const ActiveSessionPage = lazy(() => import('./pages/session/ActiveSessionPage'));
const SessionReviewPage = lazy(() => import('./pages/session/SessionReviewPage'));
const SessionReportPage = lazy(() => import('./pages/session/SessionReportPage'));
const QuestionBankPage = lazy(() => import('./pages/questions/QuestionBankPage'));
const AddQuestionPage = lazy(() => import('./pages/questions/AddQuestionPage'));
const HistoryPage = lazy(() => import('./pages/HistoryPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const HelpPage = lazy(() => import('./pages/HelpPage'));

/* ── Loading ── */
function PageSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-3 border-deep-teal/30 border-t-deep-teal rounded-full animate-spin" />
        <p className="text-sm text-text-muted font-medium">Loading…</p>
      </div>
    </div>
  );
}

/* ── Page transition ── */
function PT({ children }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
      {children}
    </motion.div>
  );
}

/* ── Layout wrappers ── */
function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-[72px]"><Outlet /></main>
      <Footer />
    </div>
  );
}

function AuthLayout() {
  return <Outlet />;
}

function DashLayout() {
  return (
    <DoctorDashboardLayout>
      <Outlet />
      <MobileTabBar />
    </DoctorDashboardLayout>
  );
}

function SessionLayout() {
  return <Outlet />;
}

/* ── Auth guard ── */
function RequireAuth() {
  const { isAuthenticated, loading } = useDoctor();
  if (loading) return <PageSkeleton />;
  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;
  return <Outlet />;
}

/* ── Placeholder ── */
function Placeholder({ title, desc }) {
  return <div className="p-6 lg:p-8"><h1 className="text-2xl font-bold text-navy-dark mb-2">{title}</h1><p className="text-text-secondary">{desc}</p></div>;
}

/* ── 404 ── */
function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-6xl font-extrabold text-deep-teal mb-3">404</h1>
      <p className="text-lg text-text-secondary mb-6">Page not found</p>
      <a href="/" className="text-sm font-semibold text-deep-teal hover:underline">← Back to Home</a>
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        {/* PUBLIC */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<PT><LandingPage /></PT>} />
          <Route path="/learn" element={<PT><LearnHubPage /></PT>} />
          <Route path="/demo" element={<PT><Placeholder title="Platform Demo" desc="Experience the EchoMind screening flow." /></PT>} />
        </Route>

        {/* AUTH (immersive) */}
        <Route element={<AuthLayout />}>
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/signup" element={<SignupPage />} />
          <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
        </Route>

        {/* PROTECTED — Dashboard layout */}
        <Route element={<RequireAuth />}>
          <Route element={<DashLayout />}>
            <Route path="/dashboard" element={<PT><DashboardPage /></PT>} />
            <Route path="/patients" element={<PT><PatientsListPage /></PT>} />
            <Route path="/patients/add" element={<PT><AddPatientPage /></PT>} />
            <Route path="/patients/:patientId" element={<PT><PatientDetailPage /></PT>} />
            <Route path="/patients/:patientId/edit" element={<PT><Placeholder title="Edit Patient" desc="Update patient information." /></PT>} />
            <Route path="/session/setup/:patientId" element={<PT><SessionSetupPage /></PT>} />
            <Route path="/session/review/:sessionId" element={<PT><SessionReviewPage /></PT>} />
            <Route path="/session/report/:sessionId" element={<PT><SessionReportPage /></PT>} />
            <Route path="/questions" element={<PT><QuestionBankPage /></PT>} />
            <Route path="/questions/add" element={<PT><AddQuestionPage /></PT>} />
            <Route path="/history" element={<PT><HistoryPage /></PT>} />
            <Route path="/profile" element={<PT><ProfilePage /></PT>} />
            <Route path="/settings" element={<PT><ProfilePage /></PT>} />
            <Route path="/help" element={<PT><HelpPage /></PT>} />
          </Route>

          {/* Session — immersive (no sidebar) */}
          <Route element={<SessionLayout />}>
            <Route path="/session/active/:sessionId" element={<ActiveSessionPage />} />
          </Route>
        </Route>

        <Route path="*" element={<PublicLayout><PT><NotFound /></PT></PublicLayout>} />
      </Routes>
    </Suspense>
  );
}
