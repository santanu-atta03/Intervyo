import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function FAQ() {
  const [scrollY, setScrollY] = useState(0);

  // Scroll effect for navbar background (optional)
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f1a] via-[#13132a] to-[#0f0f1a] text-white px-6 pb-10 overflow-y-auto">
      {/* Navbar */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${scrollY > 50 ? "bg-slate-900/95 shadow-lg" : "bg-transparent"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo / Home button */}
            <Link to="/" className="flex items-center gap-2 -ml-6">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center animate-pulse-glow">
                <span className="text-white font-bold text-xl">AI</span>
              </div>
              <span className="text-xl font-bold">Intervyo</span>
            </Link>

            {/* Back to Home button */}
            <div>
              <Link
                to="/"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* FAQ content */}
      <div className="pt-20 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-10 text-center">
          Frequently Asked Questions
        </h1>

        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-2">What is Intervyo?</h3>
            <p className="text-gray-300">
              Intervyo is an AI-powered platform that helps users prepare for
              technical interviews through realistic interview simulations.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-2">
              Who can use Intervyo?
            </h3>
            <p className="text-gray-300">
              Intervyo is suitable for students, freshers, and professionals
              preparing for technical interviews across different domains.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-2">
              Is Intervyo free to use?
            </h3>
            <p className="text-gray-300">
              Yes, Intervyo offers free access to core interview preparation
              features.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-2">
              Do I need to sign up?
            </h3>
            <p className="text-gray-300">
              Yes, creating an account is required to use Intervyo. This allows
              users to access interview features and track their progress
              securely.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
