import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Github,
  LockKeyhole,
  Mail,
  Mic2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import SEO from "../components/shared/SEO";
import BrandLogo from "../components/shared/BrandLogo";
import { login, warmUpAuthService } from "../services/operations/authAPI";
import { authEndpoints } from "../services/apis";

const HERO_IMAGE = {
  login_img: "/upscalemedia-transformed.png"
}

const PASSWORD_REQUIREMENTS = [
  {
    id: "length",
    label: "8+ Characters",
    test: (password) => password.length >= 8,
  },
  {
    id: "uppercase",
    label: "Upper Case",
    test: (password) => /[A-Z]/.test(password),
  },
  {
    id: "number",
    label: "Number",
    test: (password) => /[0-9]/.test(password),
  },
  {
    id: "special",
    label: "Special Char",
    test: (password) => /[#?!@$%^&*-]/.test(password),
  },
];

const getStrength = (password) =>
  PASSWORD_REQUIREMENTS.filter((requirement) =>
    requirement.test(password)
  ).length;

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const passwordInputRef = useRef(null);

  const { loading } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    warmUpAuthService();
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      if (event.currentTarget.name === "email") {
        passwordInputRef.current?.focus();
      }
    }
  };

  const handleEmailLogin = (event) => {
    event.preventDefault();

    if (!email.trim() || !password) {
      setError("Please fill in all fields");
      return;
    }

    setError("");
    dispatch(login(email.trim(), password, navigate));
  };

  const handleGoogleLogin = () => {
    const googleLoginUrl = authEndpoints.LOGIN_API.replace(
      "/login",
      "/google"
    );

    window.location.href = googleLoginUrl;
  };

  const handleGitHubLogin = () => {
    const githubLoginUrl = authEndpoints.LOGIN_API.replace(
      "/login",
      "/github"
    );

    window.location.href = githubLoginUrl;
  };

  const strength = getStrength(password);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#0A0D12] text-white">
      <SEO
        title="Login – Intervyo"
        description="Login to Intervyo and continue practicing AI-powered mock interviews."
        url="https://intervyo.xyz/login"
      />

      <style>{`
        @font-face {
          font-family: "FK Screamer";
          src: url("https://cdn.ploy.ai/d21bf4ad-2458-43ee-9561-54c28ab0e85f/user/4b73ec13-fkscreamer.woff2") format("woff2");
          font-weight: 100 900;
          font-style: normal;
          font-display: swap;
        }

        .nav-heading{
          font-family: "FK Screamer", Impact, sans-serif;
        }

        .font-heading {
          font-family: "FK Screamer", Impact, sans-serif, "Geist;
          letter-spacing: -0.02em;
        }

        .login-grid {
          background-image:
            linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px);
          background-size: 4rem 4rem;
          mask-image: radial-gradient(ellipse at center, black 0%, transparent 76%);
          -webkit-mask-image: radial-gradient(ellipse at center, black 0%, transparent 76%);
        }

        @keyframes imageDrift {
          0%, 100% {
            transform: scale(1.05) translate3d(0, 0, 0);
          }
          50% {
            transform: scale(1.1) translate3d(-1%, -1%, 0);
          }
        }

        .login-image-drift {
          animation: imageDrift 18s ease-in-out infinite;
        }
      `}</style>

      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(195,219,255,0.12),transparent_35%),linear-gradient(180deg,#0E121A_0%,#0A0D12_100%)]" />
      <div className="login-grid pointer-events-none fixed inset-0" />

      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-20 flex items-center justify-between px-5 py-5 sm:px-8 lg:px-12"
      >
        <Link
          to="/"
          className="inline-flex"
        >
          <BrandLogo className="text-[30px]" />
        </Link>

        <Link
          to="/"
          className="group flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
          Back to home
        </Link>
      </motion.nav>

      <div className="relative z-10 mx-auto grid  max-w-[10/12]  lg:grid-cols-[minmax(0,1.15fr)_minmax(400px,0.85fr)] ">
        {/* Editorial image panel */}
        <motion.section
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative hidden  w-full min-h-[90%] lg:block"
        >
          <img
            src={HERO_IMAGE.login_img}
            alt="Intervyo interview preparation workspace"
            className="login-image-drift absolute inset-0 h-full w-full "
          />

        </motion.section>

        {/* Login panel */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.75,
            delay: 0.12,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="flex items-center justify-center font-[Geist]"
        >
          <div className="w-full max-w-[394px]">
            <div className="relative rounded-[5px] border border-[#303030] bg-[#292929] px-7 py-7 shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
              {/* Decorative card dots */}
              <span className="absolute left-[11px] top-[10px] h-[7px] w-[7px] rounded-full bg-[#3b3b3b]" />
              <span className="absolute right-[11px] top-[10px] h-[7px] w-[7px] rounded-full bg-[#3b3b3b]" />
              <span className="absolute bottom-[10px] left-[11px] h-[7px] w-[7px] rounded-full bg-[#3b3b3b]" />
              <span className="absolute bottom-[10px] right-[11px] h-[7px] w-[7px] rounded-full bg-[#3b3b3b]" />

              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="mb-6"
              >
                <h2 className="font-heading font-[Geist] text-[35px] font-bold leading-none tracking-[-0.04em] text-white">
                  Welcome back
                </h2>

                <p className="mt-2 text-[12px] leading-none text-[#b8b8b8]">
                  It&apos;s good to see you.
                </p>
              </motion.div>

              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -8 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -8 }}
                    role="alert"
                    className="mb-4 overflow-hidden rounded-[4px] border border-red-400/30 bg-red-400/10 px-3 py-2 text-[11px] text-red-300"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleEmailLogin} className="space-y-5">
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.12 }}
                >
                  <label
                    htmlFor="email-input"
                    className="mb-2 block text-[13px] font-semibold text-white"
                  >
                    Email
                  </label>

                  <input
                    id="email-input"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="m@example.com"
                    className="h-[44px] w-full rounded-[5px] border ring-0 border-[#4e91db] bg-[#292929] px-3 text-[14px] text-white outline-none transition placeholder:text-[#858585] focus:border-[#72b2ff] focus:ring-1 focus:ring-[#72b2ff]/30 sm:h-[40px] sm:text-[12px]"
                  />
                </motion.div>

                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.18 }}
                >
                  <label
                    htmlFor="password-input"
                    className="mb-2 block text-[13px] font-semibold text-white"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <input
                      ref={passwordInputRef}
                      id="password-input"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder=""
                      className="h-[44px] w-full rounded-[5px] border border-[#414141] bg-[#292929] px-3 pr-9 text-[14px] text-white outline-none transition placeholder:text-[#858585] focus:border-[#72b2ff] focus:ring-1 focus:ring-[#72b2ff]/30 sm:h-[40px] sm:text-[12px]"
                    />

                    <button
                      type="button"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-[#929292] transition hover:text-white focus:outline-none focus:ring-1 focus:ring-[#72b2ff]"
                    >
                      {showPassword ? (
                        <EyeOff className="h-3.5 w-3.5" />
                      ) : (
                        <Eye className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>

                  {password.length > 0 && (
                    <div className="mt-2">
                      <div className="flex h-[3px] gap-1">
                        {[1, 2, 3, 4].map((level) => (
                          <div
                            key={level}
                            className={`flex-1 rounded-full transition-all duration-500 ${strength >= level ? "bg-[#d9d9d9]" : "bg-[#414141]"
                              }`}
                          />
                        ))}
                      </div>

                      <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1">
                        {PASSWORD_REQUIREMENTS.map((requirement) => (
                          <span
                            key={requirement.id}
                            className={`text-[9px] transition-colors ${requirement.test(password)
                                ? "text-[#d9d9d9]"
                                : "text-[#777777]"
                              }`}
                          >
                            {requirement.test(password) ? "✓" : "○"}{" "}
                            {requirement.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>

                <motion.button
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.24 }}
                  type="submit"
                  disabled={loading || !email || !password}
                  whileHover={{ scale: loading ? 1 : 1.01 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className="mt-1 flex h-[48px] w-full items-center justify-center rounded-full bg-[#e6e6e6] px-4 text-[14px] font-medium text-[#111111] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 sm:h-[40px]"
                >
                  {loading ? "Signing in..." : "Log in"}
                </motion.button>
              </form>

              <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-[#444444]" />
                <span className="text-[11px] text-[#b7b7b7]">or</span>
                <div className="h-px flex-1 bg-[#444444]" />
              </div>

              <div className="space-y-2">
                <motion.button
                  type="button"
                  onClick={handleGoogleLogin}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex h-[37px] w-full items-center justify-center gap-2 rounded-full border border-[#444444] bg-transparent text-[14px] font-medium text-white transition hover:border-[#666666] hover:bg-white/[0.04]"
                >
                  <span className="text-[20px] font-[Geist] leading-none">G</span>
                  Continue with Google
                </motion.button>

                <motion.button
                  type="button"
                  onClick={handleGitHubLogin}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex h-[37px] w-full items-center justify-center gap-2 rounded-full border border-[#444444] bg-transparent text-[14px] font-medium text-white transition hover:border-[#666666] hover:bg-white/[0.04]"
                >
                  <Github className="h-[15px] w-[15px]" />
                  Continue with GitHub
                </motion.button>
              </div>

              <button
                type="button"
                className="mx-auto mt-5 block text-[13px] font-semibold text-white transition hover:text-[#cfcfcf]"
              >
                Having trouble signing in?
              </button>

              <p className="mt-3 text-center text-[13px] text-[#bdbdbd]">
                Don&apos;t have an account?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-white transition hover:text-[#d1f48c]"
                >
                  Sign up
                </Link>
              </p>
            </div>

          </div>
        </motion.section>
      </div>
    </main>
  );
}