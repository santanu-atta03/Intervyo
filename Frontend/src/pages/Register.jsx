import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setSignupData } from "../slices/authSlice";
import { sendOtp } from "../services/operations/authAPI";

const PASSWORD_REQUIREMENTS = [
  { id: 'length', label: '8+ Characters', test: (p) => p.length >= 8 },
  { id: 'uppercase', label: 'Upper Case', test: (p) => /[A-Z]/.test(p) },
  { id: 'number', label: 'Number', test: (p) => /[0-9]/.test(p) },
  { id: 'special', label: 'Special Char', test: (p) => /[#?!@$%^&*-]/.test(p) },
];

// 2. Define getStrength here so it's available to the component
const getStrength = (password) => PASSWORD_REQUIREMENTS.filter(req => req.test(password)).length;

export default function Register() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    domain: "",
    experience: "",
  });
  
  // 3. MOVE THESE INSIDE THE COMPONENT
  // This allows them to "react" to changes in formData
  const currentStrength = getStrength(formData.password);
  const isPasswordValid = currentStrength === 4;
  const isMatching = formData.password === formData.confirmPassword && formData.confirmPassword !== '';
  const isFormFilled = formData.name.trim() !== '' && formData.email.trim() !== '';

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);
  const domains = [
    {
      id: "frontend",
      name: "Frontend",
      icon: "🎨",
      color: "from-pink-500 to-rose-500",
    },
    {
      id: "backend",
      name: "Backend",
      icon: "⚙️",
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "fullstack",
      name: "Full Stack",
      icon: "🚀",
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "data-science",
      name: "Data Science",
      icon: "📊",
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "devops",
      name: "DevOps",
      icon: "🔧",
      color: "from-orange-500 to-amber-500",
    },
    {
      id: "mobile",
      name: "Mobile",
      icon: "📱",
      color: "from-indigo-500 to-blue-500",
    },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be 6+ characters";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      // Store signup data in Redux
      const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`;
      dispatch(
        setSignupData({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          profilePicture: avatarUrl,
        }),
      );

      // Send OTP and navigate to verify email
      dispatch(sendOtp(formData.email, navigate));
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = "https://intervyo.onrender.com/api/auth/google";
  };

  const handleGitHubSignup = () => {
    window.location.href = "https://intervyo.onrender.com/api/auth/github";
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* 🔳 TILE GRID BACKGROUND */}
      <div className="absolute inset-0 grid grid-cols-[repeat(auto-fill,minmax(60px,1fr))] grid-rows-[repeat(auto-fill,minmax(60px,1fr))] pointer-events-auto">
        {Array.from({ length: 800 }).map((_, i) => (
          <div
            key={i}
            className="
              border border-white/5
              transition-colors duration-150 ease-out
              hover:bg-[#10b981]
            "
          />
        ))}
      </div>

      {/* Glow layer */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[420px] h-[420px] rounded-full bg-emerald-500 blur-[80px]" />
      </div>

      {/* CENTERED REGISTER CARD */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 pointer-events-none">
        <div
          className="pointer-events-auto w-full max-w-md rounded-2xl border border-white/10
          bg-gradient-to-br from-zinc-900/90 to-zinc-800/80
          backdrop-blur-xl shadow-[0_0_60px_rgba(16,185,129,0.15)] p-8"
        >
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-300">
                Step 1 of 3
              </span>
              <span className="text-sm text-gray-400">33%</span>
            </div>
            <div className="w-full bg-zinc-800/50 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-2 rounded-full transition-all duration-500"
                style={{ width: "33%" }}
              ></div>
            </div>
          </div>

          {/* Step 1: Basic Info */}
          <div>
            <div className="text-center mb-6">
              <div className="inline-block p-3 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full mb-3">
                <span className="text-4xl">🚀</span>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Create Account
              </h1>
              <p className="text-gray-400 mt-2">
                Start your interview prep journey today!
              </p>
            </div>

            {errors.submit && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-4">
                {errors.submit}
              </div>
            )}

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg bg-zinc-900 border ${errors.name ? "border-red-500/50" : "border-zinc-700"} text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 outline-none transition`}
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg bg-zinc-900 border ${errors.email ? "border-red-500/50" : "border-zinc-700"} text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 outline-none transition`}
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg bg-zinc-900 border ${errors.password ? "border-red-500/50" : "border-zinc-700"} text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 outline-none transition`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none transition"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg bg-zinc-900 border ${errors.confirmPassword ? "border-red-500/50" : "border-zinc-700"} text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 outline-none transition`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none transition"
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={handleNextStep}
              // Only enable if Loading is false AND password is strong AND passwords match AND fields are filled
              disabled={loading || !isPasswordValid || !isMatching || !isFormFilled}
              className="relative w-full overflow-hidden rounded-lg bg-emerald-500 py-3 font-semibold text-black
              transition-all duration-300
              hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(16,185,129,0.8)]
              active:scale-95 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
            >
              <span className="relative z-10">
                {loading ? "Sending OTP..." : "Continue →"}
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-600 opacity-0 hover:opacity-100 transition-opacity" />
            </button>

            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-zinc-700"></div>
              <span className="px-4 text-sm text-gray-400">
                Or sign up with
              </span>
              <div className="flex-1 border-t border-zinc-700"></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleGoogleSignup}
                className="flex items-center justify-center gap-3 rounded-lg border border-zinc-700
                bg-zinc-900 py-3 font-semibold text-white
                hover:border-emerald-500 hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] transition"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </button>

              <button
                onClick={handleGitHubSignup}
                className="flex items-center justify-center gap-3 rounded-lg
                bg-zinc-800 py-3 font-semibold text-white
                hover:bg-zinc-700 hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] transition"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </button>
            </div>

            <p className="text-center mt-6 text-gray-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-emerald-400 font-semibold hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
