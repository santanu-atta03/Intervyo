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
            Privacy Policy
          </h1>

          <p className="text-gray-300 mb-8">
            This Privacy Policy describes how{" "}
            <span className="text-purple-400 font-semibold">Intervyo</span>
            ("we", "our", or "us") collects, uses, stores, and protects your
            personal information when you access or use our AI-powered interview
            preparation platform.
          </p>

          {/* 1 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">
              1. Information We Collect
            </h2>
            <p className="text-gray-300 mb-4">
              We collect information to provide, improve, and secure our services.
              The types of information we may collect include:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>
                <span className="text-white font-medium">
                  Personal Information:
                </span>{" "}
                Name, email address, profile details, authentication credentials.
              </li>
              <li>
                <span className="text-white font-medium">Interview Data:</span>{" "}
                Responses, transcripts, audio/video recordings (if enabled),
                performance metrics, and AI-generated feedback.
              </li>
              <li>
                <span className="text-white font-medium">Usage Information:</span>{" "}
                Pages visited, features used, session duration, and interaction
                logs.
              </li>
              <li>
                <span className="text-white font-medium">
                  Device Information:
                </span>{" "}
                Browser type, operating system, IP address, and device
                identifiers.
              </li>
            </ul>
          </section>

          {/* 2 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">
              2. How We Use Your Information
            </h2>
            <p className="text-gray-300 mb-4">
              Your information is used strictly for legitimate business and
              platform functionality purposes, including:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>Providing AI-powered interview simulations</li>
              <li>Generating performance analytics and improvement insights</li>
              <li>Improving model accuracy and user experience</li>
              <li>Managing subscriptions, authentication, and security</li>
              <li>Communicating updates, alerts, and support responses</li>
            </ul>
          </section>

          {/* 3 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">
              3. AI & Automated Processing
            </h2>
            <p className="text-gray-300">
              Intervyo uses artificial intelligence and machine learning models to
              analyze interview responses and generate feedback. These processes
              are automated and designed solely to assist learning and
              preparation. AI outputs should not be considered professional hiring
              advice.
            </p>
          </section>

          {/* 4 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">
              4. Data Storage & Security
            </h2>
            <p className="text-gray-300 mb-4">
              We implement industry-standard technical and organizational security
              measures to protect your data, including encryption, access control,
              and secure cloud infrastructure.
            </p>
            <p className="text-gray-300">
              However, no system is completely secure. By using Intervyo, you
              acknowledge and accept this risk.
            </p>
          </section>

          {/* 5 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">
              5. Data Retention
            </h2>
            <p className="text-gray-300">
              We retain your data only for as long as necessary to provide
              services, comply with legal obligations, resolve disputes, and
              enforce policies. You may request deletion of your data at any time.
            </p>
          </section>

          {/* 6 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">
              6. Third-Party Services
            </h2>
            <p className="text-gray-300 mb-4">
              We may integrate trusted third-party services for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>Cloud hosting and storage</li>
              <li>Analytics and performance monitoring</li>
              <li>Authentication and security</li>
              <li>AI inference and processing</li>
            </ul>
            <p className="text-gray-300 mt-3">
              These providers are contractually obligated to protect your data.
            </p>
          </section>

          {/* 7 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">
              7. Cookies & Tracking
            </h2>
            <p className="text-gray-300">
              Intervyo may use cookies or similar technologies to maintain
              sessions, enhance user experience, and analyze platform usage. You
              can control cookie settings through your browser.
            </p>
          </section>

          {/* 8 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">
              8. User Rights
            </h2>
            <p className="text-gray-300 mb-4">
              Depending on your jurisdiction, you may have the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>Access your personal data</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your data</li>
              <li>Withdraw consent for data processing</li>
            </ul>
          </section>

          {/* 9 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">
              9. Children’s Privacy
            </h2>
            <p className="text-gray-300">
              Intervyo is not intended for children under the age of 13. We do not
              knowingly collect personal information from minors.
            </p>
          </section>

          {/* 10 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">
              10. Changes to This Policy
            </h2>
            <p className="text-gray-300">
              We may update this Privacy Policy from time to time. Changes will be
              posted on this page with an updated revision date.
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">
              11. Contact Information
            </h2>
            <p className="text-gray-300">
              If you have any questions or concerns regarding this Privacy Policy,
              please contact us at:
            </p>
            <p className="text-purple-400 font-medium mt-2">
              support@intervyo.ai
            </p>
          </section>

          <p className="text-xs text-gray-400 mt-12">
            Last updated: 7 January 2026
          </p>
        </div>
      </div>
    </>
  );
}
