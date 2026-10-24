import { Suspense, lazy, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/shared/ScrollToTopButton";
import Footer from "./components/shared/Footer";
import ScrollToTopOnRouteChange from "./components/shared/ScrollToTopOnRouteChange";
import Navbar from "./components/Navbar";
import VoiceflowChatbot from "./components/Chatbot/VoiceflowChatbot";

const Landing = lazy(() => import("./pages/Landing"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const AuthCallback = lazy(() => import("./pages/AuthCallback"));
const FAQ = lazy(() => import("./pages/FAQ"));
const PrivacyPolicy = lazy(() => import("./pages/Privacy"));
const TermsAndConditions = lazy(() => import("./pages/Terms"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const Career = lazy(() => import("./pages/Career"));
const PricingPage = lazy(() => import("./pages/PricingPage"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));
const DomainSelection = lazy(() => import("./pages/DomainSelection"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));
const BlogPlatform = lazy(() => import("./components/Blogs/BlogPlatform"));
const DashboardPage = lazy(() => import("./pages/Dashboard"));
const Analytics = lazy(() => import("./pages/Analytics"));
const AdvancedFeaturesDashboard = lazy(() => import("./pages/AdvancedFeaturesDashboard"));
const PracticeLab = lazy(() => import("./pages/PracticeLab"));
const ReviewHistory = lazy(() => import("./components/Dashboard/ReviewHistory"));
const LearningHub = lazy(() => import("./components/Dashboard/LearningHub"));
const Settings = lazy(() => import("./components/Dashboard/Settings"));
const Achievements = lazy(() => import("./components/Dashboard/Achievements"));
const InterviewSetup = lazy(() => import("./pages/InterviewSetup"));
const InterviewWrapper = lazy(() => import("./components/Interview/InterviewWrapper"));
const Results = lazy(() => import("./pages/Results"));
const QuizPage = lazy(() => import("./pages/QuizPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const routeFallback = (
  <div className="flex min-h-screen items-center justify-center bg-[#09090b] text-sm text-zinc-300">
    Loading...
  </div>
);

function App() {
  const location = useLocation();

  const hideFooterRoutes = ["/login", "/register"];
  const hideFooter = hideFooterRoutes.includes(location.pathname);

  const hideNavbarRoutes = ["/dashboard", "/settings", "/pricing", "/career", "/terms", "/privacy", "/cookie-policy", "/interview-setup", "/auth/callback", "/blog", "/history", "/analytics", "/resources"];
  const hideNavbar =
    hideNavbarRoutes.includes(location.pathname) ||
    location.pathname.startsWith("/interview-room") ||
    location.pathname.startsWith("/results/");

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js");
    }
  }, []);

  const appContent = (
    <>
      <ScrollToTop />
      <ScrollToTopOnRouteChange />
      {!hideNavbar && <Navbar />}

      <Suspense fallback={routeFallback}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/career" element={<Career />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/domain-selection" element={<DomainSelection />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/blog" element={<BlogPlatform />} />
          <Route path="/blog/:slug" element={<BlogPlatform />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
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
            path="/advanced-features"
            element={
              <ProtectedRoute>
                <AdvancedFeaturesDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/practice-lab"
            element={
              <ProtectedRoute>
                <PracticeLab />
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
            element={
              <ProtectedRoute>
                <InterviewWrapper />
              </ProtectedRoute>
            }
          />

          <Route
            path="/results/:interviewId"
            element={
              <ProtectedRoute>
                <Results />
              </ProtectedRoute>
            }
          />

          <Route path="/quiz" element={<QuizPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      {!location.pathname.startsWith("/interview-room") && <VoiceflowChatbot />}
      {!hideFooter && <Footer />}
    </>
  );

  return appContent;
}

export default App;
