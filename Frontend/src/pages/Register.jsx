import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  AtSign,
  BriefcaseBusiness,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Github,
  Mail,
  Monitor,
  Rocket,
  Search,
  Sparkles,
  Users,
} from "lucide-react";

import { setSignupData } from "../slices/authSlice";
import { sendOtp, warmUpAuthService } from "../services/operations/authAPI";

const HERO_IMAGE = {
  register_img: "/upscalemedia-transformed.png",
};

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

const PLATFORMS = [
  {
    id: "frontend",
    label: "Frontend",
    icon: Monitor,
  },
  {
    id: "backend",
    label: "Backend",
    icon: BriefcaseBusiness,
  },
  {
    id: "fullstack",
    label: "Full Stack",
    icon: Rocket,
  },
  {
    id: "data-science",
    label: "Data Science",
    icon: Sparkles,
  },
  {
    id: "devops",
    label: "DevOps",
    icon: Search,
  },
  {
    id: "mobile",
    label: "Mobile",
    icon: AtSign,
  },
];

const getStrength = (password) =>
  PASSWORD_REQUIREMENTS.filter((requirement) =>
    requirement.test(password)
  ).length;

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

function Register() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [platform, setPlatform] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    warmUpAuthService();
  }, []);

  const strength = getStrength(password);
  const passwordsMatch =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword;

  const validateEmail = () => {
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }

    setError("");
    return true;
  };

  const validatePassword = () => {
    if (strength !== 4) {
      setError("Please choose a stronger password");
      return false;
    }

    if (!passwordsMatch) {
      setError("Passwords do not match");
      return false;
    }

    setError("");
    return true;
  };

  const handleContinue = async () => {
    if (step === 1) {
      if (validateEmail()) {
        setStep(2);
      }

      return;
    }

    if (step === 2) {
      if (validatePassword()) {
        setStep(3);
      }

      return;
    }

    if (step === 3) {
      if (!platform) {
        setError("Please choose a platform");
        return;
      }

      setError("");

      const derivedName = email
        .split("@")[0]
        .replace(/[._-]+/g, " ")
        .replace(/\b\w/g, (character) => character.toUpperCase());

      dispatch(
        setSignupData({
          name: derivedName || "Intervyo User",
          email,
          password,
          platform,
          profilePicture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
            email
          )}`,
        })
      );

      setStep(4);

      // Passing an empty callback keeps the verification message on this screen.
      // The verification page can still be opened from your auth flow if needed.
      dispatch(sendOtp(email, () => { }));

      return;
    }
  };

  const handleBack = () => {
    setError("");

    if (step > 1 && step < 4) {
      setStep((currentStep) => currentStep - 1);
    }
  };

  const handleGoogleAuth = () => {
    const baseUrl =
      import.meta.env.VITE_BASE_URL || "http://localhost:5000";

    window.location.href = `${baseUrl}/api/auth/google`;
  };

  const handleGithubAuth = () => {
    const baseUrl =
      import.meta.env.VITE_BASE_URL || "http://localhost:5000";

    window.location.href = `${baseUrl}/api/auth/github`;
  };

  return (
    <main className="relative h-screen w-full overflow-hidden bg-[#0A0D12] text-white">
      <style>{`
      @font-face {
        font-family: "FK Screamer";
        src: url("https://cdn.ploy.ai/d21bf4ad-2458-43ee-9561-54c28ab0e85f/user/4b73ec13-fkscreamer.woff2") format("woff2");
        font-weight: 100 900;
        font-style: normal;
        font-display: swap;
      }

      .font-heading {
        font-family: "FK Screamer", Impact, sans-serif, "Geist;
        letter-spacing: -0.02em;
      }

      .register-grid {
        background-image:
          linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px);
        background-size: 4rem 4rem;
        mask-image: radial-gradient(ellipse at center, black 0%, transparent 78%);
        -webkit-mask-image: radial-gradient(ellipse at center, black 0%, transparent 78%);
      }

      .nav-heading{
          font-family: "FK Screamer", Impact, sans-serif;
        }

      @keyframes imageDrift {
        0%, 100% {
          transform: scale(1.02) translate3d(0, 0, 0);
        }

        50% {
          transform: scale(1.06) translate3d(-1%, -1%, 0);
        }
      }
      
      .reg-panel{
        font-family : Geist
      }

      .register-image-drift {
        animation: imageDrift 18s ease-in-out infinite;
      }
    `}</style>

      {/* Background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(195,219,255,0.12),transparent_35%),linear-gradient(180deg,#0E121A_0%,#0A0D12_100%)]" />

      <div className="register-grid pointer-events-none absolute inset-0" />

      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-30 flex h-[88px] items-center justify-between px-5 sm:px-8 lg:px-12"
      >
        <Link
          to="/"
          className="rounded-full bg-white px-5 py-2.5 text-[#171717] shadow-lg shadow-black/20 transition hover:bg-zinc-100"
        >
          <span className="nav-heading text-[30px] font-extrabold leading-none">
            Intervyo
          </span>
        </Link>

        <Link
          to="/login"
          className="text-sm text-zinc-400 transition hover:text-white"
        >
          Already have an account?{" "}
          <span className="font-semibold text-white">Log in</span>
        </Link>
      </motion.nav>

      {/* Main content */}
      <div className="relative z-10 mx-auto grid h-[calc(100vh-88px)] w-full max-w-[1440px] grid-cols-1 items-center lg:grid-cols-[minmax(0,1.15fr)_minmax(390px,0.85fr)]">
        {/* Image panel */}
        <motion.section
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative hidden h-full min-h-0 items-center justify-center overflow-hidden lg:flex lg:flex-row"
        >
          <img
            src={HERO_IMAGE.register_img}
            alt="Intervyo interview preparation workspace"
            className="register-image-drift block max-h-[82vh] w-[95%] object-contain object-center"
          />


        </motion.section>

        {/* Registration panel */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.75,
            delay: 0.12,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="reg-panel flex h-full min-h-0 items-center justify-center px-10 py-10 font-[Geist]"
        >
          <div className="w-full max-w-[394px]">
          <div className="relative rounded-[5px] border border-[#303030] bg-[#292929] px-7 py-7 shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
            {/* Decorative card dots */}
            <span className="absolute left-[11px] top-[10px] h-[7px] w-[7px] rounded-full bg-[#3b3b3b]" />
            <span className="absolute right-[11px] top-[10px] h-[7px] w-[7px] rounded-full bg-[#3b3b3b]" />
            <span className="absolute bottom-[10px] left-[11px] h-[7px] w-[7px] rounded-full bg-[#3b3b3b]" />
            <span className="absolute bottom-[10px] right-[11px] h-[7px] w-[7px] rounded-full bg-[#3b3b3b]" />

            {step > 1 && step < 4 && (
              <button
                type="button"
                onClick={handleBack}
                className="absolute left-6 top-6 rounded-full p-1 text-[#8d8d8d] transition hover:bg-white/[0.06] hover:text-white"
                aria-label="Go back"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            )}

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="email"
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: -10 }}
                >
                  <h1 className="font-heading text-[28px] font-bold leading-none text-white font-[Geist]">
                    Sign up
                  </h1>

                  <div className="mt-7">
                    <label
                      htmlFor="signup-email"
                      className="mb-2 block text-[14px] font-semibold text-white"
                    >
                      Email
                    </label>

                    <input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        setError("");
                      }}
                      placeholder="m@example.com"
                      autoComplete="email"
                      autoFocus
                      className={`h-[36px] w-full rounded-[5px] border bg-transparent px-3 text-[14px] text-white outline-none transition placeholder:text-[#858585] focus:border-[#72b2ff] focus:ring-1 focus:ring-[#72b2ff]/30 ${error ? "border-red-400/70" : "border-[#414141]"
                        }`}
                    />
                  </div>

                  {error && (
                    <p className="mt-2 text-[11px] text-red-300">{error}</p>
                  )}

                  <button
                    type="button"
                    onClick={handleContinue}
                    className="mt-6 flex h-[39px] w-full items-center justify-center rounded-full bg-[#e6e6e6] text-[14px] font-medium text-[#111] transition hover:bg-white active:scale-[0.98]"
                  >
                    Continue
                  </button>

                  <div className="my-5 flex items-center gap-3">
                    <div className="h-px flex-1 bg-[#444]" />
                    <span className="text-[13px] text-[#aaa]">or</span>
                    <div className="h-px flex-1 bg-[#444]" />
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogleAuth}
                    className="flex h-[40px] w-full items-center justify-center gap-2 rounded-full border border-[#444] text-[14px] font-medium text-white transition hover:border-[#666] hover:bg-white/[0.04]"
                  >
                    <span className="text-[18px] font-[Geist]">G</span>
                    Continue with Google
                  </button>

                  <p className="mt-6 text-center text-[13px] text-[#aaa]">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="font-semibold text-white hover:text-[#D1F48C]"
                    >
                      Log in
                    </Link>
                  </p>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="password"
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: -10 }}
                >
                  <h1 className="font-heading text-[27px] font-bold leading-none text-white">
                    Create your password
                  </h1>

                  <p className="mt-2 text-[12px] leading-relaxed text-[#aaa]">
                    Choose a password to secure your interview workspace.
                  </p>

                  <div className="mt-7">
                    <label
                      htmlFor="signup-password"
                      className="mb-2 block text-[12px] font-semibold text-white"
                    >
                      Password
                    </label>

                    <div className="relative">
                      <input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(event) => {
                          setPassword(event.target.value);
                          setError("");
                        }}
                        autoFocus
                        className="h-[36px] w-full rounded-[5px] border border-[#414141] bg-transparent px-3 pr-10 text-[12px] text-white outline-none transition focus:border-[#72b2ff] focus:ring-1 focus:ring-[#72b2ff]/30"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword((value) => !value)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#888] hover:text-white"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="mt-5">
                    <label
                      htmlFor="confirm-password"
                      className="mb-2 block text-[12px] font-semibold text-white"
                    >
                      Confirm password
                    </label>

                    <div className="relative">
                      <input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(event) => {
                          setConfirmPassword(event.target.value);
                          setError("");
                        }}
                        className={`h-[36px] w-full rounded-[5px] border bg-transparent px-3 pr-10 text-[12px] text-white outline-none transition focus:ring-1 ${confirmPassword && !passwordsMatch
                            ? "border-red-400/70 focus:border-red-400"
                            : "border-[#414141] focus:border-[#72b2ff] focus:ring-[#72b2ff]/30"
                          }`}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword((value) => !value)
                        }
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#888] hover:text-white"
                        aria-label={
                          showConfirmPassword
                            ? "Hide confirm password"
                            : "Show confirm password"
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {password.length > 0 && (
                    <div className="mt-4">
                      <div className="flex h-[3px] gap-1">
                        {[1, 2, 3, 4].map((level) => (
                          <div
                            key={level}
                            className={`flex-1 rounded-full transition-all ${strength >= level
                                ? "bg-[#d9d9d9]"
                                : "bg-[#414141]"
                              }`}
                          />
                        ))}
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-2">
                        {PASSWORD_REQUIREMENTS.map((requirement) => (
                          <span
                            key={requirement.id}
                            className={`text-[10px] ${requirement.test(password)
                                ? "text-[#d9d9d9]"
                                : "text-[#777]"
                              }`}
                          >
                            {requirement.test(password) ? "✓" : "○"}{" "}
                            {requirement.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {error && (
                    <p className="mt-3 text-[11px] text-red-300">{error}</p>
                  )}

                  <button
                    type="button"
                    onClick={handleContinue}
                    className="mt-6 flex h-[39px] w-full items-center justify-center gap-2 rounded-full bg-[#e6e6e6] text-[13px] font-medium text-[#111] transition hover:bg-white active:scale-[0.98]"
                  >
                    Continue
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="platform"
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: -10 }}
                >
                  <h1 className="font-heading text-[27px] font-bold leading-none text-white">
                    Which platform are you preparing for?
                  </h1>

                  <p className="mt-2 text-[12px] leading-relaxed text-[#aaa]">
                    We&apos;ll personalize your interview preparation.
                  </p>

                  <div className="mt-6 space-y-2">
                    {PLATFORMS.map((item) => {
                      const Icon = item.icon;
                      const selected = platform === item.id;

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setPlatform(item.id);
                            setError("");
                          }}
                          className={`flex h-[39px] w-full items-center justify-between rounded-[5px] border px-3 text-left transition ${selected
                              ? "border-[#8c8c8c] bg-white/[0.08]"
                              : "border-[#414141] hover:border-[#626262]"
                            }`}
                        >
                          <span className="flex items-center gap-3 text-[12px] text-white">
                            <Icon className="h-4 w-4 text-[#aaa]" />
                            {item.label}
                          </span>

                          <span
                            className={`flex h-3.5 w-3.5 items-center justify-center rounded-full border ${selected
                                ? "border-white bg-white"
                                : "border-[#555]"
                              }`}
                          >
                            {selected && (
                              <span className="h-1.5 w-1.5 rounded-full bg-[#292929]" />
                            )}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {error && (
                    <p className="mt-3 text-[11px] text-red-300">{error}</p>
                  )}

                  <button
                    type="button"
                    onClick={handleContinue}
                    disabled={loading}
                    className="mt-5 flex h-[39px] w-full items-center justify-center rounded-full bg-[#e6e6e6] text-[13px] font-medium text-[#111] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? "Sending verification..." : "Continue"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPlatform("skipped");
                      handleContinue();
                    }}
                    className="mx-auto mt-5 block text-[12px] font-medium text-white hover:text-[#D1F48C]"
                  >
                    Skip
                  </button>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="verification"
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  className="py-5 text-center"
                >
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#555] bg-white/[0.05]">
                    <Mail className="h-5 w-5 text-[#d9d9d9]" />
                  </div>

                  <h1 className="mt-5 font-heading text-[28px] font-bold leading-none text-white">
                    Check your inbox
                  </h1>

                  <p className="mt-3 text-[12px] leading-relaxed text-[#aaa]">
                    We sent a verification link to:
                  </p>

                  <p className="mt-2 break-all text-[13px] font-semibold text-white">
                    {email}
                  </p>

                  <p className="mt-5 text-[11px] leading-relaxed text-[#888]">
                    Open the email and follow the link to finish creating your
                    Intervyo account.
                  </p>

                  <div className="mt-6 rounded-[5px] border border-[#414141] bg-white/[0.03] px-4 py-3 text-left text-[11px] text-[#aaa]">
                    <div className="flex items-center gap-2 text-white">
                      <Check className="h-4 w-4 text-[#d9d9d9]" />
                      Account details saved
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-white">
                      <Check className="h-4 w-4 text-[#d9d9d9]" />
                      Preparation path selected
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="mt-6 text-[12px] font-semibold text-white hover:text-[#D1F48C]"
                  >
                    Use a different email
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          </div>
        </motion.section>
      </div>
    </main>
  );
}

export default Register;