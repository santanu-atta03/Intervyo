import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function PrivacyPolicy() {
  const token = useSelector((state) => state.auth.token);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 w-[95%] max-w-7xl bg-white/95 backdrop-blur-md rounded-full shadow-lg z-50 border border-gray-200">
        <div className="px-4 md:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl md:text-2xl font-bold">
            <span className="text-gray-900">Interv</span>
            <span className="text-emerald-500">yo</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <a
              href="/#features"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors cursor-pointer"
            >
              Features
            </a>
            <Link
              to="/about"
              className="text-emerald-500 font-medium transition-colors"
            >
              About
            </Link>
            <a
              href="/#how-it-works"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors cursor-pointer"
            >
              How it Works
            </a>
            <a
              href="/#pricing"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors cursor-pointer"
            >
              Pricing
            </a>
            <a
              href="/#faq"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors cursor-pointer"
            >
              FAQ
            </a>
            <Link
              to="/contact"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            {token ? (
              <button
                onClick={() => navigate("/dashboard")}
                className="px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 font-semibold shadow-lg transition-all"
              >
                Dashboard
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 font-semibold shadow-lg transition-all text-sm"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 font-semibold shadow-lg transition-all text-sm"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 mt-2 bg-white backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 mx-2 overflow-hidden">
            <div className="p-6 space-y-4">
              <a
                href="/#features"
                className="block text-gray-600 hover:text-gray-900 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={closeMobileMenu}
              >
                Features
              </a>
              <a
                href="/#how-it-works"
                className="block text-gray-600 hover:text-gray-900 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={closeMobileMenu}
              >
                How it Works
              </a>
              <a
                href="/#pricing"
                className="block text-gray-600 hover:text-gray-900 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={closeMobileMenu}
              >
                Pricing
              </a>
              <a
                href="/#faq"
                className="block text-gray-600 hover:text-gray-900 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={closeMobileMenu}
              >
                FAQ
              </a>
              <Link
                to="/contact"
                onClick={closeMobileMenu}
                className="block text-gray-600 hover:text-gray-900 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Contact
              </Link>
              <Link
                to="/about"
                onClick={closeMobileMenu}
                className="block text-emerald-500 font-medium py-3 px-4 rounded-lg bg-emerald-50"
              >
                About
              </Link>

              <div className="pt-4 border-t border-gray-200 space-y-3">
                {token ? (
                  <button
                    onClick={() => {
                      navigate("/dashboard");
                      closeMobileMenu();
                    }}
                    className="w-full px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 font-semibold shadow-lg transition-all"
                  >
                    Dashboard
                  </button>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={closeMobileMenu}
                      className="block w-full px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 font-semibold shadow-lg transition-all text-center"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={closeMobileMenu}
                      className="block w-full px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 font-semibold shadow-lg transition-all text-center"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 text-white px-4 py-24">
        <div className="max-w-5xl mx-auto bg-white/5 backdrop-blur-lg rounded-3xl p-6 md:p-12 border border-white/10">
          <h1 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Cookie Policy
          </h1>

          <p className="text-gray-300 mb-8">
            This Cookie Policy explains how{" "}
            <span className="text-purple-400 font-semibold">Intervyo</span>
            ("we", "our", or "us") uses cookies and similar technologies when you
            visit or interact with our AI-powered interview preparation platform.
          </p>

          {/* 1 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">
              1. What Are Cookies?
            </h2>
            <p className="text-gray-300">
              Cookies are small text files stored on your device when you visit a
              website. They help websites remember your preferences, maintain
              sessions, and improve overall user experience.
            </p>
          </section>

          {/* 2 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">
              2. How We Use Cookies
            </h2>
            <p className="text-gray-300 mb-4">
              Intervyo uses cookies for the following purposes:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>Maintaining secure user sessions and authentication</li>
              <li>Remembering user preferences and settings</li>
              <li>Analyzing platform usage and performance</li>
              <li>Improving features, reliability, and user experience</li>
            </ul>
          </section>

          {/* 3 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">
              3. Types of Cookies We Use
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>
                <span className="text-white font-medium">Essential Cookies:</span>{" "}
                Required for core functionality such as login, security, and
                session management.
              </li>
              <li>
                <span className="text-white font-medium">
                  Performance Cookies:
                </span>{" "}
                Help us understand how users interact with the platform so we can
                improve it.
              </li>
              <li>
                <span className="text-white font-medium">Preference Cookies:</span>{" "}
                Store your settings and preferences for a more personalized
                experience.
              </li>
            </ul>
          </section>

          {/* 4 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">
              4. Third-Party Cookies
            </h2>
            <p className="text-gray-300 mb-4">
              We may use trusted third-party services such as analytics or
              performance monitoring tools that place cookies on your device.
            </p>
            <p className="text-gray-300">
              These third parties are subject to their own privacy and cookie
              policies, and we do not control their cookie usage.
            </p>
          </section>

          {/* 5 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">
              5. Managing Cookies
            </h2>
            <p className="text-gray-300 mb-4">
              You can control or delete cookies at any time through your browser
              settings. Most browsers allow you to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>View stored cookies</li>
              <li>Delete existing cookies</li>
              <li>Block cookies from specific or all websites</li>
            </ul>
            <p className="text-gray-300 mt-3">
              Please note that disabling certain cookies may affect platform
              functionality.
            </p>
          </section>

          {/* 6 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">
              6. Consent
            </h2>
            <p className="text-gray-300">
              By continuing to use Intervyo, you consent to the use of cookies as
              described in this policy unless you disable them through your
              browser settings.
            </p>
          </section>

          {/* 7 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">
              7. Changes to This Cookie Policy
            </h2>
            <p className="text-gray-300">
              We may update this Cookie Policy from time to time. Any changes will
              be posted on this page with an updated revision date.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">
              8. Contact Information
            </h2>
            <p className="text-gray-300">
              If you have any questions about our use of cookies, please contact
              us at:
            </p>
            <p className="text-purple-400 font-medium mt-2">
              support@intervyo.ai
            </p>
          </section>

          <p className="text-xs text-gray-400 mt-12">
            Last updated: 31 January 2026
          </p>
        </div>
      </div>
    </>
  );
}
