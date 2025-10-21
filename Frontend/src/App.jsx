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
import toast from 'react-hot-toast'
import InterviewWrapper from './components/Interview/InterviewWrapper';
import Leaderboard from './pages/Leaderboard';
import ReviewHistory from './components/Dashboard/ReviewHistory';
import LearningHub from './components/Dashboard/LearningHub';

function App() {
  return (
      <Routes>
        <Route path='/' element = {<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path='/verify-email' element={<VerifyEmail />} />
        <Route path="/domain-selection" element={<DomainSelection />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/history" element={<ReviewHistory />} />
        <Route path="/resources" element={<LearningHub />} />
        <Route path='settings' element={<Settings />} />
        <Route 
        path="/interview-setup" 
        element={
          <ProtectedRoute>
            <InterviewSetup />
          </ProtectedRoute>
        } 
      />
      
      {/* UPDATED: Use InterviewWrapper instead of InterviewRoom directly */}
      <Route 
        path="/interview/:interviewId" 
        element={
          <ProtectedRoute>
            <InterviewWrapper  />
          </ProtectedRoute>
        } 
      />
      <Route path="/interview-room/:interviewId" element={<InterviewRoom />} />
      
      <Route 
        path="/results/:interviewId" 
        element={
          <ProtectedRoute>
            <Results />
          </ProtectedRoute>
        } 
      />
        </Routes>
  );
}

export default App;