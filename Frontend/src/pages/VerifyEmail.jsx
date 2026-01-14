import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSignupData } from "../slices/authSlice";
import { resendOtp } from "../services/operations/authAPI";
import { toast } from "react-hot-toast";

export default function VerifyEmail() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(0);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { signupData, loading } = useSelector((state) => state.auth);

  // Countdown timer effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && isResendDisabled) {
      setIsResendDisabled(false);
    }
  }, [countdown, isResendDisabled]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus next input
    if (element.value && element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && e.target.previousSibling) {
      e.target.previousSibling.focus();
    }
  };

  const handleVerify = () => {
    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      toast.error("Please enter complete OTP");
      return;
    }

    if (!signupData) {
      toast.error("Please complete registration form first");
      navigate("/register");
      return;
    }

    // Store OTP in signupData
    dispatch(
      setSignupData({
        ...signupData,
        otp: otpValue,
      }),
    );

    toast.success("Email verified! Choose your domain");
    // Navigate to domain selection
    navigate("/domain-selection");
  };

  const handleResendOtp = () => {
    if (!signupData?.email) {
      toast.error("Email not found");
      return;
    }

    setIsResendDisabled(true);
    setCountdown(30);

    dispatch(resendOtp(signupData.email));
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* 🔳 TILE GRID BACKGROUND (Matching Register) */}
      <div className="absolute inset-0 grid grid-cols-[repeat(auto-fill,minmax(60px,1fr))] grid-rows-[repeat(auto-fill,minmax(60px,1fr))] pointer-events-auto">
        {Array.from({ length: 800 }).map((_, i) => (
          <div
            key={i}
            className="border border-white/5 transition-colors duration-150 ease-out hover:bg-[#10b981]"
          />
        ))}
      </div>

      {/* Glow layer */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[420px] h-[420px] rounded-full bg-emerald-500 blur-[80px]" />
      </div>

      {/* CENTERED VERIFY CARD */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-md rounded-2xl border border-white/10 
          bg-gradient-to-br from-zinc-900/90 to-zinc-800/80 
          backdrop-blur-xl shadow-[0_0_60px_rgba(16,185,129,0.15)] p-8">
          
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-300">Step 2 of 3</span>
              <span className="text-sm text-gray-400">66%</span>
            </div>
            <div className="w-full bg-zinc-800/50 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-2 rounded-full transition-all duration-500"
                style={{ width: '66%' }}
              ></div>
            </div>
          </div>

          {/* Heading and Description */}
          <h1 className="text-3xl font-bold text-white mb-2">
            Verify Email
          </h1>
          <p className="text-gray-400 mb-8">
            Enter the 6-digit code sent to
            <br />
            <span className="font-semibold text-emerald-400">
              {signupData?.email}
            </span>
          </p>

          {/* OTP Input Fields */}
          <div className="flex justify-center gap-2 mb-8">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-14 text-center text-2xl font-bold bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all shadow-inner"
              />
            ))}
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Verify Email
          </h1>
          <p className="text-gray-600">
            Enter the 6-digit code sent to
            <br />
            <span className="font-semibold text-purple-600">
              {signupData?.email}
            </span>
          </p>
        </div>

          {/* Resend OTP Button */}
          <div className="text-center mb-6">
            <button
              onClick={handleResendOtp}
              disabled={isResendDisabled}
              className="text-sm font-semibold text-emerald-500 hover:text-emerald-400 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
            >
              {isResendDisabled ? `Resend OTP in ${countdown}s` : "Didn't receive OTP? Resend"}
            </button>
          </div>

          {/* Verify Button */}
          <button
            onClick={handleVerify}
            disabled={loading || otp.join('').length !== 6}
            className="relative w-full overflow-hidden rounded-lg bg-emerald-500 py-3 font-semibold text-black
              transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(16,185,129,0.8)]
              active:scale-95 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed mb-4"
          >
            <span className="relative z-10">Verify & Continue</span>
            <span className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-600 opacity-0 hover:opacity-100 transition-opacity" />
          </button>

          {/* Back to Registration */}
          <button
            onClick={() => navigate('/register')}
            className="w-full text-gray-400 font-medium hover:text-emerald-400 transition-colors flex items-center justify-center gap-2"
          >
            ← Back to Registration
          </button>
        </div>

        <button
          onClick={handleVerify}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition transform hover:scale-105 shadow-lg mb-4"
        >
          Verify & Continue
        </button>

        <button
          onClick={() => navigate("/register")}
          className="w-full text-purple-600 font-semibold hover:text-purple-700 transition"
        >
          ← Back to Registration
        </button>
      </div>
    </div>
  );
}
