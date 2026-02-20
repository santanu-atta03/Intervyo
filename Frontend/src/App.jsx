// frontend/src/App.jsx
import { Routes, Route, useLocation } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import AuthCallback from "./pages/AuthCallback";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import InterviewSetup from "./components/AiInterview/InterviewSetup";
import VerifyEmail from "./pages/VerifyEmail";
import DomainSelection from "./pages/DomainSelection";
import InterviewRoom from "./components/AiInterview/InterviewRoom";
import Results from "./pages/Results";
import Settings from "./components/Dashboard/Settings";
import InterviewWrapper from "./components/Interview/InterviewWrapper";
import Leaderboard from "./pages/Leaderboard";
import ReviewHistory from "./components/Dashboard/ReviewHistory";
import LearningHub from "./components/Dashboard/LearningHub";
import BlogPlatform from "./components/Blogs/BlogPlatform";
import Achievements from "./components/Dashboard/Achievements";
import VoiceflowChatbot from "./components/Chatbot/VoiceflowChatbot";
import NotFound from "./pages/NotFound";
import FAQ from "./pages/FAQ";
import Analytics from "./pages/Analytics";
import AdvancedFeaturesDashboard from "./pages/AdvancedFeaturesDashboard";
import ScrollToTop from "./components/shared/ScrollToTopButton";
import Footer from "./components/shared/Footer";
import TermsAndConditions from "./pages/Terms";
import PrivacyPolicy from "./pages/Privacy";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import PracticeLab from "./pages/PracticeLab";
import Career from "./pages/Career";
import PricingPage from "./pages/PricingPage";
import QuizPage from "./pages/QuizPage";
import CookiePolicy from "./pages/CookiePolicy";
import ScrollToTopOnRouteChange from "./components/shared/ScrollToTopOnRouteChange";
import Navbar from "./components/Navbar";
import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";

function App() {
  const location = useLocation();

  const hideFooterRoutes = ["/login", "/register"];
  const hideFooter = hideFooterRoutes.includes(location.pathname);

  // Initialize smooth scrolling with Lenis
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: "vertical",
      gestureDirection: "vertical",
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
  const hideNavbarRoutes = ["/dashboard", "/settings", "/pricing", "/career", "/terms", "/privacy", "/cookie-policy", "/interview-setup", "/auth/callback"];
  const hideNavbar =
    hideNavbarRoutes.includes(location.pathname) ||
    location.pathname.startsWith("/interview-room");

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js");
    }
  }, []);

  return (
    <>
      {/* 🔥 Smooth Scroll Behavior */}
      <style>
        {`
          html {
            scroll-behavior: smooth;
          }

          /* ===== Modern Glass Scrollbar ===== */
          ::-webkit-scrollbar {
            width: 10px;
          }

          ::-webkit-scrollbar-track {
            background: transparent;
          }

          ::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.35);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            border: 2px solid rgba(255,255,255,0.2);
          }

          ::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.6);
          }

          /* Firefox */
          * {
            scrollbar-width: thin;
            scrollbar-color: rgba(255,255,255,0.4) transparent;
          }
        `}
      </style>

      <ScrollToTop />
      <ScrollToTopOnRouteChange />
      {!hideNavbar && <Navbar />}

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

        <Route path="/quiz" element={<QuizPage />} />

        <Route path="*" element={<NotFound />} />
      </Routes>

      <VoiceflowChatbot />

      {!hideFooter && <Footer />}
    </>
  );
}

export default App;
