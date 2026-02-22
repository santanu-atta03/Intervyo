import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SEO from "../components/SEO";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate();

  // Email validation regex
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const validateEmail = (emailValue) => {
    if (!emailValue) {
      setEmailError("");
      return false;
    }
    if (!emailRegex.test(emailValue)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (value) {
      validateEmail(value);
    } else {
      setEmailError("");
    }
  };

  const handleEmailBlur = () => {
    if (email) {
      validateEmail(email);
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // Validate email
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      // TODO: Implement actual OTP sending logic here
      // Example API call:
      // const response = await fetch('/api/auth/forgot-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email })
      // });

      // Simulated success for now
      setTimeout(() => {
        setLoading(false);
        setMessage("OTP sent successfully! Please check your email.");
      }, 1500);
    } catch {
      setLoading(false);
      setError("Failed to send OTP. Please try again.");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <SEO
        title="Forgot Password – Intervyo"
        description="Reset your Intervyo account password."
        url="https://intervyo.xyz/forgot-password"
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

      {/* CENTERED FORGOT PASSWORD CARD */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 pt-32 pb-12 pointer-events-none">
        <div
          className="pointer-events-auto w-full max-w-md rounded-2xl border border-white/10
          bg-gradient-to-br from-zinc-900/90 to-zinc-800/80
          backdrop-blur-xl shadow-[0_0_60px_rgba(16,185,129,0.15)] p-8"
        >
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <h1 className="text-4xl font-bold">
                <span className="text-white">Interv</span>
                <span className="text-emerald-500">yo</span>
              </h1>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Forgot Password?
            </h2>
            <p className="text-gray-400 mt-2">
              Enter your email to receive an OTP for password reset
            </p>
          </div>

          {/* Success Message */}
          {message && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-lg mb-4">
              {message}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSendOTP} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
                placeholder="you@example.com"
                pattern="[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                className={`w-full px-4 py-3 rounded-lg bg-zinc-900 border ${
                  emailError
                    ? "border-red-500 focus:ring-2 focus:ring-red-500"
                    : "border-zinc-700 focus:ring-2 focus:ring-emerald-500"
                }
                text-white placeholder-gray-500
                outline-none transition-all`}
                required
              />
              {emailError && (
                <p className="mt-2 text-sm text-red-400">{emailError}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !email || emailError}
              className="relative w-full overflow-hidden rounded-lg bg-emerald-500 py-3 font-semibold text-black
              transition-all duration-300
              hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(16,185,129,0.8)]
              active:scale-95 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
            >
              <span className="relative z-10">
                {loading ? "Sending OTP..." : "Send OTP"}
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-600 opacity-0 hover:opacity-100 transition-opacity" />
            </button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <button
              onClick={() => navigate("/login")}
              className="text-emerald-400 font-semibold hover:underline transition-colors"
            >
              ← Back to Login
            </button>
            <p className="text-gray-400 text-sm">
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
    </div>
  );
}
