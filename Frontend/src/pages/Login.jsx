
import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/operations/authAPI';
import SEO from '../components/SEO';
const PASSWORD_REQUIREMENTS = [
  { id: 'length', label: '8+ Characters', test: (p) => p.length >= 8 },
  { id: 'uppercase', label: 'Upper Case', test: (p) => /[A-Z]/.test(p) },
  { id: 'number', label: 'Number', test: (p) => /[0-9]/.test(p) },
  { id: 'special', label: 'Special Char', test: (p) => /[#?!@$%^&*-]/.test(p) },
];

const getStrength = (password) => PASSWORD_REQUIREMENTS.filter(req => req.test(password)).length;
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Added state for password visibility
  const passwordInputRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      document.getElementById('password-input')?.focus();
    }
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleEmailLogin = (e) => {
    e.preventDefault();
    setError('');
    dispatch(login(email, password, navigate));
  };

  const handleGoogleLogin = () => {
    window.location.href = 'https://intervyo.onrender.com/api/auth/google';
  };

  const handleGitHubLogin = () => {
    window.location.href = 'https://intervyo.onrender.com/api/auth/github';
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <SEO
        title="Login – Intervyo"
        description="Login to Intervyo and continue practicing AI-powered mock interviews."
        url="https://intervyo.xyz/login"
      />

      {/* 🔳 TILE GRID BACKGROUND */}
      <div className="absolute inset-0 grid grid-cols-[repeat(auto-fill,minmax(60px,1fr))] grid-rows-[repeat(auto-fill,minmax(60px,1fr))] pointer-events-auto">
        {Array.from({ length: 800 }).map((_, i) => (
          <div
            key={i}
            className="
              border border-white/5
              transition-colors duration-90 ease-out
              hover:bg-[#10b981]
            "
          />
        ))}
      </div>

      {/* Glow layer */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[420px] h-[420px] rounded-full bg-emerald-500 blur-[80px]" />
      </div>

      {/* CENTERED LOGIN CARD */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 pointer-events-none">
        <div
          className="pointer-events-auto w-full max-w-md rounded-2xl border border-white/10
          bg-gradient-to-br from-zinc-900/90 to-zinc-800/80
          backdrop-blur-xl shadow-[0_0_60px_rgba(16,185,129,0.15)] p-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-gray-400 mt-2">
              Sign in to continue your interview prep
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDownCapture={handleKeyDown}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-700
                text-white placeholder-gray-500
                focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div className="space-y-2">
  <label className="block text-sm font-medium text-gray-300">
    Password
  </label>
  <div className="relative">
    <input
      id="password-input"
      type={showPassword ? 'text' : 'password'}
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      placeholder="••••••••"
      className="w-full px-4 py-3 pr-10 rounded-lg bg-zinc-900 border border-zinc-700
      text-white placeholder-gray-500
      focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
    />
    {/* Password Visibility Toggle Button */}
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none transition"
    >
      {showPassword ? (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      )}
    </button>
  </div>
  
  {/* Simple Compact Strength Bar for Login */}
  {password.length > 0 && (
    <div className="flex gap-1 h-1 mt-2">
      {[1, 2, 3, 4].map((i) => (
        <div 
          key={i} 
          className={`h-full flex-1 rounded-full transition-all duration-700 ${
            getStrength(password) >= i ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-zinc-800'
          }`} 
        />
      ))}
    </div>
  )}
</div>
            <button
              onClick={handleEmailLogin}
              // Disable if loading OR if strength is less than 2 (out of 4)
              disabled={loading || !email || !password}
              className="relative w-full overflow-hidden rounded-lg bg-emerald-500 py-3 font-semibold text-black
              transition-all duration-300
              hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(16,185,129,0.8)]
              active:scale-95 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
            >
              <span className="relative z-10">
                {loading ? 'Signing in...' : 'Sign In'}
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-600 opacity-0 hover:opacity-100 transition-opacity" />
            </button>
          </div>

          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-zinc-700"></div>
            <span className="px-4 text-sm text-gray-400">Or continue with</span>
            <div className="flex-1 border-t border-zinc-700"></div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 rounded-lg border border-zinc-700
              bg-zinc-900 py-3 font-semibold text-white
              hover:border-emerald-500 hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] transition"
            >
              Continue with Google
            </button>

            <button
              onClick={handleGitHubLogin}
              className="w-full flex items-center justify-center gap-3 rounded-lg
              bg-zinc-800 py-3 font-semibold text-white
              hover:bg-zinc-700 hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] transition"
            >
              Continue with GitHub
            </button>
          </div>

          <p className="text-center mt-6 text-gray-400">
            Don&apos;t have an account?{' '}
            <a href="/register" className="text-emerald-400 font-semibold hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}