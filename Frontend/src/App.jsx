// frontend/src/App.jsx
import { Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import AuthCallback from './pages/AuthCallback';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import InterviewSetup from './components/AiInterview/InterviewSetup';
import VerifyEmail from './pages/VerifyEmail';
import DomainSelection from './pages/DomainSelection';
import InterviewRoom from './components/AiInterview/InterviewRoom';
import Results from './pages/Results';
import Settings from './components/Dashboard/Settings';
import InterviewWrapper from './components/Interview/InterviewWrapper';
import Leaderboard from './pages/Leaderboard';
import ReviewHistory from './components/Dashboard/ReviewHistory';
import LearningHub from './components/Dashboard/LearningHub';
import BlogPlatform from './components/Blogs/BlogPlatform';
import Achievements from './components/Dashboard/Achievements';
import AIChatbot from './components/Chatbot/AiChatBot';
import NotFound from './pages/NotFound';
import FAQ from './pages/FAQ';
import Analytics from './pages/Analytics';
import ScrollToTop from './components/shared/ScrollToTop';
import Footer from './components/shared/Footer';
import TermsAndConditions from './pages/Terms';
import PrivacyPolicy from './pages/Privacy';

function App() {
  return (
    <>
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsAndConditions />} />

        <Route path="/domain-selection" element={<DomainSelection />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/blog" element={<BlogPlatform />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />

        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <ReviewHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/resources"
          element={
            <ProtectedRoute>
              <LearningHub />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/achievements"
          element={
            <ProtectedRoute>
              <Achievements />
            </ProtectedRoute>
          }
        />

        <Route
          path="/interview-setup"
          element={
            <ProtectedRoute>
              <InterviewSetup />
            </ProtectedRoute>
          }
        />

        <Route
          path="/interview/:interviewId"
          element={
            <ProtectedRoute>
              <InterviewWrapper />
            </ProtectedRoute>
          }
        />

        <Route
          path="/interview-room/:interviewId"
          element={<InterviewRoom />}
        />

        <Route
          path="/results/:interviewId"
          element={
            <ProtectedRoute>
              <Results />
            </ProtectedRoute>
          }
        />

        {/* 404 – must be last */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <AIChatbot defaultContext="general" />
      <Footer />
    </>
  );
}

export default App;
