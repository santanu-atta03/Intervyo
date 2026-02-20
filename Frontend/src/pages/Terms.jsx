import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function TermsAndConditions() {
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
            Terms & Conditions
          </h1>

          <p className="text-gray-300 mb-8">
            These Terms & Conditions ("Terms") govern your access to and use of{" "}
            <span className="text-purple-400 font-semibold">Intervyo</span>, an
            AI-powered interview preparation platform. By accessing or using the
            platform, you agree to be legally bound by these Terms.
          </p>

          {/* 1 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-300">
              By creating an account, accessing, or using Intervyo, you confirm
              that you have read, understood, and agreed to these Terms. If you do
              not agree, you must discontinue use of the platform immediately.
            </p>
          </section>

          {/* 2 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">
              2. Description of Service
            </h2>
            <p className="text-gray-300">
              Intervyo provides AI-powered mock interviews, analytics, feedback,
              and learning tools designed to assist users in preparing for job
              interviews. The platform is intended for educational and practice
              purposes only.
            </p>
          </section>

          {/* 3 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">
              3. Eligibility
            </h2>
            <p className="text-gray-300">
              You must be at least 13 years old to use Intervyo. If you are under
              18, you confirm that you have permission from a parent or legal
              guardian. By using the platform, you represent that you meet these
              requirements.
            </p>
          </section>

          {/* 4 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">
              4. User Accounts & Responsibilities
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>
                You are responsible for maintaining the confidentiality of your
                account credentials.
              </li>
              <li>
                You are responsible for all activities conducted under your
                account.
              </li>
              <li>You agree to provide accurate and up-to-date information.</li>
              <li>
                You must notify us immediately of any unauthorized account use.
              </li>
            </ul>
          </section>

          {/* 5 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">
              5. Acceptable Use Policy
            </h2>
            <p className="text-gray-300 mb-4">
              You agree not to misuse Intervyo. Prohibited activities include, but
              are not limited to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>Attempting to reverse-engineer or exploit AI models</li>
              <li>Uploading malicious, harmful, or illegal content</li>
              <li>Impersonating another individual or organization</li>
              <li>Attempting to disrupt platform security or infrastructure</li>
              <li>
                Using the platform for cheating, fraud, or misrepresentation
              </li>
            </ul>
          </section>

          {/* 6 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">
              6. AI-Generated Content Disclaimer
            </h2>
            <p className="text-gray-300">
              All interview feedback, analytics, and suggestions generated by
              Intervyo are produced using artificial intelligence. These outputs
              are informational only and should not be considered professional,
              hiring, legal, or career advice. Intervyo does not guarantee job
              offers, interview success, or employment outcomes.
            </p>
          </section>

          {/* 7 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">
              7. Subscriptions, Payments & Billing
            </h2>
            <p className="text-gray-300 mb-4">
              Certain features may require a paid subscription. By purchasing a
              plan, you agree to the following:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>Fees are billed as displayed at the time of purchase</li>
              <li>Subscriptions may renew automatically unless cancelled</li>
              <li>
                Payments are generally non-refundable unless stated otherwise
              </li>
            </ul>
          </section>

          {/* 8 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">
              8. Intellectual Property Rights
            </h2>
            <p className="text-gray-300">
              All platform content, including but not limited to UI design, logos,
              branding, AI models, text, graphics, and software, is the exclusive
              property of Intervyo. You are granted a limited, non-transferable,
              non-commercial license to use the platform.
            </p>
          </section>

          {/* 9 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">
              9. User-Generated Content
            </h2>
            <p className="text-gray-300">
              You retain ownership of content you submit. By using Intervyo, you
              grant us a limited license to store, process, and analyze this
              content solely for providing platform functionality.
            </p>
          </section>

          {/* 10 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">
              10. Suspension & Termination
            </h2>
            <p className="text-gray-300">
              We reserve the right to suspend or terminate accounts that violate
              these Terms, misuse the platform, or pose security or legal risks,
              without prior notice.
            </p>
          </section>

          {/* 11 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">
              11. Limitation of Liability
            </h2>
            <p className="text-gray-300">
              To the maximum extent permitted by law, Intervyo shall not be liable
              for any indirect, incidental, or consequential damages arising from
              your use of the platform, including loss of opportunities or data.
            </p>
          </section>

          {/* 12 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">
              12. Indemnification
            </h2>
            <p className="text-gray-300">
              You agree to indemnify and hold harmless Intervyo from any claims,
              damages, or liabilities arising from your violation of these Terms
              or misuse of the platform.
            </p>
          </section>

          {/* 13 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">
              13. Modifications to the Terms
            </h2>
            <p className="text-gray-300">
              We may update these Terms at any time. Continued use of Intervyo
              after updates constitutes acceptance of the revised Terms.
            </p>
          </section>

          {/* 14 */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">
              14. Governing Law
            </h2>
            <p className="text-gray-300">
              These Terms shall be governed and interpreted in accordance with
              applicable local laws, without regard to conflict of law principles.
            </p>
          </section>

          {/* 15 */}
          <section>
            <h2 className="text-2xl font-semibold mb-3 text-purple-300">
              15. Contact Information
            </h2>
            <p className="text-gray-300">
              If you have questions regarding these Terms, contact us at:
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
