
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
// import BrandLogo from "../components/shared/BrandLogo";

// export default function Login() {
//   const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

//   return (
//     <div className="relative min-h-screen overflow-hidden bg-[#09090b] text-white flex flex-col justify-center items-center px-4 py-16 selection:bg-emerald-500/30">
//       <SEO
//         title="Sign In – Intervyo"
//         description="Sign in to your Intervyo account to practice AI-driven mock interviews and track your progress."
//         url="https://intervyo.xyz/login"
//       />

//       {/* Futuristic Background Accents */}
//       <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_45%,#000_70%,transparent_100%)] pointer-events-none" />
//       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-emerald-500/20 via-emerald-500/5 to-transparent rounded-full blur-[110px] pointer-events-none" />
//       <div className="absolute -bottom-20 right-10 w-[400px] h-[300px] bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none" />

//       {/* Main Centered Content */}
//       <div className="relative z-10 w-full max-w-[460px] flex flex-col items-center">
//         {/* Brand Header */}
//         <Link to="/" className="inline-flex items-center gap-2 mb-6 group transition-transform hover:scale-[1.02]">
//           <BrandLogo
//             className="text-3xl tracking-tight"
//             primaryClassName="text-white group-hover:text-emerald-400 transition-colors"
//             secondaryClassName="text-emerald-400"
//           />
//         </Link>

//         {/* Missing Key Notification */}
//         {!publishableKey && (
//           <div className="mb-6 w-full bg-amber-500/10 border border-amber-500/30 text-amber-300 p-4 rounded-2xl text-center backdrop-blur-xl shadow-lg">
//             <p className="font-semibold text-sm">Clerk Publishable Key Required</p>
//             <p className="text-xs text-amber-200/80 mt-1">
//               Add <code className="bg-black/50 px-1.5 py-0.5 rounded font-mono text-amber-300">VITE_CLERK_PUBLISHABLE_KEY</code> to your <code className="bg-black/50 px-1.5 py-0.5 rounded font-mono text-amber-300">Frontend/.env</code> file.
//             </p>
//           </div>
//         )}

//         {/* Clerk Sign In Component with Custom Theme */}
//         <div className="w-full">
//           <SignIn
//             routing="path"
//             path="/login"
//             signUpUrl="/register"
//             fallbackRedirectUrl="/dashboard"
//             appearance={{
//               baseTheme: dark,
//               variables: {
//                 colorPrimary: "#10b981",
//                 colorBackground: "#131316",
//                 colorInputBackground: "#1e1e24",
//                 colorInputText: "#ffffff",
//                 colorTextSecondary: "#a1a1aa",
//                 colorText: "#ffffff",
//                 borderRadius: "0.875rem",
//                 fontFamily: "inherit",
//               },
//               elements: {
//                 rootBox: "w-full",
//                 card: "bg-zinc-900/90 backdrop-blur-2xl border border-white/10 shadow-[0_0_50px_rgba(16,185,129,0.12),0_25px_50px_rgba(0,0,0,0.7)] rounded-3xl p-6 sm:p-8",
//                 headerTitle: "text-2xl font-bold text-white tracking-tight text-center",
//                 headerSubtitle: "text-zinc-400 text-sm text-center mt-1.5",
//                 socialButtonsBlockButton: "bg-zinc-800/90 hover:bg-zinc-750 border border-zinc-700/80 hover:border-emerald-500/50 text-white rounded-xl py-2.5 transition-all duration-200 shadow-sm",
//                 socialButtonsBlockButtonText: "font-medium text-zinc-200 text-sm",
//                 dividerLine: "bg-zinc-800",
//                 dividerText: "text-zinc-500 text-xs font-semibold uppercase tracking-wider px-2",
//                 formFieldLabel: "text-zinc-300 text-xs font-semibold uppercase tracking-wider mb-1.5",
//                 formFieldInput: "bg-zinc-800/90 border border-zinc-700/80 rounded-xl px-4 py-2.5 text-white placeholder-zinc-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm",
//                 formButtonPrimary: "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-black font-bold rounded-xl py-3 shadow-[0_0_20px_rgba(16,185,129,0.35)] hover:shadow-[0_0_30px_rgba(16,185,129,0.55)] transition-all duration-200 active:scale-[0.98] text-sm",
//                 footer: "bg-transparent border-t border-zinc-800/80 mt-5 pt-4",
//                 footerActionText: "text-zinc-400 text-sm",
//                 footerActionLink: "text-emerald-400 hover:text-emerald-300 font-semibold transition-colors",
//                 identityPreviewText: "text-white font-medium",
//                 identityPreviewEditButton: "text-emerald-400 hover:text-emerald-300",
//                 formFieldAction: "text-emerald-400 hover:text-emerald-300 text-xs font-medium",
//                 formResendCodeLink: "text-emerald-400 hover:text-emerald-300 font-semibold",
//                 otpCodeFieldInput: "border-zinc-700 bg-zinc-800 text-white rounded-xl focus:border-emerald-500",
//                 phoneInputBox: "bg-zinc-800/90 border border-zinc-700/80 rounded-xl text-white",
//                 formFieldSuccessText: "text-emerald-400 text-xs",
//                 formFieldErrorText: "text-rose-400 text-xs",
//                 alertText: "text-zinc-200 text-sm",
//               },
//             }}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// =====================================================
// PREVIOUS LOGIN COMPONENT (COMMENTED OUT AS REQUESTED)
// =====================================================
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, warmUpAuthService } from '../services/operations/authAPI';
import { authEndpoints } from '../services/apis';
const PASSWORD_REQUIREMENTS = [
  { id: 'length', label: '8+ Characters', test: (p) => p.length >= 8 },
  { id: 'uppercase', label: 'Upper Case', test: (p) => /[A-Z]/.test(p) },
  { id: 'number', label: 'Number', test: (p) => /[0-9]/.test(p) },
  { id: 'special', label: 'Special Char', test: (p) => /[#?!@$%^&*-]/.test(p) },
];

const getStrength = (password) => PASSWORD_REQUIREMENTS.filter(req => req.test(password)).length;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { loading } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const passwordInputRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      document.getElementById("password-input")?.focus();
    }
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    warmUpAuthService();
  }, []);

  const handleEmailLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    setError("");
    dispatch(login(email, password, navigate));
  };

  // Dynamically derive social login URLs from our API config
  const handleGoogleLogin = () => {
    const googleLoginUrl = authEndpoints.LOGIN_API.replace('/login', '/google');
    window.location.href = googleLoginUrl;
  };

  const handleGitHubLogin = () => {
    const githubLoginUrl = authEndpoints.LOGIN_API.replace('/login', '/github');
    window.location.href = githubLoginUrl;
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
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 pt-32 pb-12 pointer-events-none">
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
                      className={`h-full flex-1 rounded-full transition-all duration-700 ${getStrength(password) >= i ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-zinc-800'
                        }`}
                    />
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={handleEmailLogin}
              // Disable if loading
              disabled={loading || !email || !password}
              className="relative w-full overflow-hidden rounded-lg bg-emerald-500 py-3 font-semibold text-black
              transition-all duration-300
              hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(16,185,129,0.8)]
              active:scale-95 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
            >
              <span className="relative z-10">
                {loading ? "Signing in..." : "Sign In"}
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
            Don&apos;t have an account?{" "}
            <a
              href="/register"
              className="text-emerald-400 font-semibold hover:underline"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

